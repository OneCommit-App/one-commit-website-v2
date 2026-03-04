import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "OneCommit — Track & Field Recruiting Copilot"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          backgroundColor: "#0f1a14",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#4ade80",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f1a14",
            }}
          >
            1C
          </div>
          <span
            style={{
              color: "white",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            OneCommit
          </span>
        </div>
        <div
          style={{
            color: "white",
            fontSize: "52px",
            fontWeight: 700,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.15,
          }}
        >
          Get recruited faster for{" "}
          <span style={{ color: "#4ade80" }}>Track & Field</span>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "22px",
            marginTop: "20px",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Match to colleges. Send outreach. Track replies. Free during beta.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "40px",
            backgroundColor: "white",
            color: "#0f1a14",
            fontSize: "18px",
            fontWeight: 600,
            padding: "12px 32px",
            borderRadius: "9999px",
          }}
        >
          Join the Track Beta
        </div>
      </div>
    ),
    { ...size }
  )
}
