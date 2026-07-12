"use client"

import { useEffect } from "react"
import { track } from "@vercel/analytics"

const campaignSource = "coach_outreach"
const campaignMedium = "email"
const campaignName = "coach_beta"
const campaignContent = new Set(["workflow_interview", "team_invitation"])

export default function CoachCampaignAttribution() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const content = params.get("utm_content")

    if (
      params.get("utm_source") !== campaignSource ||
      params.get("utm_medium") !== campaignMedium ||
      params.get("utm_campaign") !== campaignName ||
      !content ||
      !campaignContent.has(content)
    ) {
      return
    }

    try {
      const sessionKey = `onecommit:coach-campaign:${window.location.href}`
      if (window.sessionStorage.getItem(sessionKey)) return

      track("coach_page_click", {
        source: `${campaignSource}_${campaignMedium}_${content}`,
        destination: "/coaches",
      })
      window.sessionStorage.setItem(sessionKey, "1")
    } catch {
      // Analytics must never block the coach page.
    }
  }, [])

  return <span hidden aria-hidden="true" data-campaign-attribution="coach_outreach_email" />
}
