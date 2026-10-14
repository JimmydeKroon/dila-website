import type { Locale } from "./types";
import { nl } from "./locales/nl";

/**
 * Every visible string on the site comes from a dictionary, never from a
 * hardcoded literal in a component. That is the whole i18n strategy: shipping
 * English later means adding `src/locales/en.ts` that satisfies `Dictionary`
 * and registering it in `dictionaries` below — no routing or component changes.
 *
 * Longer editorial copy (brand stories, service descriptions) lives with the
 * content data in this package instead, because it is authored per subject
 * rather than per screen.
 */
export interface Dictionary {
  locale: Locale;
  /** Value for `<html lang>`. */
  htmlLang: string;

  nav: {
    skipToContent: string;
    brands: string;
    maintenance: string;
    about: string;
    contact: string;
    menu: string;
    closeMenu: string;
    call: string;
  };

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    brandStripLabel: string;
  };

  brandsSection: {
    eyebrow: string;
    title: string;
    lead: string;
    cardCta: string;
    note: string;
  };

  maintenance: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Explains that brommers and motoren have no APK obligation. */
    note: string;
    imageCaption: string;
    cta: string;
  };

  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    facts: { title: string; body: string }[];
    galleryTitle: string;
    galleryLead: string;
  };

  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    closedLabel: string;
    mapCta: string;
    siblingTitle: string;
    /** Shown while the sibling shop has no website yet. */
    siblingComingSoon: string;
    formNote: string;
  };

  footer: {
    tagline: string;
    exploreTitle: string;
    contactTitle: string;
    hoursTitle: string;
    rights: string;
    /** Short note that the contact details still need client confirmation. */
    draftNotice: string;
  };

  brandPage: {
    back: string;
    originLabel: string;
    storyTitle: string;
    categoriesTitle: string;
    categoriesLead: string;
    modelsTitle: string;
    officialTitle: string;
    officialBody: string;
    officialCta: string;
    whyTitle: string;
    whyPoints: string[];
    ctaTitle: string;
    ctaBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };

  notFound: {
    title: string;
    body: string;
    cta: string;
  };
}

/**
 * Partial on purpose: only the locales that exist are listed. Adding English
 * means creating `src/locales/en.ts` and adding `en` here — the `Dictionary`
 * type then guarantees the translation is complete.
 */
export const dictionaries: Partial<Record<Locale, Dictionary>> = {
  nl,
  // en: TODO — add `src/locales/en.ts` and register it here.
};

export const defaultLocale: Locale = "nl";

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? nl;
}
