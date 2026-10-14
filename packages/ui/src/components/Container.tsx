import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** `wide` uses the full content width, `narrow` centres text-heavy blocks. */
  width?: "default" | "wide" | "narrow";
}

const widths = {
  default: "max-w-7xl",
  wide: "max-w-[var(--container-wide)]",
  narrow: "max-w-3xl",
} as const;

export function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8", widths[width], className)}>
      {children}
    </div>
  );
}
