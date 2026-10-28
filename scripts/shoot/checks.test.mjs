import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { sitemapUrls, internalUrl, inspectDocument, documentFailures, isMutation } from './checks.mjs';

test('sitemap routes are discovered, decoded and deduplicated', () => {
  assert.deepEqual(sitemapUrls('<urlset><url><loc>https://www.example.com/new?a=1&amp;b=2</loc></url></urlset>'), ['https://www.example.com/new?a=1&b=2']);
  assert.throws(() => sitemapUrls('<urlset/>'), /nonempty/);
  assert.throws(() => sitemapUrls('<sitemapindex><loc>https://example.com/child.xml</loc></sitemapindex>'), /nonempty/);
});
test('relative and canonical internal links stay local; outside protocols are skipped', () => {
  const origin = 'http://127.0.0.1:4321';
  const hosts = ['example.com', 'www.example.com'];
  assert.equal(internalUrl('/support#help', origin, origin, hosts), `${origin}/support#help`);
  assert.equal(internalUrl('https://www.example.com/new?q=1', origin, origin, hosts), `${origin}/new?q=1`);
  for (const href of ['https://external.com/a', 'mailto:a@example.com', 'tel:123', 'javascript:void(0)']) assert.equal(internalUrl(href, origin, origin, hosts), null);
});
test('all write methods are blocked, including remote beacon POST', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) assert.equal(isMutation(method), true);
  for (const method of ['GET', 'HEAD', 'OPTIONS']) assert.equal(isMutation(method), false);
});
test('browser fixture detects real overflow, missing alt and console errors; decorative alt passes', async () => {
  const browser = await chromium.launch(process.env.SHOOT_CHANNEL ? { channel: process.env.SHOOT_CHANNEL } : {});
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setContent('<div style="width:600px">Wide</div><img><img alt=""><a href="/missing">Broken</a><script>console.error("fixture failure")</script>');
    const result = await page.evaluate(inspectDocument);
    assert.equal(result.missingAlt.length, 1);
    assert.equal(documentFailures(result).length, 2);
    assert.deepEqual(errors, ['fixture failure']);
    await page.setContent('<main>Fits</main><img alt="">');
    assert.deepEqual(documentFailures(await page.evaluate(inspectDocument)), []);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.setContent('<div style="width:2000px">Desktop overflow outside requested gate</div>');
    assert.deepEqual(documentFailures(await page.evaluate(inspectDocument)), []);
  } finally { await browser.close(); }
});

test('link checker fails 404, missing fragments, redirect loops and remote redirects', async () => {
  const { createServer } = await import('node:http');
  const { linkChecker } = await import('./links.mjs');
  const server = createServer((req, res) => {
    if (req.url === '/missing') { res.writeHead(404); res.end('missing'); }
    else if (req.url === '/loop') { res.writeHead(302, { location: '/loop' }); res.end(); }
    else if (req.url === '/remote') { res.writeHead(302, { location: 'https://outside.example/' }); res.end(); }
    else if (req.url === '/canonical') { res.writeHead(302, { location: 'https://example.com/ok' }); res.end(); }
    else { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<div id="exists">ok</div>'); }
  });
  server.keepAliveTimeout = 60000;
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch(process.env.SHOOT_CHANNEL ? { channel: process.env.SHOOT_CHANNEL } : {});
  try {
    const context = await browser.newContext();
    const check = linkChecker(context, origin, ['example.com']);
    await check(`${origin}/ok#exists`);
    await check(`${origin}/ok#top`);
    await check(`${origin}/ok#:~:text=ok`);
    await check(`${origin}/canonical#exists`);
    await assert.rejects(check(`${origin}/missing`), /HTTP 404/);
    await assert.rejects(check(`${origin}/ok#absent`), /missing fragment/);
    await assert.rejects(check(`${origin}/loop`), /redirect loop/);
    await assert.rejects(check(`${origin}/remote`), /leaves local site/);
  } finally { await browser.close(); await new Promise((resolve) => server.close(resolve)); }
});
