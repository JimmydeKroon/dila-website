import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@dila/content";
import { cn } from "../lib/cn";

interface BrandStripProps {
  brands: Brand[];
  /** Small caption above the logos, e.g. "Deze merken vind je bij ons". */
  label?: string;
  /** `dark` variant for use on top of a hero image. */
  variant?: "light" | "dark";
  className?: string;
  /** Render as a plain list instead of links (used inside brand cards). */
  linked?: boolean;
}

/**
 * The brand row that sits under the hero. Logos are rendered at a per-brand
 * height so a square emblem and a wide wordmark read as visually equal.
 */
export function BrandStrip({
  brands,
  label,
  variant = "light",
  className,
  linked = true,
}: BrandStripProps) {
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <p
          className={cn(
            "mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em]",
            variant === "dark" ? "text-ink-300" : "text-ink-500",
          )}
        >
          {label}
        </p>
      ) : null}

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8">
        {brands.map((brand) => {
          const logo = (
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              width={brand.logoWidth}
              height={brand.logoHeight}
              style={{ height: brand.logoSize, width: "auto" }}
              className="opacity-90 transition-opacity duration-200 group-hover:opacity-100"
            />
          );

          // On the hero the logos sit on white chips rather than being inverted:
          // the Derbi mark is a solid colour block, so inverting it would turn
          // the whole logo into an unreadable white rectangle.
          const chip = cn(
            "flex items-center justify-center rounded-xl transition-colors",
            variant === "dark"
              ? "h-16 min-w-[6rem] bg-white px-4 shadow-sm shadow-ink-950/20"
              : "py-1",
          );

          return (
            <li key={brand.slug}>
              {linked ? (
                <Link
                  href={`/brands/${brand.slug}`}
                  className={cn("group", chip)}
                  aria-label={brand.name}
                >
                  {logo}
                </Link>
              ) : (
                <span className={chip}>{logo}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
