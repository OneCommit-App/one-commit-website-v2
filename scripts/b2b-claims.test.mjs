import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("B2B audience data stays limited to the truthful athlete-owned pilot", async () => {
  const data = await source("lib/b2b-audiences.ts")

  for (const fragment of [
    'export type AudienceKey = "coaches" | "schools" | "athletic-programs"',
    'pilotHref("OneCommit coach pilot"',
    'pilotHref("OneCommit school pilot"',
    'pilotHref("OneCommit athletic program pilot"',
    "Athlete-owned accounts and profile review",
    "D3-focused OneScore",
    "supported connected inbox",
    "No coach or administrator dashboard",
    "No school administrator dashboard",
    "No program dashboard or staff accounts",
    "No roster monitoring or team reporting",
    "No roster import, surveillance, or reporting",
    "No roster management or team analytics",
  ]) {
    assert.ok(data.includes(fragment), `missing B2B truth boundary: ${fragment}`)
  }

  for (const fragment of [
    "Gmail",
    "free forever",
    "FERPA-compliant",
    "COPPA-compliant",
    "guaranteed placement",
    "customer logo",
    "<form",
  ]) {
    assert.ok(!data.includes(fragment), `B2B data contains unsupported claim: ${fragment}`)
  }
  assert.doesNotMatch(data, /\$\s*\d/, "B2B data must not invent pilot pricing")
})

test("shared audience page exposes real athlete screens and accessible interaction contracts", async () => {
  const [page, nav, boundaries] = await Promise.all([
    source("components/b2b/audience-page.tsx"),
    source("components/b2b/audience-nav.tsx"),
    source("components/b2b/pilot-boundaries.tsx"),
  ])
  const combined = `${page}\n${nav}\n${boundaries}`

  for (const fragment of [
    'src="/app-explore.png"',
    'src="/app-track-replies.png"',
    'id="main-content"',
    'href="#main-content"',
    'aria-label="Audience pages"',
    'aria-current={isCurrent ? "page" : undefined}',
    "min-h-11",
    "focus-visible:ring-2",
    "min-[260px]:inline",
    "min-[240px]:pt-52",
    "Capacity-dependent beta",
    "A conversation is not an invitation",
  ]) {
    assert.ok(combined.includes(fragment), `missing shared audience contract: ${fragment}`)
  }

  assert.equal((page.match(/<h1\b/g) || []).length, 1)
  assert.ok(!combined.includes("<form"), "audience pages must not imply an unsupported lead form")
})

test("all three server-rendered audience routes use shared metadata and page content", async () => {
  const routes = {
    coaches: await source("app/coaches/page.tsx"),
    schools: await source("app/schools/page.tsx"),
    "athletic-programs": await source("app/athletic-programs/page.tsx"),
  }

  for (const [key, route] of Object.entries(routes)) {
    assert.ok(route.includes(`audienceMetadata("${key}")`), `${key} metadata is not wired`)
    assert.ok(route.includes(`<AudiencePage audience="${key}" />`), `${key} shared page is not wired`)
  }
})

test("homepage, footer, sitemap, and smoke gate make every audience route discoverable", async () => {
  const [home, chooser, footer, sitemap, smoke] = await Promise.all([
    source("app/page.tsx"),
    source("components/b2b/audience-chooser.tsx"),
    source("components/footer-section.tsx"),
    source("app/sitemap.ts"),
    source("scripts/smoke-production.mjs"),
  ])

  assert.ok(home.includes("<AudienceChooser />"))
  assert.ok(home.includes("Supported connected inbox"))
  assert.ok(!home.includes("Gmail and Outlook messages from you"))

  for (const path of ["/coaches", "/schools", "/athletic-programs"]) {
    assert.ok(chooser.includes(`href: "${path}"`), `${path} missing from homepage chooser`)
    assert.ok(footer.includes(`href="${path}"`), `${path} missing from footer`)
    assert.ok(sitemap.includes(`https://www.onecommit.us${path}`), `${path} missing from sitemap`)
    assert.ok(smoke.includes(`path: "${path}"`), `${path} missing from route smoke`)
  }

  for (const fragment of [
    "no coach or administrator dashboard",
    "pilot_interest_click",
    "checkAudiencePageSemantics",
  ]) {
    assert.ok(`${chooser}\n${smoke}`.includes(fragment), `missing discoverability gate: ${fragment}`)
  }
})
