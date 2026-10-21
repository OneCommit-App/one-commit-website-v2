/** @type {import('next').NextConfig} */
const securityHeaders = [
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

// The parent pay link (onecommit.us/p/<code>, app/p/[code]) is a private
// address: never indexed, and never handed on as a referrer to Stripe, the
// API or the next page. Listed after the site-wide entry so its
// Referrer-Policy wins (Next applies the last matching value for a key).
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

const legacyMarketingHosts = ["onecommit\\.org\\.?", "www\\.onecommit\\.org\\.?"]

const nextConfig = {
  async redirects() {
    return legacyMarketingHosts.map((host) => ({
      source: "/:path*",
      has: [
        {
          type: "host",
          value: host,
        },
      ],
      destination: "https://www.onecommit.us/:path*",
      permanent: true,
    }))
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/p/:path*",
        headers: parentPayHeaders,
      },
    ]
  },
}

export default nextConfig
