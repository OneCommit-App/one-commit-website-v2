/**
 * Decorative lane arcs. Strokes are white because this only sits on the deep-green
 * stadium and the shell bands. It does not encode a result, a place, or a time.
 */
export default function TrackField({ className = "" }: { className?: string }) {
  const lanes = [168, 228, 288, 348, 408, 468]

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.25">
        {lanes.map((rx) => (
          <ellipse key={rx} cx="1080" cy="460" rx={rx} ry={rx * 0.62} />
        ))}
      </g>
      <ellipse
        className="oc-lane-dash"
        cx="1080"
        cy="460"
        rx="288"
        ry="178"
        stroke="#9cd8b5"
        strokeWidth="1.75"
        strokeOpacity="0.85"
      />
      <path d="M1080 282v356" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
      <path d="M1064 282h32" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
    </svg>
  )
}
