import type { Brand } from "./types";

/**
 * Brands carried by Dila Scooters en Brommers.
 *
 * The scooter shop's full brand list was not supplied — the five below are the
 * ones the client named. Adding another brand is a matter of appending an entry
 * here plus dropping a logo into `apps/*​/public/images/brands/`.
 *
 * Availability, specifications and prices change constantly, so every brand page
 * links out to the manufacturer's own site as the source of truth.
 */
export const brands: Brand[] = [
  {
    slug: "vespa",
    name: "Vespa",
    image: {
      src: "/images/brands/vespa-scooter.jpg",
      alt: "Vespa scooter in de showroom van Dila",
    },
    logoSrc: "/images/brands/vespa.svg",
    logoWidth: 450,
    logoHeight: 155,
    logoSize: 34,
    origin: "Italië",
    summary:
      "Het Italiaanse icoon: een stalen carrosserie, tijdloos design en een rijkarakter dat je nergens anders vindt.",
    story: [
      "Vespa is sinds 1946 het gezicht van de Italiaanse scooter. De herkenbare stalen carrosserie en het ronde achterwerk maken een Vespa direct herkenbaar — en dat ontwerp is in al die jaren nooit uit de mode geraakt.",
      "In onze showroom zie je meerdere modellen naast elkaar, van compacte stads scooters tot krachtigere motorscooters. Twijfel je tussen een 50 cc bromscooter en een 125 cc motorscooter? We vertellen je eerlijk wat past bij jouw rijbewijs en hoe je de scooter gaat gebruiken.",
      "Onderhoud en reparatie doen wij in onze eigen werkplaats, volgens het onderhoudsschema van de fabrikant. Onderdelen die we niet op voorraad hebben, bestellen we voor je.",
    ],
    categories: [
      {
        name: "Bromscooters en snorfietsen (50 cc)",
        description:
          "Rijden met een AM-rijbewijs en een geel kenteken. Compact, zuinig en gemaakt voor de stad.",
      },
      {
        name: "Motorscooters (125 cc en zwaarder)",
        description:
          "Met een A1-rijbewijs of zwaarder rijd je comfortabeler en houd je buiten de bebouwde kom goed bij.",
      },
    ],
    models: ["Primavera", "Sprint", "GTS", "LX"],
    officialUrl: "https://www.vespa.com/nl_NL/",
    officialLabel: "vespa.com",
  },
  {
    slug: "kymco",
    name: "KYMCO",
    image: {
      src: "/images/brands/kymco-scooter.jpg",
      alt: "KYMCO scooter bij Dila in Purmerend",
    },
    logoSrc: "/images/brands/kymco.svg",
    logoWidth: 184,
    logoHeight: 100,
    logoSize: 38,
    origin: "Taiwan",
    summary:
      "Praktische scooters met een uitstekende prijs-kwaliteitverhouding — van zuinige stads scooter tot luxe motorscooter.",
    story: [
      "KYMCO is een van de grootste scooterfabrikanten ter wereld en bouwt al decennia betrouwbare, nuchtere scooters. Je krijgt veel scooter voor je geld, zonder dat het ten koste gaat van de kwaliteit.",
      "Het assortiment loopt van lichte 50 cc bromscooters voor woon-werkverkeer tot comfortabele motorscooters met veel opbergruimte. Juist die breedte maakt KYMCO interessant: er is vrijwel altijd een model dat bij je past.",
      "Wij verkopen en onderhouden KYMCO in Purmerend. Voor een onderhoudsbeurt, een nieuwe accu of een set banden ben je bij onze eigen werkplaats aan het juiste adres.",
    ],
    categories: [
      {
        name: "Broms- en snorscooters (50 cc)",
        description:
          "Betaalbaar, zuinig en makkelijk te parkeren. Geschikt voor een AM-rijbewijs.",
      },
      {
        name: "Motorscooters (125 cc en zwaarder)",
        description:
          "Ruime scooters met meer vermogen, comfortabel voor langere ritten en woon-werkverkeer.",
      },
    ],
    models: ["Agility", "Like", "Super 8", "Xciting", "Downtown"],
    officialUrl: "https://kymco.nl/",
    officialLabel: "kymco.nl",
  },
  {
    slug: "derbi",
    name: "Derbi",
    image: {
      src: "/images/brands/derbi-scooter.jpg",
      alt: "Derbi brommer bij Dila in Purmerend",
    },
    logoSrc: "/images/brands/derbi.svg",
    logoWidth: 142,
    logoHeight: 44,
    logoSize: 28,
    origin: "Spanje",
    summary:
      "Sportief erfgoed uit Barcelona: brommers en lichte motoren voor wie iets meer karakter zoekt.",
    story: [
      "Derbi begon in 1922 in Barcelona en bouwde een reputatie op in de racerij. De slogan 'Race bred' is geen marketingpraatje: de techniek uit de wegracerij sijpelt door naar de straatmodellen.",
      "Dat merk je aan de afwerking en de rijeigenschappen. Een Derbi voelt wat sportiever en directer aan dan een gemiddelde brommer, zonder onpraktisch te worden.",
      "Bij Dila onderhouden en repareren wij Derbi-brommers en schakelmodellen. Voor onderdelen, afstellingen en reparaties kun je bij onze werkplaats terecht.",
    ],
    categories: [
      {
        name: "Brommers en schakelbrommers",
        description:
          "Van sportief vormgegeven 50 cc modellen tot schakelbrommers, geschikt voor een AM-rijbewijs.",
      },
      {
        name: "Lichte motoren",
        description:
          "Compacte motoren voor dagelijks gebruik, met de sportieve insteek waar Derbi om bekendstaat.",
      },
    ],
    models: ["Senda", "Variant"],
    officialUrl: "https://www.derbi.com/",
    officialLabel: "derbi.com",
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    image: {
      src: "/images/brands/yamaha-scooter.jpg",
      alt: "Yamaha scooter bij Dila in Purmerend",
    },
    logoSrc: "/images/brands/yamaha.svg",
    logoWidth: 524,
    logoHeight: 114,
    logoSize: 26,
    origin: "Japan",
    summary:
      "Van zuinige stads scooter tot sportieve motor: Yamaha staat al decennia voor betrouwbare techniek.",
    story: [
      "Yamaha bouwt al sinds de jaren vijftig gemotoriseerde tweewielers en is inmiddels een van de meest vertrouwde namen in de branche. Die ervaring zie je terug in de afwerking en in de betrouwbaarheid van de motoren.",
      "Het aanbod is breed: zuinige 50 cc bromscooters voor de stad, comfortabele motorscooters voor dagelijks woon-werkverkeer en sportievere motoren voor wie meer wil.",
      "Yamaha is een van de merken waarop onze werkplaats is ingericht. Voor onderhoud, diagnose en reparatie — aan scooter én motor — kun je bij ons terecht, volgens het onderhoudsschema van de fabrikant.",
    ],
    categories: [
      {
        name: "Broms- en snorscooters (50 cc)",
        description:
          "Lichte, zuinige scooters voor in de stad, met een AM-rijbewijs te rijden.",
      },
      {
        name: "Motorscooters (125 cc en zwaarder)",
        description:
          "Comfortabele scooters met genoeg vermogen voor langere afstanden en woon-werkverkeer.",
      },
      {
        name: "Motoren",
        description:
          "Naast scooters voert Dila een selectie Yamaha-motoren voor wie op zoek is naar meer vermogen.",
      },
    ],
    models: ["Aerox", "D'elight", "NMAX", "XMAX", "TMAX"],
    officialUrl: "https://www.yamaha-motor.eu/nl/nl/",
    officialLabel: "yamaha-motor.eu",
  },
  {
    slug: "peugeot",
    name: "Peugeot",
    image: {
      src: "/images/brands/peugeot-scooter.jpg",
      alt: "Peugeot scooter bij Dila in Purmerend",
    },
    logoSrc: "/images/brands/peugeot.svg",
    logoWidth: 283,
    logoHeight: 200,
    logoSize: 46,
    origin: "Frankrijk",
    summary:
      "Frans design met een lange scooterhistorie — denk aan de iconische Django en de sportieve Speedfight.",
    story: [
      "Peugeot bouwt al meer dan een eeuw gemotoriseerde voertuigen en hoort daarmee bij de oudste namen in de branche. In scooters vertaalt die ervaring zich in modellen met een duidelijk eigen karakter.",
      "Van de klassiek gelijnde Django tot de sportieve Speedfight en de driedelige Metropolis: Peugeot durft buiten de gebaande paden te denken. De afwerking en het rijcomfort zijn daarbij duidelijk Frans.",
      "Wij verkopen en onderhouden Peugeot scooters in Purmerend. Voor een onderhoudsbeurt, een reparatie of het vervangen van slijtagedelen kun je bij onze werkplaats terecht.",
    ],
    categories: [
      {
        name: "Broms- en snorscooters (50 cc)",
        description:
          "Nostalgische en sportieve 50 cc modellen met een AM-rijbewijs te rijden.",
      },
      {
        name: "Motorscooters (125 cc en zwaarder)",
        description:
          "Ruime en krachtigere scooters, waaronder modellen met een laag instapmodel en driedelige uitvoering.",
      },
    ],
    models: ["Kisbee", "Django", "Tweet", "Metropolis", "Speedfight"],
    officialUrl: "https://www.peugeot-motocycles.nl/",
    officialLabel: "peugeot-motocycles.nl",
  },
];

/** Fast lookup by slug, used by `generateStaticParams` and the detail page. */
export const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

export function getBrand(slug: string): Brand | undefined {
  return brandBySlug.get(slug);
}
