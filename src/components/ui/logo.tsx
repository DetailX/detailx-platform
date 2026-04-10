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
      className={`inline-flex items-center leading-none ${size} ${className}`}
      style={{ fontFamily: "var(--font-baloo)", fontWeight: 900, color }}
      aria-label="detailx"
    >
      {/* "detai" rendered normally */}
      <span style={{ letterSpacing: "-0.01em" }}>detai</span>

      {/* "l" and "x" pulled together so they touch and connect */}
      <span style={{ letterSpacing: "-0.18em" }}>l</span>
      <span>x</span>
    </span>
  );
}
