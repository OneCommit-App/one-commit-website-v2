export const downloadKeys = [
  "NEXT_PUBLIC_APP_DOWNLOAD_URL",
  "NEXT_PUBLIC_IOS_DOWNLOAD_URL",
  "NEXT_PUBLIC_ANDROID_DOWNLOAD_URL",
]

export const appStoreIdKey = "NEXT_PUBLIC_APP_STORE_ID"

export const blockedDownloadUrls = [
  {
    id: "id6759487696",
    reason: "This App Store listing is an unrelated habit app using the OneCommit name.",
  },
]

const placeholderPattern =
  /(your[-_\s]?(public[-_\s]?)?(link|code|app|id)|placeholder|example|fake|todo|tbd|real[-_\s]?(public[-_\s]?code|app[-_\s]?id)|public[-_\s]?code|app[-_\s]?id|bundle[-_\s]?id|package[-_\s]?name)/i

function fail(message, details = {}) {
  const error = new Error(message)
  error.details = details
  throw error
}

export function isAllowedDownloadHost(hostname) {
  return (
    hostname === "apps.apple.com" ||
    hostname === "testflight.apple.com" ||
    hostname === "play.google.com" ||
    hostname.endsWith(".app.link") ||
    hostname.endsWith(".onelink.me") ||
    (hostname.endsWith(".onecommit.us") && hostname !== "www.onecommit.us")
  )
}

function assertNoPlaceholder(value, key) {
  if (placeholderPattern.test(value)) {
    fail(`${key} still contains a placeholder`, { value })
  }
}

function assertRealisticAppStoreUrl(url, key) {
  const match = url.pathname.match(/\/id(\d+)$/)
  if (!match) {
    fail(`${key} must point to a concrete App Store app page`, { value: url.href })
  }

  assertValidAppStoreId(match[1], `${key} App Store id`)
}

function assertRealisticTestFlightUrl(url, key) {
  if (!/^\/join\/[A-Za-z0-9]{6,}$/.test(url.pathname)) {
    fail(`${key} must point to a concrete TestFlight public join link`, { value: url.href })
  }
}

function assertRealisticPlayUrl(url, key) {
  const packageName = url.searchParams.get("id") || ""
  if (url.pathname !== "/store/apps/details" || !packageName) {
    fail(`${key} must point to a concrete Google Play app details page`, { value: url.href })
  }

  assertNoPlaceholder(packageName, key)

  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(packageName)) {
    fail(`${key} must contain a valid Google Play package id`, {
      value: url.href,
      packageName,
    })
  }
}

export function assertValidDownloadUrl(entry) {
  let url

  try {
    url = new URL(entry.value)
  } catch {
    fail(`${entry.key} is not a valid URL`, { value: entry.value })
  }

  if (url.protocol !== "https:") {
    fail(`${entry.key} must use https`, { value: entry.value })
  }

  if (url.hostname === "www.onecommit.us" || url.hostname === "onecommit.us") {
    fail(`${entry.key} must point to an app download destination, not the marketing site`, {
      value: entry.value,
    })
  }

  if (!isAllowedDownloadHost(url.hostname)) {
    fail(`${entry.key} must point to an app-store, TestFlight, Play, or owned deep-link host`, {
      value: entry.value,
      hostname: url.hostname,
    })
  }

  assertNoPlaceholder(entry.value, entry.key)

  if (url.hostname === "apps.apple.com") {
    assertRealisticAppStoreUrl(url, entry.key)
  }

  if (url.hostname === "testflight.apple.com") {
    assertRealisticTestFlightUrl(url, entry.key)
  }

  if (url.hostname === "play.google.com") {
    assertRealisticPlayUrl(url, entry.key)
  }

  for (const blocked of blockedDownloadUrls) {
    if (entry.value.includes(blocked.id)) {
      fail(`${entry.key} points to a blocked download URL`, {
        value: entry.value,
        reason: blocked.reason,
      })
    }
  }

  return url
}

export function assertValidAppStoreId(value, key = appStoreIdKey) {
  if (!/^\d+$/.test(value)) {
    fail(`${key} must contain only the numeric Apple app id`, { value })
  }

  if (/^(0+|1+|1234567890?|9876543210?)$/.test(value)) {
    fail(`${key} looks like a placeholder Apple app id`, { value })
  }

  if (value === "6759487696") {
    fail(`${key} points to a blocked App Store listing`, {
      value,
      reason: blockedDownloadUrls[0].reason,
    })
  }

  return value
}
