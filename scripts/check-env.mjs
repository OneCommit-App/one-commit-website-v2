#!/usr/bin/env node

import fs from "node:fs"

const args = process.argv.slice(2)
const envFileArg = args.find((arg) => arg.startsWith("--env-file="))
const envFile = envFileArg ? envFileArg.slice("--env-file=".length) : null

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

const envValues = {
  ...process.env,
  ...(envFile ? parseEnvFile(envFile) : {}),
}

function checkRequired() {
  for (const key of requiredKeys) {
    if (!envValues[key]?.trim()) {
      fail("Missing required website environment variable", { key })
    }
  }
}

function checkSupabaseUrl() {
  const value = envValues.NEXT_PUBLIC_SUPABASE_URL.trim()
  let url

  try {
    url = new URL(value)
  } catch {
    fail("NEXT_PUBLIC_SUPABASE_URL is not a valid URL", { value })
  }

  if (url.protocol !== "https:") {
    fail("NEXT_PUBLIC_SUPABASE_URL must use https", { value })
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

  return url.hostname
}

function checkSupabaseKey() {
  const key = envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()

  if (key === "your-supabase-anon-key") {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY still contains the placeholder key")
  }

  if (key.startsWith("sb_secret_")) {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY contains a secret key; use the public anon/publishable key")
  }

  if (key.startsWith("sb_publishable_")) {
    return "publishable"
  }

  const payload = readJwtPayload(key)
  if (!payload) {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is not a recognized Supabase public key format")
  }

  if (payload.role !== "anon") {
    fail("NEXT_PUBLIC_SUPABASE_ANON_KEY must be an anon key", {
      role: payload.role || null,
    })
  }

  return "anon jwt"
}

try {
  checkRequired()
  const hostname = checkSupabaseUrl()
  const keyKind = checkSupabaseKey()
  console.log(`ok website env: ${hostname}, ${keyKind} key`)
} catch (error) {
  console.error(`website env check failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
}
