import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-surface-alt text-text-primary": variant === "default",
          "bg-accent/10 text-accent": variant === "accent",
          "border border-border text-text-muted": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
