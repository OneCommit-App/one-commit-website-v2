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
const homeSource = await readFile(path.join(repoRoot, "app", "page.tsx"), "utf8");

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
  const url = `http://${host}:${port}/`;
  let response;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited before smoke test:\n${serverOutput}`);
    }
    try {
      response = await fetch(url, { cache: "no-store" });
      if (response.ok) break;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  assert(response?.ok, `homepage did not become ready:\n${serverOutput}`);
  const html = await response.text();

  const navTag = html.match(/<nav[^>]*data-home-nav="true"[^>]*>/)?.[0];
  const heroTag = html.match(/<section[^>]*data-home-hero="true"[^>]*>/)?.[0];
  const proofTag = html.match(/<div[^>]*data-home-product-proof="true"[^>]*>/)?.[0];
  assert(navTag, "server HTML is missing the primary navigation marker");
  assert(heroTag, "server HTML is missing the homepage hero marker");
  assert(proofTag, "server HTML is missing the first product-proof marker");
  assert.doesNotMatch(navTag, /opacity:\s*0/, "primary navigation is hidden in server HTML");
  assert.doesNotMatch(heroTag, /opacity:\s*0/, "homepage hero is hidden in server HTML");
  assert.doesNotMatch(proofTag, /opacity:\s*0/, "product proof is hidden in server HTML");

  const heroStart = html.indexOf('data-home-hero="true"');
  const proofStart = html.indexOf('data-home-product-proof="true"', heroStart);
  assert(heroStart >= 0 && proofStart > heroStart, "product proof must follow the hero copy");
  const aboveFoldHtml = html.slice(heroStart, proofStart + 1_500);
  assert.doesNotMatch(
    aboveFoldHtml,
    /style="[^"]*opacity:\s*0/,
    "above-the-fold copy or product proof is hidden before hydration",
  );

  for (const requiredText of [
    "Skip to main content",
    "A recruiting system built around the athlete",
    "Turn your marks, grades, and college preferences into a focused list.",
    "Nothing sends without your approval.",
    "Request Beta Access",
    "OneScore by school",
  ]) {
    assert(html.includes(requiredText), `server HTML is missing: ${requiredText}`);
  }

  for (const href of ["/demo", "/coaches", "/schools", "/athletic-programs"]) {
    assert(html.includes(`href="${href}"`), `server HTML is missing navigation link ${href}`);
  }
  assert.match(html, /<a[^>]*href="#main-content"[^>]*>/, "server HTML is missing the skip link");
  assert.match(html, /<main[^>]*id="main-content"[^>]*>/, "server HTML is missing its main landmark");

  const mobileNavigationStart = html.indexOf('id="mobile-navigation"');
  assert(mobileNavigationStart >= 0, "server HTML is missing the mobile navigation target");
  const mobileNavigationHtml = html.slice(mobileNavigationStart, heroStart);
  for (const href of ["/demo", "/coaches", "/schools", "/athletic-programs"]) {
    assert(
      mobileNavigationHtml.includes(`href="${href}"`),
      `server mobile navigation is missing ${href}`,
    );
  }
  assert(
    html.includes('[data-mobile-menu-toggle="true"]'),
    "no-JavaScript fallback does not hide the inert menu toggle",
  );
  assert(
    html.includes("#onecommit-home #mobile-navigation"),
    "no-JavaScript fallback does not reveal the mobile route links",
  );

  const mainStart = html.indexOf('<main id="main-content"');
  const mainEnd = html.indexOf("</main>", mainStart);
  const footerStart = html.indexOf("<footer", mainStart);
  assert(mainStart >= 0 && mainEnd > mainStart, "server HTML has an invalid main landmark");
  assert(footerStart > mainEnd, "global footer must follow, not be nested inside, the main landmark");
  assert.doesNotMatch(
    html,
    /The first self-service recruiting copilot/i,
    "homepage footer must not publish an unsupported market superlative",
  );

  assert.equal(
    (homeSource.match(/animate=\{prefersReducedMotion \? undefined :/g) || []).length,
    4,
    "all four infinite Motion loops must stop for reduced-motion users",
  );
  assert.equal(
    (homeSource.match(/transition=\{prefersReducedMotion \? undefined :/g) || []).length,
    4,
    "all four infinite Motion transitions must stop for reduced-motion users",
  );

  for (const selector of [
    '#onecommit-home [style*="opacity:0"]',
    '#onecommit-home [style*="opacity: 0"]',
  ]) {
    assert(html.includes(selector), `server HTML is missing no-JavaScript fallback ${selector}`);
  }
  console.log(`homepage SSR smoke ok: ${html.length} bytes on ${url}`);
} finally {
  await stopServer(server);
}
