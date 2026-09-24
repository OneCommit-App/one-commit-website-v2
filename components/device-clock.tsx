"use client"

import { useEffect, useState } from "react"

/**
 * The reader's own clock, drawn into the phone's status bar.
 *
 * Safe to add because the capture's own 9:41 is invisible, not merely faint: every
 * pixel in x60-340 / y40-160 of public/app/home-hero.png is #F7F8F5 or #FFFFFF, and
 * the glyphs themselves measure x171-265 / y80-115 in pure white on that near-white
 * canvas. So this is purely additive — there is no second clock underneath to
 * mask, crop or align to, and nothing here goes stale when the capture is retaken.
 *
 * Empty on the server on purpose. A server-rendered time hydration-mismatches, and
 * scripts/home-ssr.test.mjs asserts the hero is not hidden in server HTML, so the
 * element must never carry opacity:0 to cover the gap — it carries no text at all
 * until the effect runs.
 */
export default function DeviceClock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span aria-hidden="true" className="oc-device-clock">
      {time}
    </span>
  )
}
