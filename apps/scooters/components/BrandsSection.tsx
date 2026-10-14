import { brands, getDictionary } from "@dila/content";
import {
  BrandCard,
  Container,
  Section,
  SectionHeading,
} from "@dila/ui";

export function BrandsSection() {
  const dict = getDictionary("nl");

  return (
    <Section id="merken" tone="paper" aria-labelledby="brands-title">
      <Container width="wide">
        <SectionHeading
          id="brands-title"
          eyebrow={dict.brandsSection.eyebrow}
          title={dict.brandsSection.title}
          lead={dict.brandsSection.lead}
          align="center"
          className="mx-auto"
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.slug}
              brand={brand}
              ctaLabel={dict.brandsSection.cardCta}
            />
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-ink-500">
          {dict.brandsSection.note}
        </p>
      </Container>
    </Section>
  );
}
