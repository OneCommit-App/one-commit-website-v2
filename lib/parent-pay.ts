/**
 * The parent pay page (C3, onecommit.us/p/<code>) talking to the API (lane B5).
 *
 * Contract, matched to one-commit-api `src/controllers/v1/parent-pay.js`,
 * `src/routes/ParentPayRoutes.js` and `docs/apple-iap.md` ("Text a parent"):
 *
 *   POST {base}/v1/parent-pay/links/lookup    { code }
 *     200 { status, data: { state: "payable" | "covered", first_name, ends_on,
 *                           price: { amount, currency, display } | null,
 *                           renews: false, link_expires_at } }
 *   POST {base}/v1/parent-pay/links/checkout  { code, guardian_attested: true }
 *     200 { status, data: { url } }  the Stripe Checkout page
 *
 *   Both need the API key (`x-api-key`) and no login. Every unknown, malformed,
 *   expired, used-and-unpaid or closed link is the same 404 (so is the
 *   feature flag being off), and the page answers all of them with one calm
 *   message. 429 is the per-IP limiter (30 a minute). Checkout adds 400
 *   guardian_attestation_required, 409 already_covered / payment_processing
 *   and 503 payments_unavailable.
 *
 * The code travels in the JSON body, never in a URL these requests make, and
 * nothing here logs it. Requests carry no cookies and no referrer, so the
 * `/p/<code>` address the parent opened never reaches the API's logs.
 *
 * Plain, erasable TypeScript with no imports: the node:test suite
 * (scripts/parent-pay.test.mjs) loads this file directly.
 */

export const DEFAULT_API_BASE_URL = "https://one-commit-api-production-6671.up.railway.app"

export const LOOKUP_PATH = "/v1/parent-pay/links/lookup"
export const CHECKOUT_PATH = "/v1/parent-pay/links/checkout"

/** 8 characters from 32 letters: no 0, 1, I or O (the API's CODE_RE). */
const CODE_RE = /^[2-9A-HJ-NP-Z]{8}$/
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** Stripe-hosted Checkout only. Anything else is treated as a failed checkout, never followed. */
const CHECKOUT_HOSTS = new Set(["checkout.stripe.com"])

const REQUEST_TIMEOUT_MS = 15_000

export type PassPrice = { amount: number; currency: string; display: string }

export type LookupResult =
  | { kind: "payable"; firstName: string | null; endsOn: string; price: PassPrice }
  | { kind: "covered"; firstName: string | null; endsOn: string }
  | { kind: "unavailable" }
  | { kind: "rate_limited" }
  | { kind: "error" }

export type CheckoutResult =
  | { kind: "redirect"; url: string }
  | { kind: "covered"; endsOn: string | null }
  | { kind: "processing" }
  | { kind: "attestation_required" }
  | { kind: "unavailable" }
  | { kind: "rate_limited" }
  | { kind: "error" }

export type ParentPayApi = {
  baseUrl: string
  apiKey: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

/** Upper-case, drop spaces and dashes; null unless it is a well-formed code (same rule as the API). */
export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  let decoded = raw
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return null
  }
  const code = decoded.toUpperCase().replace(/[\s-]/g, "")
  return CODE_RE.test(code) ? code : null
}

/**
 * The API origin the browser calls. An unset or unusable value falls back to
 * production; plain http is accepted only for a local mock.
 */
export function resolveApiBaseUrl(raw: string | undefined | null): string {
  const value = typeof raw === "string" ? raw.trim() : ""
  if (!value) return DEFAULT_API_BASE_URL
  try {
    const url = new URL(value)
    const local = url.hostname === "127.0.0.1" || url.hostname === "localhost" || url.hostname === "[::1]"
    if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return DEFAULT_API_BASE_URL
    if (url.username || url.password || url.search || url.hash) return DEFAULT_API_BASE_URL
    return `${url.origin}${url.pathname}`.replace(/\/+$/, "")
  } catch {
    return DEFAULT_API_BASE_URL
  }
}

/** "2028-08-31" -> "Aug 31, 2028" without a time zone ever moving the day. */
export function formatDay(day: string): string {
  const match = DAY_RE.exec(day)
  if (!match) return day
  const month = MONTHS[Number(match[2]) - 1]
  if (!month) return day
  return `${month} ${Number(match[3])}, ${match[1]}`
}

/** Whole calendar months from `now` (local day) until the end day, at least 1. */
export function monthsUntil(day: string, now: Date = new Date()): number {
  const match = DAY_RE.exec(day)
  if (!match) return 1
  const endYear = Number(match[1])
  const endMonth = Number(match[2]) - 1
  const endDate = Number(match[3])
  let months = (endYear - now.getFullYear()) * 12 + (endMonth - now.getMonth())
  if (endDate < now.getDate()) months -= 1
  return Math.max(1, months)
}

/** True for an https Stripe Checkout address and nothing else. */
export function isStripeCheckoutUrl(raw: unknown): raw is string {
  if (typeof raw !== "string" || raw.length > 4096) return false
  try {
    const url = new URL(raw)
    return url.protocol === "https:" && CHECKOUT_HOSTS.has(url.hostname) && !url.username && !url.password && !url.port
  } catch {
    return false
  }
}

/**
 * Vercel Web Analytics sees `/p/[code]` instead of the real address: the code
 * and the `?paid=1` return never leave the page in a pageview or an event.
 * Returns null (drop the event) for anything that can't be read safely.
 */
export function redactAnalyticsUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return /(^|\/)p(\/|$)/.test(raw) ? null : raw
  }
  if (url.pathname === "/p" || url.pathname.startsWith("/p/")) {
    url.pathname = "/p/[code]"
    url.search = ""
    url.hash = ""
    return url.toString()
  }
  return raw
}

function cleanFirstName(value: unknown): string | null {
  if (typeof value !== "string") return null
  const name = value.trim().split(/\s+/)[0] || ""
  return name ? name.slice(0, 40) : null
}

function cleanDay(value: unknown): string | null {
  return typeof value === "string" && DAY_RE.test(value) ? value : null
}

function cleanPrice(value: unknown): PassPrice | null {
  if (!value || typeof value !== "object") return null
  const { amount, currency, display } = value as Record<string, unknown>
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) return null
  if (typeof currency !== "string" || typeof display !== "string") return null
  const shown = display.trim()
  if (!shown || shown.length > 16) return null
  return { amount, currency, display: shown }
}

type Reply = { status: number; body: Record<string, unknown> | null }

async function post(api: ParentPayApi, path: string, payload: Record<string, unknown>): Promise<Reply | null> {
  const fetchImpl = api.fetchImpl ?? fetch
  if (!api.apiKey) return null
  const controller = typeof AbortController === "function" ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), api.timeoutMs ?? REQUEST_TIMEOUT_MS) : null
  try {
    const response = await fetchImpl(`${api.baseUrl}${path}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": api.apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      redirect: "error",
      referrerPolicy: "no-referrer",
      ...(controller ? { signal: controller.signal } : {}),
    })
    let body: Record<string, unknown> | null = null
    try {
      const parsed: unknown = await response.json()
      body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null
    } catch {
      body = null
    }
    return { status: response.status, body }
  } catch {
    return null
  } finally {
    if (timer) clearTimeout(timer)
  }
}

function errorCode(reply: Reply): string {
  const code = reply.body?.code
  return typeof code === "string" ? code : ""
}

function data(reply: Reply): Record<string, unknown> | null {
  const value = reply.body?.data
  return reply.body?.status === true && value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

/** What the page shows for a code. Never throws. */
export async function lookupLink(api: ParentPayApi, rawCode: unknown): Promise<LookupResult> {
  const code = normalizeCode(rawCode)
  if (!code) return { kind: "unavailable" }
  const reply = await post(api, LOOKUP_PATH, { code })
  if (!reply) return { kind: "error" }
  if (reply.status === 404) return { kind: "unavailable" }
  if (reply.status === 429) return { kind: "rate_limited" }
  if (reply.status !== 200) return { kind: "error" }
  const summary = data(reply)
  if (!summary) return { kind: "error" }
  const endsOn = cleanDay(summary.ends_on)
  const firstName = cleanFirstName(summary.first_name)
  if (!endsOn || summary.renews !== false) return { kind: "error" }
  if (summary.state === "covered") return { kind: "covered", firstName, endsOn }
  if (summary.state === "payable") {
    const price = cleanPrice(summary.price)
    return price ? { kind: "payable", firstName, endsOn, price } : { kind: "error" }
  }
  return { kind: "error" }
}

/** Open Stripe Checkout for a payable link. Only a Stripe Checkout address comes back as a redirect. */
export async function startCheckout(api: ParentPayApi, rawCode: unknown, guardianAttested: boolean): Promise<CheckoutResult> {
  if (guardianAttested !== true) return { kind: "attestation_required" }
  const code = normalizeCode(rawCode)
  if (!code) return { kind: "unavailable" }
  const reply = await post(api, CHECKOUT_PATH, { code, guardian_attested: true })
  if (!reply) return { kind: "error" }
  if (reply.status === 404) return { kind: "unavailable" }
  if (reply.status === 429) return { kind: "rate_limited" }
  if (reply.status === 400 && errorCode(reply) === "guardian_attestation_required") return { kind: "attestation_required" }
  if (reply.status === 409 && errorCode(reply) === "already_covered") {
    return { kind: "covered", endsOn: cleanDay(reply.body?.ends_on) }
  }
  if (reply.status === 409 && errorCode(reply) === "payment_processing") return { kind: "processing" }
  if (reply.status !== 200) return { kind: "error" }
  const url = data(reply)?.url
  return isStripeCheckoutUrl(url) ? { kind: "redirect", url } : { kind: "error" }
}
