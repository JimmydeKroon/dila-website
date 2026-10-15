import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, getBrand, getDictionary, scooters } from "@dila/content";
import {
  Container,
  Hero,
  Icon,
  PhotoGallery,
  Reveal,
  Section,
  SectionHeading,
} from "@dila/ui";

const dict = getDictionary("nl");

type PageProps = { params: Promise<{ slug: string }> };

/** Pre-render one page per brand at build time. */
export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: dict.notFound.title };

  return {
    title: `${brand.name} — ${brand.origin}`,
    description: brand.summary,
    alternates: { canonical: `/brands/${brand.slug}` },
    openGraph: {
      type: "article",
      title: `${brand.name} bij ${scooters.name}`,
      description: brand.summary,
      url: `/brands/${brand.slug}`,
      images: [{ url: brand.hero.src, alt: brand.hero.alt }],
    },
  };
}

/**
 * Three parts, deliberately kept short: a photo hero, one text section and a
 * photo mosaic. The link to the manufacturer's own site lives inside the story
 * section rather than in a section of its own — the page is meant to be read top
 * to bottom, not scanned through five stacked blocks.
 */
export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  return (
    <>
      {/* Hero -------------------------------------------------------------- */}
      <Hero
        image={brand.hero}
        size="page"
        top={
          <div className="flex flex-col gap-7">
            <Link
              href="/#merken"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <Icon name="arrowLeft" size={16} />
              {dict.brandPage.back}
            </Link>

            {/* The manufacturer marks are dark artwork, so they need a light
                chip — the same treatment as the brand strip on the home page. */}
            <span className="flex h-16 w-fit min-w-[6rem] items-center justify-center rounded-xl bg-white px-5 shadow-sm shadow-ink-950/25">
              <Image
                src={brand.logoSrc}
                alt={brand.name}
                width={brand.logoWidth}
                height={brand.logoHeight}
                style={{ height: brand.logoSize, width: "auto" }}
                className="max-w-[180px] object-contain"
              />
            </span>
          </div>
        }
        eyebrow={`${dict.brandPage.originLabel}: ${brand.origin}`}
        title={brand.name}
        lead={brand.summary}
        actions={
          <>
            <a
              href={brand.officialUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
            >
              {dict.brandPage.officialCta}
              <Icon name="external" size={18} />
            </a>
            <a
              href="/#onderhoud"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              {dict.maintenance.title}
            </a>
          </>
        }
      />

      {/* Story ------------------------------------------------------------- */}
      <Section tone="paper" aria-labelledby="brand-story-title">
        <Container width="wide">
          <Reveal className="max-w-3xl">
            <SectionHeading
              id="brand-story-title"
              eyebrow={brand.origin}
              title={`${dict.brandPage.storyTitle} ${brand.name}`}
            />
            <div className="mt-6 flex flex-col gap-5">
              {brand.story.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-base leading-relaxed text-ink-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <a
              href={brand.officialUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong transition-colors hover:text-accent"
            >
              {dict.brandPage.officialTitle}
              <Icon name="external" size={16} />
            </a>
          </Reveal>
        </Container>
      </Section>

      {/* Photos ------------------------------------------------------------ */}
      <Section tone="surface" aria-labelledby="brand-gallery-title">
        <Container width="wide">
          <Reveal className="mx-auto max-w-2xl">
            <SectionHeading
              id="brand-gallery-title"
              eyebrow={brand.name}
              title={dict.brandPage.galleryTitle}
              lead={dict.brandPage.galleryLead}
              align="center"
            />
          </Reveal>

          <Reveal className="mt-10">
            <PhotoGallery
              images={brand.gallery}
              dict={dict}
              layout="mosaic"
              ariaLabel={`${dict.brandPage.galleryTitle} — ${brand.name}`}
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
