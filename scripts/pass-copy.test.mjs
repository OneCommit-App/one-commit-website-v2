// The Recruiting Pass words agree on every page that describes it, and with
// the API on branch fable/recruiting-pass-api (one-commit-api):
//   price        ParentPay.service.js PRICE (14999 usd, "$149.99"), Checkout mode "payment"
//   end date     RecruitingPass.service.js deriveEndsOn: Aug 31 of the class year, or purchase + 90 days if later
//   commitment   applyStripeParentPass: a web payment that lands after a commitment is refunded in full
//   trial        config/limits.js PASS_TRIAL_EMAIL_LIMIT = 3
//   web refunds  docs/apple-iap.md "Web refunds inside 14 days" (the window is Hugh's call; see the PR notes)
// A page that still says there is no paid plan, or a second refund window,
// is the contradiction this guards against.
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")
const pages = ["app/parents/page.tsx", "app/support/page.tsx", "app/terms/page.tsx", "app/privacy/page.tsx"]

test("no page says there is no paid plan, or a refund window other than 14 days", async () => {
  for (const path of pages) {
    const page = await source(path)
    for (const stale of [
      /no paid plan/i,
      /None are active today/,
      /Free during the beta/i,
      /if (?:a )?paid plans? (?:becomes?|is introduced)/i,
      /Certain future features may require a paid subscription/,
      /within 7 days/i,
    ]) {
      assert.doesNotMatch(page, stale, `${path} still says ${stale}`)
    }
  }
})

test("the pass is described the same way everywhere", async () => {
  for (const path of ["app/parents/page.tsx", "app/support/page.tsx", "app/terms/page.tsx"]) {
    const page = await source(path)
    assert.match(page, /\$149\.99/, `${path}: the one price`)
    assert.match(page, /90 days/, `${path}: the 90-day minimum`)
    assert.match(page, /\b3 coach emails\b/, `${path}: the free trial`)
  }
  const terms = await source("app/terms/page.tsx")
  for (const fragment of [
    "one-time purchase of $149.99. It never renews",
    "through August 31 of the athlete's high school graduation year",
    "or for 90 days from purchase if that ends later",
    "within 14 days of the payment and we will refund it in full",
    "Apple handles refunds for App Store purchases",
    "A full refund ends the pass.",
    "before a parent's website payment goes through, we refund that payment in full automatically and no pass is added",
    "A commitment logged after the pass is on the account does not end the pass or lead to a refund.",
  ]) {
    assert.ok(terms.includes(fragment), `terms missing: ${fragment}`)
  }
  const support = await source("app/support/page.tsx")
  assert.match(support, /within 14 days for a full refund/)
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
  for (const path of pages) {
    assert.doesNotMatch(await source(path), /\b(?:she|her|hers|he|him|his)\b/i, `${path}: use "the athlete" or "they"`)
  }
})
