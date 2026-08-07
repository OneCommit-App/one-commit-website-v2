import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const listenHost = "127.0.0.1";
const validOrigin = "https://onecommit-test.public.blob.vercel-storage.com";

async function loadRedirects(value, label) {
  const previous = process.env.PUBLIC_ASSET_ORIGIN;
  if (value === undefined) delete process.env.PUBLIC_ASSET_ORIGIN;
  else process.env.PUBLIC_ASSET_ORIGIN = value;

  try {
    const configUrl = new URL("../next.config.mjs", import.meta.url);
    configUrl.searchParams.set("asset-host-test", label);
    const { default: config } = await import(configUrl.href);
    return config.redirects();
  } finally {
    if (previous === undefined) delete process.env.PUBLIC_ASSET_ORIGIN;
    else process.env.PUBLIC_ASSET_ORIGIN = previous;
  }
}

function findAssetRedirect(redirects) {
  return redirects.find((redirect) => redirect.has?.some(
    (condition) => condition.type === "host" && condition.value === "assets\\.onecommit\\.us\\.?",
  ));
}

assert.equal(findAssetRedirect(await loadRedirects(undefined, "unset")), undefined);

for (const [label, value] of [
  ["http", "http://onecommit-test.public.blob.vercel-storage.com"],
  ["foreign-host", "https://example.com"],
  ["path", `${validOrigin}/prefix`],
  ["query", `${validOrigin}?token=unsafe`],
]) {
  assert.equal(findAssetRedirect(await loadRedirects(value, label)), undefined, `${label} origin must be ignored`);
}

const configuredRedirect = findAssetRedirect(await loadRedirects(`${validOrigin}/`, "valid"));
assert.deepEqual(configuredRedirect, {
  source: "/:path*",
  has: [{ type: "host", value: "assets\\.onecommit\\.us\\.?" }],
  destination: `${validOrigin}/:path*`,
  permanent: false,
});

async function reservePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, listenHost, resolve);
  });
  const address = probe.address();
  assert(address && typeof address === "object", "failed to reserve a local port");
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

function request({ port, host, requestPath = "/" }) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: listenHost,
      port,
      path: requestPath,
      headers: { host },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve({
        status: response.statusCode,
        headers: response.headers,
      }));
    });
    req.once("error", reject);
    req.end();
  });
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
  [nextBin, "dev", "--hostname", listenHost, "--port", String(port)],
  {
    cwd: repoRoot,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      PUBLIC_ASSET_ORIGIN: validOrigin,
    },
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
  let readyResponse;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited before asset-host test:\n${serverOutput}`);
    }
    try {
      readyResponse = await request({ port, host: "www.onecommit.us" });
      if (readyResponse.status === 200) break;
    } catch {
      // The development server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  assert.equal(readyResponse?.status, 200, `canonical host did not become ready:\n${serverOutput}`);

  const requestPath = "/school-banners/example%20school.png?v=2026-08-07&size=2x";
  const response = await request({ port, host: "assets.onecommit.us", requestPath });
  assert.equal(response.status, 307, "configured asset host must redirect temporarily");
  assert.equal(
    response.headers.location,
    `${validOrigin}${requestPath}`,
    "asset redirect must preserve path encoding and query parameters",
  );

  const canonicalResponse = await request({ port, host: "www.onecommit.us" });
  assert.equal(canonicalResponse.status, 200, "asset redirect must remain host-conditioned");
  assert.equal(canonicalResponse.headers.location, undefined);
} finally {
  await stopServer(server);
}

console.log("asset-host redirect ok: unset/invalid origins omitted; configured host returns path-preserving 307");
