import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isRealIsoDate } from "./lib/dates.mjs";

const isoDate = z.string().refine(isRealIsoDate, {
  message: "Use a real YYYY-MM-DD calendar date (example: 2026-09-06)",
});

const sourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

const sectionSchema = z.object({
  heading: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  sources: z.array(sourceSchema).optional(),
});

const updates = defineCollection({
  loader: glob({
    pattern: "*.json",
    base: "./content/updates",
  }),
  schema: z.object({
    $schema: z.string().optional(),
    date: isoDate,
    title: z.string().min(1),
    summary: z.string().min(1),
    tone: z.string().min(1).max(40).optional(),
    sections: z.array(sectionSchema).min(1),
    bottomLine: z.string().min(1),
  }),
});

export const collections = { updates };
