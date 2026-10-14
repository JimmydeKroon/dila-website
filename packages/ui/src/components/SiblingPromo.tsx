import type { Dictionary, SiteInfo } from "@dila/content";
import { Icon } from "./Icon";

interface SiblingPromoProps {
  site: SiteInfo;
  dict: Dictionary;
}

/**
 * The two shops share a building, so each site points at the other. While the
 * sibling has no website yet this degrades to a non-link teaser instead of a
 * dead link.
 */
export function SiblingPromo({ site, dict }: SiblingPromoProps) {
  const { sibling } = site;

  const body = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-light">
        {dict.contact.siblingTitle}
      </p>
      <h3 className="mt-2 font-display text-xl font-bold text-white">
        {sibling.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">
        {sibling.note}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
        {sibling.url ? (
          <>
            {sibling.name}
            <Icon name="arrowRight" size={16} />
          </>
        ) : (
          dict.contact.siblingComingSoon
        )}
      </span>
    </>
  );

  if (!sibling.url) {
    return (
      <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
        {body}
      </div>
    );
  }

  return (
    <a
      href={sibling.url}
      className="block rounded-2xl border border-white/10 bg-ink-900 p-6 transition-colors hover:border-white/25"
    >
      {body}
    </a>
  );
}
