# AGENTS.md: neoaccountants.nl

Instructies voor AI-agents (Claude Code, Cursor, Codex) en ontwikkelaars die aan dit project werken.
Lees eerst `README.md` voor context en `CHANGELOG.md` voor recente wijzigingen.

## Project
- Klant: Neo Accountants & Adviseurs · Bedrijf: CKDT · SLA: TODO
- Stack: Astro 7, geen CMS (markdown), Node 22 (zie `.nvmrc`), static

## Werkwijze
- Werk nooit direct op `main`. Branch vanaf `staging` → PR naar `staging` → deploy preview → merge. Naar `main` alleen gebundelde releases en hotfixes, volgens `~/Code/_standards/DEPLOY.md`.
- Branchnamen: `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Commit nooit `.env`-bestanden of tokens. Nieuwe variabelen: naam toevoegen aan `.env.example` en de README-tabel.
- Variabelen met `PUBLIC_` komen in de browser terecht: nooit voor tokens.

## Documentatie bijhouden (verplicht)
- Elke wijziging die je commit: voeg een regel toe onder `## [Unreleased]` in `CHANGELOG.md`.
- Bij een release (`staging → main`): zet `[Unreleased]` om naar een datumkop.
- Verandert setup, env, stack of deploy? Werk `README.md` bij.

## Conventies
- Moderne CSS: custom properties, OKLCH-kleuren, logical properties, cascade layers (`src/styles/global.scss`). Componentstijlen staan buiten de layers en winnen dus altijd.
- Toegankelijkheid: WCAG 2.2 AA. Semantische HTML, focus-states, `prefers-reduced-motion` respecteren.
- AVG en consent volgens `~/Code/_standards/CONSENT.md`: geen banner vooraf, embeds pas na een klik op de embed, statistiek: geen (TODO met klant: Umami als er statistiek moet komen).
- Animaties: geen GSAP. Leg bij nieuwe animaties in een comment de logica uit.
- SEO en AI readiness (meta, JSON-LD, sitemap, robots, `llms.txt`) volgens `~/Code/_standards/SEO.md`.
- Afbeeldingen: profiel Website volgens `~/Code/_standards/IMAGES.md` (er zijn nu geen contentbeelden).
- Transities: laag 1-2 (`<ClientRouter />` + `PageProgress`) volgens `~/Code/_standards/TRANSITIONS.md`.

## Projectspecifiek
- Twee talen, één pagina per taal. Vertaalbare tekst in `src/content/<collectie>/<taal>…`, de rest in `src/data/settings.ts`. Interfaceteksten in `src/i18n/ui.ts`.
- Diensten: de bestandsnaam is het anker in de URL; `key` koppelt NL en EN en de kleur/volgorde in `settings.services`. Elke `key` moet in beide talen bestaan, anders faalt de build (bewust).
- Dienstkleur toevoegen of wijzigen: kies `ink` (`dark`/`light`) op contrast ≥ 4.5:1.
- Content altijd via `src/lib/content.ts`, niet direct `getCollection` in componenten: bij de overstap naar Sanity verandert alleen die laag (`~/Code/_standards/SANITY-MIGRATIE.md`).
- Scrollgedrag staat in `src/lib/sections.ts`: ankerklikken naar een `[data-section]` worden daar afgehandeld (vóór de ClientRouter), inclusief menu sluiten, smooth scroll, `replaceState` en focus op de kop. Voeg geen eigen klik-handlers op menulinks toe.
- Kleur van vaste elementen volgt `html[data-surface-top]` (logo), `[data-surface-top-end]` (hamburger) en `[data-surface-middle]` (desktopmenu), waarden `paper`/`dark`/`light`. Verander je `--slant` in `Section.astro`, pas dan ook `SLANT` in `sections.ts` aan.
- `netlify.toml` → `ignore`: sluit alleen root-docs uit, niet `*.md` (content is markdown).
