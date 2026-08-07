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

function parsePublicAssetOrigin(value) {
  const candidate = value?.trim()
  if (!candidate) return null

  try {
    const url = new URL(candidate)
    const isPublicBlobHost = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.public\.blob\.vercel-storage\.com$/.test(url.hostname)
    const isOriginOnly = !url.username
      && !url.password
      && !url.port
      && url.pathname === "/"
      && !url.search
      && !url.hash

    if (url.protocol !== "https:" || !isPublicBlobHost || !isOriginOnly) return null
    return url.origin
  } catch {
    return null
  }
}

const publicAssetOrigin = parsePublicAssetOrigin(process.env.PUBLIC_ASSET_ORIGIN)

const nextConfig = {
  async redirects() {
    return [
      ...(publicAssetOrigin
        ? [
            {
              source: "/:path*",
              has: [
                {
                  type: "host",
                  value: "assets\\.onecommit\\.us\\.?",
                },
              ],
              destination: `${publicAssetOrigin}/:path*`,
              permanent: false,
            },
          ]
        : []),
      ...legacyMarketingHosts.map((host) => ({
        source: "/:path*",
        has: [
          {
            type: "host",
            value: host,
          },
        ],
        destination: "https://www.onecommit.us/:path*",
        permanent: true,
      })),
    ]
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
