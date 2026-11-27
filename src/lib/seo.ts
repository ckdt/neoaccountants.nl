// Titel, beschrijving en JSON-LD. Zie ~/Code/_standards/SEO.md.
import { settings } from "../data/settings";

export function clampDescription(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 160 ? `${clean.slice(0, 157).trimEnd()}…` : clean;
}

/** Wie staat er achter de site. AccountingService is een LocalBusiness-subtype. */
export function entityJsonLd(site: URL, description: string) {
  const a = settings.address;
  return {
    "@context": "https://schema.org",
    "@type": settings.entityType,
    "@id": new URL("/#entity", site).href,
    name: settings.siteName,
    url: site.href,
    description,
    logo: new URL("/apple-touch-icon.png", site).href,
    image: new URL("/og-default.jpg", site).href,
    email: settings.email,
    telephone: settings.telephoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressCountry: a.country,
    },
    identifier: { "@type": "PropertyValue", name: "KvK", value: settings.kvk },
  };
}

export function websiteJsonLd(site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": new URL("/#website", site).href,
    url: site.href,
    name: settings.siteName,
    inLanguage: ["nl-NL", "en-GB"],
    publisher: { "@id": new URL("/#entity", site).href },
  };
}
