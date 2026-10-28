import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync, mkdirSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import ts from "typescript"

// Load the actual small TS modules, resolving the site's @/ alias without a
// second test runner or changing production import conventions.
const root = new URL("../", import.meta.url)
const cache = new Map()
function load(relative) {
  if (cache.has(relative)) return cache.get(relative)
  const source = readFileSync(new URL(relative, root), "utf8")
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const exports = {}
  cache.set(relative, exports)
  const require = (id) => id.startsWith("@/") ? load(`${id.slice(2)}.ts`) : createRequire(import.meta.url)(id)
  new Function("exports", "require", compiled)(exports, require)
  return exports
}
const { organization, mobileApplication, faqPage, serializeJsonLd } = load("lib/structured-data.ts")
const { betaOffer } = load("lib/pricing.ts")
const { faqData } = load("components/faq-data.ts")

test("one linked organization and MobileApplication with centralized beta terms", () => {
  assert.equal(organization["@type"], "Organization")
  assert.equal(mobileApplication["@type"], "MobileApplication")
  assert.equal(mobileApplication.publisher["@id"], organization["@id"])
  for (const key of Object.keys(betaOffer)) assert.equal(mobileApplication.offers[key], betaOffer[key])
  assert.equal(mobileApplication.offers.price, "0")
  assert.equal(mobileApplication.offers.priceCurrency, "USD")
  assert.match(mobileApplication.offers.description, /capacity-limited beta/)
  assert.equal("aggregateRating" in mobileApplication, false)
  assert.equal("review" in mobileApplication, false)
  assert.equal("downloadUrl" in mobileApplication, false)
})

test("FAQ exactly matches the existing visible source", () => {
  assert.equal(faqPage.mainEntity.length, faqData.length)
  assert.deepEqual(faqPage.mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })), faqData)
})

test("JSON-LD script serialization cannot close the script element", () => {
  const value = { text: '</script><img src=x onerror="alert(1)">' }
  const encoded = serializeJsonLd(value)
  assert.ok(!encoded.includes("<"))
  assert.deepEqual(JSON.parse(encoded), value)
})

// A pasteable artifact for Google's hosted Code test, not a simulated Google
// result. The full-site build remains separate from this schema contract test.
if (process.argv.includes("--export")) {
  const graph = { "@context": "https://schema.org", "@graph": [organization, mobileApplication, faqPage].map(({ "@context": _, ...value }) => value) }
  mkdirSync(new URL("docs/evidence/", root), { recursive: true })
  writeFileSync(new URL("docs/evidence/structured-data-1028.json", root), JSON.stringify(graph, null, 2) + "\n")
  console.log("Exported exact structured-data graph to docs/evidence/structured-data-1028.json")
}
