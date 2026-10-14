import { scooters } from "@dila/content";

/** Schema.org day names, keyed by the Dutch labels used in the site config. */
const schemaDays: Record<string, string> = {
  Maandag: "Monday",
  Dinsdag: "Tuesday",
  Woensdag: "Wednesday",
  Donderdag: "Thursday",
  Vrijdag: "Friday",
  Zaterdag: "Saturday",
  Zondag: "Sunday",
};

/**
 * Groups the opening hours by identical times so Saturday does not get merged
 * with the weekdays, and skips closed days entirely.
 */
function openingHoursSpecification() {
  const groups = new Map<string, string[]>();

  for (const entry of scooters.hours) {
    if (entry.closed) continue;
    const [opens, closes] = entry.hours.split(" - ");
    if (!opens || !closes) continue;
    const key = `${opens}|${closes}`;
    const day = schemaDays[entry.day];
    if (!day) continue;
    groups.set(key, [...(groups.get(key) ?? []), day]);
  }

  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("|");
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens,
      closes,
    };
  });
}

/**
 * `Store` covers the retail side, `MotorcycleRepair` the workshop. There are no
 * geo coordinates yet — a wrong pin is worse than none, so they are omitted
 * until the client confirms them.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "MotorcycleRepair"],
    name: scooters.name,
    description: scooters.description,
    url: scooters.url,
    image: `${scooters.url}/images/hero/hero-shop.jpg`,
    telephone: scooters.phone,
    email: scooters.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: scooters.address.street,
      postalCode: scooters.address.postalCode,
      addressLocality: scooters.address.city,
      addressCountry: scooters.address.countryCode,
    },
    openingHoursSpecification: openingHoursSpecification(),
    // Deliberately no `department`/`subOrganization` link to Dila Watersport:
    // schema.org would assert a specific company structure we have not been
    // told. Add it once the client confirms how the two shops are registered.
  };
}
