import Link from "next/link";
import { cn } from "../lib/cn";

interface LogoProps {
  /** "Dila" plus the shop-specific strapline. */
  strapline?: string;
  className?: string;
  href?: string;
  /** Dark version for use on ink-coloured surfaces. */
  onDark?: boolean;
  /** Hide the strapline on small screens. */
  compact?: boolean;
}

/**
 * Wordmark placeholder.
 *
 * The client supplied a square, white-on-black logo, which cannot sit in a
 * light header or act as a favicon. Until they commission a proper vector
 * wordmark, the header uses a typographic lockup built from the display font —
 * it carries the same heavy, slanted, red-accented character and is swappable
 * for the real logo in one place. The supplied logo *is* used, unmodified, on
 * the dark footer where its white artwork belongs.
 */
export function Logo({
  strapline,
  className,
  href = "/",
  onDark = false,
  compact = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-md",
        className,
      )}
      aria-label={strapline ? `Dila ${strapline} — naar de startpagina` : "Dila"}
    >
      <span
        className={cn(
          "flex h-10 items-center font-display text-[1.75rem] leading-none font-black italic tracking-[-0.04em]",
          onDark ? "text-white" : "text-ink-900",
        )}
      >
        D
        <span className="text-accent">i</span>
        la
      </span>
      {strapline ? (
        <span
          className={cn(
            "hidden flex-col border-l pl-3 text-[0.6rem] leading-tight font-semibold uppercase tracking-[0.2em] sm:flex",
            onDark ? "border-white/25 text-ink-300" : "border-line text-ink-500",
            compact && "lg:flex",
          )}
        >
          {strapline}
        </span>
      ) : null}
    </Link>
  );
}
