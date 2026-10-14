import Image from "next/image";
import type { ReactNode } from "react";
import type { Dictionary, ImageRef, SiteInfo } from "@dila/content";
import { Container } from "./Container";
import { Icon } from "./Icon";

interface HeroProps {
  site: SiteInfo;
  dict: Dictionary;
  image: ImageRef;
  /** Anchor target for the single hero CTA. */
  primaryHref: string;
  /** Brand logos, rendered in the band below the copy. */
  brandStrip: ReactNode;
}

/**
 * Centred hero: eyebrow, headline, one CTA, then the brand strip. The overlay
 * is symmetric (a flat tint plus a bottom fade) rather than a left-to-right
 * gradient, which would darken one side and leave the other washed out now that
 * the copy is centred.
 */
export function Hero({
  site,
  dict,
  image,
  primaryHref,
  brandStrip,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        style={image.focal ? { objectPosition: image.focal } : undefined}
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink-950/72" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink-950/90 to-transparent"
      />

      <Container width="wide" className="relative">
        <div className="flex min-h-[32rem] flex-col items-center justify-end pt-24 pb-10 text-center sm:min-h-[36rem] lg:min-h-[40rem] lg:pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {site.groupName} · {dict.hero.eyebrow}
          </p>

          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-black tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            {dict.hero.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            {dict.hero.lead}
          </p>

          <a
            href={primaryHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
          >
            {dict.hero.primaryCta}
            <Icon name="arrowRight" size={18} />
          </a>

          <div className="mt-12 w-full border-t border-white/15 pt-8">
            {brandStrip}
          </div>
        </div>
      </Container>
    </section>
  );
}
