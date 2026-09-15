import type { Metadata } from "next"
import { ArrowRight, CalendarCheck, Mail, ShieldCheck, Smartphone, Target } from "lucide-react"
import DeviceFrame from "@/components/device-frame"
import DownloadLink from "@/components/download-link"
import FooterSection from "@/components/footer-section"
import { container, eyebrow, lede, pillPrimary, pillSecondary } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import { RevealGroup, RevealItem } from "@/components/reveal"
import RouteShell from "@/components/routes/route-shell"
import { h1, hero, iconDot } from "@/components/routes/tokens"
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

const betaIncludes = [
  { icon: CalendarCheck, label: "Free account for invited beta users" },
  { icon: ShieldCheck, label: "Athlete age gate in the app" },
  { icon: Target, label: "D3-focused OneScore workspace" },
]

export default function DownloadPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="download_header" />
      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="access-heading" className={`${hero} oc-wash relative overflow-x-clip`}>
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
            <div>
              <p className={eyebrow}>OneCommit Beta</p>
              <h1 id="access-heading" className={`mt-5 ${h1}`}>
                {hasConfiguredDownloadUrl
                  ? "Download the recruiting app built for overlooked track athletes."
                  : "Request beta access to start your track recruiting process."}
              </h1>
              <p className={`mt-6 max-w-xl ${lede}`}>
                Build a D3-focused college list, generate coach outreach from your own inbox, and track replies
                without paying for a passive recruiting profile.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {hasConfiguredDownloadUrl ? (
                  <DownloadLink
                    analyticsSource="download_page_primary"
                    className={`${pillPrimary} group`}
                  >
                    Open App Download
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
                    />
                  </DownloadLink>
                ) : (
                  <TrackedLink
                    href="mailto:admin@onecommit.us?subject=OneCommit%20app%20download"
                    eventName="download_click"
                    eventSource="download_page_fallback_email"
                    eventDestination="support_email"
                    className={pillPrimary}
                  >
                    Request Beta Access
                    <Mail aria-hidden="true" size={16} />
                  </TrackedLink>
                )}
                <TrackedLink
                  href="/demo"
                  eventName="demo_click"
                  eventSource="download_page_secondary"
                  className={pillSecondary}
                >
                  Watch the 1-minute demo
                </TrackedLink>
              </div>

              {platformLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {platformLinks.map((link) => (
                    <DownloadLink
                      key={link.label}
                      href={link.href}
                      analyticsSource={`download_page_${link.label.includes("iPhone") ? "ios" : "android"}`}
                      className="inline-flex h-11 min-h-11 items-center gap-2 rounded-full bg-card px-4 text-[13px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    >
                      <Smartphone aria-hidden="true" size={15} className="text-green-mid" />
                      {link.label}
                    </DownloadLink>
                  ))}
                </div>
              )}

              {!hasConfiguredDownloadUrl && (
                <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                  Public download links are not available yet. Email support to ask about current beta availability;
                  invitations depend on capacity and a supported app-access path.
                </p>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] top-[10%] bottom-[10%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[min(280px,74vw)] lg:w-[340px]">
                <DeviceFrame
                  src="/app/welcome.png"
                  alt="OneCommit welcome screen"
                  priority
                  sizes="(max-width: 1024px) 280px, 340px"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="beta-includes-heading" className="px-4 pb-24 sm:px-6 lg:pb-32">
          <div className={container}>
            <h2 id="beta-includes-heading" className={eyebrow}>
              Current beta includes
            </h2>
            <RevealGroup
              stagger={0.1}
              className="oc-raised mt-5 grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-3"
            >
              {betaIncludes.map(({ icon: Icon, label }) => (
                <RevealItem key={label} y={12} className="flex items-center gap-4 bg-card p-6 sm:p-7">
                  <span className={iconDot}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{label}</span>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
              Outlook/Microsoft 365 is currently the only inbox option offered in the beta app. Gmail is not currently available.
            </p>
          </div>
        </section>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
