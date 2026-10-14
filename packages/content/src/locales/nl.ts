import type { Dictionary } from "../i18n";

/**
 * Dutch copy. This is drafted copy based on what the client told us — every
 * claim here is one they can back up. Where something was not confirmed (prices,
 * pickup service, opening hours during holidays) the text stays silent instead
 * of inventing a promise.
 */
export const nl: Dictionary = {
  locale: "nl",
  htmlLang: "nl",

  nav: {
    skipToContent: "Naar de inhoud",
    brands: "Merken",
    maintenance: "Onderhoud",
    about: "Over ons",
    contact: "Contact",
    menu: "Menu",
    closeMenu: "Menu sluiten",
    call: "Bel ons",
  },

  hero: {
    eyebrow: "Purmerend",
    title: "Scooters, brommers en motoren",
    lead: "Bij Dila vind je scooters, brommers en motoren van Vespa, KYMCO, Derbi, Yamaha en Peugeot. Wat we verkopen, onderhouden we ook — in onze eigen werkplaats.",
    primaryCta: "Bekijk onze merken",
    secondaryCta: "Bel de werkplaats",
    brandStripLabel: "Deze merken vind je bij ons",
  },

  brandsSection: {
    eyebrow: "Ons assortiment",
    title: "Merken die we verkopen en onderhouden",
    lead: "Elk merk heeft zijn eigen karakter. Klik op een merk voor meer informatie over het aanbod en wat wij eraan onderhouden.",
    cardCta: "Meer over",
    note: "Actuele modellen, uitvoeringen en prijzen vind je op de website van de fabrikant.",
  },

  maintenance: {
    eyebrow: "Eigen werkplaats",
    title: "Onderhoud en reparatie",
    lead: "Een scooter of motor loopt het beste als hij regelmatig aandacht krijgt. Wij voeren onderhoud uit volgens het onderhoudsschema van de fabrikant en bespreken extra werkzaamheden altijd eerst met je, voordat we beginnen.",
    note: "Voor brommers, snorfietsen en motoren is er in Nederland geen APK-keuring. Regelmatig onderhoud en een veiligheidscontrole blijven wel belangrijk — daar zorgen wij voor.",
    imageCaption: "In onze werkplaats in Purmerend",
    cta: "Vraag een onderhoudsbeurt aan",
  },

  about: {
    eyebrow: "Over Dila",
    title: "Twee zaken naast elkaar in Purmerend",
    paragraphs: [
      "Dila is geen standaard winkel. Op de Maxwellstraat vind je twee zaken direct naast elkaar: Dila Scooters en Brommers en Dila Watersport. De ene kant draait om scooters, brommers en motoren, de andere om boten en jetski's.",
      "Die combinatie is precies waar het bedrijf om draait: alles wat een motor heeft, krijgt bij ons dezelfde aandacht. Onze eigen werkplaats is de spil van beide zaken, of het nu gaat om een onderhoudsbeurt, een reparatie of het zoeken naar een storing die maar blijft terugkomen.",
      "Je bent altijd welkom om binnen te lopen en de voertuigen zelf te bekijken. Heb je een vraag over een model, een onderdeel of iets dat nog niet op deze website staat? Bel of kom langs — dan denken we met je mee.",
    ],
    facts: [
      {
        title: "Eigen werkplaats",
        body: "Onderhoud, reparatie en diagnose doen we in Purmerend, niet via een externe partij.",
      },
      {
        title: "Twee zaken, één adres",
        body: "Scooters en watersport naast elkaar op de Maxwellstraat, met dezelfde mensen en dezelfde aanpak.",
      },
      {
        title: "Ook andere merken",
        body: "Onderhoud en reparatie zijn niet beperkt tot de merken die in onze showroom staan.",
      },
    ],
    galleryTitle: "Een kijkje in de winkel",
    galleryLead: "De showroom en het magazijn op de Maxwellstraat in Purmerend.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Kom langs of bel ons",
    lead: "Je bent van harte welkom in de winkel. Voor een vraag, een afspraak voor onderhoud of een prijsopgave kun je ons ook direct bellen of mailen.",
    addressLabel: "Adres",
    phoneLabel: "Telefoon",
    emailLabel: "E-mail",
    hoursLabel: "Openingstijden",
    closedLabel: "Gesloten",
    mapCta: "Routebeschrijving",
    siblingTitle: "Ook aan de watersport toe?",
    siblingComingSoon: "De website van Dila Watersport volgt binnenkort.",
    formNote: "Een contactformulier volgt zodra de definitieve contactgegevens van de klant binnen zijn.",
  },

  footer: {
    tagline: "Scooters, brommers en motoren in Purmerend — met een eigen werkplaats voor onderhoud en reparatie.",
    exploreTitle: "Op deze pagina",
    contactTitle: "Contact",
    hoursTitle: "Openingstijden",
    rights: "Alle rechten voorbehouden.",
    draftNotice:
      "Conceptversie: bedrijfsgegevens en teksten worden nog met de klant afgestemd.",
  },

  brandPage: {
    back: "Alle merken",
    originLabel: "Herkomst",
    storyTitle: "Over",
    categoriesTitle: "Modellen en categorieën",
    categoriesLead:
      "Een greep uit het aanbod. Vraag ons naar de actuele beschikbaarheid en uitvoeringen — die veranderen regelmatig.",
    modelsTitle: "Modellen",
    officialTitle: "Het actuele aanbod",
    officialBody:
      "Modellen, uitvoeringen en prijzen worden door de fabrikant bijgehouden. Op hun website vind je altijd de meest recente informatie.",
    officialCta: "Bekijk het aanbod",
    whyTitle: "Waarom bij Dila",
    whyPoints: [
      "Persoonlijk advies over het model dat bij jouw rijbewijs en gebruik past",
      "Onderhoud en reparatie in onze eigen werkplaats in Purmerend",
      "Onderdelen en accessoires die we niet op voorraad hebben, bestellen we voor je",
    ],
    ctaTitle: "Vragen over {brand}?",
    ctaBody:
      "Bel ons, of kom langs in de winkel. We vertellen je graag meer over het aanbod en wat we voor jouw voertuig kunnen betekenen.",
    ctaPrimary: "Bel de werkplaats",
    ctaSecondary: "Bekijk alle merken",
  },

  notFound: {
    title: "Deze pagina bestaat niet",
    body: "De link klopt niet of de pagina is verplaatst. Ga terug naar de startpagina om verder te kijken.",
    cta: "Terug naar de startpagina",
  },
};
