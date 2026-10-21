// The Recruiting Pass words agree on every surface that describes it (the
// pages, the home page, the FAQ and the JSON-LD sent to search engines), and
// with the API on branch fable/recruiting-pass-api (one-commit-api):
//   price        ParentPay.service.js PRICE (14999 usd, "$149.99"), Checkout mode "payment"
//   end date     RecruitingPass.service.js deriveEndsOn: Aug 31 of the class year, or purchase + 90 days if later
//   commitment   applyStripeParentPass: a web payment that lands after a commitment is refunded in full
//   overlap      ParentPay.service.js refundWebOverlapAfterApplePass: a later App Store pass refunds the web payment
//   disputes     a chargeback revokes; a won dispute restores (restoreStripePassAfterDispute), or refunds a duplicate
//   trial        config/limits.js PASS_TRIAL_EMAIL_LIMIT = 3 (only while RECRUITING_PASS_ENABLED is on)
//   web refunds  the published Terms' 7-day discretionary review. No code enforces a window, and no
//                decision sets a new one; changing it is Hugh's and counsel's call (see the PR notes).
// Any source file that still says there is no paid plan, or a second refund
// window, is the contradiction this guards against. The guard reads every
// file under app/, components/ and lib/, not a list of pages, because the
// home page, the FAQ and the JSON-LD state prices too.
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const source = async (file) => readFile(path.join(repoRoot, file), "utf8")

async function sourceFiles(dir) {
  const out = []
  for (const entry of await readdir(path.join(repoRoot, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await sourceFiles(rel)))
    else if (/\.(?:tsx?|mdx?)$/.test(entry.name)) out.push(rel)
  }
  return out
}

const everySource = async () => [
  ...(await sourceFiles("app")),
  ...(await sourceFiles("components")),
  ...(await sourceFiles("lib")),
]

// Every surface that names the price, and the files edited with it.
const passSurfaces = [
  "app/parents/page.tsx",
  "app/support/page.tsx",
  "app/terms/page.tsx",
  "app/privacy/page.tsx",
  "app/page.tsx",
  "components/pricing-section.tsx",
  "components/faq-data.ts",
  "components/json-ld.tsx",
  "components/stats-section.tsx",
  "components/home/problem-section.tsx",
]

test("no source file says there is no paid plan or that the app is free", async () => {
  const files = await everySource()
  assert(files.length > 50, `the guard reads the whole site (found ${files.length} files)`)
  const found = []
  for (const file of files) {
    const text = await source(file)
    for (const stale of [
      /no paid plan/i,
      /None are active today/,
      /Free during (?:the )?beta/i,
      /Free, capacity-limited beta/i,
      /free (?:beta )?invitation/i,
      /No credit card is required/i,
      /if (?:a )?paid plans? (?:becomes?|is introduced)/i,
      /paid plans? become available/i,
      /Certain future features may require a paid subscription/,
      /price will be shown before/i,
      /before publishing a price/i,
      /show our price before/i,
      /Any future price/i,
      /\bprice:\s*"0"/,
    ]) {
      if (stale.test(text)) found.push(`${file}: ${stale}`)
    }
  }
  assert.deepEqual(found, [])
})

test("one refund window, stated as the published Terms state it", async () => {
  const windows = new Set()
  for (const file of await everySource()) {
    const text = await source(file)
    if (!/refund/i.test(text)) continue
    for (const match of text.matchAll(/within (\d+) days(?: of (?:a|the) (?:charge|payment))? and we(?:'|’)?(?:ll| will) (?:review|refund)/g)) {
      windows.add(match[1])
    }
  }
  assert.deepEqual([...windows], ["7"], "every page states the same web refund window")
  const terms = await source("app/terms/page.tsx")
  for (const fragment of [
    "within 7 days of the payment and we will review your request",
    "Website payments are non-refundable except where we approve a discretionary refund or where the law requires one.",
  ]) {
    assert.ok(terms.includes(fragment), `terms missing: ${fragment}`)
  }
  const support = await source("app/support/page.tsx")
  assert.ok(/within 7 days of the payment and we'll review your request\. Refunds are discretionary unless the law requires one\./.test(support), "support: the same discretionary review")
  for (const file of await everySource()) {
    assert.ok(!/refund it in full\. After \d+ days/.test(await source(file)), `${file}: no unconditional refund promise`)
  }
})

test("the pass is described the same way everywhere", async () => {
  for (const file of ["app/parents/page.tsx", "app/support/page.tsx", "app/terms/page.tsx", "components/faq-data.ts"]) {
    const text = await source(file)
    assert.ok(/\$149\.99/.test(text), `${file}: the one price`)
    assert.ok(/90 days (?:after|from) purchase/.test(text), `${file}: the 90-day minimum, counted from purchase`)
    assert.ok(!/90 days if that ends later/.test(text), `${file}: 90 days from when?`)
    assert.ok(/\b3 coach emails\b/.test(text), `${file}: the free trial`)
  }
  for (const file of ["components/pricing-section.tsx", "app/page.tsx", "components/stats-section.tsx", "components/home/problem-section.tsx"]) {
    const text = await source(file)
    assert.ok(/\$149\.99/.test(text), `${file}: the one price`)
    assert.ok(/\b3 coach emails\b/.test(text), `${file}: the free trial`)
  }
  const jsonLd = await source("components/json-ld.tsx")
  assert.ok(/price: "149\.99"/.test(jsonLd), "JSON-LD: the pass price")
  assert.ok(/priceCurrency: "USD"/.test(jsonLd), "JSON-LD: the currency")
  assert.ok(/3 coach emails/.test(jsonLd), "JSON-LD: the free trial")

  const terms = await source("app/terms/page.tsx")
  for (const fragment of [
    "one-time purchase of $149.99. It never renews",
    "through August 31 of the athlete's high school graduation year",
    "or for 90 days from purchase if that ends later",
    "Apple handles refunds for App Store purchases",
    "A full refund ends the pass.",
    "if the chargeback is decided in our favor, the pass comes back",
    "before a parent's website payment goes through, we refund that payment in full automatically and no pass is added",
    "If an App Store pass is recorded while a parent's website pass is active, we refund the website payment in full",
    "A commitment logged after the pass is on the account does not end the pass or lead to a refund.",
  ]) {
    assert.ok(terms.includes(fragment), `terms missing: ${fragment}`)
  }
})

test("privacy names the processor and what the pay page keeps", async () => {
  const privacy = await source("app/privacy/page.tsx")
  for (const fragment of [
    "payment processors (Stripe for payments on our website, Apple for App Store purchases)",
    "we keep a scrambled (hashed) copy of its code",
    "The pay page shows only the athlete's first name, the date the pass would cover them through, and the price.",
    "our servers do not store the parent's name, email address, or phone number",
    "Pass and pay-link records are deleted when the athlete's account is deleted.",
  ]) {
    assert.ok(privacy.includes(fragment), `privacy missing: ${fragment}`)
  }
})

test("the pass copy names no athlete's gender", async () => {
  for (const file of passSurfaces) {
    assert.ok(!/\b(?:she|her|hers|he|him|his)\b/i.test(await source(file)), `${file}: use "the athlete" or "they"`)
  }
})
