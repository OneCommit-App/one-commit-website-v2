import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { clearStaleSummaries, selectCoverage } from './run-state.mjs'

const routes = new Set(['/', '/about', '/waitlist'])

test('default and reordered selections cover all distinct routes and profiles', () => {
 assert.deepEqual(selectCoverage(routes), {routes:['/','/about','/waitlist'],modes:['mobile','desktop'],full:true})
 assert.equal(selectCoverage(routes,'/waitlist, /about, /','desktop, mobile').full,true)
})

test('valid route and profile subsets are explicitly partial', () => {
 assert.equal(selectCoverage(routes,'/').full,false)
 assert.equal(selectCoverage(routes,undefined,'mobile').full,false)
 assert.equal(selectCoverage(routes,'/about,/waitlist','desktop').full,false)
})

test('duplicate, blank and unknown selections fail instead of implying coverage', () => {
 for (const value of ['', ' ', ',', '/,', '/,/about,', '/,/about,/', '/unknown']) {
  assert.throws(()=>selectCoverage(routes,value),/empty|duplicate|Unknown/)
 }
 for (const value of ['', ' ', ',', 'mobile,', 'mobile,mobile', 'mobile, mobile', 'tablet']) {
  assert.throws(()=>selectCoverage(routes,undefined,value),/empty|duplicate|Unknown/)
 }
 assert.throws(()=>selectCoverage(new Set()),/No routes available/)
})

test('new-run invalidation removes only stale summary markers', async () => {
 const dir=await mkdtemp(path.join(os.tmpdir(),'lh-run-state-'))
 try {
  for (const name of ['summary.json','summary.md','partial.json','home-mobile.json','home-mobile.html','notes.txt']) await writeFile(path.join(dir,name),'preserve or invalidate')
  await mkdir(path.join(dir,'archive'))
  await writeFile(path.join(dir,'archive','summary.json'),'old archived result')
  await clearStaleSummaries(dir)
  assert.deepEqual((await readdir(dir)).sort(),['archive','home-mobile.html','home-mobile.json','notes.txt'])
  assert.equal(await readFile(path.join(dir,'archive','summary.json'),'utf8'),'old archived result')
  await clearStaleSummaries(dir) // Missing prior markers are harmless on first run.
 } finally { await rm(dir,{recursive:true,force:true}) }
})

test('invalidation refuses to recursively remove an unexpected directory', async () => {
 const dir=await mkdtemp(path.join(os.tmpdir(),'lh-run-state-'))
 try {
  await mkdir(path.join(dir,'summary.json'))
  await writeFile(path.join(dir,'summary.json','keep.txt'),'keep')
  await assert.rejects(clearStaleSummaries(dir))
  assert.equal(await readFile(path.join(dir,'summary.json','keep.txt'),'utf8'),'keep')
 } finally { await rm(dir,{recursive:true,force:true}) }
})
