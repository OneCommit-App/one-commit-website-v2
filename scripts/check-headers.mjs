import assert from "node:assert/strict"

// Local production server only: never use this check to probe a production host.
const base = new URL(process.argv[2] || "http://127.0.0.1:3104")
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Use a loopback next start server")
const expected = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "x-frame-options": "DENY",
}
for (const path of ["/", "/download", "/waitlist", "/privacy", "/terms"]) {
  const response = await fetch(new URL(path, base), { redirect: "manual" })
  assert.ok(response.status >= 200 && response.status < 400, `${path}: HTTP ${response.status}`)
  for (const [name, value] of Object.entries(expected)) {
    assert.equal(response.headers.get(name), value, `${path}: ${name}`)
  }
  const enforced = response.headers.get("content-security-policy") || ""
  assert.ok(enforced.includes("frame-ancestors 'none'"), `${path}: enforced anti-framing`)
  const reportOnly = response.headers.get("content-security-policy-report-only") || ""
  for (const directive of ["default-src 'self'", "script-src 'self'", "style-src 'self'", "connect-src 'self'", "frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
    assert.ok(reportOnly.includes(directive), `${path}: report-only ${directive}`)
  }
  for (const source of ["https://*.supabase.co", "https://va.vercel-scripts.com", "https://vitals.vercel-insights.com"]) {
    assert.ok(reportOnly.includes(source), `${path}: report-only ${source}`)
  }
  console.log(`PASS ${path} HTTP ${response.status}: HSTS, nosniff, referrer, permissions, framing, report-only CSP`)
}
console.log("Local header check passed. This is not a securityheaders.com grade or a deployment check.")
