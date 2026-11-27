/*
  Site-instellingen die niet per taal verschillen. Vertaalbare tekst staat in src/content/.
  Bij de overstap naar Sanity wordt dit het singleton `siteSettings` (zie ~/Code/_standards/SANITY.md §1).
*/

export type Ink = "dark" | "light";

export const settings = {
  siteName: "Neo",
  entityType: "AccountingService",
  email: "info@neoaccountants.nl",
  telephone: "010-3070183",
  telephoneHref: "tel:+31103070183",
  kvk: "81006497",
  address: {
    street: "K.P. van der Mandelelaan 9",
    postalCode: "3062 MB",
    city: "Rotterdam",
    country: "NL",
  },
  /** Dienstsecties in volgorde. `key` koppelt aan de markdown in src/content/services/<taal>/. */
  services: [
    // ink = tekstkleur op de achtergrond. Gecontroleerd op WCAG AA (≥ 4.5:1).
    { key: "administratie", color: "oklch(76.7% 0.083 204.4)", ink: "dark" }, // #6ec3cc
    { key: "fiscaal", color: "oklch(52.4% 0.048 258.3)", ink: "light" }, // #596b86
    { key: "accountancy", color: "oklch(48.9% 0.079 28.8)", ink: "light" }, // #874e46
    { key: "advies", color: "oklch(77.7% 0.108 38.6)", ink: "dark" }, // #f29e83
    { key: "consulting", color: "oklch(76.5% 0.046 147.1)", ink: "dark" }, // #a0bba2
  ] satisfies { key: string; color: string; ink: Ink }[],
  /** Bestanden in public/documenten/. */
  documents: {
    "algemene-voorwaarden": "/documenten/algemene-voorwaarden.pdf",
    disclaimer: "/documenten/disclaimer.pdf",
    databescherming: "/documenten/databescherming.pdf",
    klachtenregeling: "/documenten/klachtenregeling.pdf",
  } as Record<string, string>,
  /** Mogen AI-modellen de content gebruiken voor training? Zie ~/Code/_standards/SEO.md §5. */
  allowAiTraining: true,
  noindex: false,
};
