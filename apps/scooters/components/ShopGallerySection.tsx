import { getDictionary } from "@dila/content";
import {
  Container,
  PhotoGallery,
  Reveal,
  Section,
  SectionHeading,
} from "@dila/ui";
import { shopGallery } from "@/lib/content";

export function ShopGallerySection() {
  const dict = getDictionary("nl");

  return (
    <Section id="winkel" tone="paper" aria-labelledby="gallery-title">
      <Container width="wide">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHeading
            id="gallery-title"
            eyebrow={dict.about.eyebrow}
            title={dict.about.galleryTitle}
            lead={dict.about.galleryLead}
            align="center"
          />
        </Reveal>

        {/* The gallery is a client component with its own lightbox, so the whole
            block animates as one rather than trying to stagger its tiles. */}
        <Reveal className="mt-10">
          <PhotoGallery images={shopGallery} dict={dict} />
        </Reveal>
      </Container>
    </Section>
  );
}
