import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * `wide` uses the full content width, `narrow` centres text-heavy blocks.
   *
   * `full` drops the max-width entirely and only keeps a gutter, so the content
   * hugs the edges of the window instead of sitting in a centred column. It is
   * for full-bleed bands — the hero and the transparent header that overlays it
   * — where the copy belongs against the left edge of the photo. Both use this
   * variant, so the logo and the headline share the exact same left edge.
   */
  width?: "default" | "wide" | "narrow" | "full";
}

const widths = {
  default: "max-w-7xl",
  wide: "max-w-[var(--container-wide)]",
  narrow: "max-w-3xl",
  full: "max-w-none",
} as const;

/** A wider gutter for the full-bleed bands, so they breathe on large screens. */
const gutters = {
  default: "px-5 sm:px-8",
  wide: "px-5 sm:px-8",
  narrow: "px-5 sm:px-8",
  full: "px-6 sm:px-8 lg:px-12 xl:px-20",
} as const;

export function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", gutters[width], widths[width], className)}
    >
      {children}
    </div>
  );
}
