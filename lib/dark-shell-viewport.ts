import type { Viewport } from "next"

/**
 * Mobile browser chrome color for the one route that opens on a deep-green band
 * (/demo). Every other public route starts on the light canvas and inherits the
 * root layout's #f7f8f5, so the address bar matches whatever the page opens on.
 */
export const darkShellViewport: Viewport = {
  themeColor: "#0b2a1f",
}
