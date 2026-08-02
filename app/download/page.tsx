import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Mail, Smartphone } from "lucide-react"
import DownloadLink from "@/components/download-link"
import TrackedLink from "@/components/tracked-link"
import {
  androidDownloadUrl,
  hasConfiguredDownloadUrl,
  iosDownloadUrl,
} from "@/lib/download"

const accessTitle = hasConfiguredDownloadUrl ? "Download" : "Request Beta Access"
const accessDescription = hasConfiguredDownloadUrl
  ? "Download OneCommit for Track & Field recruiting: D3-focused OneScore matches, own-inbox outreach, and reply tracking."
  : "Request a OneCommit beta invitation for Track & Field recruiting: D3-focused OneScore matches, own-inbox outreach, and reply tracking."

export const metadata: Metadata = {
  title: accessTitle,
  description: accessDescription,
  alternates: { canonical: "https://www.onecommit.us/download" },
  openGraph: {
    title: hasConfiguredDownloadUrl ? "Download OneCommit" : "Request OneCommit Beta Access",
    description: accessDescription,
    url: "https://www.onecommit.us/download",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: hasConfiguredDownloadUrl ? "Download OneCommit" : "Request OneCommit Beta Access",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: hasConfiguredDownloadUrl ? "Download OneCommit" : "Request OneCommit Beta Access",
    description: accessDescription,
    images: ["/opengraph-image"],
  },
}

const platformLinks = [
  { label: "Download for iPhone", href: iosDownloadUrl },
  { label: "Download for Android", href: androidDownloadUrl },
].filter((item) => item.href && item.href !== "/download")

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#0f1a14] text-white">
      <header className="px-4 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="OneCommit logo" width={28} height={28} className="w-7 h-7 rounded-full" />
            <span className="text-white text-base font-semibold">OneCommit</span>
          </Link>
          <TrackedLink
            href="/demo"
            eventName="demo_click"
            eventSource="download_header"
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            Watch demo
          </TrackedLink>
        </div>
      </header>

      <section className="px-4 pt-16 pb-16 flex justify-center">
        <div className="w-full max-w-4xl grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">
              OneCommit Beta
            </span>
            <h1 className="mt-3 text-white text-3xl sm:text-5xl font-bold tracking-tight text-balance">
              {hasConfiguredDownloadUrl
                ? "Download the recruiting app built for overlooked track athletes."
                : "Request beta access to start your track recruiting process."}
            </h1>
            <p className="mt-4 text-white/55 text-sm sm:text-base leading-relaxed max-w-2xl">
              Build a D3-focused college list, generate coach outreach from your own inbox, and track replies without paying for a passive recruiting profile.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              {hasConfiguredDownloadUrl ? (
                <DownloadLink
                  analyticsSource="download_page_primary"
                  className="h-11 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors group"
                >
                  Open App Download
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </DownloadLink>
              ) : (
                <TrackedLink
                  href="mailto:admin@onecommit.us?subject=OneCommit%20app%20download"
                  eventName="download_click"
                  eventSource="download_page_fallback_email"
                  eventDestination="support_email"
                  className="h-11 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                >
                  Request Beta Access
                  <Mail size={15} />
                </TrackedLink>
              )}
              <TrackedLink
                href="/demo"
                eventName="demo_click"
                eventSource="download_page_secondary"
                className="h-11 px-6 border border-white/15 text-white text-sm font-medium rounded-full inline-flex items-center justify-center hover:bg-white/[0.04] transition-colors"
              >
                Watch the 1-minute demo
              </TrackedLink>
            </div>

            {platformLinks.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {platformLinks.map((link) => (
                  <DownloadLink
                    key={link.label}
                    href={link.href}
                    analyticsSource={`download_page_${link.label.includes("iPhone") ? "ios" : "android"}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.07] hover:text-white"
                  >
                    <Smartphone size={14} />
                    {link.label}
                  </DownloadLink>
                ))}
              </div>
            )}

            {!hasConfiguredDownloadUrl && (
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-amber-100/70">
                Public download links are not available yet. Email support to ask about current beta availability; invitations depend on capacity and a supported app-access path.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5">
            <div className="grid gap-3">
              {[
                "Free account for invited beta users",
                "Athlete age gate in the app",
                "Gmail and Outlook outreach",
                "D3-focused OneScore workspace",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/70">
                  <CheckCircle2 size={15} className="shrink-0 text-[#86efac]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
