"use client"

import type React from "react"
import { track } from "@vercel/analytics"

type FunnelEventName = "download_click" | "demo_click" | "support_click"

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: FunnelEventName
  eventSource: string
  eventDestination?: string
}

function getDestination(href: string, fallback?: string) {
  if (fallback) return fallback
  if (href.startsWith("mailto:")) return "email"
  if (href.startsWith("/")) return href

  try {
    return new URL(href).hostname
  } catch {
    return "unknown"
  }
}

export default function TrackedLink({
  eventName,
  eventSource,
  eventDestination,
  href = "",
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return

    try {
      track(eventName, {
        source: eventSource,
        destination: getDestination(href, eventDestination),
      })
    } catch {
      // Analytics must never block navigation.
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      data-funnel-event={eventName}
      data-funnel-source={eventSource}
      {...props}
    >
      {children}
    </a>
  )
}
