#!/usr/bin/env node

import fs from "node:fs"
import {
  appStoreIdKey,
  assertValidAppStoreId,
  assertValidDownloadUrl,
  downloadKeys,
} from "./download-url-rules.mjs"

const args = process.argv.slice(2)
const envFileArg = args.find((arg) => arg.startsWith("--env-file="))
const envFile = envFileArg ? envFileArg.slice("--env-file=".length) : null
const allowsMissingDownloadUrl = Boolean(envFile && /(^|[/\\])\.env\.example$/.test(envFile))

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

function fail(message, details = {}) {
  const error = new Error(message)
  error.details = details
  throw error
}

const envValues = {
  ...process.env,
  ...(envFile ? parseEnvFile(envFile) : {}),
}

function readConfiguredDownloadUrls() {
  return downloadKeys
    .map((key) => ({ key, value: envValues[key]?.trim() || "" }))
    .filter((entry) => entry.value)
}

function checkAppStoreId() {
  const value = envValues[appStoreIdKey]?.trim()
  if (!value) return null

  return assertValidAppStoreId(value)
}

try {
  const configured = readConfiguredDownloadUrls()
  if (configured.length === 0) {
    if (allowsMissingDownloadUrl) {
      checkAppStoreId()
      console.log("ok website env: example file leaves app download URLs empty")
      process.exit(0)
    }

    fail("Missing public app download URL", {
      acceptedKeys: downloadKeys,
    })
  }

  const hosts = configured.map((entry) => assertValidDownloadUrl(entry).hostname)
  const appStoreId = checkAppStoreId()
  const appStoreSuffix = appStoreId ? `, app-store-id ${appStoreId}` : ""
  console.log(`ok website env: ${hosts.join(", ")}${appStoreSuffix}`)
} catch (error) {
  console.error(`website env check failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
}
