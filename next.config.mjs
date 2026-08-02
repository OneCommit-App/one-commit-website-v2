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
    ]
  },
}

export default nextConfig
