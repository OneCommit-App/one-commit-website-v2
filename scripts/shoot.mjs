import { chromium } from 'playwright';
import { linkChecker } from './shoot/links.mjs';
import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { once } from 'node:events';
import { sitemapUrls, internalUrl, inspectDocument, documentFailures, isMutation } from './shoot/checks.mjs';

const output = new URL('../.shots/', import.meta.url);
await mkdir(output, { recursive: true });
await Promise.all(['contact-sheet.png', 'report.json'].map((name) => rm(new URL(name, output), { force: true })));
const run = { generatedAt: new Date().toISOString(), gitHead: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() };
// Allocate a fresh loopback port so a stale/dev server cannot masquerade as this build.
const reservation = createServer();
reservation.listen(0, '127.0.0.1');
await once(reservation, 'listening');
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const server = spawn('pnpm', ['exec', 'next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
let serverLog = '';
server.stdout.on('data', (data) => { serverLog += data; });
server.stderr.on('data', (data) => { serverLog += data; });
const failures = [], captures = [], blockedMutations = [];
let browser;
async function stop() {
  await browser?.close();
  try { process.kill(-server.pid, 'SIGTERM'); } catch {}
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  stop().finally(() => process.exit(signal === 'SIGINT' ? 130 : 143));
});
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reportError = (scope, error) => failures.push({ scope, error: String(error) });
try {
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`next start exited: ${serverLog}`);
    try { const response = await fetch(`${origin}/sitemap.xml`); if (response.ok) { ready = true; break; } } catch {}
    await sleep(500);
  }
  if (!ready) throw new Error(`next start did not become ready: ${serverLog}`);
  const urls = sitemapUrls(await (await fetch(`${origin}/sitemap.xml`)).text());
  const hosts = [...new Set(urls.flatMap((url) => { const host = new URL(url).hostname; return [host, host.replace(/^www\./, '')]; }))];
  const routes = urls.map((url) => internalUrl(url, origin, origin, hosts));
  browser = await chromium.launch(process.env.SHOOT_CHANNEL ? { channel: process.env.SHOOT_CHANNEL } : {});
  const links = new Map();
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport, colorScheme, serviceWorkers: 'block' });
      await context.route('**/*', async (route) => {
        const request = route.request();
        // No form interactions; also prevent analytics/beacons or any accidental write.
        if (isMutation(request.method())) {
          blockedMutations.push({ method: request.method(), url: request.url() });
          await route.fulfill({ status: 204 });
        } else await route.continue();
      });
      const page = await context.newPage();
      let scope = '';
      page.on('console', (message) => { if (message.type() === 'error') reportError(scope, `console: ${message.text()}`); });
      page.on('pageerror', (error) => reportError(scope, `pageerror: ${error.message}`));
      for (const url of routes) {
        const path = new URL(url).pathname;
        scope = `${path} ${viewport.width}x${viewport.height} ${colorScheme}`;
        try {
          const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          if (!response?.ok()) reportError(scope, `route HTTP ${response?.status()}`);
          await page.evaluate(() => document.fonts.ready);
          // Trigger below-fold intersection animations without changing application sources.
          await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } scrollTo(0, 0); });
          await page.waitForTimeout(400);
          const result = await page.evaluate(inspectDocument);
          documentFailures(result).forEach((error) => reportError(scope, error));
          for (const href of result.links) {
            const local = internalUrl(href, page.url(), origin, hosts);
            if (local && !links.has(local)) links.set(local, path);
          }
          const name = `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${viewport.width}-${colorScheme}`;
          await page.screenshot({ path: new URL(`${name}.png`, output).pathname, fullPage: true, animations: 'disabled' });
          await page.screenshot({ path: new URL(`${name}-viewport.png`, output).pathname, animations: 'disabled' });
          captures.push({ path, viewport, colorScheme, name });
          console.log(`Captured ${scope}`);
        } catch (error) { reportError(scope, error.message); }
      }
      await context.close();
    }
  }
  // Resolve same-site redirects locally, never following canonical redirects to production.
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const checkLink = linkChecker(context, origin, hosts);
  for (const [href, source] of links) {
    try { await checkLink(href); } catch (error) { reportError(`link from ${source}`, `${href.replace(origin, '')}: ${error.message}`); }
  }
  await context.close();
  const sheet = await browser.newPage({ viewport: { width: 1000, height: 2600 }, deviceScaleFactor: 1 });
  const cards = [];
  for (const path of routes.map((url) => new URL(url).pathname)) {
    for (const capture of captures.filter((item) => item.path === path)) {
      const data = (await readFile(new URL(`${capture.name}-viewport.png`, output))).toString('base64');
      cards.push(`<article><div>${capture.path} · ${capture.viewport.width} · ${capture.colorScheme}</div><img src="data:image/png;base64,${data}" alt="Screenshot"></article>`);
    }
  }
  await sheet.setContent(`<html><style>body{margin:0;padding:16px;background:#ddd;font:12px sans-serif}main{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}article{background:white;padding:8px}img{display:block;width:100%;height:200px;object-fit:contain}h1{font-size:20px}</style><h1>Sitemap route baseline · 390×844 / 1440×900 · light / dark</h1><main>${cards.join('')}</main></html>`);
  await sheet.screenshot({ path: new URL('contact-sheet.png', output).pathname, fullPage: true });
  await writeFile(new URL('report.json', output), JSON.stringify({ ...run, browser: browser.version(), routes: urls, captureCount: captures.length, internalLinksChecked: links.size, blockedMutations, failures }, null, 2));
} catch (error) {
  reportError('harness', error.stack);
  await writeFile(new URL('report.json', output), JSON.stringify({ ...run, captures, failures }, null, 2));
} finally {
  await stop();
  await writeFile(new URL('server.log', output), serverLog);
}
for (const failure of failures) console.error(`${failure.scope}: ${failure.error}`);
console.log(`${captures.length} screenshots; ${failures.length} failures. See .shots/report.json and .shots/contact-sheet.png`);
process.exitCode = failures.length ? 1 : 0;
