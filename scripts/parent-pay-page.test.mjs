// The parent pay page (/p/[code]) end to end against a MOCK API: the built site
// under `next start`, a local stand-in for the API's two parent-page endpoints,
// and headless Chrome driven over the DevTools protocol (no extra dependency).
//
// Run after `pnpm build`. Nothing leaves this machine: Chrome's every request
// is intercepted, the Stripe Checkout address is answered by a stub, and
// anything else off 127.0.0.1 is refused (and fails the test).
//
//   node scripts/parent-pay-page.test.mjs
//   PARENT_PAY_SHOTS=/some/dir node scripts/parent-pay-page.test.mjs   (also saves screenshots)
//   CHROME_PATH=/path/to/chrome ...                                     (pick the browser)
//
// Without Chrome the server-rendered checks still run; under CI a missing
// Chrome is a failure, not a skip.
import assert from "node:assert/strict"
import { spawn, spawnSync } from "node:child_process"
import { once } from "node:events"
import { existsSync } from "node:fs"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import http from "node:http"
import net from "node:net"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next")
const host = "127.0.0.1"
const API_KEY = "test-client-key"
const STRIPE_URL = "https://checkout.stripe.com/c/pay/cs_test_mock#fidkdWxOYHwnPyd1blpxYHZxWjA0"
const shotsDir = process.env.PARENT_PAY_SHOTS || ""

assert(existsSync(path.join(repoRoot, ".next", "BUILD_ID")), "run `pnpm build` before this test")

// ---------------------------------------------------------------------------
// The mock API: the contract from one-commit-api src/controllers/v1/parent-pay.js
// ---------------------------------------------------------------------------

const payable = (firstName = "Avery") => ({
  status: 200,
  body: {
    status: true,
    data: {
      state: "payable",
      first_name: firstName,
      ends_on: "2028-08-31",
      price: { amount: 14999, currency: "usd", display: "$149.99" },
      renews: false,
      link_expires_at: "2026-10-28T12:00:00.000Z",
    },
  },
})
const covered = {
  status: 200,
  body: {
    status: true,
    data: { state: "covered", first_name: "Avery", ends_on: "2028-08-31", price: null, renews: false, link_expires_at: null },
  },
}
const gone = {
  status: 404,
  body: { status: false, code: "link_unavailable", message: "This link isn't active. Ask your athlete to send a new one from the OneCommit app." },
}
const disabled = { status: 404, body: { status: false, code: "parent_pay_disabled", message: "Asking a parent to pay isn't available yet." } }
const limited = { status: 429, body: { status: false, code: "rate_limited", message: "Too many tries. Please wait a minute and open the link again." } }
const outage = { status: 503, body: { status: false, code: "parent_pay_unavailable", message: "This isn't available right now." } }
const toStripe = { status: 200, body: { status: true, data: { url: STRIPE_URL } } }

// Codes use the API's alphabet (no 0, 1, I, O). Each entry answers lookup by
// call count (the last answer repeats) and checkout with one answer.
const fixtures = {
  K7Q2M9AB: { lookup: [payable()], checkout: toStripe },
  NAMELESS: { lookup: [payable(null)], checkout: toStripe },
  CVRD2345: { lookup: [covered] },
  GQNE7777: { lookup: [gone] },
  DSBL2345: { lookup: [disabled] },
  SLWW2345: { lookup: [limited] },
  FALL2345: { lookup: [outage, payable()], checkout: toStripe },
  PRCS2345: { lookup: [payable()], checkout: { status: 409, body: { status: false, code: "payment_processing", message: "This payment is going through. Check back in a minute." } } },
  BADU2345: { lookup: [payable()], checkout: { status: 200, body: { status: true, data: { url: "https://evil.example.com/c/pay/cs_test_x" } } } },
  TAKN2345: { lookup: [payable()], checkout: { status: 409, body: { status: false, code: "already_covered", message: "Already covered. There's nothing to pay.", ends_on: "2027-08-31" } } },
  PAYD2345: { lookup: [payable(), covered] },
}

const apiRequests = []
const lookupCalls = new Map()

function sendJson(res, status, body) {
  res.writeHead(status, {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "cache-control": "no-store",
  })
  res.end(JSON.stringify(body))
}

const mockApi = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    // The API's app.use(cors()): any origin, the request's own headers.
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "access-control-allow-headers": req.headers["access-control-request-headers"] || "",
    })
    res.end()
    return
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString("utf8")
  let body = null
  try {
    body = JSON.parse(raw)
  } catch {
    body = null
  }
  apiRequests.push({ method: req.method, url: req.url, headers: req.headers, body })

  if (req.headers["x-api-key"] !== API_KEY) return sendJson(res, 401, { message: "API Key is required." })
  const code = body && typeof body.code === "string" ? body.code : ""
  const fixture = fixtures[code]
  if (req.method === "POST" && req.url === "/v1/parent-pay/links/lookup") {
    if (!fixture) return sendJson(res, gone.status, gone.body)
    const n = lookupCalls.get(code) || 0
    lookupCalls.set(code, n + 1)
    const answer = fixture.lookup[Math.min(n, fixture.lookup.length - 1)]
    return sendJson(res, answer.status, answer.body)
  }
  if (req.method === "POST" && req.url === "/v1/parent-pay/links/checkout") {
    if (body?.guardian_attested !== true) {
      return sendJson(res, 400, { status: false, code: "guardian_attestation_required" })
    }
    const answer = fixture?.checkout || gone
    return sendJson(res, answer.status, answer.body)
  }
  return sendJson(res, 404, { message: "Not found" })
})

// ---------------------------------------------------------------------------
// Process plumbing
// ---------------------------------------------------------------------------

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

async function stopProcess(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return
  const exited = once(child, "exit")
  child.kill("SIGTERM")
  const stopped = await Promise.race([exited.then(() => true), new Promise((resolve) => setTimeout(() => resolve(false), 5_000))])
  if (!stopped && child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL")
    await once(child, "exit")
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ]
  for (const candidate of candidates) if (existsSync(candidate)) return candidate
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const found = spawnSync("which", [name], { encoding: "utf8" })
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim()
  }
  return null
}

/** A minimal DevTools protocol client over Node's global WebSocket. */
class Cdp {
  constructor(socket) {
    this.socket = socket
    this.nextId = 0
    this.pending = new Map()
    this.listeners = new Set()
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id)
        this.pending.delete(message.id)
        if (message.error) reject(new Error(`${message.error.message} (${message.error.code})`))
        else resolve(message.result)
        return
      }
      if (message.method) for (const listener of this.listeners) listener(message)
    })
  }

  static async connect(url) {
    const socket = new WebSocket(url)
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true })
      socket.addEventListener("error", reject, { once: true })
    })
    return new Cdp(socket)
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId
    this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`CDP ${method} timed out`))
        }
      }, 20_000)
    })
  }

  on(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  close() {
    this.socket.close()
  }
}

// ---------------------------------------------------------------------------
// Start everything
// ---------------------------------------------------------------------------

const apiPort = await reservePort()
await new Promise((resolve) => mockApi.listen(apiPort, host, resolve))
const apiBase = `http://${host}:${apiPort}`

const sitePort = await reservePort()
const site = `http://${host}:${sitePort}`
const server = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", String(sitePort)], {
  cwd: repoRoot,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    ONECOMMIT_API_BASE_URL: apiBase,
    ONECOMMIT_API_KEY: API_KEY,
  },
  stdio: ["ignore", "pipe", "pipe"],
})
let serverOutput = ""
const capture = (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-20_000)
}
server.stdout.on("data", capture)
server.stderr.on("data", capture)

let chrome = null
let chromeProfile = null
let cdp = null
const failures = []

try {
  let ready = false
  for (let attempt = 0; attempt < 120 && !ready; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next server exited before the test:\n${serverOutput}`)
    try {
      ready = (await fetch(`${site}/robots.txt`, { cache: "no-store" })).ok
    } catch {
      // still starting
    }
    if (!ready) await sleep(250)
  }
  assert(ready, `site did not become ready:\n${serverOutput}`)

  // -------------------------------------------------------------------------
  // Server-rendered page: private, uncached, and knows nothing about the athlete
  // -------------------------------------------------------------------------
  {
    const response = await fetch(`${site}/p/K7Q2M9AB`, { cache: "no-store", redirect: "manual" })
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.equal(response.headers.get("referrer-policy"), "no-referrer", "/p must send no referrer")
    assert.match(response.headers.get("x-robots-tag") || "", /noindex/, "/p must carry X-Robots-Tag: noindex")
    assert.match(response.headers.get("cache-control") || "", /no-store/, "/p must never be cached")
    assert.match(html, /<meta name="robots" content="noindex, nofollow[^"]*"/, "robots meta noindex")
    assert.match(html, /<meta name="referrer" content="no-referrer"/, "referrer meta")
    assert.doesNotMatch(html, /rel="canonical"/, "no canonical address for a private link")
    assert.doesNotMatch(html, /property="og:url"/, "the link preview carries no address")
    assert.match(html, /<title>Recruiting Pass \| OneCommit<\/title>/)
    assert.match(html, /<meta property="og:title" content="OneCommit Recruiting Pass"/)
    assert.doesNotMatch(html, /Avery/, "the server never looks the athlete up")
    assert.equal(apiRequests.length, 0, "server rendering makes no API call")

    const paid = await (await fetch(`${site}/p/K7Q2M9AB?paid=1`, { cache: "no-store" })).text()
    assert.match(paid, /Thank you\./, "the Stripe return renders its thank-you straight away")

    const home = await fetch(`${site}/`, { cache: "no-store" })
    assert.equal(home.headers.get("referrer-policy"), "strict-origin-when-cross-origin", "the rest of the site is unchanged")
    assert.equal(home.headers.get("x-robots-tag"), null)

    const sitemap = await (await fetch(`${site}/sitemap.xml`, { cache: "no-store" })).text()
    assert.doesNotMatch(sitemap, /\/p\//, "pay links are never in the sitemap")
    console.log("ok server-rendered /p: noindex, no-referrer, no-store, no athlete data, sitemap clean")
  }

  // -------------------------------------------------------------------------
  // In a browser
  // -------------------------------------------------------------------------
  const chromePath = findChrome()
  if (!chromePath) {
    if (process.env.CI) throw new Error("Chrome is required for the parent pay browser checks in CI (set CHROME_PATH)")
    console.log("SKIP browser flows: no Chrome found (set CHROME_PATH)")
  } else {
    chromeProfile = await mkdtemp(path.join(os.tmpdir(), "oc-parent-pay-chrome-"))
    const args = [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${chromeProfile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-sync",
      "--hide-scrollbars",
      "--mute-audio",
      "--window-size=1280,900",
    ]
    if (process.platform === "linux") args.push("--no-sandbox")
    chrome = spawn(chromePath, [...args, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] })
    const wsUrl = await new Promise((resolve, reject) => {
      let text = ""
      const timer = setTimeout(() => reject(new Error(`Chrome did not start:\n${text}`)), 20_000)
      chrome.stderr.on("data", (chunk) => {
        text += chunk
        const match = text.match(/DevTools listening on (ws:\/\/\S+)/)
        if (match) {
          clearTimeout(timer)
          resolve(match[1])
        }
      })
      chrome.once("exit", () => reject(new Error(`Chrome exited:\n${text}`)))
    })
    cdp = await Cdp.connect(wsUrl)
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" })
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true })
    const send = (method, params) => cdp.send(method, params, sessionId)

    // Every request is seen here first: local ones go through, Stripe's page is
    // a stub, everything else is refused and recorded as a failure.
    const offMachine = []
    const stripeHits = []
    cdp.on((message) => {
      if (message.sessionId !== sessionId || message.method !== "Fetch.requestPaused") return
      const { requestId, request, resourceType } = message.params
      const url = new URL(request.url)
      if (url.hostname === host) {
        send("Fetch.continueRequest", { requestId }).catch(() => {})
      } else if (url.hostname === "checkout.stripe.com") {
        if (resourceType === "Document") stripeHits.push({ url: request.url, headers: request.headers })
        send("Fetch.fulfillRequest", {
          requestId,
          responseCode: 200,
          responseHeaders: [{ name: "content-type", value: "text/html" }],
          body: Buffer.from("<!doctype html><title>Stripe stub</title><p>stub</p>").toString("base64"),
        }).catch(() => {})
      } else {
        offMachine.push(request.url)
        send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" }).catch(() => {})
      }
    })
    await send("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] })
    await send("Page.enable")
    await send("Runtime.enable")
    await send("Network.enable")
    await send("Network.setCacheDisabled", { cacheDisabled: true })

    const evaluate = async (expression) => {
      const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
      return result.result.value
    }
    const text = () => evaluate("document.body.innerText")
    const waitFor = async (expression, label, timeout = 12_000) => {
      const started = Date.now()
      let last
      while (Date.now() - started < timeout) {
        try {
          last = await evaluate(expression)
          if (last) return last
        } catch {
          // navigating
        }
        await sleep(100)
      }
      throw new Error(`timed out waiting for ${label}; page text:\n${await text().catch(() => "(unreadable)")}`)
    }
    const waitForText = (needle, timeout) =>
      waitFor(`document.body && document.body.innerText.includes(${JSON.stringify(needle)})`, JSON.stringify(needle), timeout)
    const goto = async (route) => {
      const loaded = new Promise((resolve) => {
        const off = cdp.on((message) => {
          if (message.sessionId === sessionId && message.method === "Page.loadEventFired") {
            off()
            resolve()
          }
        })
      })
      await send("Page.navigate", { url: `${site}${route}` })
      await loaded
    }
    const viewport = async (width, height, dark = false) => {
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 768 })
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: dark ? "dark" : "light" }, { name: "prefers-reduced-motion", value: "reduce" }] })
    }
    const shoot = async (name) => {
      if (!shotsDir) return
      await mkdir(shotsDir, { recursive: true })
      await sleep(300)
      const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true })
      await writeFile(path.join(shotsDir, `${name}.png`), Buffer.from(data, "base64"))
    }
    const noOverflow = async (label) => {
      const widths = await evaluate("({ doc: document.documentElement.scrollWidth, view: window.innerWidth })")
      assert(widths.doc <= widths.view, `${label}: horizontal overflow ${widths.doc} > ${widths.view}`)
    }
    const step = async (label, fn) => {
      try {
        await fn()
        console.log(`ok ${label}`)
      } catch (error) {
        failures.push(`${label}: ${error.stack || error.message}`)
        console.log(`FAIL ${label}`)
      }
    }
    const requestsSince = (mark) => apiRequests.slice(mark)

    await viewport(390, 844)

    await step("payable: name, one price, the window, the guardian box, one button", async () => {
      const mark = apiRequests.length
      await goto("/p/k7q2-m9ab")
      await waitForText("Cover Avery’s recruiting app.")
      const body = await text()
      for (const needle of [
        "One payment. Nothing renews.",
        "$149.99",
        "once",
        "Today",
        "Aug 31, 2028",
        "months",
        "Finds schools that fit",
        "Riley drafts coach emails",
        "AI COACH",
        "Avery approves each one",
        "Tracks coach replies",
        "I’m Avery’s parent or guardian.",
        "Pay $149.99",
        "Secure checkout by Stripe. We never see your card.",
        "No account needed · US only",
      ]) {
        assert(body.includes(needle), `missing ${JSON.stringify(needle)}`)
      }
      assert.equal(await evaluate("document.querySelectorAll('main button').length"), 1, "one button")
      const calls = requestsSince(mark)
      assert.equal(calls.length, 1, "one lookup")
      assert.equal(calls[0].url, "/v1/parent-pay/links/lookup")
      assert.deepEqual(calls[0].body, { code: "K7Q2M9AB" })
      assert.equal(calls[0].headers["x-api-key"], API_KEY)
      assert.equal(calls[0].headers.referer, undefined, "no referrer to the API")
      assert.equal(calls[0].headers.cookie, undefined, "no cookies to the API")
      await noOverflow("payable 390")
      await shoot("01-payable-light-390")
    })

    await step("payable: the box is required, then Pay opens Stripe Checkout with no referrer", async () => {
      const mark = apiRequests.length
      await evaluate("document.querySelector('main button[type=submit]').click()")
      await waitForText("Please confirm you’re Avery’s parent or guardian.")
      assert.equal(requestsSince(mark).length, 0, "no checkout without the box")
      assert.equal(await evaluate("document.activeElement && document.activeElement.type"), "checkbox", "focus moves to the box")
      await shoot("02-payable-attest-required-390")
      await evaluate("document.querySelector('main input[type=checkbox]').click()")
      assert.equal(await evaluate("document.body.innerText.includes('Please confirm')"), false, "ticking clears the note")
      await evaluate("document.querySelector('main button[type=submit]').click()")
      await waitFor(`location.href.startsWith(${JSON.stringify(STRIPE_URL.split("#")[0])})`, "the Stripe Checkout page")
      const calls = requestsSince(mark)
      assert.equal(calls.length, 1, "one checkout call")
      assert.equal(calls[0].url, "/v1/parent-pay/links/checkout")
      assert.deepEqual(calls[0].body, { code: "K7Q2M9AB", guardian_attested: true })
      assert.equal(calls[0].headers.referer, undefined)
      assert.equal(stripeHits.length, 1, "one navigation to Stripe")
      const refererHeader = Object.keys(stripeHits[0].headers).find((key) => key.toLowerCase() === "referer")
      assert.equal(refererHeader, undefined, "Stripe never sees the /p/<code> address")
    })

    await step("covered: no checkout, calm words", async () => {
      await goto("/p/CVRD2345")
      await waitForText("Already covered.")
      assert((await text()).includes("Avery is covered through Aug 31, 2028. There’s nothing to pay."))
      assert.equal(await evaluate("document.querySelectorAll('main button, main input').length"), 0)
      await shoot("03-covered-390")
    })

    await step("unknown, expired, closed or switched-off links all read the same", async () => {
      for (const route of ["/p/GQNE7777", "/p/DSBL2345"]) {
        await goto(route)
        await waitForText("This link isn’t active.")
        assert((await text()).includes("Ask your athlete to send a new one from the OneCommit app."))
      }
      await shoot("04-unavailable-390")
      const mark = apiRequests.length
      await goto("/p/hello")
      await waitForText("This link isn’t active.")
      assert.equal(requestsSince(mark).length, 0, "a malformed code never reaches the API")
    })

    await step("API failure: didn't load, nothing charged, try again works", async () => {
      await goto("/p/FALL2345")
      await waitForText("This page didn’t load.")
      assert((await text()).includes("Nothing was charged. Try again in a moment."))
      await shoot("05-error-390")
      await evaluate("[...document.querySelectorAll('main button')].find((b) => b.innerText.includes('Try again')).click()")
      await waitForText("Cover Avery’s recruiting app.")
    })

    await step("rate limited", async () => {
      await goto("/p/SLWW2345")
      await waitForText("Too many tries.")
      assert((await text()).includes("Wait a minute, then try again."))
    })

    await step("checkout refusals stay on the page with a calm note", async () => {
      await goto("/p/PRCS2345")
      await waitForText("Cover Avery’s recruiting app.")
      await evaluate("document.querySelector('main input[type=checkbox]').click()")
      await evaluate("document.querySelector('main button[type=submit]').click()")
      await waitForText("This payment is going through. Check back in a minute.")
      assert(new URL(await evaluate("location.href")).pathname === "/p/PRCS2345")

      await goto("/p/BADU2345")
      await waitForText("Cover Avery’s recruiting app.")
      await evaluate("document.querySelector('main input[type=checkbox]').click()")
      await evaluate("document.querySelector('main button[type=submit]').click()")
      await waitForText("Checkout didn’t open. Nothing was charged. Try again.")
      assert.equal(new URL(await evaluate("location.href")).hostname, host, "a non-Stripe address is never followed")

      await goto("/p/TAKN2345")
      await waitForText("Cover Avery’s recruiting app.")
      await evaluate("document.querySelector('main input[type=checkbox]').click()")
      await evaluate("document.querySelector('main button[type=submit]').click()")
      await waitForText("Already covered.")
      assert((await text()).includes("Avery is covered through Aug 31, 2027."))
    })

    await step("no first name: 'your athlete'", async () => {
      await goto("/p/NAMELESS")
      await waitForText("Cover your athlete’s recruiting app.")
      const body = await text()
      assert(body.includes("I’m your athlete’s parent or guardian."))
      assert(body.includes("Your athlete approves each one"))
    })

    await step("back from Stripe (?paid=1): thank you, then confirmed once the pass lands", async () => {
      await goto("/p/PAYD2345?paid=1")
      await waitForText("Thank you.")
      assert((await text()).includes("Stripe emails your receipt."))
      await shoot("06-paid-pending-390")
      await waitForText("You’re all set.", 15_000)
      const body = await text()
      assert(body.includes("Avery is covered through Aug 31, 2028"))
      assert(body.includes("The pass goes straight to Avery’s account."))
      assert(body.includes("Nothing renews. There’s nothing else to do."))
      assert(!body.includes("Didn’t finish paying?"))
      await shoot("07-paid-confirmed-390")
    })

    await step("?paid=1 on a link that no longer answers: thank you, honest wait", async () => {
      await goto("/p/GQNE7777?paid=1")
      await waitForText("This can take a few minutes.")
      const body = await text()
      assert(body.includes("Thank you."))
      assert(body.includes("Didn’t finish paying?"))
      assert.equal(await evaluate("document.querySelector('main a[href=\"/p/GQNE7777\"]') !== null"), true)
    })

    await step("small phone, dark scheme and desktop: no overflow", async () => {
      await viewport(320, 640)
      await goto("/p/K7Q2M9AB")
      await waitForText("Cover Avery’s recruiting app.")
      await noOverflow("payable 320")
      await viewport(390, 844, true)
      await goto("/p/K7Q2M9AB")
      await waitForText("Cover Avery’s recruiting app.")
      const bg = await evaluate("getComputedStyle(document.body).backgroundColor")
      assert.equal(bg, "rgb(6, 16, 12)", "dark canvas token applies")
      await noOverflow("payable dark 390")
      await shoot("08-payable-dark-390")
      await goto("/p/K7Q2M9AB?paid=1")
      await waitForText("Thank you.")
      await shoot("09-paid-dark-390")
      await viewport(1280, 900)
      await goto("/p/K7Q2M9AB")
      await waitForText("Cover Avery’s recruiting app.")
      await noOverflow("payable 1280")
      await shoot("10-payable-light-1280")
    })

    assert.deepEqual(offMachine, [], "no request left this machine")
    console.log("ok nothing left this machine (Stripe answered by a stub)")
  }
} finally {
  if (cdp) cdp.close()
  await stopProcess(chrome)
  if (chromeProfile) await rm(chromeProfile, { recursive: true, force: true }).catch(() => {})
  await stopProcess(server)
  await new Promise((resolve) => mockApi.close(resolve))
}

if (failures.length) {
  console.error(`\n${failures.length} parent pay check(s) failed:\n\n${failures.join("\n\n")}`)
  process.exit(1)
}
console.log("ok parent pay page")
