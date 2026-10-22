import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const source = (rel) => readFile(path.join(root, rel), "utf8")

const indexablePages = [
  ["app/about/page.tsx", "/about"],
  ["app/download/page.tsx", "/download"],
  ["app/parents/page.tsx", "/parents"],
  ["app/privacy/page.tsx", "/privacy"],
  ["app/support/page.tsx", "/support"],
  ["app/terms/page.tsx", "/terms"],
  ["app/coaches/page.tsx", "/coaches"],
  ["app/schools/page.tsx", "/schools"],
  ["app/athletic-programs/page.tsx", "/athletic-programs"],
]

async function walk(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const rel = `${directory}/${entry.name}`
      return entry.isDirectory() ? walk(rel) : [rel]
    }),
  )
  return nested.flat()
}

test("indexable routes publish titles, descriptions, Open Graph, Twitter, and sitemap URLs", async () => {
  const [sitemap, robots, layout, seo] = await Promise.all([
    source("app/sitemap.ts"),
    source("app/robots.ts"),
    source("app/layout.tsx"),
    source("lib/page-metadata.ts"),
  ])

  assert.match(robots, /sitemapUrl/)
  assert.match(robots, /allow:\s*"\/"/)
  assert.match(layout, /robots:\s*\{[\s\S]*index:\s*true/)
  assert.match(layout, /sharedOgImage/)
  assert.match(seo, /summary_large_image/)
  assert.match(seo, /Find the schools that fit/)
  assert.match(sitemap, /https:\/\/www\.onecommit\.us",/)

  for (const [file, route] of indexablePages) {
    const page = await source(file)
    assert.match(page, /pageMetadata\(|audienceMetadata\(/, `${file} is missing page metadata`)
    assert.ok(sitemap.includes(`https://www.onecommit.us${route}`), `${route} is missing from the sitemap`)
  }

  assert.ok(!sitemap.includes("/waitlist"), "sitemap must not advertise the legacy waitlist URL")
})

test("not-found has its own title and stays out of the index", async () => {
  const [page, sitemap] = await Promise.all([source("app/not-found.tsx"), source("app/sitemap.ts")])
  assert.match(page, /title:\s*"Page not found"/)
  assert.match(page, /index:\s*false/)
  assert.ok(!sitemap.includes("/404"), "sitemap must not advertise a 404 URL")
})

test("public text does not use the sub-AA ink-faint utility", async () => {
  const files = (await Promise.all(["app", "components"].map(walk))).flat()
  const tsx = files.filter((file) => file.endsWith(".tsx"))
  for (const file of tsx) {
    const text = await source(file)
    assert.ok(!text.includes("text-ink-faint"), `${file} uses text-ink-faint`)
  }

  const css = await source("app/globals.css")
  assert.ok(!css.includes("rgba(11, 31, 24, 0.4)"), "light ink-faint is still below 4.5:1")
  assert.ok(!css.includes("rgba(233, 242, 236, 0.45)"), "dark ink-faint is still below 4.5:1")
})

test("screen alt text describes the capture, and headings precede the figures they name", async () => {
  const [download, cta, audience, daily, features, how] = await Promise.all([
    source("app/download/page.tsx"),
    source("components/cta-section.tsx"),
    source("components/b2b/audience-page.tsx"),
    source("components/home/daily-loop.tsx"),
    source("components/home/feature-band.tsx"),
    source("components/home/how-it-works.tsx"),
  ])

  const welcomeAlt =
    "OneCommit welcome screen: Stop waiting for coaches to find you. Riley drafts the outreach, and nothing sends until you review and approve it."
  assert.ok(download.includes(welcomeAlt), "download welcome alt does not describe the screen")
  assert.ok(cta.includes(welcomeAlt), "CTA welcome alt does not describe the screen")
  assert.ok(
    audience.includes(
      "a prompt to connect an inbox so messages send from the athlete's own address, above six saved D3 schools",
    ),
    "pipeline alt still places the inbox prompt below the schools",
  )
  assert.ok(audience.includes("plus a Riley's Desk card"), "home-screen alt omits Riley's Desk")

  const dailyHeading = daily.indexOf('id="daily-loop-heading"')
  const dailyImage = daily.indexOf('src="/app/brief-today.png"')
  assert.ok(dailyHeading >= 0 && dailyImage > dailyHeading, "daily loop heading must precede its figure in the DOM")

  const featureBody = features.slice(features.indexOf("export default function FeatureBand"))
  assert.ok(
    featureBody.indexOf("<h2") >= 0 && featureBody.indexOf("<h2") < featureBody.indexOf("<FeatureCard"),
    "feature band heading must precede its h3 cards",
  )

  const howBody = how.slice(how.indexOf("export default function HowItWorks"))
  const howH2 = howBody.indexOf("<h2")
  const howH3 = howBody.indexOf("<h3")
  assert.ok(howH2 >= 0 && howH3 > howH2, "how-it-works must not open a step heading before its section heading")
})
