import Image from "next/image"
import Link from "next/link"
import DownloadLink from "@/components/download-link"

type PublicHeaderProps = {
  accessSource: string
}

const secondaryLinkClass =
  "hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c] sm:inline-flex"

export default function PublicHeader({ accessSource }: PublicHeaderProps) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-0 z-[100] inline-flex min-h-11 -translate-y-full items-center rounded-full bg-[#e6b85c] px-4 py-2 text-sm font-semibold text-[#0f1a14] shadow-lg transition-transform focus:top-4 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <header className="relative z-40 px-4 pt-4 sm:pt-5">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex min-h-14 w-full max-w-4xl items-center justify-between gap-3 rounded-full border border-white/[0.09] bg-[#13231a]/95 px-2.5 py-1.5 shadow-[0_14px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-3"
        >
          <Link
            href="/"
            aria-label="OneCommit home"
            className="flex min-h-11 min-w-11 items-center gap-2 rounded-full px-2 text-white transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
          >
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
            />
            <span className="text-sm font-semibold tracking-tight">OneCommit</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link href="/demo" className={secondaryLinkClass}>
              Demo
            </Link>
            <Link href="/#how-it-works" className={secondaryLinkClass}>
              How it works
            </Link>
            <DownloadLink
              analyticsSource={accessSource}
              fallbackLabel="Request Access"
              className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13231a]"
            >
              Get the app
            </DownloadLink>
          </div>
        </nav>
      </header>
    </>
  )
}
