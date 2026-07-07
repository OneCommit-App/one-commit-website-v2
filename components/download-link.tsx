"use client"

import type React from "react"
import { track } from "@vercel/analytics"
import {
  externalLinkProps,
  hasConfiguredDownloadUrl,
  primaryDownloadUrl,
} from "@/lib/download"

type DownloadLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
  fallbackLabel?: React.ReactNode
  analyticsSource?: string
}

function getDestination(href: string, isFallback: boolean) {
  if (isFallback) return "download_fallback"
  if (href.startsWith("/")) return href

  try {
    return new URL(href).hostname
  } catch {
    return "unknown"
  }
}

export default function DownloadLink({
  href = primaryDownloadUrl,
  fallbackLabel = "Get App Access",
  analyticsSource = "download_link",
  children,
  onClick,
  ...props
}: DownloadLinkProps) {
  const isDefaultFallback = !hasConfiguredDownloadUrl && href === primaryDownloadUrl

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return

    try {
      track("download_click", {
        source: analyticsSource,
        destination: getDestination(href, isDefaultFallback),
        configured: hasConfiguredDownloadUrl ? "true" : "false",
      })
    } catch {
      // Analytics must never block app access or fallback navigation.
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      data-funnel-event="download_click"
      data-funnel-source={analyticsSource}
      {...externalLinkProps(href)}
      {...props}
    >
      {isDefaultFallback ? fallbackLabel : children}
    </a>
  )
}
