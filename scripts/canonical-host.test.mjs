import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import http from "node:http";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const listenHost = "127.0.0.1";

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

function request({ port, host, requestPath = "/", method = "GET" }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: listenHost,
        port,
        path: requestPath,
        method,
        headers: { host },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        }));
      },
    );
    req.once("error", reject);
    req.end();
  });
}

const port = await reservePort();
const server = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", listenHost, "--port", String(port)],
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
  let readyResponse;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited before canonical-host smoke test:\n${serverOutput}`);
    }
    try {
      readyResponse = await request({ port, host: "www.onecommit.us" });
      if (readyResponse.status === 200) break;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  assert.equal(readyResponse?.status, 200, `canonical host did not become ready:\n${serverOutput}`);
  assert.match(
    readyResponse.body,
    /A recruiting system built around the athlete/,
    "canonical host must continue to render the homepage",
  );

  const cases = [
    {
      host: "onecommit.org",
      requestPath: "/",
      expectedLocation: "https://www.onecommit.us",
    },
    {
      host: "www.onecommit.org",
      requestPath: "/schools?utm_source=old-domain&utm_campaign=fall%202026",
      expectedLocation: "https://www.onecommit.us/schools?utm_source=old-domain&utm_campaign=fall%202026",
    },
    {
      host: "www.onecommit.org",
      requestPath: "/athletic-programs",
      method: "POST",
      expectedLocation: "https://www.onecommit.us/athletic-programs",
    },
    {
      host: "www.onecommit.org.",
      requestPath: "/terms?ref=fqdn",
      expectedLocation: "https://www.onecommit.us/terms?ref=fqdn",
    },
  ];

  for (const testCase of cases) {
    const response = await request({ port, ...testCase });
    assert.equal(
      response.status,
      308,
      `${testCase.host}${testCase.requestPath} must redirect permanently`,
    );
    assert.equal(
      response.headers.location,
      testCase.expectedLocation,
      `${testCase.host}${testCase.requestPath} must preserve the canonical path and query`,
    );
    assert.doesNotMatch(
      response.body,
      /A recruiting system built around the athlete/,
      "legacy-host redirects must not render duplicate page content",
    );
  }

  for (const nearMatchHost of [
    "onecommitXorg",
    "onecommit-org",
    "wwwXonecommitXorg",
    "notonecommit.org",
    "onecommit.org.example",
    "www.onecommit.us",
    "preview.vercel.app",
  ]) {
    const response = await request({ port, host: nearMatchHost });
    assert.equal(response.status, 200, `${nearMatchHost} must not match a legacy-domain redirect`);
    assert.equal(response.headers.location, undefined, `${nearMatchHost} must not receive a redirect location`);
    assert.match(
      response.body,
      /A recruiting system built around the athlete/,
      `${nearMatchHost} must keep the normal application response`,
    );
  }

  console.log(`canonical-host smoke ok: ${cases.length} legacy redirects and 7 near-match hosts verified`);
} finally {
  await stopServer(server);
}
