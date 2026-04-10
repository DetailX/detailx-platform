"use client";

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
      className={`inline-flex items-baseline leading-none ${size} ${className}`}
      aria-label="detailx"
    >
      {/* "detai" in Nunito Black */}
      <span
        style={{
          fontFamily: "var(--font-baloo)",
          fontWeight: 900,
          color,
          letterSpacing: "-0.01em",
        }}
      >
        detai
      </span>

      {/* Custom "lx" SVG ligature — l foot curves into x */}
      <svg
        viewBox="0 0 78 76"
        style={{
          height: "0.88em",
          width: "auto",
          display: "inline-block",
          verticalAlign: "-0.06em",
          marginLeft: "-0.01em",
        }}
        aria-hidden="true"
      >
        <g
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* l — vertical stroke */}
          <line x1="14" y1="5" x2="14" y2="50" />
          {/* l foot — curves right and connects into x's bottom-left */}
          <path d="M 14 50 Q 24 68 42 57" />
          {/* x — top-left to bottom-right diagonal */}
          <line x1="42" y1="20" x2="70" y2="57" />
          {/* x — top-right to bottom-left diagonal (bottom-left shares l foot endpoint) */}
          <line x1="70" y1="20" x2="42" y2="57" />
        </g>
      </svg>
    </span>
  );
}
