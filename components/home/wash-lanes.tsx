/**
 * The same lane arcs, drawn in the page's own green so a light hero still belongs
 * to the track. Sits behind the hero copy (the parent section is positioned).
 */
export default function WashLanes() {
  const lanes = [150, 210, 270, 330, 390]

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full w-[min(680px,78vw)]"
      viewBox="0 0 680 800"
      preserveAspectRatio="xMaxYMid meet"
      fill="none"
    >
      <g stroke="var(--oc-green)" strokeOpacity="0.16" strokeWidth="1.25">
        {lanes.map((rx) => (
          <ellipse key={rx} cx="620" cy="400" rx={rx} ry={rx * 0.62} />
        ))}
      </g>
      <path d="M620 214v372" stroke="var(--oc-green)" strokeOpacity="0.28" strokeWidth="2" />
    </svg>
  )
}
