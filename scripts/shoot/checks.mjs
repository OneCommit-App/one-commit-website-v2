export function sitemapUrls(xml) {
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => m[1].trim().replaceAll('&amp;', '&'));
  if (!urls.length || /<sitemapindex[\s>]/.test(xml)) throw new Error('Expected a nonempty URL sitemap');
  return [...new Set(urls.map((url) => new URL(url).href))];
}

export function internalUrl(href, source, origin, hosts) {
  const url = new URL(href, source);
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  if (url.origin !== origin && !hosts.includes(url.hostname)) return null;
  return new URL(`${url.pathname}${url.search}${url.hash}`, origin).href;
}

// Runs inside the browser. Empty alt is valid for decorative images.
export function inspectDocument() {
  return {
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    missingAlt: [...document.querySelectorAll('img:not([alt])')].map((img) => img.outerHTML),
    links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
  };
}

export function documentFailures(result) {
  return [
    ...(result.width === 390 && result.scrollWidth > result.width ? [`horizontal overflow: ${result.scrollWidth} > ${result.width}`] : []),
    ...result.missingAlt.map((html) => `img missing alt: ${html}`),
  ];
}

export function isMutation(method) { return !['GET', 'HEAD', 'OPTIONS'].includes(method); }
