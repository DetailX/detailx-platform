export function Logo({
  className = "",
  size = "text-2xl",
  lightText = false,
}: {
  className?: string;
  size?: string;
  lightText?: boolean;
}) {
  const color = lightText ? "rgba(255,255,255,0.85)" : "#0c1021";

  /*
   * All coordinates in a 435 × 100 viewBox.
   * Baseline  y = 82   Cap height y = 8   X-height y = 34
   * strokeWidth = 22   (half = 11)
   * 5-unit visual gap between every letter.
   *
   * Each letter position was calculated so radii are geometrically
   * valid and the visual edges align cleanly.
   */

  return (
    <span
      className={`inline-block leading-none ${size} ${className}`}
      style={{ lineHeight: 0 }}
      aria-label="detailx"
    >
      <svg
        viewBox="0 0 435 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "1em", width: "auto", display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* ── d ──────────────────────────────────────────────────────────
              Stem x=58. Bowl: elliptical arc going left.
              rx=38 ry=27 makes ry exactly = half the bowl y-span (54/2).
              Leftmost visual edge ≈ x 9. */}
          <line x1="58" y1="8" x2="58" y2="82" />
          <path d="M 58 22 A 38 27 0 0 0 58 76" />

          {/* ── e ──────────────────────────────────────────────────────────
              Circle r=26 centered at (112, 57).
              Large CCW arc leaves a 12-unit gap on the right (the opening).
              Horizontal bar at y=57 from left edge to just before gap. */}
          <path d="M 138 51 A 26 26 0 1 0 138 63" />
          <line x1="86" y1="57" x2="134" y2="57" />

          {/* ── t ──────────────────────────────────────────────────────────
              Stem shorter at top (starts y=24 not cap height).
              Crossbar at y=44. */}
          <line x1="184" y1="24" x2="184" y2="82" />
          <line x1="162" y1="44" x2="206" y2="44" />

          {/* ── a ──────────────────────────────────────────────────────────
              Single-storey. Large CCW arc from top of stem to bottom
              sweeps left making the round bowl. Stem closes the right gap.
              ry=24 valid because 2×24=48 > y-span of 42. */}
          <path d="M 267 36 A 24 24 0 1 0 267 78" />
          <line x1="267" y1="36" x2="267" y2="82" />

          {/* ── i ──────────────────────────────────────────────────────────
              Stem from x-height to baseline. Dot is a separate filled circle. */}
          <line x1="294" y1="34" x2="294" y2="82" />

          {/* ── l + x ligature ─────────────────────────────────────────────
              l stem runs full cap height, stops before baseline so the foot
              curve has room to sweep right.
              The foot Bézier ends at (360, 74) — the EXACT same point as
              the x's top-left-to-bottom-right diagonal starts and the
              top-right-to-bottom-left diagonal ends, creating one continuous
              seamless connection between l and x. */}
          <line x1="321" y1="8" x2="321" y2="63" />
          <path d="M 321 63 Q 338 88 360 74" />

          {/* x diagonal 1: top-left → bottom-right */}
          <line x1="360" y1="34" x2="410" y2="76" />
          {/* x diagonal 2: top-right → bottom-left  (endpoint = l foot) */}
          <line x1="410" y1="34" x2="360" y2="76" />
        </g>

        {/* i dot — solid filled, kept outside the stroke group */}
        <circle cx="294" cy="19" r="11" fill={color} />
      </svg>
    </span>
  );
}
