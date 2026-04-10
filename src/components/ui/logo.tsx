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
      className={`${size} leading-none tracking-tight ${className}`}
      style={{
        fontFamily: "var(--font-baloo)",
        fontWeight: 900,
        color,
        letterSpacing: "-0.02em",
      }}
    >
      detailx
    </span>
  );
}
