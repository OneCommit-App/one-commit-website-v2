import type { Viewport } from "next"

/**
 * Mobile browser chrome color for routes that still render the dark #0f1a14 shell.
 * The root layout declares the light homepage canvas; each dark route re-exports this
 * so the address bar matches the page it sits above.
 */
export const darkShellViewport: Viewport = {
  themeColor: "#0f1a14",
}
