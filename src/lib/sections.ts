/*
  Scrollgedrag van de one-pager, zonder bibliotheek (vervangt fullPage.js + jQuery).

  1. Klik op een anker naar een sectie (menu, logo)
     We vangen de klik af in de capture-fase, vóór Astro's <ClientRouter /> hem pakt
     (die doet anders een harde sprong via location.href en zet de focus op <body>).
     - menu (popover) dicht;
     - doel meteen actief en zichtbaar (geen geflikker van tussenliggende secties);
     - smooth scrollen, of direct bij prefers-reduced-motion;
     - hash bijwerken met replaceState: geen geschiedenisregel per menuklik, router-state blijft intact;
     - focus naar de kop van de sectie (preventScroll), zodat toetsenbord- en
       screenreadergebruikers verder gaan waar ze heen wilden.
     Tijdens die scroll staat de actieve-sectie-bepaling op slot, tot `scrollend`
     (of een time-out voor browsers zonder dat event).

  2. Welke sectie is actief? Bij elke scroll (max. één keer per frame) meten we
     drie punten, omdat de vaste elementen op verschillende plekken staan:
       - top:    links bovenin (logo)          → html[data-surface-top]
       - topEnd: rechts bovenin (hamburger)    → html[data-surface-top-end]
                 De schuine bovenrand van een sectie ligt rechts ~7vw hoger.
       - middle: midden in beeld (desktopmenu) → html[data-surface-middle] + aria-current
     Waarden: paper | dark | light; de CSS kiest daarmee de kleur.

  3. Reveal: een IntersectionObserver zet .is-visible zodra 20% van een sectie
     in beeld is (eenmalig). De CSS animeert, behalve bij reduced motion.

  Opgezet bij elke astro:page-load, opgeruimd bij astro:before-swap.
*/

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const SLANT = 0.07; // gelijk aan --slant (7vw) in Section.astro
const TOP_PROBE = 40; // px vanaf boven: hoogte van logo/hamburger

let sections: HTMLElement[] = [];
let reveal: IntersectionObserver | undefined;
let lockedTo: HTMLElement | null = null;
let unlockTimer: ReturnType<typeof setTimeout> | undefined;
let frame = 0;
const ac = { current: new AbortController() };

/** Laatste sectie waarvan de bovenkant boven y ligt (offset = schuine rand). */
function sectionAt(y: number, offset = 0) {
  let found = sections[0];
  for (const s of sections) {
    if (s.getBoundingClientRect().top - offset <= y) found = s;
    else break;
  }
  return found;
}

function setNav(active: HTMLElement) {
  const root = document.documentElement;
  root.dataset.surfaceMiddle = active.dataset.surface ?? "paper";
  document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((a) => {
    if (a.dataset.navLink === active.id) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
}

function update() {
  frame = 0;
  if (!sections.length) return;
  const root = document.documentElement;
  root.dataset.surfaceTop = sectionAt(TOP_PROBE).dataset.surface ?? "paper";
  root.dataset.surfaceTopEnd = sectionAt(TOP_PROBE, innerWidth * SLANT).dataset.surface ?? "paper";
  if (!lockedTo) setNav(sectionAt(innerHeight / 2));
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

function unlock() {
  clearTimeout(unlockTimer);
  lockedTo = null;
  update();
}

function goTo(target: HTMLElement) {
  const nav = document.getElementById("site-nav");
  if (nav?.matches(":popover-open")) nav.hidePopover();

  lockedTo = target;
  setNav(target);
  target.classList.add("is-visible");

  const behavior: ScrollBehavior = reducedMotion() ? "instant" : "smooth";
  target.scrollIntoView({ behavior, block: "start" });

  const hash = target.id === sections[0]?.id ? location.pathname : `#${target.id}`;
  history.replaceState(history.state, "", hash);

  const heading = target.querySelector<HTMLElement>("h1, h2");
  if (heading) {
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  clearTimeout(unlockTimer);
  unlockTimer = setTimeout(unlock, behavior === "smooth" ? 1200 : 50);
}

function onClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target?.hasAttribute("data-section")) return;
  event.preventDefault();
  event.stopPropagation(); // niet ook nog door de ClientRouter
  goTo(target);
}

function init() {
  sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
  if (!sections.length) return;

  ac.current = new AbortController();
  const { signal } = ac.current;
  document.addEventListener("click", onClick, { capture: true, signal });
  addEventListener("scroll", onScroll, { passive: true, signal });
  addEventListener("resize", onScroll, { passive: true, signal });
  addEventListener("scrollend", () => lockedTo && unlock(), { signal });

  reveal = new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }),
    { threshold: 0.2 },
  );
  sections.forEach((s) => reveal!.observe(s));
  update();
}

function cleanup() {
  ac.current.abort();
  reveal?.disconnect();
  cancelAnimationFrame(frame);
  frame = 0;
  clearTimeout(unlockTimer);
  lockedTo = null;
  sections = [];
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", cleanup);
