import type { Dictionary, SiteInfo } from "@dila/content";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SiblingPromo } from "./SiblingPromo";

interface ContactBlockProps {
  site: SiteInfo;
  dict: Dictionary;
}

export function ContactBlock({ site, dict }: ContactBlockProps) {
  return (
    <Section id="contact" tone="ink" aria-labelledby="contact-title">
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              id="contact-title"
              eyebrow={dict.contact.eyebrow}
              title={dict.contact.title}
              lead={dict.contact.lead}
              onDark
            />

            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                  <Icon name="pin" size={14} />
                  {dict.contact.addressLabel}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                  <br />
                  {site.address.country}
                </dd>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light hover:underline"
                >
                  {dict.contact.mapCta}
                  <Icon name="external" size={14} />
                </a>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                  <Icon name="phone" size={14} />
                  {dict.contact.phoneLabel}
                </dt>
                <dd className="mt-2">
                  <a
                    href={site.phoneHref}
                    className="text-sm font-semibold text-white hover:text-accent-light"
                  >
                    {site.phone}
                  </a>
                </dd>

                <dt className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                  <Icon name="mail" size={14} />
                  {dict.contact.emailLabel}
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm font-semibold break-all text-white hover:text-accent-light"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                <Icon name="clock" size={14} />
                {dict.contact.hoursLabel}
              </p>
              <dl className="mt-4 divide-y divide-white/10">
                {site.hours.map((entry) => (
                  <div
                    key={entry.day}
                    className="flex items-center justify-between gap-4 py-2.5 text-sm"
                  >
                    <dt className="text-ink-300">{entry.day}</dt>
                    <dd
                      className={
                        entry.closed
                          ? "text-ink-500"
                          : "font-semibold text-white"
                      }
                    >
                      {entry.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <SiblingPromo site={site} dict={dict} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
