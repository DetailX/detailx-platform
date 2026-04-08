export function Logo({
  className = "",
  size = "text-2xl",
  darkX = false,
}: {
  className?: string;
  size?: string;
  darkX?: boolean;
}) {
  return (
    <span
      className={`${size} leading-none ${className}`}
      style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800 }}
    >
      <span>detail</span>
      <span style={{ color: darkX ? "#0c1021" : "#3b5bff" }}>x</span>
    </span>
  );
}
