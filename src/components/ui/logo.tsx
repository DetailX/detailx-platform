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

  return (
    <span
      className={`inline-block leading-none ${size} ${className}`}
      style={{ lineHeight: 0 }}
      aria-label="detailx"
    >
      <svg
        viewBox="0 0 390 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "1em", width: "auto", display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="19"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* ── d ─────────────────────────────────────────────
              Right stem runs full cap height.
              Bowl: elliptical arc opening to the right. */}
          <line x1="58" y1="8" x2="58" y2="82" />
          <path d="M 58 22 A 36 26 0 0 0 58 76" />

          {/* ── e ─────────────────────────────────────────────
              Near-full circle (gap on right ~12px).
              Horizontal bar cuts through the middle. */}
          <path d="M 132 51 A 26 26 0 1 0 132 63" />
          <line x1="82" y1="57" x2="128" y2="57" />

          {/* ── t ─────────────────────────────────────────────
              Stem shorter than cap height at top.
              Crossbar at ~x-height. */}
          <line x1="164" y1="22" x2="164" y2="82" />
          <line x1="143" y1="42" x2="185" y2="42" />

          {/* ── a ─────────────────────────────────────────────
              Single-storey: large CCW arc = round bowl on
              left, open gap on right where the stem closes. */}
          <path d="M 226 36 A 24 24 0 1 0 226 78" />
          <line x1="226" y1="36" x2="226" y2="82" />

          {/* ── i ─────────────────────────────────────────────
              Short stem (x-height). Dot drawn separately. */}
          <line x1="258" y1="34" x2="258" y2="82" />

          {/* ── l ─────────────────────────────────────────────
              Tall stem (cap height). Foot curves right and
              its endpoint is shared with x bottom-left arm,
              creating the seamless lx connection. */}
          <line x1="284" y1="8" x2="284" y2="62" />
          <path d="M 284 62 Q 300 84 320 70" />

          {/* ── x ─────────────────────────────────────────────
              Two crossing diagonals. Bottom-left endpoint
              (320, 70) == l foot endpoint → connected. */}
          <line x1="320" y1="34" x2="366" y2="70" />
          <line x1="366" y1="34" x2="320" y2="70" />
        </g>

        {/* i dot — filled circle, not part of stroke group */}
        <circle cx="258" cy="20" r="10" fill={color} />
      </svg>
    </span>
  );
}
