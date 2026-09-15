"use client";

import { useState } from "react";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import DownloadLink from "@/components/download-link";

type PublicHeaderProps = {
  accessSource: string;
  /** "dark" when the page opens on a deep-green band: the glass, text, and pill tint to match. */
  tone?: "light" | "dark";
  /** The audience shell renders its own skip link ahead of this header. */
  skipLink?: boolean;
};

const primaryLinks = [
  { label: "Demo", href: "/demo" },
  { label: "Coaches", href: "/coaches" },
  { label: "Schools", href: "/schools" },
  { label: "Programs", href: "/athletic-programs" },
  { label: "How it works", href: "/#how-it-works" },
];

const mobileLinks = [
  { label: "Demo", href: "/demo" },
  { label: "Coaches", href: "/coaches" },
  { label: "Schools", href: "/schools" },
  { label: "Athletic Programs", href: "/athletic-programs" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

/*
 * Tone is carried by CSS variables so every link keeps one plain class string
 * (the public-shell gate reads those strings) while the colors follow the band
 * the page opens on. Light: canvas glass, ink text, green pill. Dark: shell glass,
 * white text, white pill.
 *
 * The light tone resolves through --oc-* tokens rather than literals so it follows
 * the colour scheme: a paper-white literal here renders a light bar on the dark
 * canvas once the page is scrolled, and pairs white with a mint pill.
 */
const toneVars: Record<"light" | "dark", React.CSSProperties> = {
  light: {
    "--nav-fg": "var(--oc-ink)",
    "--nav-fg-soft": "var(--oc-ink-soft)",
    "--nav-hover": "rgba(11, 31, 24, 0.05)",
    "--nav-ring": "var(--oc-green-mid)",
    "--nav-bg": "var(--oc-bg)",
    "--nav-glass": "color-mix(in srgb, var(--oc-bg) 80%, transparent)",
    "--nav-glass-solid": "color-mix(in srgb, var(--oc-bg) 95%, transparent)",
    "--nav-line": "var(--oc-line)",
    "--nav-cta-bg": "var(--oc-green)",
    "--nav-cta-bg-hover": "var(--oc-green-mid)",
    "--nav-cta-fg": "var(--oc-on-green)",
  } as React.CSSProperties,
  dark: {
    "--nav-fg": "#ffffff",
    "--nav-fg-soft": "rgba(255, 255, 255, 0.72)",
    "--nav-hover": "rgba(255, 255, 255, 0.08)",
    "--nav-ring": "var(--oc-mint)",
    "--nav-bg": "var(--oc-shell)",
    "--nav-glass": "rgba(11, 42, 31, 0.8)",
    "--nav-glass-solid": "rgba(11, 42, 31, 0.95)",
    "--nav-line": "rgba(255, 255, 255, 0.1)",
    "--nav-cta-bg": "#ffffff",
    "--nav-cta-bg-hover": "var(--oc-green-tint)",
    "--nav-cta-fg": "var(--oc-shell)",
  } as React.CSSProperties,
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-bg)]";

const secondaryLinkClass =
  "hidden min-h-11 items-center rounded-full px-3 text-[13px] font-medium text-[color:var(--nav-fg-soft)] transition-colors hover:text-[color:var(--nav-fg)] md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-bg)]";

/**
 * Shared frosted-glass navigation for every route away from the homepage. It is
 * transparent over the top of the page and turns to glass with a hairline once the
 * page scrolls, matching components/home/site-nav.tsx.
 */
export default function PublicHeader({
  accessSource,
  tone = "light",
  skipLink = true,
}: PublicHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12));

  const frosted = scrolled || open;

  return (
    <div className="contents" style={toneVars[tone]}>
      {skipLink ? (
        <a
          href="#main-content"
          className="fixed left-4 top-0 z-[100] inline-flex min-h-11 -translate-y-full items-center rounded-full bg-[color:var(--nav-cta-bg)] px-4 text-sm font-semibold text-[color:var(--nav-cta-fg)] transition-transform focus:top-4 focus:shadow-cta focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[color:var(--nav-ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--nav-bg)]"
        >
          Skip to main content
        </a>
      ) : null}

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-out-quint ${
          frosted
            ? "border-[color:var(--nav-line)] bg-[color:var(--nav-glass)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Primary navigation" className="px-4 sm:px-6">
          <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3">
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="OneCommit home"
                className="-ml-2 flex min-h-11 items-center gap-2 rounded-full px-2 text-[color:var(--nav-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-bg)]"
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px] rounded-full ring-1 ring-ink/10"
                />
                <span className="hidden text-[15px] font-semibold tracking-[-0.01em] min-[360px]:inline">
                  OneCommit
                </span>
              </Link>
              <div className="ml-3 hidden items-center gap-0.5 md:flex">
                {primaryLinks.map(({ label, href }) => (
                  <Link key={label} href={href} className={secondaryLinkClass}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-mobile-menu-toggle="true"
                onClick={() => setOpen((value) => !value)}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--nav-fg-soft)] transition-colors hover:text-[color:var(--nav-fg)] md:hidden ${focusRing}`}
                aria-label={
                  open ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={open}
                aria-controls="route-mobile-navigation"
              >
                {open ? (
                  <X size={18} aria-hidden="true" />
                ) : (
                  <Menu size={18} aria-hidden="true" />
                )}
              </button>
              <DownloadLink
                analyticsSource={accessSource}
                fallbackLabel="Request Access"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[color:var(--nav-cta-bg)] px-4 text-[13px] font-semibold text-[color:var(--nav-cta-fg)] shadow-cta transition-colors hover:bg-[color:var(--nav-cta-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nav-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nav-bg)]"
              >
                Get the app
              </DownloadLink>
            </div>
          </div>

          <motion.div
            initial={false}
            animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            id="route-mobile-navigation"
            data-mobile-navigation="true"
            className={`${open ? "block" : "hidden"} border-t border-[color:var(--nav-line)] bg-[color:var(--nav-glass-solid)] backdrop-blur-xl md:hidden`}
          >
            <div
              data-mobile-navigation-links="true"
              className="mx-auto flex w-full max-w-[1200px] flex-col px-3 py-2"
            >
              {mobileLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 rounded-input px-3 py-3 text-[15px] font-medium text-[color:var(--nav-fg-soft)] transition-colors hover:bg-[color:var(--nav-hover)] hover:text-[color:var(--nav-fg)] ${focusRing}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        </nav>
      </header>
    </div>
  );
}
