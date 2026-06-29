#!/usr/bin/env node

import dns from "node:dns/promises"
import fs from "node:fs"

const args = new Set(process.argv.slice(2))
const getArgValue = (name, fallback = null) => {
  const prefix = `${name}=`
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}

const envFile = getArgValue("--env-file")
const shouldInsert = args.has("--insert")
const timeoutMs = Number(getArgValue("--timeout-ms", "15000"))
const explicitEmail = getArgValue("--email")
const requiredKeys = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

function parseEnvFile(path) {
  const values = {}
  const text = fs.readFileSync(path, "utf8")

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue

    const equalsIndex = line.indexOf("=")
    if (equalsIndex === -1) continue

    const key = line.slice(0, equalsIndex).trim()
    let value = line.slice(equalsIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    values[key] = value
  }

  return values
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=")
  return Buffer.from(padded, "base64").toString("utf8")
}

function readJwtPayload(token) {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  try {
    return JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }
}

function fail(message, details = {}) {
  const error = new Error(message)
  error.details = details
  throw error
}

function assertRequired(envValues) {
  for (const key of requiredKeys) {
    if (!envValues[key]?.trim()) {
      fail("Missing required website environment variable", { key })
    }
  }
}

function readSupabaseConfig() {
  const envValues = {
    ...process.env,
    ...(envFile ? parseEnvFile(envFile) : {}),
  }

  assertRequired(envValues)

  const supabaseUrl = envValues.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/+$/, "")
  const key = envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()

  let url
  try {
    url = new URL(supabaseUrl)
  } catch {
    fail("NEXT_PUBLIC_SUPABASE_URL is not a valid URL", { value: supabaseUrl })
  }

  if (url.protocol !== "https:") {
    fail("NEXT_PUBLIC_SUPABASE_URL must use https", { value: supabaseUrl })
  }

  if (!url.hostname.endsWith(".supabase.co")) {
    fail("NEXT_PUBLIC_SUPABASE_URL must point at a Supabase project host", {
      hostname: url.hostname,
    })
  }

  if (url.hostname.includes("your-project-ref")) {
    fail("NEXT_PUBLIC_SUPABASE_URL still contains the placeholder project ref", {
      hostname: url.hostname,
    })
  }

  if (key === "your-supabase-anon-key") {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY still contains the placeholder key")
  }

  if (key.startsWith("sb_secret_")) {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY contains a secret key; use the public anon/publishable key")
  }

  let keyKind = "publishable"
  if (!key.startsWith("sb_publishable_")) {
    const payload = readJwtPayload(key)
    if (!payload) {
      fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is not a recognized Supabase public key format")
    }

    if (payload.role !== "anon") {
      fail("NEXT_PUBLIC_SUPABASE_ANON_KEY must be an anon key", {
        role: payload.role || null,
      })
    }

    keyKind = "anon jwt"
  }

  return { supabaseUrl, hostname: url.hostname, key, keyKind }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (error.name === "AbortError") {
      fail("Supabase request timed out", { url, timeoutMs })
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

async function checkDns(hostname) {
  try {
    const records = await dns.lookup(hostname, { all: true })
    if (records.length === 0) {
      fail("Supabase project host did not resolve", { hostname })
    }
    console.log(`ok supabase dns: ${hostname}, ${records.length} record(s)`)
  } catch (error) {
    fail("Supabase project host did not resolve", {
      hostname,
      code: error.code,
      message: error.message,
    })
  }
}

async function checkRestGateway(config) {
  const response = await fetchWithTimeout(`${config.supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      accept: "application/openapi+json, application/json",
    },
  })
  const text = await response.text()

  if (!response.ok) {
    fail("Supabase REST gateway check failed", {
      status: response.status,
      body: text.slice(0, 500),
    })
  }

  console.log(`ok supabase rest gateway: ${response.status}, ${config.keyKind} key`)
}

async function checkWaitlistInsert(config) {
  if (!shouldInsert) {
    console.log("skip waitlist insert check: pass --insert after production test-row policy is approved")
    return
  }

  const email =
    explicitEmail ||
    `codex-direct-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}@example.com`
  const payload = {
    first_name: "Codex",
    last_name: "DirectCheck",
    email,
    sport: "Track & Field",
    grad_year: "2027",
    phone: null,
  }

  const insert = async () => {
    const response = await fetchWithTimeout(`${config.supabaseUrl}/rest/v1/waitlist`, {
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
    fail("Waitlist direct insert failed", {
      status: first.response.status,
      body: first.text.slice(0, 1000),
    })
  }
  console.log(`ok waitlist direct insert: ${email}`)

  const duplicate = await insert()
  const duplicateBody = duplicate.text.toLowerCase()
  if (duplicate.response.ok || !(duplicateBody.includes("duplicate") || duplicateBody.includes("unique"))) {
    fail("Waitlist duplicate direct check did not reject as expected", {
      status: duplicate.response.status,
      body: duplicate.text.slice(0, 1000),
    })
  }
  console.log(`ok waitlist duplicate rejection: ${duplicate.response.status}`)
}

try {
  const config = readSupabaseConfig()
  await checkDns(config.hostname)
  await checkRestGateway(config)
  await checkWaitlistInsert(config)
} catch (error) {
  console.error(`waitlist supabase check failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
}
