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
    // Outer span carries the Tailwind size class so 1em on the SVG picks up the right px
    <span
      className={`inline-block leading-none ${size} ${className}`}
      style={{ lineHeight: 0 }}
      aria-label="detailx"
    >
      <svg
        viewBox="0 0 335 88"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "1em", width: "auto", display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        {/*
          "detai" — SVG <text> using the Nunito Black CSS variable loaded by next/font.
          Inline SVGs inherit CSS variables from the page so this works.
          textLength pins the width so the lx paths align precisely every time.
        */}
        <text
          x="0"
          y="72"
          fill={color}
          fontSize="80"
          fontWeight="900"
          textLength="232"
          lengthAdjust="spacingAndGlyphs"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          detai
        </text>

        {/*
          "lx" — hand-drawn stroked paths.
          The foot of the l shares its endpoint with the bottom-left of the x,
          creating the seamless connection seen in the brand logo.
          strokeWidth 20 matches the thick stems of Nunito Black at 80px.
        */}
        <g
          stroke={color}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* l — tall vertical stem */}
          <line x1="246" y1="13" x2="246" y2="60" />

          {/* l foot — sweeps right and flows into x's bottom-left arm */}
          <path d="M 246 60 Q 258 80 276 68" />

          {/* x — top-left to bottom-right diagonal */}
          <line x1="276" y1="30" x2="318" y2="68" />

          {/* x — top-right to bottom-left diagonal (endpoint = l foot endpoint) */}
          <line x1="318" y1="30" x2="276" y2="68" />
        </g>
      </svg>
    </span>
  );
}
