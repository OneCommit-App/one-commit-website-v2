import { internalUrl } from './checks.mjs';

export function linkChecker(context, origin, hosts) {
  const checked = new Map();
  return async function checkLink(href, depth = 0) {
    if (depth > 10) throw new Error('redirect loop');
    const url = new URL(href); const hash = url.hash; url.hash = '';
    if (!checked.has(url.href)) checked.set(url.href, (async () => {
      const response = await context.request.get(url.href, { maxRedirects: 0, maxRetries: 1 });
      if (response.status() >= 300 && response.status() < 400) {
        const location = response.headers().location;
        const local = location && internalUrl(location, url.href, origin, hosts);
        if (!local) throw new Error(`redirect leaves local site: ${location}`);
        return { redirect: local };
      }
      if (!response.ok()) throw new Error(`HTTP ${response.status()}`);
      return { html: response.headers()['content-type']?.includes('text/html') ? await response.text() : null };
    })());
    const result = await checked.get(url.href);
    if (result.redirect) return checkLink(result.redirect + (new URL(result.redirect).hash ? '' : hash), depth + 1);
    if (hash && hash !== '#' && result.html !== null) {
      // Parse HTML inertly: scripts and forms cannot run during fragment checks.
      const page = await context.newPage();
      const exists = await page.evaluate(({ html, fragment }) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const id = decodeURIComponent(fragment.slice(1).split(':~:')[0]);
        if (!id || id.toLowerCase() === 'top') return true;
        return !!doc.getElementById(id) || [...doc.getElementsByName(id)].some((el) => el.tagName === 'A');
      }, { html: result.html, fragment: hash });
      await page.close();
      if (!exists) throw new Error(`missing fragment ${hash}`);
    }
  };
}
