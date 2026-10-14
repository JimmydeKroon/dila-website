import { getDictionary } from "@dila/content";
import { Container, PhotoGallery, Section, SectionHeading } from "@dila/ui";
import { shopGallery } from "@/lib/content";

export function ShopGallerySection() {
  const dict = getDictionary("nl");

  return (
    <Section id="winkel" tone="paper" aria-labelledby="gallery-title">
      <Container width="wide">
        <SectionHeading
          id="gallery-title"
          eyebrow={dict.about.eyebrow}
          title={dict.about.galleryTitle}
          lead={dict.about.galleryLead}
          align="center"
          className="mx-auto"
        />
        <PhotoGallery images={shopGallery} dict={dict} className="mt-10" />
      </Container>
    </Section>
  );
}
