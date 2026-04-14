export function Logo({
  className = "",
  size = "text-2xl",
  lightText = false,
}: {
  className?: string;
  size?: string;
  lightText?: boolean;
}) {
  const textColor = lightText ? "rgba(255,255,255,0.9)" : "#0c1021";

  return (
    <span
      className={`inline-block leading-none tracking-tight ${size} ${className}`}
      style={{ fontFamily: "var(--font-baloo)", fontWeight: 900, lineHeight: 1 }}
      aria-label="detailx"
    >
      {/* Tiny-blur goo filter — only merges strokes that are nearly touching */}
      <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
        <defs>
          <filter
            id="lx-connect"
            x="-5%" y="-15%"
            width="110%" height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 45 -18"
              result="sharp"
            />
            <feComposite in="SourceGraphic" in2="sharp" operator="atop" />
          </filter>
        </defs>
      </svg>
      <span style={{ color: textColor }}>detai</span><span
        style={{
          color: textColor,
          display: "inline-block",
          verticalAlign: "baseline",
          letterSpacing: "-0.05em",
          filter: "url(#lx-connect)",
        }}
      >lx</span>
    </span>
  );
}
