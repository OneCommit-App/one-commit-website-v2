import Image from "next/image"
import type React from "react"
import { cn } from "@/lib/utils"

type DeviceFrameProps = {
  /** 2x portrait app capture (public/app/*.png, 1206x2622 or the 919x1999 sim size). */
  src: string
  /** Describe what the screen shows. Pass "" only for purely decorative duplicates. */
  alt: string
  priority?: boolean
  className?: string
  /** next/image `sizes` for the screen; defaults to the largest homepage width. */
  sizes?: string
  /** Optional layers rendered inside the screen, above the base image. */
  children?: React.ReactNode
}

/**
 * A CSS-drawn iPhone: titanium band, black bezel, Dynamic Island, side buttons.
 * Everything scales from the frame width, so it stays crisp from 160px to 400px.
 */
export default function DeviceFrame({
  src,
  alt,
  priority = false,
  className,
  sizes = "(max-width: 1024px) 280px, 340px",
  children,
}: DeviceFrameProps) {
  return (
    <div className={cn("oc-device select-none", className)} aria-hidden={alt === "" ? true : undefined}>
      <span aria-hidden="true" className="oc-device-btn is-left" style={{ top: "15.5%", height: "2.4%" }} />
      <span aria-hidden="true" className="oc-device-btn is-left" style={{ top: "21.5%", height: "5.2%" }} />
      <span aria-hidden="true" className="oc-device-btn is-left" style={{ top: "28%", height: "5.2%" }} />
      <span aria-hidden="true" className="oc-device-btn is-right" style={{ top: "23%", height: "8.2%" }} />
      <div className="oc-device-body">
        <div className="oc-device-bezel" />
        <div className="oc-device-screen">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={85}
            sizes={sizes}
            className="object-cover object-top"
            draggable={false}
          />
          {children}
        </div>
        <span aria-hidden="true" className="oc-device-island" />
      </div>
    </div>
  )
}
