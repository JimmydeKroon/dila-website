import Image from "next/image";
import { getDictionary, scooters, services } from "@dila/content";
import {
  Container,
  Icon,
  Section,
  SectionHeading,
  ServiceCard,
} from "@dila/ui";
import { workshopImage } from "@/lib/content";

/**
 * Two clear rows rather than one mixed column stack:
 *   1. photo on the left, heading / APK note / CTA on the right, vertically
 *      centred so nothing floats out of alignment;
 *   2. the services as a full-width three-column grid (6 cards = 2 even rows).
 */
export function MaintenanceSection() {
  const dict = getDictionary("nl");

  return (
    <Section id="onderhoud" tone="surface" aria-labelledby="maintenance-title">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <figure className="overflow-hidden rounded-2xl bg-surface-alt">
            <span className="block aspect-4/3 w-full">
              <Image
                src={workshopImage.src}
                alt={workshopImage.alt}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="h-full w-full object-cover"
              />
            </span>
            <figcaption className="bg-paper px-5 py-3 text-xs text-ink-500">
              {dict.maintenance.imageCaption}
            </figcaption>
          </figure>

          <div>
            <SectionHeading
              id="maintenance-title"
              eyebrow={dict.maintenance.eyebrow}
              title={dict.maintenance.title}
              lead={dict.maintenance.lead}
            />

            <p className="mt-7 flex gap-3 rounded-2xl border border-line bg-paper p-5 text-sm leading-relaxed text-ink-600">
              <Icon
                name="shield"
                size={18}
                className="mt-0.5 shrink-0 text-accent-strong"
              />
              {dict.maintenance.note}
            </p>

            <a
              href={scooters.phoneHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
            >
              <Icon name="phone" size={18} />
              {dict.maintenance.cta}
            </a>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
