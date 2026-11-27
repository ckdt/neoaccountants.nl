# Changelog

Alle noemenswaardige wijzigingen aan dit project. Nieuwste bovenaan.
Format gebaseerd op [Keep a Changelog](https://keepachangelog.com/nl/1.1.0/).

Categorieën: **Toegevoegd**, **Gewijzigd**, **Opgelost**, **Verwijderd**, **Beveiliging**, **Onderhoud**.

## [Unreleased]

## [2026-11-27]

### Toegevoegd
- Hoofdadres wordt www.neoaccounting.nl. neoaccounting.nl, neoaccountants.nl, neoaa.nl, neoadviseurs.nl en neofinance.nl (ook met www) sturen er met een 301 naartoe, met SSL via Netlify. Mailrecords van alle domeinen blijven bij Strato.
- Live via Netlify met Let's Encrypt-certificaat; DNS bij Strato (alleen A en `www` naar Netlify), mailrecords ongewijzigd.
- GitHub-repo `ckdt/neoaccountants.nl` (public) met `staging` als standaardbranch en branch protection op `main` en `staging`; Netlify-site `neoaccountants` (team ckdt) met branch deploys voor `staging`.
- Statische Astro 7-site als vervanging van de WordPress-site (thema neo3000, WPML): één pagina in het Nederlands (`/`) en Engels (`/en/`).
- Content in markdown (`src/content/`), taalonafhankelijke gegevens in `src/data/settings.ts`.
- Standaarden uit `_standards`: OKLCH-thema met light/dark, Utopia type- en spaceschaal, breakout-grid, favicon (light/dark), `ClientRouter` + `PageProgress`, SiteMeta met hreflang, JSON-LD, sitemap, robots.txt, llms.txt.
- Documenten (PDF) lokaal in `public/documenten/`, met redirects vanaf de oude WordPress-paden.
- `netlify.toml` met redirects voor `?lang=en` en `/site/*`, Dependabot naar `staging`.

### Gewijzigd
- fullPage.js en jQuery vervangen door CSS scroll-snap en IntersectionObserver.
- Donkere tekst op de lichte dienstkleuren (teal, zalm, saliegroen) voor WCAG-contrast.
- Google Fonts vervangen door lokaal gehoste Fontsource-fonts (AVG).

### Opgelost
- Menu en secties: een klik op een menu-item scrolt nu soepel (direct bij reduced motion) in plaats van te springen, het actieve item flikkert niet meer langs tussenliggende secties, en de focus gaat naar de kop van de sectie in plaats van naar `<body>`. Menuklikken vullen de terugknop-geschiedenis niet meer.
- Logo, hamburger en desktopmenu kiezen hun kleur elk op basis van de sectie die er werkelijk achter ligt (boven links, boven rechts incl. schuine rand, midden).
- Scroll-snap op desktop (≥ 62em breed, ≥ 40em hoog) staat nu op `mandatory`: elke sectie klikt vast in beeld, zoals op de oude site. Mobiel scrolt vrij.
- Kapotte PDF-links (404) en de Engelse documentlinks die naar `#` wezen.
- Typo's in de Engelse tekst ("taks", "conditons").

### Verwijderd
- Google Analytics (Universal Analytics, sinds 2023 buiten gebruik).
