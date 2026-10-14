import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift + accent border on hover. */
  interactive?: boolean;
  as?: "div" | "li" | "article";
}

export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-paper",
        interactive &&
          "transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-lg hover:shadow-ink-900/5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
