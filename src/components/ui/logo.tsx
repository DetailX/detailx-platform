export function Logo({
  className = "",
  size = "text-2xl",
  lightText = false,
}: {
  className?: string;
  size?: string;
  lightText?: boolean;
}) {
  return (
    <span
      className={`${size} leading-none ${className}`}
      style={{ fontFamily: "var(--font-baloo)", fontWeight: 800 }}
    >
      <span style={{ color: lightText ? "white" : "#0c1021" }}>detail</span>
      <span style={{ color: "#3b5bff" }}>x</span>
    </span>
  );
}
