import type { SiteInfo } from "./types";

/* -------------------------------------------------------------------------- */
/*  PLACEHOLDERS TO CONFIRM WITH THE CLIENT                                    */
/* -------------------------------------------------------------------------- */
/**
 * The client owns several domains but the login details were still being
 * collected, so the canonical domain is a placeholder until we know which
 * domain the scooter shop will actually run on.
 */
const SCOOTERS_URL = "https://dila.nl";
/** Watersport domain — not known yet, placeholder only. */
const WATERSPORT_URL = "https://watersport.dila.nl";

/**
 * TODO(client): no e-mail address was supplied. `info@dila.nl` is a guess based
 * on the domain they own — confirm before this goes live, or set it to `null`
 * in the footer if they would rather only be reachable by phone.
 */
const EMAIL = "info@dila.nl";

/* -------------------------------------------------------------------------- */
/*  Shared business details (identical for both shops — same building)          */
/* -------------------------------------------------------------------------- */

const ADDRESS = {
  street: "Maxwellstraat 5",
  postalCode: "1446 TA",
  city: "Purmerend",
  country: "Nederland",
  countryCode: "NL",
} as const;

const HOURS = [
  { day: "Maandag", short: "Ma", hours: "10:00 - 18:00" },
  { day: "Dinsdag", short: "Di", hours: "10:00 - 18:00" },
  { day: "Woensdag", short: "Wo", hours: "10:00 - 18:00" },
  { day: "Donderdag", short: "Do", hours: "10:00 - 18:00" },
  { day: "Vrijdag", short: "Vr", hours: "10:00 - 18:00" },
  { day: "Zaterdag", short: "Za", hours: "10:00 - 17:00" },
  { day: "Zondag", short: "Zo", hours: "Gesloten", closed: true },
];

const fullAddress = `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.city}`;

/**
 * No Google Maps iframe: embedding it would drop third-party cookies without
 * consent. Instead every map block is a styled link out to Google Maps, which
 * keeps the site free of a cookie banner. Drop a URL in `mapEmbedUrl` if the
 * client later wants a real embedded map (and accepts a consent notice).
 */
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

/* -------------------------------------------------------------------------- */
/*  Shops                                                                      */
/* -------------------------------------------------------------------------- */

export const scooters: SiteInfo = {
  id: "scooters",
  name: "Dila Scooters en Brommers",
  shortName: "Dila Scooters",
  groupName: "Dila",
  tagline: "Scooters, brommers en motoren",
  logoStrapline: "Scooters en brommers",
  description:
    "Dila Scooters en Brommers in Purmerend: scooters, brommers en motoren van Vespa, KYMCO, Derbi, Yamaha en Peugeot. Eigen werkplaats voor onderhoud en reparatie.",
  url: SCOOTERS_URL,
  phone: "0299 476 313",
  phoneHref: "tel:+31299476313",
  email: EMAIL,
  address: { ...ADDRESS },
  mapsUrl: mapsLink,
  mapEmbedUrl: null,
  hours: HOURS,
  socials: [],
  sibling: {
    name: "Dila Watersport",
    // Set once the watersport site is live; until then it renders as a teaser.
    url: null,
    note: "Direct naast onze scooterwinkel: boten, jetski's en watersportonderhoud.",
  },
  theme: "scooters",
};

export const watersport: SiteInfo = {
  id: "watersport",
  name: "Dila Watersport",
  shortName: "Dila Watersport",
  groupName: "Dila",
  tagline: "Boten, jetski's en watersportonderhoud",
  logoStrapline: "Watersport",
  description:
    "Dila Watersport in Purmerend: boten, jetski's en watersportartikelen, met eigen werkplaats voor onderhoud, reparatie en winterstalling.",
  url: WATERSPORT_URL,
  phone: "0299 476 313",
  phoneHref: "tel:+31299476313",
  email: EMAIL,
  address: { ...ADDRESS },
  mapsUrl: mapsLink,
  mapEmbedUrl: null,
  hours: HOURS,
  socials: [],
  sibling: {
    name: "Dila Scooters en Brommers",
    url: SCOOTERS_URL,
    note: "Direct naast onze watersportwinkel: scooters, brommers en motoren.",
  },
  theme: "watersport",
};

export const sites = { scooters, watersport } as const;

/** The address as a single line, reused across the site. */
export const addressLine = fullAddress;
