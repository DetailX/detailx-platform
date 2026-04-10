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
      <span style={{ color: textColor }}>detail</span>
      <span style={{ color: "#3b5bff" }}>x</span>
    </span>
  );
}
