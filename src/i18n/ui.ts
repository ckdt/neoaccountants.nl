export const languages = { nl: "Nederlands", en: "English" } as const;
export type Lang = keyof typeof languages;
export const locales: Record<Lang, string> = { nl: "nl_NL", en: "en_GB" };
export const homePath: Record<Lang, string> = { nl: "/", en: "/en/" };

export const ui = {
  nl: {
    skip: "Naar de inhoud",
    menu: "Menu",
    nav: "Hoofdmenu",
    language: "Taal",
    logo: "Neo, naar boven",
    email: "E-mail",
    phone: "Telefoon",
    notFoundTitle: "Pagina niet gevonden",
    notFoundText: "Deze pagina bestaat niet (meer).",
    backHome: "Naar de homepage",
  },
  en: {
    skip: "Skip to content",
    menu: "Menu",
    nav: "Main menu",
    language: "Language",
    logo: "Neo, back to top",
    email: "Email",
    phone: "Phone",
    notFoundTitle: "Page not found",
    notFoundText: "This page does not exist (anymore).",
    backHome: "Go to the homepage",
  },
} satisfies Record<Lang, Record<string, string>>;
