import type React from "react"
import { cn } from "@/lib/utils"

type RouteShellProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Page wrapper for every secondary route: light canvas by default, plus the same
 * no-JavaScript fallback the homepage uses so Reveal-wrapped sections (which start
 * at opacity 0 until they scroll into view) stay readable without hydration.
 */
export default function RouteShell({ children, className }: RouteShellProps) {
  return (
    <div id="onecommit-route" className={cn("relative min-h-screen w-full bg-canvas text-ink", className)}>
      {children}
      <noscript>
        <style>{`
          #onecommit-route [style*="opacity:0"],
          #onecommit-route [style*="opacity: 0"] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          #onecommit-route * {
            animation: none !important;
            transition: none !important;
          }
          @media (max-width: 767px) {
            #onecommit-route [data-mobile-menu-toggle="true"] {
              display: none !important;
            }
            #onecommit-route [data-mobile-navigation="true"] {
              display: block !important;
              opacity: 1 !important;
              transform: none !important;
            }
            #onecommit-route [data-mobile-navigation-links="true"] {
              flex-direction: row !important;
              overflow-x: auto !important;
              overscroll-behavior-x: contain;
              padding: 0.5rem !important;
            }
            #onecommit-route [data-mobile-navigation-links="true"] a {
              align-items: center;
              display: flex;
              flex: 0 0 auto;
              min-height: 44px;
              padding: 0.5rem 0.75rem !important;
            }
          }
        `}</style>
      </noscript>
    </div>
  )
}
