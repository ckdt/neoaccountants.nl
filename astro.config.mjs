// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Live-domein, ook zolang de site nog op netlify.app staat (canonical, sitemap, OG).
  site: "https://www.neoaccounting.nl",
  trailingSlash: "ignore",
  i18n: {
    locales: ["nl", "en"],
    defaultLocale: "nl",
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
      i18n: { defaultLocale: "nl", locales: { nl: "nl-NL", en: "en-GB" } },
    }),
  ],
});
