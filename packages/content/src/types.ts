/**
 * Shared content types.
 *
 * All long-form copy lives in typed data files (per brand / per service) instead
 * of being hardcoded in components, so it can later be swapped for a CMS or
 * database without touching the UI. UI labels live in the locale dictionaries
 * (`src/locales/*`) so a second language can be dropped in later.
 */

export type Locale = "nl" | "en";

export type ShopId = "scooters" | "watersport";

/** An image referenced from `/<app>/public`. */
export interface ImageRef {
  src: string;
  alt: string;
  /** Optional focal point, e.g. "50% 30%", for `object-position`. */
  focal?: string;
}

export interface OpeningHours {
  /** Dutch day name, e.g. "Maandag". */
  day: string;
  /** Short label for compact layouts, e.g. "Ma". */
  short: string;
  /** Display value, e.g. "10:00 - 18:00" or "Gesloten". */
  hours: string;
  closed?: boolean;
}

export interface PostalAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

/**
 * Everything that defines one shop. Both shops share the same shape, the same
 * contact details and the same design system — only the theme + copy differ.
 */
export interface SiteInfo {
  id: ShopId;
  /** Full trading name as used in the header + structured data. */
  name: string;
  /** Short name for tight spaces (header on mobile). */
  shortName: string;
  /** The umbrella name both shops share. */
  groupName: string;
  tagline: string;
  /**
   * Short descriptor for the shop, e.g. "Scooters en brommers". The logo
   * artwork already carries the trading name, so this is no longer printed
   * beside it — it is the accessible name of the header logo link.
   */
  logoStrapline: string;
  /** Meta description for the home page. */
  description: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  /** Display phone number. */
  phone: string;
  /** `tel:` href value. */
  phoneHref: string;
  email: string;
  address: PostalAddress;
  /** External map link (opens in Google Maps). */
  mapsUrl: string;
  /** Embeddable map src for an iframe, or null to omit the map. */
  mapEmbedUrl: string | null;
  hours: OpeningHours[];
  socials: SocialLink[];
  /** The other shop, physically next door. */
  sibling: {
    name: string;
    /** `null` while that site does not exist yet — renders as a non-link teaser. */
    url: string | null;
    note: string;
  };
  /** Accent palette key. Resolves to CSS variables in `@dila/ui`. */
  theme: ShopId;
}

export interface BrandCategory {
  name: string;
  description: string;
}

/** A manufacturer carried by a shop. */
export interface Brand {
  slug: string;
  name: string;
  /** Scooter photo shown at the top of the brand card. */
  image: ImageRef;
  /**
   * Full-bleed photo behind the copy at the top of the brand page. Kept apart
   * from `image` because the two are cropped differently: the card is a 16:10
   * thumbnail, the hero is a wide banner, so each needs its own focal point.
   */
  hero: ImageRef;
  /** Photos shown in the brand page mosaic. */
  gallery: ImageRef[];
  /** Logo path inside `public/images/brands`. */
  logoSrc: string;
  /** Intrinsic logo width, used to keep the correct aspect ratio. */
  logoWidth: number;
  /** Intrinsic logo height, used to keep the correct aspect ratio. */
  logoHeight: number;
  /**
   * Rendered height in px. Kept per brand because a square emblem and a wide
   * wordmark at the same height look wildly different in size.
   */
  logoSize: number;
  /** Region of origin, shown as a small detail line. */
  origin: string;
  /** One-liner used on the home page brand cards. */
  summary: string;
  /** Paragraphs for the brand detail page. */
  story: string[];
  categories: BrandCategory[];
  /** Model names worth mentioning. Availability is always "op aanvraag". */
  models: string[];
  officialUrl: string;
  officialLabel: string;
}

/**
 * Icons usable by the "about Dila" facts. A narrow union rather than the UI
 * package's full icon set, because the content package must not depend on
 * `@dila/ui` — the copy files only name the few icons they are allowed to use.
 */
export type FeatureIcon = "wrench" | "pin" | "check" | "shield";

export type ServiceIcon =
  | "wrench"
  | "diagnose"
  | "tyre"
  | "brake"
  | "battery"
  | "carburettor"
  | "exhaust"
  | "snow";

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: ServiceIcon;
}

export interface StoragePackage {
  slug: string;
  name: string;
  description: string;
  price: string;
  /** Bullet points listed inside the package card. */
  includes: string[];
  /** Highlight the recommended package. */
  featured?: boolean;
}
