"use client"

import { useEffect } from "react"

/**
 * Makes an open mobile menu behave like a layer rather than page content: Escape
 * closes it, and the document stops scrolling behind it. Neither header had either,
 * so the page scrolled under an open menu and the X was the only way out.
 */
export function useMenuLayer(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])
}
