import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Heading level, so each page keeps a valid document outline. */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** Invert colours for dark sections. */
  onDark?: boolean;
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  align = "left",
  onDark = false,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            onDark ? "text-accent-light" : "text-accent-strong",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]",
          onDark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            onDark ? "text-ink-300" : "text-ink-600",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
