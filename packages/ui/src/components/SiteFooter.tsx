import Image from "next/image";
import type { Dictionary, SiteInfo } from "@dila/content";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { SiblingPromo } from "./SiblingPromo";

interface SiteFooterProps {
  site: SiteInfo;
  dict: Dictionary;
  /**
   * The client's logo. Transparent, full colour, so it needs no chip on the
   * dark band.
   */
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  /** Rendered logo height in px. */
  logoSize?: number;
}

/**
 * Contact and footer in one block.
 *
 * They used to be two stacked dark sections that repeated the same address,
 * e-mail address and route link a few hundred pixels apart, which read as a
 * mistake. This is the single dark band at the foot of every page: contact
 * details first, then the logo with the shop's tagline, then the legal line.
 *
 * It carries `id="contact"` because the "Contact" item in the menu points at it,
 * and it is part of the layout rather than the home page, so `/#contact` also
 * resolves from a brand detail page. Opening hours appear exactly once, here.
 *
 * There is no second menu down here. It repeated the header a thousand pixels
 * below itself, so the logo and the tagline simply sit under the address now and
 * the band needs one divider instead of two.
 *
 * The phone number appears here — and, since the maintenance section dropped its
 * button, nowhere else on the site.
 */
export function SiteFooter({
  site,
  dict,
  logoSrc,
  logoWidth,
  logoHeight,
  logoSize = 72,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ink-950 pt-16 pb-8 text-ink-300"
    >
      <Container width="wide">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
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

              <div className="flex flex-col gap-6">
                <div>
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
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
                </div>
              </div>
            </dl>

            {/* The logo and the tagline sign the contact block off. They used to
                sit in a second block below a divider, next to a repetition of
                the page menu. */}
            <div className="mt-10 flex items-start gap-5">
              <Image
                src={logoSrc}
                alt={site.name}
                width={logoWidth}
                height={logoHeight}
                style={{ height: logoSize, width: "auto" }}
                className="shrink-0 object-contain"
              />
              <p className="max-w-sm text-sm leading-relaxed text-ink-400">
                {dict.footer.tagline}
              </p>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-6">
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
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
