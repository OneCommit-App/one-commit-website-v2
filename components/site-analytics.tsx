"use client"

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react"
import { redactAnalyticsUrl } from "@/lib/parent-pay"

/**
 * Vercel Web Analytics for every page, with one rule: a parent pay link
 * (/p/<code>, and its ?paid=1 return from Stripe) is reported as /p/[code],
 * so the private code never reaches an analytics event.
 */
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = redactAnalyticsUrl(event.url)
  return url === null ? null : { ...event, url }
}

export default function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />
}
