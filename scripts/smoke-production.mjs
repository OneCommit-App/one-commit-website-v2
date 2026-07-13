#!/usr/bin/env node

import dns from "node:dns/promises"
import { readFile } from "node:fs/promises"
import {
  assertValidDownloadUrl,
  isAllowedDownloadHost,
} from "./download-url-rules.mjs"

const args = new Set(process.argv.slice(2))
const getArgValue = (name, fallback) => {
  const prefix = `${name}=`
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}

const baseUrl = getArgValue("--base", process.env.WEBSITE_SMOKE_BASE_URL || "https://www.onecommit.us")
const apexUrl = getArgValue("--apex", process.env.WEBSITE_SMOKE_APEX_URL || "https://onecommit.us")
const canonicalOrigin = getArgValue(
  "--canonical-origin",
  process.env.WEBSITE_SMOKE_CANONICAL_ORIGIN || new URL(baseUrl).origin
).replace(/\/+$/, "")
const skipApex = args.has("--skip-apex") || process.env.WEBSITE_SMOKE_SKIP_APEX === "1"
const skipDownload = args.has("--skip-download") || process.env.WEBSITE_SMOKE_SKIP_DOWNLOAD === "1"
const downloadRunbook = "docs/download-production-runbook.md"
const campaignDraftPath = new URL("../docs/coach-team-campaign.md", import.meta.url)
const campaignAttributionPath = new URL("../components/coach-campaign-attribution.tsx", import.meta.url)

const routeChecks = [
  { path: "/", typeIncludes: "text/html" },
  { path: "/demo", typeIncludes: "text/html" },
  { path: "/download", typeIncludes: "text/html" },
  { path: "/coaches", typeIncludes: "text/html" },
  { path: "/support", typeIncludes: "text/html" },
  { path: "/privacy", typeIncludes: "text/html" },
  { path: "/terms", typeIncludes: "text/html" },
  { path: "/robots.txt", typeIncludes: "text/plain" },
  { path: "/sitemap.xml", typeIncludes: "application/xml" },
  { path: "/opengraph-image", typeIncludes: "image/png" },
  { path: "/demo.mp4", typeIncludes: "video/mp4" },
  { path: "/demo-poster.png", typeIncludes: "image/png" },
  { path: "/logo.png", typeIncludes: "image/png" },
]

const canonicalPaths = ["/", "/demo", "/download", "/coaches", "/support", "/privacy", "/terms"]
const publicPages = ["/", "/demo", "/download", "/coaches", "/support", "/privacy", "/terms"]

const fail = (message, details = {}) => {
  const error = new Error(message)
  error.details = details
  throw error
}

const asUrl = (path, base = baseUrl) => new URL(path, base).href

async function fetchText(url, options = {}) {
  const response = await fetch(url, options)
  const text = await response.text()
  return { response, text }
}

async function checkApexRedirect() {
  const response = await fetch(apexUrl, { redirect: "manual" })
  const location = response.headers.get("location")
  const expected = new URL(baseUrl)

  if (![301, 302, 307, 308].includes(response.status)) {
    fail("Apex domain did not redirect", { status: response.status, location })
  }

  if (!location || new URL(location).host !== expected.host) {
    fail("Apex domain redirects to the wrong host", { status: response.status, location })
  }

  console.log(`ok apex redirect: ${apexUrl} -> ${location}`)
}

async function checkRoutes() {
  for (const check of routeChecks) {
    const url = asUrl(check.path)
    const started = Date.now()
    const response = await fetch(url, { redirect: "manual" })
    const bytes = Buffer.byteLength(await response.arrayBuffer())
    const contentType = response.headers.get("content-type") || ""

    if (response.status !== 200) {
      fail("Route returned non-200", { path: check.path, status: response.status, url: response.url })
    }

    if (!contentType.includes(check.typeIncludes)) {
      fail("Route returned unexpected content type", {
        path: check.path,
        contentType,
        expected: check.typeIncludes,
      })
    }

    if (bytes === 0) {
      fail("Route returned an empty body", { path: check.path })
    }

    console.log(`ok route ${check.path}: ${response.status}, ${contentType}, ${bytes} bytes, ${Date.now() - started}ms`)
  }
}

function htmlAttribute(tag, name) {
  const match = tag.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  )
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? ""
}

function extractPageMetadata(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || ""
  const canonicalTag = (head.match(/<link\b[^>]*>/gi) || []).find((tag) => (
    htmlAttribute(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")
  ))
  const descriptionTag = (head.match(/<meta\b[^>]*>/gi) || []).find((tag) => (
    htmlAttribute(tag, "name").toLowerCase() === "description"
  ))

  return {
    canonical: canonicalTag ? htmlAttribute(canonicalTag, "href") : "",
    description: descriptionTag ? htmlAttribute(descriptionTag, "content") : "",
    title: head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "",
  }
}

async function checkLegacyWaitlistRedirect() {
  const response = await fetch(asUrl("/waitlist"), { redirect: "manual" })
  const location = response.headers.get("location")

  if (![301, 302, 307, 308].includes(response.status)) {
    fail("Legacy waitlist route did not redirect", {
      status: response.status,
      location,
      runbook: downloadRunbook,
    })
  }

  if (!location || new URL(location, baseUrl).pathname !== "/download") {
    fail("Legacy waitlist route does not point at /download", {
      status: response.status,
      location,
      runbook: downloadRunbook,
    })
  }

  console.log(`ok legacy redirect: /waitlist -> ${location}`)
}

async function checkCanonicalArtifacts() {
  const expectedOrigin = canonicalOrigin
  const apexOrigin = new URL(apexUrl).origin
  const expectedSitemap = `${expectedOrigin}/sitemap.xml`
  const { text: robots } = await fetchText(asUrl("/robots.txt"), { redirect: "follow" })
  const { text: sitemap } = await fetchText(asUrl("/sitemap.xml"), { redirect: "follow" })

  if (!robots.includes(`Sitemap: ${expectedSitemap}`)) {
    fail("Robots sitemap points at the wrong canonical host", {
      expected: expectedSitemap,
    })
  }

  for (const path of canonicalPaths) {
    const expectedUrl = path === "/" ? expectedOrigin : `${expectedOrigin}${path}`
    if (!sitemap.includes(`<loc>${expectedUrl}</loc>`)) {
      fail("Sitemap is missing canonical URL", { expectedUrl })
    }

    const { response, text } = await fetchText(asUrl(path), { redirect: "manual" })
    if (response.status !== 200) {
      fail("Canonical page did not return a direct 200", {
        path,
        status: response.status,
        location: response.headers.get("location"),
      })
    }

    const metadata = extractPageMetadata(text)
    if (metadata.canonical !== expectedUrl) {
      fail("Page canonical tag points at the wrong URL", {
        path,
        actual: metadata.canonical,
        expected: expectedUrl,
      })
    }
    if (!metadata.title || !metadata.description) {
      fail("Page is missing required title or description metadata", {
        path,
        hasTitle: Boolean(metadata.title),
        hasDescription: Boolean(metadata.description),
      })
    }
    if (path === "/demo" && !metadata.description.toLowerCase().includes("d3-focused")) {
      fail("Demo metadata does not disclose D3-focused matching", {
        description: metadata.description,
      })
    }
  }

  if (sitemap.includes("<loc>https://www.onecommit.us/waitlist</loc>")) {
    fail("Sitemap still advertises the legacy waitlist URL", {
      runbook: downloadRunbook,
    })
  }

  if (apexOrigin !== expectedOrigin && sitemap.includes(`<loc>${apexOrigin}`)) {
    fail("Sitemap still advertises apex canonical URLs", {
      apexOrigin,
      expectedOrigin,
    })
  }

  console.log(`ok canonical artifacts: robots and sitemap advertise ${expectedOrigin}`)
}

function extractHrefValues(html) {
  return [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1])
}

function normalizeHref(href) {
  try {
    return new URL(href, baseUrl)
  } catch {
    return null
  }
}

function validateExternalDownloadUrl(url) {
  if (!url || url.protocol !== "https:") return false

  const marketingHosts = new Set(["www.onecommit.us", "onecommit.us"])
  if (marketingHosts.has(url.hostname)) return false

  if (!isAllowedDownloadHost(url.hostname)) {
    return false
  }

  try {
    return assertValidDownloadUrl({ key: "download CTA href", value: url.href })
  } catch (error) {
    error.details = {
      ...(error.details || {}),
      runbook: downloadRunbook,
    }
    throw error
  }
}

async function checkDownloadLinks() {
  const discovered = new Map()

  for (const path of ["/", "/demo", "/download", "/coaches"]) {
    const { response, text } = await fetchText(asUrl(path), { redirect: "follow" })
    if (response.status !== 200) {
      fail("Download CTA page returned non-200", { path, status: response.status })
    }

    for (const href of extractHrefValues(text)) {
      const url = normalizeHref(href)
      const downloadUrl = validateExternalDownloadUrl(url)
      if (!downloadUrl) continue
      discovered.set(downloadUrl.href, { path, hostname: downloadUrl.hostname })
    }
  }

  if (discovered.size === 0) {
    fail("No external app download URL found on production pages", {
      checkedPages: ["/", "/demo", "/download", "/coaches"],
      runbook: downloadRunbook,
    })
  }

  for (const [href, details] of discovered) {
    try {
      await dns.lookup(details.hostname)
    } catch (error) {
      fail("App download host did not resolve", {
        url: href,
        hostname: details.hostname,
        page: details.path,
        code: error.code,
        message: error.message,
        runbook: downloadRunbook,
      })
    }
  }

  console.log(`ok download links: ${[...discovered.keys()].join(", ")}`)
}

async function checkNoPublicWaitlistCopy() {
  const blockedFragments = [
    "join beta waitlist",
    "join the beta waitlist",
    "waitlist_submit",
    "supabase.co",
    "400+ d3 programs",
    "monthly 1-on-1 advisor call",
    "monthly pro call",
    "unlimited coach outreach",
    "follow up at the right time",
  ]

  for (const path of publicPages) {
    const { text } = await fetchText(asUrl(path), { redirect: "follow" })
    const lower = text.toLowerCase()

    for (const fragment of blockedFragments) {
      if (lower.includes(fragment)) {
        fail("Public page still contains waitlist-era copy or config", {
          path,
          fragment,
          runbook: downloadRunbook,
        })
      }
    }
  }

  console.log("ok public copy: no waitlist, stale advisor, timing, or unverified coverage claims")
}

async function checkHonestMarketingClaims() {
  const checks = [
    {
      path: "/",
      required: [
        "onescore",
        "riley-guided voice onboarding",
        "d3-focused",
        "coach_page_click",
        "free beta invitations",
      ],
      forbidden: ["typed onboarding", "typed setup", "manual entry", "enter them yourself"],
    },
    {
      path: "/demo",
      required: ['aria-label="back to home"'],
    },
    {
      path: "/coaches",
      required: [
        "d3-focused onescore",
        "athlete-owned accounts",
        "mailto:admin@onecommit.us",
        "coach_interest_click",
        'data-campaign-attribution="coach_outreach_email"',
        "parent or guardian before creating an account",
        "a coach invitation does not replace that permission",
        'aria-label="back to athlete site"',
      ],
      forbidden: [
        "what coaches can use today",
        "we will send access instructions",
        "start a team beta",
        "typed setup",
      ],
    },
  ]

  for (const check of checks) {
    const { response, text } = await fetchText(asUrl(check.path), { redirect: "follow" })
    if (response.status !== 200) {
      fail("Marketing claim page returned non-200", { path: check.path, status: response.status })
    }

    const lower = text.toLowerCase()
    for (const fragment of check.required) {
      if (!lower.includes(fragment)) {
        fail("Marketing claim page is missing required honest copy or tracking", {
          path: check.path,
          fragment,
        })
      }
    }

    for (const fragment of check.forbidden || []) {
      if (lower.includes(fragment)) {
        fail("Marketing claim page contains an unearned onboarding or access promise", {
          path: check.path,
          fragment,
        })
      }
    }
  }

  console.log("ok marketing claims: Riley onboarding, invitation-only access, guardian permission, D3 scope, and coach tracking are honest")
}

async function checkCoachCampaignContract() {
  const [campaignDraft, attributionSource] = await Promise.all([
    readFile(campaignDraftPath, "utf8"),
    readFile(campaignAttributionPath, "utf8"),
  ])
  const lowerDraft = campaignDraft.toLowerCase()
  const campaignUrls = campaignDraft.match(/https:\/\/www\.onecommit\.us\/coaches\?\S+/g) || []
  const requiredContent = new Set(["workflow_interview", "team_invitation"])

  if (campaignUrls.length !== 2) {
    fail("Coach campaign must contain exactly one attributable URL in each email draft", {
      count: campaignUrls.length,
    })
  }

  for (const href of campaignUrls) {
    const url = new URL(href)
    const content = url.searchParams.get("utm_content")
    if (
      url.pathname !== "/coaches" ||
      url.searchParams.get("utm_source") !== "coach_outreach" ||
      url.searchParams.get("utm_medium") !== "email" ||
      url.searchParams.get("utm_campaign") !== "coach_beta" ||
      !content ||
      !requiredContent.delete(content)
    ) {
      fail("Coach campaign URL does not match the approved attribution contract", { href })
    }
  }

  if (requiredContent.size > 0) {
    fail("Coach campaign is missing a draft-specific attribution token", {
      missing: [...requiredContent],
    })
  }

  const requiredDraftFragments = [
    "parent or guardian's permission for each athlete age 13-17",
    "a coach invitation cannot replace that permission",
    "supported app-access path",
  ]
  for (const fragment of requiredDraftFragments) {
    if (!lowerDraft.includes(fragment)) {
      fail("Coach campaign is missing an access or guardian safeguard", { fragment })
    }
  }

  const blockedDraftFragments = [
    "riley voice onboarding or typed profile setup",
    "invite 3 coaches to start",
    "we are opening a small free beta",
    "we can start with 5-15 athletes",
    "useful this month",
  ]
  for (const fragment of blockedDraftFragments) {
    if (lowerDraft.includes(fragment)) {
      fail("Coach campaign still contains an unearned onboarding or access promise", { fragment })
    }
  }

  const attributionFragments = [
    'track("coach_page_click"',
    'campaignSource = "coach_outreach"',
    'campaignMedium = "email"',
    'campaignName = "coach_beta"',
    '"workflow_interview", "team_invitation"',
  ]
  for (const fragment of attributionFragments) {
    if (!attributionSource.includes(fragment)) {
      fail("Coach campaign landing attribution is disconnected from the funnel", { fragment })
    }
  }

  console.log("ok coach campaign: two attributed drafts map to the coach-page funnel with guardian and invitation safeguards")
}

async function main() {
  console.log(`smoke base: ${baseUrl}`)
  if (skipApex) {
    console.log("skip apex redirect: --skip-apex")
  } else {
    await checkApexRedirect()
  }
  await checkRoutes()
  await checkLegacyWaitlistRedirect()
  await checkCanonicalArtifacts()
  await checkCoachCampaignContract()
  await checkNoPublicWaitlistCopy()
  await checkHonestMarketingClaims()
  if (skipDownload) {
    const hostname = new URL(baseUrl).hostname
    if (hostname === "onecommit.us" || hostname === "www.onecommit.us") {
      fail("Download-link gate cannot be skipped on the production host", { baseUrl })
    }
    console.log("skip download-link gate: --skip-download on non-production host")
  } else {
    await checkDownloadLinks()
  }
}

main().catch((error) => {
  console.error(`release smoke failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
})
