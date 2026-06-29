#!/usr/bin/env node

import dns from "node:dns/promises"

const args = new Set(process.argv.slice(2))
const getArgValue = (name, fallback) => {
  const prefix = `${name}=`
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}

const baseUrl = getArgValue("--base", process.env.WEBSITE_SMOKE_BASE_URL || "https://www.onecommit.us")
const apexUrl = getArgValue("--apex", process.env.WEBSITE_SMOKE_APEX_URL || "https://onecommit.us")
const shouldInsert = args.has("--insert") || process.env.WAITLIST_SMOKE_INSERT === "1"

const routeChecks = [
  { path: "/", typeIncludes: "text/html" },
  { path: "/demo", typeIncludes: "text/html" },
  { path: "/waitlist", typeIncludes: "text/html" },
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

const canonicalPaths = ["/", "/demo", "/waitlist", "/support", "/privacy", "/terms"]

const fail = (message, details = {}) => {
  const error = new Error(message)
  error.details = details
  throw error
}

const asUrl = (path, base) => new URL(path, base).href

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
    const url = asUrl(check.path, baseUrl)
    const started = Date.now()
    const response = await fetch(url, { redirect: "follow" })
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

async function checkCanonicalArtifacts() {
  const expectedOrigin = new URL(baseUrl).origin
  const apexOrigin = new URL(apexUrl).origin
  const expectedSitemap = `${expectedOrigin}/sitemap.xml`
  const { text: robots } = await fetchText(asUrl("/robots.txt", baseUrl), { redirect: "follow" })
  const { text: sitemap } = await fetchText(asUrl("/sitemap.xml", baseUrl), { redirect: "follow" })

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
  }

  if (apexOrigin !== expectedOrigin && sitemap.includes(`<loc>${apexOrigin}`)) {
    fail("Sitemap still advertises apex canonical URLs", {
      apexOrigin,
      expectedOrigin,
    })
  }

  console.log(`ok canonical artifacts: robots and sitemap advertise ${expectedOrigin}`)
}

async function getWaitlistHtml() {
  const { response, text } = await fetchText(asUrl("/waitlist", baseUrl), { redirect: "follow" })
  if (response.status !== 200) {
    fail("Waitlist page returned non-200", { status: response.status, url: response.url })
  }
  return text
}

async function getScriptUrls(html) {
  return [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => asUrl(match[1], baseUrl))
}

async function findSupabaseConfig(scriptUrls) {
  const urlPattern = /https:\/\/[a-z0-9]+\.supabase\.co/g
  const publishablePattern = /sb_publishable_[A-Za-z0-9_-]+/g
  const jwtPattern = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g
  const config = {
    supabaseUrl: null,
    key: null,
    keyKind: null,
    urlScriptUrl: null,
    keyScriptUrl: null,
  }

  for (const scriptUrl of scriptUrls) {
    const { response, text } = await fetchText(scriptUrl)
    if (response.status !== 200) {
      fail("Client chunk returned non-200", { scriptUrl, status: response.status })
    }

    const supabaseUrls = [...text.matchAll(urlPattern)].map((match) => match[0])
    const publishableKeys = [...text.matchAll(publishablePattern)].map((match) => match[0])
    const jwtKeys = [...text.matchAll(jwtPattern)].map((match) => match[0])
    const keys = [...publishableKeys, ...jwtKeys]

    if (!config.supabaseUrl && supabaseUrls.length > 0) {
      config.supabaseUrl = supabaseUrls[0]
      config.urlScriptUrl = scriptUrl
    }

    if (!config.key && keys.length > 0) {
      config.key = keys[0]
      config.keyKind = publishableKeys.length > 0 ? "publishable" : "jwt"
      config.keyScriptUrl = scriptUrl
    }

    if (config.supabaseUrl && config.key) {
      return config
    }
  }

  return config.supabaseUrl || config.key ? config : null
}

async function checkSupabaseConfig() {
  const html = await getWaitlistHtml()
  const scriptUrls = await getScriptUrls(html)
  const config = await findSupabaseConfig(scriptUrls)

  if (!config?.supabaseUrl) {
    fail("No Supabase project URL found in the production waitlist bundle")
  }

  if (!config?.key) {
    fail("No Supabase public key found in the production waitlist bundle", {
      supabaseUrl: config.supabaseUrl,
      urlScriptUrl: config.urlScriptUrl,
    })
  }

  const hostname = new URL(config.supabaseUrl).hostname
  let records
  try {
    records = await dns.lookup(hostname, { all: true })
  } catch (error) {
    fail("Supabase project host did not resolve", {
      hostname,
      code: error.code,
      message: error.message,
    })
  }

  if (records.length === 0) {
    fail("Supabase project host did not resolve", { hostname })
  }

  console.log(`ok supabase config: ${hostname}, ${config.keyKind} key present, ${records.length} DNS record(s)`)
  return config
}

async function checkWaitlistInsert(config) {
  if (!shouldInsert) {
    console.log("skip waitlist insert smoke: pass --insert or WAITLIST_SMOKE_INSERT=1 after confirming test-row policy")
    return
  }

  const email = `codex-smoke-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}@example.com`
  const payload = {
    first_name: "Codex",
    last_name: "SmokeTest",
    email,
    sport: "Track & Field",
    grad_year: "2027",
    phone: null,
  }

  const insert = async () => {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    })
    return { response, text: await response.text() }
  }

  const first = await insert()
  if (![200, 201, 204].includes(first.response.status)) {
    fail("Waitlist smoke insert failed", { status: first.response.status, body: first.text })
  }
  console.log(`ok waitlist insert: ${email}`)

  const duplicate = await insert()
  const duplicateBody = duplicate.text.toLowerCase()
  if (duplicate.response.ok || !(duplicateBody.includes("duplicate") || duplicateBody.includes("unique"))) {
    fail("Waitlist duplicate smoke did not reject as expected", {
      status: duplicate.response.status,
      body: duplicate.text,
    })
  }
  console.log(`ok waitlist duplicate rejection: ${duplicate.response.status}`)
}

async function main() {
  console.log(`smoke base: ${baseUrl}`)
  await checkApexRedirect()
  await checkRoutes()
  await checkCanonicalArtifacts()
  const supabaseConfig = await checkSupabaseConfig()
  await checkWaitlistInsert(supabaseConfig)
}

main().catch((error) => {
  console.error(`release smoke failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
})
