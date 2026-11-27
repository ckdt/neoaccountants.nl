import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Eén bestand per taal: src/content/home/nl.md, src/content/home/en.md
const home = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/home" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string(),
    navLabel: z.string(),
  }),
});

// src/content/services/<taal>/<anker>.md — de bestandsnaam is het anker in de URL (#fiscale-zaken).
const services = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/services" }),
  schema: z.object({
    key: z.string(), // koppelt aan settings.services (kleur, volgorde) en aan de andere taal
    title: z.string(),
  }),
});

const contact = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/contact" }),
  schema: z.object({
    title: z.string(),
    anchor: z.string(),
    kvkLabel: z.string(),
    documentsLabel: z.string(),
    documentsNote: z.string().optional(),
    documents: z.array(z.object({ label: z.string(), file: z.string() })),
  }),
});

export const collections = { home, services, contact };
