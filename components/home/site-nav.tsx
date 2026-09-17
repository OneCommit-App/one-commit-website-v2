"use client";

import { useState } from "react"
import { mobileNavLinks } from "@/lib/nav-links"
import { useMenuLayer } from "@/components/use-menu-layer";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import DownloadLink from "@/components/download-link";
import { focusRing } from "@/components/home/tokens";

const primaryLinks = [
  { label: "Coaches", href: "/coaches" },
  { label: "Schools", href: "/schools" },
  { label: "Programs", href: "/athletic-programs" },
  { label: "How it works", href: "#how-it-works" },
];


/** Transparent over the hero; turns to frosted glass with a hairline once the page scrolls. */
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  useMenuLayer(open, () => setOpen(false));
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12));

  const frosted = scrolled || open;

  return (
    <nav
      data-home-nav="true"
      aria-label="Primary navigation"
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ease-out-quint ${
        frosted
          ? "border-line bg-canvas/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="OneCommit home"
              className={`-ml-2 flex min-h-11 items-center gap-2 rounded-full px-2 text-ink ${focusRing}`}
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
                <a
                  key={label}
                  href={href}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink ${focusRing}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-mobile-menu-toggle="true"
              onClick={() => setOpen((value) => !value)}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink md:hidden ${focusRing}`}
              aria-label={
                open ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <DownloadLink
              analyticsSource="home_nav"
              fallbackLabel="Request Access"
              className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-green px-4 text-[13px] font-semibold text-on-green shadow-cta transition-colors hover:bg-green-mid ${focusRing}`}
            >
              Download App
            </DownloadLink>
          </div>
        </div>
      </div>

      {open ? (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-x-0 bottom-0 top-14 -z-10 cursor-default bg-ink/20 md:hidden"
        />
      ) : null}

      <motion.div
        initial={false}
        animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        id="mobile-navigation"
        className={`${open ? "block" : "hidden"} border-t border-line bg-canvas/95 backdrop-blur-xl md:hidden`}
      >
        <div
          data-mobile-navigation-links="true"
          className="mx-auto flex w-full max-w-[1200px] flex-col px-3 py-2"
        >
          {mobileNavLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`min-h-11 rounded-input px-3 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink ${focusRing}`}
            >
              {label}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
