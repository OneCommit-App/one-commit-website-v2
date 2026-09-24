import { ImageResponse } from "next/og"
import { ocMarkDataUri } from "@/app/og-mark"
import { hasConfiguredDownloadUrl } from "@/lib/download"

export const runtime = "edge"
export const alt = "OneCommit — Track & Field Recruiting Copilot"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const accessButton = hasConfiguredDownloadUrl ? "Download OneCommit" : "Request Beta Access"

/* The same three proof points the homepage trust strip carries. Nothing here is a
   count, an outcome, or a claim the product cannot back. */
const proofPoints = ["OneScore by school", "Outreach from your own inbox", "Coach reply tracking"]

/* Palette values are the literal --oc-* tokens from app/globals.css. ImageResponse
   renders on the server with no stylesheet, so they cannot be var() references. */
const SHELL_DEEP = "#071a14"
const MINT = "#9cd8b5"
const WHITE = "#ffffff"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: SHELL_DEEP,
          backgroundImage:
            "radial-gradient(60% 55% at 50% 12%, rgba(156,216,181,0.13), rgba(7,26,20,0) 70%)",
          fontFamily: "sans-serif",
          padding: "0 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "40px" }}>
          <img
            src={ocMarkDataUri}
            width={64}
            height={64}
            alt=""
            style={{ borderRadius: "18px" }}
          />
          <span style={{ color: WHITE, fontSize: "36px", fontWeight: 700, letterSpacing: "-0.01em" }}>
            OneCommit
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: WHITE,
            fontSize: "60px",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
          }}
        >
          <span>Find the schools that fit.</span>
          <span style={{ color: MINT }}>Then actually email them.</span>
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.62)",
            fontSize: "24px",
            marginTop: "26px",
            textAlign: "center",
          }}
        >
          Track &amp; Field · Invite-only beta
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "46px" }}>
          {proofPoints.map((point) => (
            <span
              key={point}
              style={{
                display: "flex",
                alignItems: "center",
                color: "rgba(255,255,255,0.8)",
                fontSize: "19px",
                padding: "11px 22px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              {point}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "44px",
            backgroundColor: WHITE,
            color: SHELL_DEEP,
            fontSize: "19px",
            fontWeight: 600,
            padding: "14px 34px",
            borderRadius: "9999px",
          }}
        >
          {accessButton}
        </div>
      </div>
    ),
    { ...size },
  )
}
