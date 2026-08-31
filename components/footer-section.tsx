import Image from "next/image"
import Link from "next/link"
import TrackedLink from "@/components/tracked-link"

const footerLinkClass =
  "-mx-3 inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-white/65 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"

export default function FooterSection() {
  return (
    <footer className="flex flex-col items-center border-t border-white/[0.07] px-4 pb-10 pt-10 sm:pb-12">
      <div className="flex w-full max-w-4xl flex-col items-start justify-between gap-10 sm:flex-row">
        <div className="flex max-w-xs flex-col gap-3">
          <Link
            href="/"
            aria-label="OneCommit home"
            className="-mx-2 flex min-h-11 w-fit items-center gap-2 rounded-lg px-2 text-white transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
          >
            <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
            <span className="text-sm font-semibold">OneCommit</span>
          </Link>
          <p className="text-sm leading-relaxed text-white/60">
            An athlete-owned recruiting workflow for track &amp; field.
          </p>
          <TrackedLink
            href="mailto:admin@onecommit.us"
            eventName="support_click"
            eventSource="footer_email_primary"
            className="-mx-3 inline-flex min-h-11 w-fit items-center rounded-lg px-3 text-sm font-medium text-[#86efac] transition-colors hover:bg-white/[0.04] hover:text-[#bbf7d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
          >
            admin@onecommit.us
          </TrackedLink>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:w-auto sm:grid-cols-3 sm:gap-x-12">
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60">Product</span>
            <Link href="/#features" className={footerLinkClass}>Features</Link>
            <Link href="/#how-it-works" className={footerLinkClass}>How it works</Link>
            <Link href="/#pricing" className={footerLinkClass}>Pricing</Link>
            <Link href="/#faq" className={footerLinkClass}>FAQ</Link>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60">For teams</span>
            <TrackedLink href="/coaches" eventName="coach_page_click" eventSource="footer_coaches" className={footerLinkClass}>Coaches</TrackedLink>
            <TrackedLink href="/schools" eventName="audience_page_click" eventSource="footer_schools" className={footerLinkClass}>Schools</TrackedLink>
            <TrackedLink href="/athletic-programs" eventName="audience_page_click" eventSource="footer_athletic_programs" className={footerLinkClass}>Programs</TrackedLink>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60">Company</span>
            <Link href="/about" className={footerLinkClass}>About</Link>
            <TrackedLink href="/support" eventName="support_click" eventSource="footer_support" className={footerLinkClass}>Support</TrackedLink>
            <Link href="/privacy" className={footerLinkClass}>Privacy</Link>
            <Link href="/terms" className={footerLinkClass}>Terms</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl border-t border-white/[0.06] pt-6">
        <p className="text-center text-xs text-white/60">
          © {new Date().getFullYear()} OneCommit LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
