import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const host = "127.0.0.1";

const [footerSource, headerSource, demoSource, downloadSource, supportSource, notFoundSource] = await Promise.all([
  readFile(path.join(repoRoot, "components", "footer-section.tsx"), "utf8"),
  readFile(path.join(repoRoot, "components", "public-header.tsx"), "utf8"),
  readFile(path.join(repoRoot, "app", "demo", "page.tsx"), "utf8"),
  readFile(path.join(repoRoot, "app", "download", "page.tsx"), "utf8"),
  readFile(path.join(repoRoot, "app", "support", "page.tsx"), "utf8"),
  readFile(path.join(repoRoot, "app", "not-found.tsx"), "utf8"),
]);

async function reservePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, host, resolve);
  });
  const address = probe.address();
  assert(address && typeof address === "object", "failed to reserve a local port");
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, "exit");
  child.kill("SIGTERM");
  const stopped = await Promise.race([
    exited.then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
  ]);
  if (!stopped && child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await once(child, "exit");
  }
}

function tagCount(html, tag) {
  return (html.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
}

function tagAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${attribute}="([^"]*)"`, "i"))?.[1] || "";
}

function mainHtml(html) {
  const match = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
  assert(match, "page must contain a complete main landmark");
  return match[0];
}

function mainAnchors(html) {
  return mainHtml(html).match(/<a\b[^>]*>/gi) || [];
}

function assertMinimumTarget(anchor, token, message) {
  const classes = tagAttribute(anchor, "class").split(/\s+/);
  assert(classes.includes(token), message);
}

for (const anchor of ["features", "how-it-works", "pricing", "faq"]) {
  assert(
    footerSource.includes(`href="/#${anchor}"`),
    `footer ${anchor} link must work away from the homepage`,
  );
}
assert.doesNotMatch(footerSource, /x\.com\/onecommit|instagram\.com\/onecommit/i, "footer must not publish unverified social accounts");
assert.doesNotMatch(footerSource, /initial=["{]|whileInView|opacity:\s*0/, "footer must be visible without JavaScript or scrolling");
assert.match(
  footerSource,
  /const footerLinkClass\s*=\s*"[^"\n]*\bmin-h-11\b[^"\n]*"/,
  "every shared footer navigation link must inherit a 44px minimum target",
);
assert.match(
  footerSource,
  /aria-label="OneCommit home"[\s\S]{0,320}?className="[^"\n]*\bmin-h-11\b/,
  "footer home link must retain a 44px minimum target",
);
assert.match(
  footerSource,
  /eventSource="footer_email_primary"[\s\S]{0,320}?className="[^"\n]*\bmin-h-11\b/,
  "footer support email must retain a 44px minimum target",
);
for (const label of ["Product", "For teams", "Company"]) {
  assert.match(
    footerSource,
    new RegExp(`text-xs[^"\\n]*text-white\\/60">${label}<`),
    `footer ${label} label must retain the verified AA contrast class`,
  );
}
assert.match(
  footerSource,
  /text-center text-xs text-white\/60[^>]*>[\s\S]*©/,
  "footer copyright must retain the verified AA contrast class",
);
assert.match(headerSource, /Skip to main content/, "shared header must include a skip link");
assert.match(
  headerSource,
  /href="#main-content"\s+className="[^"\n]*\bmin-h-11\b[^"\n]*"/,
  "shared skip link must retain a 44px minimum target when focused",
);
assert.match(headerSource, /aria-label="Primary navigation"/, "shared header must name its navigation landmark");
assert.match(
  headerSource,
  /const secondaryLinkClass\s*=\s*"[^"\n]*\bmin-h-11\b[^"\n]*"/,
  "every shared header text link must inherit a 44px minimum target",
);
assert.match(
  headerSource,
  /aria-label="OneCommit home"[\s\S]{0,320}?className="[^"\n]*\bmin-h-11\b/,
  "header home link must retain a 44px minimum target",
);
assert.match(
  headerSource,
  /fallbackLabel="Request Access"[\s\S]{0,320}?className="[^"\n]*\bmin-h-11\b/,
  "header access action must retain a 44px minimum target",
);
assert.doesNotMatch(demoSource, /\bautoPlay\b|\bloop\b/, "demo playback must remain user initiated");
assert.match(demoSource, /kind="captions"/, "demo video must retain captions");
for (const [name, source] of [
  ["download", downloadSource],
  ["support", supportSource],
  ["not-found", notFoundSource],
]) {
  assert.match(source, /<PublicHeader\b/, `${name} must use the shared public header`);
  assert.match(source, /<FooterSection\b/, `${name} must use the shared footer`);
  assert.doesNotMatch(
    source,
    /text-white\/(?:[0-5]\d?)\b/,
    `${name} must not use sub-AA low-emphasis white text on the verified dark shell`,
  );
}
const providerBoundary = /Outlook\/Microsoft 365 is currently the only inbox option offered in the beta app\. Gmail is not currently available\./;
assert.match(downloadSource, providerBoundary, "download must disclose the exact current inbox boundary");
assert.match(supportSource, providerBoundary, "support must disclose the exact current inbox boundary");
assert.match(downloadSource, /platformLinks\.map\(\(link\)/, "download must render every configured platform link");
assert.match(
  downloadSource,
  /eventSource="download_page_fallback_email"[\s\S]{0,420}?className="[^"]*\bh-11\b/,
  "download fallback action must retain a 44px target",
);
assert.match(
  downloadSource,
  /analyticsSource="download_page_primary"[\s\S]{0,420}?className="[^"]*\bh-11\b/,
  "download primary action must retain a 44px target",
);
assert.match(
  downloadSource,
  /eventSource="download_page_secondary"[\s\S]{0,420}?className="[^"]*\bh-11\b/,
  "download demo action must retain a 44px target",
);
assert.match(
  downloadSource,
  /analyticsSource={`download_page_\$\{[\s\S]{0,160}?}[\s\S]{0,420}?className="[^"]*\bmin-h-11\b/,
  "every platform action must retain a 44px target",
);
assert.match(
  supportSource,
  /const inlineLinkClass\s*=\s*"[^"]*\bmin-h-6\b/,
  "every support inline link must inherit a 24px target",
);
assert.match(
  supportSource,
  /eventSource="support_contact"[\s\S]{0,420}?className="[^"]*\bmin-h-11\b/,
  "support primary contact action must retain a 44px target",
);
for (const href of ['href="/"', 'href="/support"']) {
  assert.match(notFoundSource, new RegExp(`${href}[\\s\\S]{0,420}?className="[^"]*\\bmin-h-11\\b`), `not-found recovery ${href} must retain a 44px target`);
}

const port = await reservePort();
const server = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", host, "--port", String(port)],
  {
    cwd: repoRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let serverOutput = "";
const capture = (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-20_000);
};
server.stdout.on("data", capture);
server.stderr.on("data", capture);

try {
  const origin = `http://${host}:${port}`;
  let readyResponse;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited before public-shell smoke test:\n${serverOutput}`);
    }
    try {
      readyResponse = await fetch(`${origin}/demo`, { cache: "no-store" });
      if (readyResponse.ok) break;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert(readyResponse?.ok, `public shell did not become ready:\n${serverOutput}`);

  const routeCases = [
    { route: "/demo", status: 200, response: readyResponse },
    { route: "/download", status: 200 },
    { route: "/support", status: 200 },
    { route: "/privacy", status: 200 },
    { route: "/terms", status: 200 },
    { route: "/this-page-does-not-exist", status: 404 },
  ];

  for (const routeCase of routeCases) {
    const { route, status } = routeCase;
    const response = routeCase.response || await fetch(`${origin}${route}`, { cache: "no-store" });
    assert.equal(response.status, status, `${route} must return ${status}`);
    const html = await response.text();

    assert.equal(tagCount(html, "h1"), 1, `${route} must have one h1`);
    assert.equal(tagCount(html, "main"), 1, `${route} must have one main landmark`);
    assert.equal(tagCount(html, "nav"), 1, `${route} must have one navigation landmark`);
    assert.equal(tagCount(html, "footer"), 1, `${route} must have one footer landmark`);
    assert.match(html, /<a[^>]*href="#main-content"[^>]*>[^<]*Skip to main content/, `${route} must render a skip link`);
    assert.match(html, /<nav[^>]*aria-label="Primary navigation"/, `${route} must render the shared primary navigation`);
    assert.match(
      html,
      /<main[^>]*id="main-content"[^>]*tabindex="-1"|<main[^>]*tabindex="-1"[^>]*id="main-content"/,
      `${route} must expose a programmatically focusable skip-link target`,
    );

    const mainStart = html.indexOf('<main id="main-content"');
    const mainEnd = html.indexOf("</main>", mainStart);
    const footerStart = html.indexOf("<footer", mainStart);
    assert(mainStart >= 0 && mainEnd > mainStart, `${route} has an invalid main landmark`);
    assert(footerStart > mainEnd, `${route} footer must follow, not be nested in, main`);

    for (const href of ["/#features", "/#how-it-works", "/#pricing", "/#faq"]) {
      assert(html.includes(`href="${href}"`), `${route} footer is missing ${href}`);
    }
    assert.doesNotMatch(html, /x\.com\/onecommit|instagram\.com\/onecommit/i, `${route} must not expose unverified social links`);

    if (route === "/download") {
      for (const anchor of mainAnchors(html)) {
        assertMinimumTarget(anchor, "h-11", "/download main actions must each be at least 44px tall");
      }
      assert.match(html, providerBoundary, "/download must render the current inbox boundary");
      assert.match(html, /Public download links are not available yet\./, "/download must render the no-link disclosure in the default build");
    }

    if (route === "/support") {
      const anchors = mainAnchors(html);
      assert(anchors.length >= 6, "/support must retain every recovery and policy link");
      for (const anchor of anchors) {
        const classes = tagAttribute(anchor, "class").split(/\s+/);
        assert(
          classes.includes("min-h-11") || classes.includes("min-h-6"),
          "/support links must each retain their 44px primary or 24px inline target",
        );
      }
      assert.match(html, providerBoundary, "/support must render the current inbox boundary");
    }

    if (status === 404) {
      assert.match(html, /<meta[^>]*name="robots"[^>]*content="noindex"/, "404 must remain noindex");
      const recoveryAnchors = mainAnchors(html);
      assert.equal(recoveryAnchors.length, 2, "404 must expose exactly two recovery actions");
      assert.deepEqual(
        recoveryAnchors.map((anchor) => tagAttribute(anchor, "href")).sort(),
        ["/", "/support"],
        "404 recovery actions must lead home and to support",
      );
      for (const anchor of recoveryAnchors) {
        assertMinimumTarget(anchor, "min-h-11", "404 recovery actions must each be at least 44px tall");
      }
    }
  }

  console.log("public-shell smoke ok: six utility and recovery routes share visible accessible landmarks");
} finally {
  await stopServer(server);
}
