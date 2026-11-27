/*
  Datalaag: alle content via deze functies. Bij de overstap naar Sanity blijven de
  componenten gelijk zolang deze functies dezelfde vorm teruggeven (SANITY-MIGRATIE.md §4).
*/
import { statSync } from "node:fs";
import { join } from "node:path";
import { getCollection, getEntry, render } from "astro:content";
import { settings, type Ink } from "../data/settings";
import type { Lang } from "../i18n/ui";

export type Section = {
  anchor: string;
  title: string;
  color: string;
  ink: Ink;
  Content: Awaited<ReturnType<typeof render>>["Content"];
};

export async function getHome(lang: Lang) {
  const entry = await getEntry("home", lang);
  if (!entry) throw new Error(`Home ontbreekt: src/content/home/${lang}.md`);
  const { Content } = await render(entry);
  return { ...entry.data, body: entry.body ?? "", Content };
}

export async function getServices(lang: Lang): Promise<Section[]> {
  const entries = await getCollection("services", (e) => e.id.startsWith(`${lang}/`));
  return Promise.all(
    settings.services.map(async ({ key, color, ink }) => {
      const entry = entries.find((e) => e.data.key === key);
      if (!entry) throw new Error(`Dienst "${key}" ontbreekt in src/content/services/${lang}/`);
      const { Content } = await render(entry);
      return { anchor: entry.id.split("/")[1], title: entry.data.title, color, ink, Content };
    }),
  );
}

export async function getServiceSummaries(lang: Lang) {
  const entries = await getCollection("services", (e) => e.id.startsWith(`${lang}/`));
  return settings.services.flatMap(({ key }) => {
    const e = entries.find((x) => x.data.key === key);
    return e ? [{ anchor: e.id.split("/")[1], title: e.data.title, body: (e.body ?? "").trim() }] : [];
  });
}

export async function getContact(lang: Lang) {
  const entry = await getEntry("contact", lang);
  if (!entry) throw new Error(`Contact ontbreekt: src/content/contact/${lang}.md`);
  const documents = entry.data.documents.map((d) => {
    const href = settings.documents[d.file];
    if (!href) throw new Error(`Onbekend document "${d.file}" in contact/${lang}.md`);
    return { label: d.label, href, size: fileSize(href) };
  });
  return { ...entry.data, documents };
}

/** Bestandsgrootte voor de linktekst ("PDF, 166 kB"), gelezen bij de build uit public/. */
function fileSize(href: string) {
  const bytes = statSync(join(process.cwd(), "public", href)).size;
  return `${Math.max(1, Math.round(bytes / 1000))} kB`;
}
