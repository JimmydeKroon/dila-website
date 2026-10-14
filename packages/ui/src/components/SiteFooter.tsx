import Image from "next/image";
import type { Dictionary, SiteInfo } from "@dila/content";
import type { NavItem } from "./SiteHeader";
import { Container } from "./Container";
import { Icon } from "./Icon";

interface SiteFooterProps {
  site: SiteInfo;
  dict: Dictionary;
  navItems: NavItem[];
  /**
   * Light logo artwork for the dark footer. The client's supplied logo is
   * white-on-black, so it belongs here rather than in the light header.
   */
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  /** Rendered logo height in px. */
  logoSize?: number;
}

/**
 * Opening hours deliberately do NOT appear here: the contact section directly
 * above already renders them, and showing them twice at the foot of the page
 * read as a duplication.
 */
export function SiteFooter({
  site,
  dict,
  navItems,
  logoSrc,
  logoWidth,
  logoHeight,
  logoSize = 88,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 pt-16 pb-8 text-ink-300">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src={logoSrc}
              alt={site.name}
              width={logoWidth}
              height={logoHeight}
              style={{ height: logoSize, width: "auto" }}
              className="object-contain"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label="Footermenu">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {dict.footer.exploreTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {dict.footer.contactTitle}
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex gap-2.5">
                <Icon
                  name="pin"
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-500"
                />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="phone"
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-500"
                />
                <a
                  href={site.phoneHref}
                  className="transition-colors hover:text-white"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="mail"
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-500"
                />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon
                  name="map"
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-500"
                />
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-white"
                >
                  {dict.contact.mapCta}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.draftNotice}</p>
        </div>
      </Container>
    </footer>
  );
}
