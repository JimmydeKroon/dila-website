import Image from "next/image";
import { galleryPool, getDictionary, services } from "@dila/content";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
  ServiceCard,
} from "@dila/ui";
import { workshopImage } from "@/lib/content";

/**
 * Four photos of the workshop.
 *
 * The first is the client's own, the only real workbench photo we have. The
 * other three are the same placeholder files the brand pages use — chosen for
 * the ones that show work being done rather than a parked scooter — so replacing
 * them (`assets/gallery/`, then `pnpm images`) improves every page at once.
 */
const workshopPhotos = [
  workshopImage,
  galleryPool[0]!,
  galleryPool[1]!,
  galleryPool[2]!,
];

/**
 * The workshop.
 *
 * Two columns: what the workshop looks like on one side, what we actually do on
 * the other, as a card per service. Three of the four photos are placeholders
 * (see `galleryPool`), so their alt text describes what is in the frame today.
 *
 * There is no call to action and no phone number here any more. The section used
 * to carry a button — briefly two, a button and a "liever bellen?" line, both
 * dialling the same number — which turned the workshop block into a sales pitch.
 * The number now appears exactly once on the site, in the footer.
 *
 * The APK note went with it. As a full-width band under the two columns it read
 * as one more thing the visitor had to scroll past; the claim it makes (no APK
 * obligation for brommers, snorfietsen and motoren) is a factual detail, not the
 * point of the section. `dict.maintenance.note` is still in the dictionary if it
 * is ever wanted back somewhere smaller.
 */
export function MaintenanceSection() {
  const dict = getDictionary("nl");

  return (
    <Section id="onderhoud" tone="surface" aria-labelledby="maintenance-title">
      <Container width="wide">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHeading
            id="maintenance-title"
            eyebrow={dict.maintenance.eyebrow}
            title={dict.maintenance.title}
            lead={dict.maintenance.lead}
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Photos. A plain 2×2 block rather than the lightbox gallery: these
              are context for the copy beside them, not a set to browse. */}
          <Reveal>
            <ul
              className="grid grid-cols-2 gap-3 sm:gap-4"
              aria-label={dict.maintenance.imageCaption}
            >
              {workshopPhotos.map((photo) => (
                <li
                  key={photo.src}
                  className="relative overflow-hidden rounded-2xl bg-surface-alt"
                >
                  <span className="block aspect-4/3 w-full">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1400}
                      height={1050}
                      sizes="(min-width: 1024px) 24vw, 45vw"
                      className="h-full w-full object-cover"
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-500">
              {dict.maintenance.imageCaption}
            </p>
          </Reveal>

          {/* What we do, one card per service. */}
          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
