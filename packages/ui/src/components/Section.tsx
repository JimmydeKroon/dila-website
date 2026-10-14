import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Tone = "paper" | "surface" | "ink" | "accent";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Background treatment. `ink` is the dark editorial band, `accent` the CTA band. */
  tone?: Tone;
  /** Vertical rhythm. */
  spacing?: "default" | "compact" | "loose";
  as?: "section" | "div" | "footer";
  "aria-labelledby"?: string;
}

const tones: Record<Tone, string> = {
  paper: "bg-paper text-ink-900",
  surface: "bg-surface text-ink-900",
  ink: "bg-ink-950 text-white",
  accent: "bg-accent text-accent-ink",
};

const spacings = {
  compact: "py-12 sm:py-14",
  default: "py-16 sm:py-20 lg:py-24",
  loose: "py-20 sm:py-28 lg:py-32",
} as const;

export function Section({
  id,
  children,
  className,
  tone = "paper",
  spacing = "default",
  as: Tag = "section",
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "scroll-mt-24",
        tones[tone],
        spacings[spacing],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
