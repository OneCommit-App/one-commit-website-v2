import assert from "node:assert/strict"
import test from "node:test"

import nextConfig from "../next.config.mjs"

const expectedHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
]

const parentPayHeaders = [
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
]

test("security headers cover every website route, and the parent pay link is private", async () => {
  assert.equal(typeof nextConfig.headers, "function")
  assert.deepEqual(await nextConfig.headers(), [
    {
      source: "/:path*",
      headers: expectedHeaders,
    },
    // After the site-wide entry: Next applies the last matching value for a key.
    {
      source: "/p/:path*",
      headers: parentPayHeaders,
    },
  ])
})
