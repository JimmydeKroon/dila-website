import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageRef } from "@dila/content";
import { cn } from "../lib/cn";
import { Container } from "./Container";

interface HeroProps {
  image: ImageRef;
  /** Rendered above the eyebrow — a breadcrumb, a logo chip. */
  top?: ReactNode;
  /** Small line above the headline, e.g. "Dila · Purmerend". */
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons and links, grouped under the lead. */
  actions?: ReactNode;
  /**
   * Full-width row below a hairline at the foot of the hero — the brand strip
   * on the home page.
   */
  bottom?: ReactNode;
  /** `home` is the tallest treatment; `page` is for brand pages. */
  size?: "home" | "page";
  className?: string;
}

/**
 * Copy laid calmly over a full-bleed photo.
 *
 * It is full-bleed in both senses: the photo covers the window edge to edge, and
 * the copy uses a gutter-only container rather than the centred content column,
 * so on a wide screen the headline sits against the left edge of the photo
 * instead of being stranded in the middle. The header uses the same container,
 * so its wordmark lines up with the headline above it.
 *
 * The scrim is deliberately two layers: a diagonal wash that is dark in the
 * top-left (where the header and the copy sit) and almost clear in the
 * bottom-right, plus a bottom fade so the row at the foot of the hero — the
 * brand strip — keeps its contrast. A flat tint would either wash the photo out
 * or make the copy unreadable; this keeps both working.
 *
 * Copy is left-aligned on purpose. A centred stack fights the photo, whereas a
 * left column reads as one calm block and leaves the right of the frame open.
 */
export function Hero({
  image,
  top,
  eyebrow,
  title,
  lead,
  actions,
  bottom,
  size = "home",
  className,
}: HeroProps) {
  return (
    <section
      // `data-hero` is what tells the fixed header it can go transparent: the
      // header looks for it on the first block in `main`. A page that starts
      // with anything else gets the solid bar instead, which is how the 404
      // keeps a readable wordmark.
      data-hero=""
      className={cn(
        // `-mt-20` cancels the top padding the layout reserves for the fixed
        // header (one header height, `h-20`), so the photo starts at the top of
        // the window and shows through the transparent menu bar.
        "relative isolate -mt-20 overflow-hidden bg-ink-950",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        style={image.focal ? { objectPosition: image.focal } : undefined}
        className="object-cover"
      />

      {/*
        Narrow screens put the copy at the foot of the photo, so the tint is
        flat there; from `lg` up the copy moves to the left and the tint becomes
        a horizontal scrim instead, which keeps the right of the frame open.
        Both are graded so the headline sits on roughly 90% darkness and the
        paragraph never runs past the point where white text stops clearing
        WCAG AA against a bright photo.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-950/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink-950/95 lg:via-ink-950/60 lg:to-ink-950/10"
      />

      {/* Darkens the strip the fixed header floats over, so the transparent
          wordmark and nav keep their contrast against a bright photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/85 via-ink-950/40 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 via-ink-950/55 to-transparent"
      />

      <Container width="full" className="relative">
        <div
          className={cn(
            "flex flex-col justify-end",
            size === "home"
              ? "min-h-[34rem] pt-28 pb-10 lg:min-h-[44rem] lg:pt-36 lg:pb-12"
              : "min-h-[26rem] pt-28 pb-12 lg:min-h-[32rem] lg:pt-32 lg:pb-14",
          )}
        >
          {top}

          {eyebrow ? (
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-black tracking-tight text-white text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h1>

          {lead ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-100 sm:text-lg">
              {lead}
            </p>
          ) : null}

          {actions ? (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}

          {bottom ? (
            <div className="mt-14 w-full border-t border-white/15 pt-8">
              {bottom}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
