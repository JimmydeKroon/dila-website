import type { Service } from "./types";

/**
 * Maintenance services offered by the scooter/motor workshop.
 *
 * Deliberately no prices and no pickup service: neither was confirmed by the
 * client, so the site does not promise either. Every service is described in
 * terms of the work, and the copy flags that the exact contents of a service
 * depend on the manufacturer's schedule for that specific model.
 */
export const services: Service[] = [
  {
    slug: "onderhoudsbeurt",
    title: "Onderhoudsbeurt",
    description:
      "Periodiek onderhoud volgens het onderhoudsschema van de fabrikant, afgestemd op jouw model en kilometerstand.",
    icon: "wrench",
  },
  {
    slug: "reparatie-en-diagnose",
    title: "Reparatie en diagnose",
    description:
      "Startproblemen, een vreemd geluid of een storingslampje? Wij zoeken de oorzaak uit en overleggen eerst over de kosten.",
    icon: "diagnose",
  },
  {
    slug: "banden-en-remmen",
    title: "Banden en remmen",
    description:
      "Banden en remblokken controleren of vervangen, remmen afstellen en remvloeistof verversen.",
    icon: "tyre",
  },
  {
    slug: "accu-en-elektrisch",
    title: "Accu en elektrisch",
    description:
      "Accu doormeten of vervangen, verlichting nakijken en storingen in de bedrading opsporen.",
    icon: "battery",
  },
  {
    slug: "carburateur-en-afstelling",
    title: "Carburateur en afstelling",
    description:
      "Carburateur reinigen en afstellen, en bij injectie of elektrisch de elektronica uitlezen en controleren.",
    icon: "carburettor",
  },
  {
    slug: "uitlaat",
    title: "Uitlaat",
    description:
      "Een rammelende of doorgeroeste uitlaat repareren of vervangen, zodat je weer stil en netjes rijdt.",
    icon: "exhaust",
  },
];
