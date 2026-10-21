// The parent pay page's API client (lib/parent-pay.ts) against the contract on
// one-commit-api (src/controllers/v1/parent-pay.js, docs/apple-iap.md "Text a
// parent"). Every response here is a mock: nothing reaches the API or Stripe.
//
// Loads the TypeScript file directly (Node 24's type stripping).
import assert from "node:assert/strict"
import test from "node:test"

import {
  CHECKOUT_PATH,
  DEFAULT_API_BASE_URL,
  LOOKUP_PATH,
  formatDay,
  isStripeCheckoutUrl,
  lookupLink,
  monthsUntil,
  normalizeCode,
  redactAnalyticsUrl,
  resolveApiBaseUrl,
  startCheckout,
} from "../lib/parent-pay.ts"

const BASE = "https://api.example.test"
const KEY = "test-client-key"
const CODE = "K7Q2M9AB"

const payable = {
  status: true,
  data: {
    state: "payable",
    first_name: "Avery",
    ends_on: "2028-08-31",
    price: { amount: 14999, currency: "usd", display: "$149.99" },
    renews: false,
    link_expires_at: "2026-10-28T12:00:00.000Z",
  },
}

const covered = {
  status: true,
  data: { state: "covered", first_name: "Avery", ends_on: "2028-08-31", price: null, renews: false, link_expires_at: null },
}

const linkUnavailable = {
  status: false,
  code: "link_unavailable",
  message: "This link isn't active. Ask your athlete to send a new one from the OneCommit app.",
}

/** A fetch double that records every call and answers from a script. */
function mockFetch(...replies) {
  const calls = []
  const impl = async (url, init) => {
    calls.push({ url, init, body: init?.body ? JSON.parse(init.body) : undefined })
    const next = replies.length > 1 ? replies.shift() : replies[0]
    if (next instanceof Error) throw next
    const { status = 200, body } = next
    return new Response(body === undefined ? "" : typeof body === "string" ? body : JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    })
  }
  return { impl, calls }
}

const api = (fetchImpl) => ({ baseUrl: BASE, apiKey: KEY, fetchImpl })

test("normalizeCode matches the API's rule: 8 letters, no 0/1/I/O, case and dashes ignored", () => {
  assert.equal(normalizeCode("K7Q2M9AB"), "K7Q2M9AB")
  assert.equal(normalizeCode("k7q2-m9ab"), "K7Q2M9AB")
  assert.equal(normalizeCode(" k7q2 m9ab "), "K7Q2M9AB")
  assert.equal(normalizeCode("K7Q2%2DM9AB"), "K7Q2M9AB")
  for (const bad of ["", "K7Q2M9A", "K7Q2M9ABC", "K7Q2M9A0", "K7Q2M9A1", "K7Q2M9AI", "K7Q2M9AO", "K7Q2M9A!", "%E0%A4%A", null, 42, undefined]) {
    assert.equal(normalizeCode(bad), null, `rejects ${String(bad)}`)
  }
})

test("resolveApiBaseUrl falls back to production for anything unusable", () => {
  assert.equal(DEFAULT_API_BASE_URL, "https://one-commit-api-production-6671.up.railway.app")
  assert.equal(resolveApiBaseUrl(undefined), DEFAULT_API_BASE_URL)
  assert.equal(resolveApiBaseUrl("  "), DEFAULT_API_BASE_URL)
  assert.equal(resolveApiBaseUrl("not a url"), DEFAULT_API_BASE_URL)
  assert.equal(resolveApiBaseUrl("http://api.example.com"), DEFAULT_API_BASE_URL, "plain http only for a local mock")
  assert.equal(resolveApiBaseUrl("https://user:pw@api.example.com"), DEFAULT_API_BASE_URL)
  assert.equal(resolveApiBaseUrl("https://api.example.com/?x=1"), DEFAULT_API_BASE_URL)
  assert.equal(resolveApiBaseUrl("https://api.example.com/"), "https://api.example.com")
  assert.equal(resolveApiBaseUrl("https://api.example.com/base//"), "https://api.example.com/base")
  assert.equal(resolveApiBaseUrl("http://127.0.0.1:4010"), "http://127.0.0.1:4010")
  assert.equal(resolveApiBaseUrl("http://localhost:4010/"), "http://localhost:4010")
})

test("formatDay never moves the day with a time zone", () => {
  assert.equal(formatDay("2028-08-31"), "Aug 31, 2028")
  assert.equal(formatDay("2027-01-01"), "Jan 1, 2027")
  assert.equal(formatDay("2027-12-31"), "Dec 31, 2027")
  assert.equal(formatDay("garbage"), "garbage")
})

test("monthsUntil counts whole months, never fewer than one", () => {
  assert.equal(monthsUntil("2028-08-31", new Date(2026, 9, 21)), 22)
  assert.equal(monthsUntil("2027-08-31", new Date(2026, 9, 21)), 10)
  assert.equal(monthsUntil("2026-11-20", new Date(2026, 9, 21)), 1)
  assert.equal(monthsUntil("2027-01-19", new Date(2026, 9, 21)), 2, "a 90-day floor reads as 2 whole months")
  assert.equal(monthsUntil("2026-10-25", new Date(2026, 9, 21)), 1)
  assert.equal(monthsUntil("nope", new Date(2026, 9, 21)), 1)
})

test("lookup posts the code in the JSON body with the API key, no cookies, no referrer", async () => {
  const { impl, calls } = mockFetch({ body: payable })
  const result = await lookupLink(api(impl), "k7q2-m9ab")
  assert.deepEqual(result, {
    kind: "payable",
    firstName: "Avery",
    endsOn: "2028-08-31",
    price: { amount: 14999, currency: "usd", display: "$149.99" },
  })
  assert.equal(calls.length, 1)
  const [{ url, init, body }] = calls
  assert.equal(url, `${BASE}${LOOKUP_PATH}`)
  assert.equal(LOOKUP_PATH, "/v1/parent-pay/links/lookup")
  assert.ok(!url.includes(CODE), "the code is never in a URL")
  assert.deepEqual(body, { code: CODE })
  assert.equal(init.method, "POST")
  assert.equal(init.headers["x-api-key"], KEY)
  assert.equal(init.headers["content-type"], "application/json")
  assert.equal(init.credentials, "omit")
  assert.equal(init.referrerPolicy, "no-referrer")
  assert.equal(init.cache, "no-store")
  assert.equal(init.redirect, "error")
})

test("lookup: covered, and every 404 is the same calm answer", async () => {
  assert.deepEqual(await lookupLink(api(mockFetch({ body: covered }).impl), CODE), {
    kind: "covered",
    firstName: "Avery",
    endsOn: "2028-08-31",
  })
  for (const body of [linkUnavailable, { status: false, code: "parent_pay_disabled" }, { message: "Not found" }, undefined]) {
    assert.deepEqual(await lookupLink(api(mockFetch({ status: 404, body }).impl), CODE), { kind: "unavailable" })
  }
})

test("lookup: a malformed code is unavailable without calling the API", async () => {
  const { impl, calls } = mockFetch({ body: payable })
  assert.deepEqual(await lookupLink(api(impl), "hello"), { kind: "unavailable" })
  assert.equal(calls.length, 0)
})

test("lookup: rate limit, outages, bad shapes and a missing key are errors the page can retry", async () => {
  assert.deepEqual(await lookupLink(api(mockFetch({ status: 429, body: { code: "rate_limited" } }).impl), CODE), { kind: "rate_limited" })
  for (const reply of [
    { status: 503, body: { status: false, code: "parent_pay_unavailable" } },
    { status: 500, body: "<html>oops</html>" },
    { status: 401, body: { message: "API Key is required." } },
    { status: 403, body: { message: "Invalid API Key." } },
    { status: 200, body: "not json" },
    { status: 200, body: { status: true, data: { ...payable.data, state: "weird" } } },
    { status: 200, body: { status: true, data: { ...payable.data, ends_on: "Aug 31" } } },
    { status: 200, body: { status: true, data: { ...payable.data, price: null } } },
    { status: 200, body: { status: true, data: { ...payable.data, price: { amount: "14999", currency: "usd", display: "$149.99" } } } },
    { status: 200, body: { status: true, data: { ...payable.data, renews: true } } },
    { status: 200, body: { status: false, data: payable.data } },
    new TypeError("Failed to fetch"),
  ]) {
    assert.deepEqual(await lookupLink(api(mockFetch(reply).impl), CODE), { kind: "error" })
  }
  const { impl, calls } = mockFetch({ body: payable })
  assert.deepEqual(await lookupLink({ baseUrl: BASE, apiKey: "", fetchImpl: impl }, CODE), { kind: "error" })
  assert.equal(calls.length, 0, "no key, no request")
})

test("lookup: a hung request times out as an error", async () => {
  const hang = (_url, init) =>
    new Promise((_resolve, reject) => {
      init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")))
    })
  assert.deepEqual(await lookupLink({ baseUrl: BASE, apiKey: KEY, fetchImpl: hang, timeoutMs: 20 }, CODE), { kind: "error" })
})

test("lookup: only the first name, trimmed; none is fine", async () => {
  const withSpaces = { status: true, data: { ...payable.data, first_name: "  Avery Jo  " } }
  assert.equal((await lookupLink(api(mockFetch({ body: withSpaces }).impl), CODE)).firstName, "Avery")
  const none = { status: true, data: { ...payable.data, first_name: null } }
  assert.equal((await lookupLink(api(mockFetch({ body: none }).impl), CODE)).firstName, null)
})

test("checkout needs the guardian box before it calls anything", async () => {
  const { impl, calls } = mockFetch({ body: { status: true, data: { url: "https://checkout.stripe.com/c/pay/cs_test_1" } } })
  assert.deepEqual(await startCheckout(api(impl), CODE, false), { kind: "attestation_required" })
  assert.equal(calls.length, 0)
})

test("checkout posts { code, guardian_attested: true } and follows only a Stripe Checkout address", async () => {
  const stripeUrl = "https://checkout.stripe.com/c/pay/cs_test_a1b2#fid=xyz"
  const { impl, calls } = mockFetch({ body: { status: true, data: { url: stripeUrl } } })
  assert.deepEqual(await startCheckout(api(impl), "k7q2m9ab", true), { kind: "redirect", url: stripeUrl })
  assert.equal(calls[0].url, `${BASE}${CHECKOUT_PATH}`)
  assert.equal(CHECKOUT_PATH, "/v1/parent-pay/links/checkout")
  assert.deepEqual(calls[0].body, { code: CODE, guardian_attested: true })
  assert.equal(calls[0].init.headers["x-api-key"], KEY)
  assert.equal(calls[0].init.referrerPolicy, "no-referrer")

  for (const url of [
    "https://evil.example.com/c/pay/cs_test_1",
    "http://checkout.stripe.com/c/pay/cs_test_1",
    "https://checkout.stripe.com.evil.example/c/pay",
    "https://checkout.stripe.com:8443/c/pay",
    "javascript:alert(1)",
    "",
    null,
  ]) {
    const reply = { body: { status: true, data: { url } } }
    assert.deepEqual(await startCheckout(api(mockFetch(reply).impl), CODE, true), { kind: "error" }, String(url))
  }
})

test("checkout maps every refusal the API can give", async () => {
  const cases = [
    [{ status: 404, body: linkUnavailable }, { kind: "unavailable" }],
    [{ status: 404, body: { code: "parent_pay_disabled" } }, { kind: "unavailable" }],
    [{ status: 429, body: { code: "rate_limited" } }, { kind: "rate_limited" }],
    [{ status: 400, body: { code: "guardian_attestation_required" } }, { kind: "attestation_required" }],
    [{ status: 400, body: { code: "something_else" } }, { kind: "error" }],
    [{ status: 409, body: { code: "already_covered", ends_on: "2028-08-31" } }, { kind: "covered", endsOn: "2028-08-31" }],
    [{ status: 409, body: { code: "already_covered" } }, { kind: "covered", endsOn: null }],
    [{ status: 409, body: { code: "payment_processing" } }, { kind: "processing" }],
    [{ status: 409, body: { code: "committed" } }, { kind: "error" }],
    [{ status: 503, body: { code: "payments_unavailable" } }, { kind: "error" }],
    [{ status: 503, body: { code: "parent_pay_unavailable" } }, { kind: "error" }],
    [new TypeError("Failed to fetch"), { kind: "error" }],
  ]
  for (const [reply, expected] of cases) {
    assert.deepEqual(await startCheckout(api(mockFetch(reply).impl), CODE, true), expected, JSON.stringify(reply.body ?? String(reply)))
  }
})

test("isStripeCheckoutUrl", () => {
  assert.equal(isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_live_x"), true)
  assert.equal(isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_x"), true)
  assert.equal(isStripeCheckoutUrl("https://pay.stripe.com/x"), false)
  assert.equal(isStripeCheckoutUrl(`https://checkout.stripe.com/${"x".repeat(5000)}`), false)
})

test("analytics never sees a pay code or the ?paid=1 return", () => {
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/p/K7Q2M9AB"), "https://www.onecommit.us/p/[code]")
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/p/K7Q2M9AB?paid=1#x"), "https://www.onecommit.us/p/[code]")
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/p"), "https://www.onecommit.us/p/[code]")
  assert.equal(redactAnalyticsUrl("/p/K7Q2M9AB"), null, "an unparseable pay address is dropped")
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/parents"), "https://www.onecommit.us/parents")
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/privacy?x=1"), "https://www.onecommit.us/privacy?x=1")
  assert.equal(redactAnalyticsUrl("https://www.onecommit.us/"), "https://www.onecommit.us/")
})
