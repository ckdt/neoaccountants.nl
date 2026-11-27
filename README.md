# www.neoaccounting.nl

> Tweetalige one-pager (NL/EN) voor Neo Accountants & Adviseurs in Rotterdam: diensten en contact. Overgezet van WordPress (Strato) naar een statische Astro-site op Netlify, content in markdown.

| | |
|---|---|
| **Klant** | Neo Accountants & Adviseurs (TODO contactpersoon) |
| **Bedrijf** | CKDT |
| **Status** | Live (sinds 2026-11-27) |
| **SLA** | TODO |
| **Live** | https://www.neoaccounting.nl · alle andere Neo-domeinen sturen hierheen (zie *Domein en DNS*) · oud: http://58606140.swh.strato-hosting.eu/site/ |
| **Netlify** | team ckdt, site [`neoaccountants`](https://app.netlify.com/projects/neoaccountants) · staging: https://staging--neoaccountants.netlify.app |
| **CMS** | Geen (markdown in `src/content/`). Later eventueel Sanity, zie hieronder |
| **Repo** | [github.com/ckdt/neoaccountants.nl](https://github.com/ckdt/neoaccountants.nl) (public) |
| **Notion** | TODO |

## Stack

- Astro 7 · Node 22 (`.nvmrc`) · static output
- Styling: Sass voor de Utopia-schaal (`utopia-core-scss`), verder plain CSS met cascade layers, OKLCH-tokens, `light-dark()`
- Fonts: Poppins (200, 700), Karla (400, 400 italic), Space Mono (400) via Fontsource, lokaal gehost
- Animatie: geen GSAP. Scrollgedrag (ankerklik, actieve sectie, kleur van logo/menu, reveal) in `src/lib/sections.ts`, scroll-snap op desktop, paginawissel via `<ClientRouter />`
- Consent: volgens `_standards/CONSENT.md` · Statistiek: geen (oude Universal Analytics is verwijderd) · Hosting: Netlify

## Lokaal starten

```bash
nvm use
npm install
npm run dev            # http://localhost:4321
```

Overige scripts: `npm run build`, `npm run preview`, `npm run check`. OG-beeld opnieuw maken: `node scripts/og-image.mjs`.

### Environment-variabelen

Geen. (Komen erbij bij de overstap naar Sanity.)

## Structuur

```
src/
  content/
    home/{nl,en}.md            Tagline, meta-titel/-beschrijving, intro (body)
    services/{nl,en}/<anker>.md  Eén dienst per bestand; bestandsnaam = anker (#fiscale-zaken)
    contact/{nl,en}.md         Labels en documentenlijst
  content.config.ts            Schema's (Zod)
  data/settings.ts             Taalonafhankelijk: adres, telefoon, KvK, dienstkleuren en volgorde, documenten
  i18n/ui.ts                   Interfaceteksten per taal
  lib/content.ts               Datalaag (enige plek die content leest)
  lib/seo.ts, sections.ts      JSON-LD; scrollgedrag
  components/                  HomePage, Section, SiteNav, Logo, SiteMeta, ThemeScript, PageProgress
  layouts/BaseLayout.astro
  pages/                       / (nl), /en/, 404, robots.txt, llms.txt
  styles/                      tokens.scss (Utopia), theme.css, reset, base, layout (breakout-grid)
public/documenten/             Algemene voorwaarden, disclaimer, databescherming, klachtenregeling (PDF)
```

## Content en CMS

- **Tekst aanpassen:** het `.md`-bestand in `src/content/` van de juiste taal.
- **Nieuwe dienst:** een bestand per taal in `src/content/services/nl/` en `en/` met dezelfde `key`, plus een regel in `settings.services` (kleur, tekstkleur, volgorde).
- **Kleur van een dienst:** `settings.services[].color` (OKLCH) en `ink` (`dark`/`light`): controleer het contrast (≥ 4.5:1).
- **Sanity later:** het model past op per-veld-vertaling (`SANITY.md` §4): `service` met `color`/`ink`/volgorde en vertaalde `title`/`body`, singletons `home`, `contact` en `siteSettings`. Recept: `~/Code/_standards/SANITY-MIGRATIE.md`. `src/lib/content.ts` is de enige plek die dan verandert.

## Privacy, toegankelijkheid en SEO

- Geen cookies, geen externe requests (fonts lokaal, geen Google Analytics, geen jQuery/CDN). Er is dus geen banner nodig.
- WCAG 2.2 AA: tekstkleur per dienstkleur gekozen op contrast (het oude ontwerp had witte tekst op lichte kleuren, < 2.1:1); skiplink; echte koppen (h1 op de home); menu als native popover (Esc, focus); `aria-current` op de actieve sectie; reveal en menu-animatie uit bij `prefers-reduced-motion` en zonder JavaScript.
- SEO volgens `~/Code/_standards/SEO.md`: title/description per taal, canonical, `hreflang` (nl, en, x-default), Open Graph (`public/og-default.jpg`), JSON-LD `AccountingService` + `WebSite`, `sitemap-index.xml` met hreflang, `robots.txt`, `llms.txt`.

## Deploy

- `main` → productie · `staging` → `staging--<site>.netlify.app` · pull requests → deploy preview. Zie `~/Code/_standards/DEPLOY.md`.
- `netlify.toml`: build, Node 22, redirects van oude WordPress-URL's (`?lang=en`, `/site/*`, PDF's), cache-headers. De `ignore`-regel sluit alleen de docs in de root uit, want de content is ook `.md`.

## Domein en DNS

- **Hoofdadres: `www.neoaccounting.nl`.** Doorverwijzend (301, pad blijft behouden, regels in `netlify.toml`): neoaccounting.nl, neoaccountants.nl, neoaa.nl, neoadviseurs.nl, neofinance.nl, elk ook met `www`. Allemaal als alias gekoppeld aan de Netlify-site, zodat het certificaat ze dekt.
- Domeinen en DNS bij Strato. Alleen het web wijst naar Netlify: `A` → `75.2.60.5` ("eigen IP-adres"; daarmee verdwijnt ook de standaard-AAAA van Strato), `www` → CNAME naar Netlify of naar het hoofddomein.
- SSL: Let's Encrypt via Netlify, automatisch verlengd. Niets meer bij Strato.
- **Mail blijft bij Strato**, voor alle domeinen (neoaccounting.nl heeft actieve mailboxen). Niet aanraken: MX (`5 smtp.rzone.de`), DKIM (`strato-dkim-0002._domainkey`), DMARC (`p=reject`), `autoconfig` en `_autodiscover._tcp`. Verhuist de DNS ooit naar Netlify, neem deze dan exact over: met `p=reject` wordt mail zonder geldige DKIM geweigerd.

## Bekende issues en afspraken

- De PDF-links op de oude site (neoaccountants.nl/wp-content/…) gaven 404; de bestanden komen nu van de oude Strato-host en staan in `public/documenten/`. Ze dateren van 2017/2018: laat de klant checken of ze actueel zijn.
- Er zijn alleen Nederlandse documenten; de Engelse versie linkt ernaar met de melding dat ze Nederlandstalig zijn.
- Geen privacyverklaring op de site behalve de PDF "Databescherming". TODO met de klant.

---

Eigenaar: CKDT · Wat er gedaan is: zie [`CHANGELOG.md`](CHANGELOG.md) · Werkafspraken voor ontwikkelaars en AI-agents: [`AGENTS.md`](AGENTS.md)
