import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@dila/content";
import { Icon } from "./Icon";

interface BrandCardProps {
  brand: Brand;
  /** Button label prefix, e.g. "Meer over". */
  ctaLabel: string;
}

/**
 * Brand block: scooter photo, logo, one-line summary and a link to the full
 * page. The whole card is one link target, so the tap area is the full surface.
 *
 * The CTA sits in a `mt-auto` footer so the cards line up across a row even
 * when their summaries differ in length.
 */
export function BrandCard({ brand, ctaLabel }: BrandCardProps) {
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-lg hover:shadow-ink-900/5">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-alt">
        <Image
          src={brand.image.src}
          alt={brand.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex min-h-[44px] items-center">
          <Image
            src={brand.logoSrc}
            alt={brand.name}
            width={brand.logoWidth}
            height={brand.logoHeight}
            style={{ height: brand.logoSize, width: "auto" }}
            className="max-w-[140px] object-contain"
          />
        </div>

        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
          {brand.origin}
        </p>

        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {brand.summary}
        </p>

        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-accent-strong">
          {ctaLabel} {brand.name}
          <Icon
            name="arrowRight"
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>

      {/* Full-surface link keeps the whole card clickable without nesting
          interactive elements inside an anchor. */}
      <Link
        href={`/brands/${brand.slug}`}
        className="absolute inset-0 rounded-2xl"
      >
        <span className="sr-only">
          {ctaLabel} {brand.name}
        </span>
      </Link>
    </li>
  );
}
