// Samenvatting en index voor AI-assistenten (llmstxt.org). Zie ~/Code/_standards/SEO.md §6.
import type { APIRoute } from "astro";
import { settings } from "../data/settings";
import { getContact, getHome, getServiceSummaries } from "../lib/content";

export const GET: APIRoute = async ({ site }) => {
  const nl = await getHome("nl");
  const en = await getHome("en");
  const servicesNl = await getServiceSummaries("nl");
  const servicesEn = await getServiceSummaries("en");
  const contact = await getContact("nl");
  const url = (path: string) => new URL(path, site).href;
  const a = settings.address;

  const text = [
    `# ${settings.siteName}`,
    "",
    `> ${nl.description}`,
    "",
    `${en.description}`,
    "",
    `Adres: ${a.street}, ${a.postalCode} ${a.city} · E-mail: ${settings.email} · Telefoon: ${settings.telephone} · KvK: ${settings.kvk}`,
    "",
    "## Diensten (Nederlands)",
    "",
    ...servicesNl.map((s) => `- [${s.title}](${url(`/#${s.anchor}`)}): ${s.body}`),
    "",
    "## Services (English)",
    "",
    ...servicesEn.map((s) => `- [${s.title}](${url(`/en/#${s.anchor}`)}): ${s.body}`),
    "",
    "## Documenten",
    "",
    ...contact.documents.map((d) => `- [${d.label}](${url(d.href)}) (PDF)`),
    "",
  ].join("\n");

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
