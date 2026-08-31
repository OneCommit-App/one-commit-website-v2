import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import net from "node:net"
import path from "node:path"

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next")
const nextOutput = path.join(repoRoot, ".next")
const host = "127.0.0.1"
const envKeys = [
  "NEXT_PUBLIC_APP_DOWNLOAD_URL",
  "NEXT_PUBLIC_IOS_DOWNLOAD_URL",
  "NEXT_PUBLIC_ANDROID_DOWNLOAD_URL",
]

const iosUrl = "https://apps.apple.com/us/app/onecommit/id1234567890"
const androidUrl = "https://play.google.com/store/apps/details?id=com.onecommit"
const primaryUrl = "https://testflight.apple.com/join/OneCommit"
const fallbackDisclosure =
  "Public download links are not available yet. Email support to ask about current beta availability; invitations depend on capacity and a supported app-access path."
const aboutFallbackDisclosure =
  "Public app download links are not configured yet. Request access or email support to ask about current beta availability."
const aboutConfiguredDisclosure =
  "Use the Get the app action for the currently configured download path. Platform availability can vary."

const cases = [
  {
    name: "no configured URL",
    values: {},
    primary: null,
    platforms: [],
    disclosure: true,
  },
  {
    name: "iPhone only",
    values: { NEXT_PUBLIC_IOS_DOWNLOAD_URL: iosUrl },
    primary: iosUrl,
    platforms: [["download_page_ios", "Download for iPhone", iosUrl]],
    disclosure: false,
  },
  {
    name: "Android only",
    values: { NEXT_PUBLIC_ANDROID_DOWNLOAD_URL: androidUrl },
    primary: androidUrl,
    platforms: [["download_page_android", "Download for Android", androidUrl]],
    disclosure: false,
  },
  {
    name: "both platform URLs",
    values: {
      NEXT_PUBLIC_IOS_DOWNLOAD_URL: iosUrl,
      NEXT_PUBLIC_ANDROID_DOWNLOAD_URL: androidUrl,
    },
    primary: iosUrl,
    platforms: [
      ["download_page_ios", "Download for iPhone", iosUrl],
      ["download_page_android", "Download for Android", androidUrl],
    ],
    disclosure: false,
  },
  {
    name: "configured primary URL",
    values: { NEXT_PUBLIC_APP_DOWNLOAD_URL: primaryUrl },
    primary: primaryUrl,
    platforms: [],
    disclosure: false,
  },
]

function caseEnv(values) {
  return {
    ...process.env,
    CI: "true",
    NEXT_TELEMETRY_DISABLED: "1",
    ...Object.fromEntries(envKeys.map((key) => [key, ""])),
    ...values,
  }
}

async function reservePort() {
  const probe = net.createServer()
  await new Promise((resolve, reject) => {
    probe.once("error", reject)
    probe.listen(0, host, resolve)
  })
  const address = probe.address()
  assert(address && typeof address === "object", "failed to reserve a local port")
  await new Promise((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())))
  return address.port
}

async function runNext(args, env, label) {
  const child = spawn(process.execPath, [nextBin, ...args], {
    cwd: repoRoot,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  })
  let output = ""
  const capture = (chunk) => {
    output = `${output}${chunk}`.slice(-30_000)
  }
  child.stdout.on("data", capture)
  child.stderr.on("data", capture)
  const [code, signal] = await once(child, "exit")
  assert.equal(code, 0, `${label} failed (${signal || code}):\n${output}`)
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return
  const exited = once(child, "exit")
  child.kill("SIGTERM")
  const stopped = await Promise.race([
    exited.then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
  ])
  if (!stopped && child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL")
    await once(child, "exit")
  }
}

function anchorBlock(html, source) {
  const blocks = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || []
  return blocks.find((block) => block.includes(`data-funnel-source="${source}"`)) || null
}

function href(block) {
  return block?.match(/\bhref="([^"]*)"/i)?.[1] || ""
}

function attribute(block, name) {
  return block?.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1] || ""
}

function assertDownloadTarget(block, minimumClass, description) {
  assert(
    attribute(block, "class").split(/\s+/).includes(minimumClass),
    `${description} must retain its ${minimumClass === "h-11" ? "44px" : "44px minimum"} target`,
  )
}

function assertExternalSafety(block, description) {
  assert.equal(attribute(block, "target"), "_blank", `${description} external target`)
  const rel = attribute(block, "rel").split(/\s+/)
  assert(rel.includes("noopener") && rel.includes("noreferrer"), `${description} external rel`)
}

function label(block) {
  return (block || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

for (const state of cases) {
  const env = caseEnv(state.values)
  await rm(nextOutput, { recursive: true, force: true })
  await runNext(["build"], env, `${state.name} build`)

  const port = await reservePort()
  const server = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", String(port)], {
    cwd: repoRoot,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  })
  let serverOutput = ""
  const capture = (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-20_000)
  }
  server.stdout.on("data", capture)
  server.stderr.on("data", capture)

  try {
    let response
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (server.exitCode !== null) {
        throw new Error(`${state.name} server exited before readiness:\n${serverOutput}`)
      }
      try {
        response = await fetch(`http://${host}:${port}/download`, { cache: "no-store" })
        if (response.ok) break
      } catch {
        // The production server is still starting.
      }
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    assert(response?.ok, `${state.name} /download did not become ready:\n${serverOutput}`)
    const html = await response.text()
    const aboutResponse = await fetch(`http://${host}:${port}/about`, { cache: "no-store" })
    assert(aboutResponse.ok, `${state.name} /about status`)
    const aboutHtml = await aboutResponse.text()

    const fallback = anchorBlock(html, "download_page_fallback_email")
    const primary = anchorBlock(html, "download_page_primary")
    const secondary = anchorBlock(html, "download_page_secondary")
    const aboutAccess = anchorBlock(aboutHtml, "about_header")
    const platformBlocks = [
      anchorBlock(html, "download_page_ios"),
      anchorBlock(html, "download_page_android"),
    ].filter(Boolean)

    assert.equal(Boolean(fallback), !state.primary, `${state.name} fallback action visibility`)
    assert.equal(Boolean(primary), Boolean(state.primary), `${state.name} primary action visibility`)
    assert.equal(platformBlocks.length, state.platforms.length, `${state.name} platform-link count`)
    assert.equal(html.includes(fallbackDisclosure), state.disclosure, `${state.name} fallback disclosure visibility`)
    assert.equal(aboutHtml.includes(aboutFallbackDisclosure), state.disclosure, `${state.name} about fallback disclosure visibility`)
    assert.equal(aboutHtml.includes(aboutConfiguredDisclosure), !state.disclosure, `${state.name} about configured disclosure visibility`)
    assert(aboutAccess, `${state.name} about access action visibility`)
    assert.equal(label(aboutAccess), state.primary ? "Get the app" : "Request Access", `${state.name} about access label`)
    assert.equal(href(aboutAccess), state.primary || "/download", `${state.name} about access href`)
    assertDownloadTarget(aboutAccess, "min-h-11", `${state.name} about access action`)
    assert(secondary, `${state.name} demo action visibility`)
    assert.equal(href(secondary), "/demo", `${state.name} demo href`)
    assertDownloadTarget(secondary, "h-11", `${state.name} demo action`)

    if (fallback) {
      assert.equal(label(fallback), "Request Beta Access", `${state.name} fallback label`)
      assert.equal(href(fallback), "mailto:admin@onecommit.us?subject=OneCommit%20app%20download", `${state.name} fallback href`)
      assertDownloadTarget(fallback, "h-11", `${state.name} fallback action`)
    }
    if (primary) {
      assert.equal(label(primary), "Open App Download", `${state.name} primary label`)
      assert.equal(href(primary), state.primary, `${state.name} primary href`)
      assertDownloadTarget(primary, "h-11", `${state.name} primary action`)
      assertExternalSafety(primary, `${state.name} primary action`)
      assertExternalSafety(aboutAccess, `${state.name} about access action`)
    }
    for (const [source, expectedLabel, expectedHref] of state.platforms) {
      const block = anchorBlock(html, source)
      assert(block, `${state.name} missing ${source}`)
      assert.equal(label(block), expectedLabel, `${state.name} ${source} label`)
      assert.equal(href(block), expectedHref, `${state.name} ${source} href`)
      assertDownloadTarget(block, "min-h-11", `${state.name} ${source}`)
      assertExternalSafety(block, `${state.name} ${source}`)
    }
  } finally {
    await stopServer(server)
  }
}

console.log("download-state matrix ok: zero, iPhone, Android, both-platform, and primary builds")
