import { spawn, execFileSync } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { launch } from 'chrome-launcher'
import { budgets, summarize } from './performance/budgets.mjs'
import { clearStaleSummaries, selectCoverage } from './performance/run-state.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const output = path.join(root, '.lighthouse')
await mkdir(output, { recursive: true })
await clearStaleSummaries(output)
await readFile(path.join(root, '.next/BUILD_ID')) // next build is an explicit prerequisite
const probe = net.createServer()
await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(0, '127.0.0.1', resolve) })
const port = probe.address().port
await new Promise((resolve) => probe.close(resolve))
const origin = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
 cwd:root, env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}, stdio:['ignore','pipe','pipe'],
})
let serverLog=''
server.stdout.on('data', chunk=>{serverLog+=chunk})
server.stderr.on('data', chunk=>{serverLog+=chunk})
let chrome
const rows=[]
let interrupted=false
process.once('SIGINT',()=>{interrupted=true;void chrome?.kill();server.kill('SIGTERM')})
process.once('SIGTERM',()=>{interrupted=true;void chrome?.kill();server.kill('SIGTERM')})

async function walk(dir) {
 const found=[]
 for(const item of await readdir(dir,{withFileTypes:true})) {
  const full=path.join(dir,item.name)
  if(item.isDirectory()) found.push(...await walk(full))
  else found.push(full)
 }
 return found
}

try {
 let ready=false
 for(let attempt=0;attempt<120;attempt++) {
  if(server.exitCode!==null) throw new Error(`next start exited: ${serverLog}`)
  try { if((await fetch(`${origin}/sitemap.xml`)).ok){ready=true;break} } catch {}
  await new Promise(resolve=>setTimeout(resolve,500))
 }
 if(!ready) throw new Error(`next start timed out: ${serverLog}`)
 const xml=await (await fetch(`${origin}/sitemap.xml`)).text()
 const routes=new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]).pathname))
 if(!routes.size) throw new Error('Sitemap has no routes')
 // Include static page routes omitted from the sitemap, including legacy redirects.
 for(const file of await walk(path.join(root,'app'))) {
  if(!/\/page\.(tsx?|jsx?)$/.test(file)) continue
  const segments=path.relative(path.join(root,'app'),path.dirname(file)).split(path.sep).filter(Boolean).filter(part=>!part.startsWith('('))
  if(segments.some(part=>part.includes('[')||part.startsWith('@'))) throw new Error(`Route needs a concrete fixture: ${file}`)
  routes.add('/'+segments.join('/'))
 }
 const coverage=selectCoverage(routes,process.env.LH_ROUTES,process.env.LH_MODES)
 const {routes:selected,modes}=coverage
 for(const route of selected) for(const mode of modes) {
  if(interrupted) throw new Error('Interrupted')
  console.log(`Auditing ${mode} ${route}`)
  chrome=await launch({chromePath:process.env.CHROME_PATH,chromeFlags:[
   '--headless=new','--disable-gpu','--no-first-run','--disable-background-networking',
   '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost',
  ]})
  try {
   const result=await lighthouse(`${origin}${route}`,{
    port:chrome.port, logLevel:'error',output:['json','html'],onlyCategories:['performance'],
    // Source pages are local. No HTTPS provider/store/analytics traffic is permitted.
    blockedUrlPatterns:['https://*'],
   },mode==='desktop'?desktopConfig:undefined)
   if(!result) throw new Error('Lighthouse returned no result')
   const row=summarize(result.lhr,route,mode)
   const slug=route==='/'?'home':route.slice(1).replaceAll('/','-')
   await writeFile(path.join(output,`${slug}-${mode}.json`),result.report[0])
   await writeFile(path.join(output,`${slug}-${mode}.html`),result.report[1])
   rows.push(row)
   await writeFile(path.join(output,'partial.json'),JSON.stringify(rows,null,2)+'\n')
   console.log(`${mode} ${route}: score ${row.score}; LCP ${(row.lcpMs/1000).toFixed(2)}s; CLS ${row.cls.toFixed(4)}; JS ${(row.jsBytes/1024).toFixed(1)}KiB; ${row.failures.join(', ')||'within budgets'}`)
  } finally { await chrome.kill();chrome=null }
 }
 const assets=[]
 for(const dir of ['public','.next/static']) for(const file of await walk(path.join(root,dir))) {
  const info=await stat(file)
  assets.push({file:path.relative(root,file),bytes:info.size})
 }
 assets.sort((a,b)=>b.bytes-a.bytes)
 const propose=(name)=> /\.(png|jpe?g)$/i.test(name)?'Compare AVIF/WebP at the displayed dimensions; preserve a visual-quality check.': /\.mp4$/i.test(name)?'Hugh decides: propose H.264/AV1 bitrate/resolution variants; do not replace.': /\.js$/.test(name)?'Inspect bundle attribution and unused imports; split below-fold interactive code where measured.': /\.woff2$/.test(name)?'Audit actual weights/glyphs; subset only after language coverage checks.':'Check use and caching; do not delete without ownership review.'
 const summary={observedAt:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),node:process.version,lighthouse:JSON.parse(await readFile(path.join(root,'node_modules/lighthouse/package.json'),'utf8')).version,budgets,reportOnly:true,coverage,rows,assets:assets.slice(0,25)}
 await writeFile(path.join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n')
 const table=['# Local performance baseline','',`Source: ${summary.sourceCommit}; Node ${summary.node}; Lighthouse ${summary.lighthouse}; ${summary.observedAt}.`,'','Report-only. Default mobile/desktop Lighthouse simulated throttling; one cold navigation per route/profile. Local measurements on this machine are not production field data. External HTTPS requests blocked. Runtime/audit failures exit nonzero; budget misses do not.','',`Budgets: mobile LCP < ${budgets.mobileLcpMs} ms; CLS < ${budgets.cls}; transferred JS <= ${budgets.scriptTransferBytes/1024} KiB/navigation. JS ceiling is an initial engineering budget, not a web standard.`,'','| Route | Profile | Score | LCP s | CLS | JS KiB | Budget misses |','|---|---|---:|---:|---:|---:|---|',...rows.map(r=>`| ${r.route} | ${r.mode} | ${r.score} | ${(r.lcpMs/1000).toFixed(2)} | ${r.cls.toFixed(4)} | ${(r.jsBytes/1024).toFixed(1)} | ${r.failures.join(', ')||'none'} |`),'','## Heaviest on-disk assets','', 'Ranked raw file sizes, not transfer weight; includes unused public archive files. Check request reports before prioritizing. Proposals only: no image/video replacement.','','| File | KiB | Proposed work |','|---|---:|---|',...assets.slice(0,25).map(a=>`| ${a.file} | ${(a.bytes/1024).toFixed(1)} | ${propose(a.file)} |`),'',`public/demo.mp4: ${assets.some(a=>a.file==='public/demo.mp4')?'present; Hugh decides any replacement.':'absent on this main snapshot; no replacement performed.'}`,'','## Warnings','',...rows.flatMap(r=>r.warnings.map(w=>`- ${r.route} ${r.mode}: ${w}`))]
 await writeFile(path.join(output,'summary.md'),table.join('\n')+'\n')
 console.log(`Wrote ${rows.length} reports and ranked assets to .lighthouse/. Budget misses are report-only.`)
} finally {
 if(chrome) await chrome.kill()
 const exit=server.exitCode===null?once(server,'exit'):Promise.resolve()
 if(server.exitCode===null) server.kill('SIGTERM')
 await exit
 await writeFile(path.join(output,'server.log'),serverLog)
}
