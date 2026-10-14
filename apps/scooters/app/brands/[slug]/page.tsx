import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, getBrand, getDictionary, scooters } from "@dila/content";
import {
  BrandStrip,
  CallToAction,
  Container,
  Icon,
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
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const otherBrands = brands.filter((entry) => entry.slug !== brand.slug);

  return (
    <>
      {/* Masthead ---------------------------------------------------------- */}
      <section className="border-b border-line bg-surface pt-10 pb-14 sm:pt-12 sm:pb-16">
        <Container width="wide">
          <Link
            href="/#merken"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-accent-strong"
          >
            <Icon name="arrowLeft" size={16} />
            {dict.brandPage.back}
          </Link>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex min-h-[56px] items-center">
                <Image
                  src={brand.logoSrc}
                  alt={brand.name}
                  width={brand.logoWidth}
                  height={brand.logoHeight}
                  style={{ height: brand.logoSize * 1.4, width: "auto" }}
                  className="max-w-[220px] object-contain"
                />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
                {dict.brandPage.originLabel}: {brand.origin}
              </p>

              <h1 className="mt-3 font-display text-4xl leading-[1.08] font-black tracking-tight text-ink-900 text-balance sm:text-5xl">
                {brand.name}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
                {brand.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={brand.officialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-300"
                >
                  {brand.officialLabel}
                  <Icon name="external" size={16} />
                </a>
                <a
                  href={scooters.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
                >
                  <Icon name="phone" size={16} />
                  {scooters.phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Story ------------------------------------------------------------- */}
      <Section tone="paper" aria-labelledby="brand-story-title">
        <Container width="wide">
          <SectionHeading
            id="brand-story-title"
            eyebrow={brand.origin}
            title={`${dict.brandPage.storyTitle} ${brand.name}`}
          />
          <div className="mt-6 grid gap-5 lg:max-w-3xl">
            {brand.story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-ink-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* Categories -------------------------------------------------------- */}
      <Section tone="surface" aria-labelledby="brand-categories-title">
        <Container width="wide">
          <SectionHeading
            id="brand-categories-title"
            eyebrow={brand.name}
            title={dict.brandPage.categoriesTitle}
            lead={dict.brandPage.categoriesLead}
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.categories.map((category) => (
              <li
                key={category.name}
                className="rounded-2xl border border-line bg-paper p-6"
              >
                <h3 className="font-display text-base font-bold text-ink-900">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {category.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Models + official site ------------------------------------------- */}
      <Section tone="paper" aria-labelledby="brand-models-title">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="brand-models-title"
                eyebrow={brand.name}
                title={dict.brandPage.modelsTitle}
              />
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {brand.models.map((model) => (
                  <li
                    key={model}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-700"
                  >
                    {model}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-7">
              <h2 className="font-display text-xl font-bold text-ink-900">
                {dict.brandPage.officialTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {dict.brandPage.officialBody}
              </p>
              <a
                href={brand.officialUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-accent hover:text-accent-strong"
              >
                {dict.brandPage.officialCta} — {brand.officialLabel}
                <Icon name="external" size={16} />
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why us ------------------------------------------------------------ */}
      <Section tone="surface" aria-labelledby="brand-why-title">
        <Container width="wide">
          <SectionHeading
            id="brand-why-title"
            eyebrow={dict.maintenance.eyebrow}
            title={dict.brandPage.whyTitle}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {dict.brandPage.whyPoints.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-2xl border border-line bg-paper p-5"
              >
                <Icon
                  name="check"
                  size={20}
                  className="mt-0.5 shrink-0 text-accent-strong"
                />
                <span className="text-sm leading-relaxed text-ink-600">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CallToAction
        title={dict.brandPage.ctaTitle.replace("{brand}", brand.name)}
        body={dict.brandPage.ctaBody}
        primary={{ label: scooters.phone, href: scooters.phoneHref }}
        secondary={{ label: dict.brandPage.ctaSecondary, href: "/#merken" }}
        footnote={`${scooters.address.street}, ${scooters.address.postalCode} ${scooters.address.city}`}
      />

      {/* Other brands ------------------------------------------------------ */}
      <Section tone="paper" spacing="compact" aria-labelledby="brand-others-title">
        <Container width="wide">
          <h2
            id="brand-others-title"
            className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-500"
          >
            {dict.hero.brandStripLabel}
          </h2>
          <BrandStrip brands={otherBrands} className="mt-6" />
        </Container>
      </Section>
    </>
  );
}
