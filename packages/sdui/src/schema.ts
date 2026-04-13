import { z } from "zod";

// ── Section schemas ──────────────────────────────────────────────────────────

export const HeroSchema = z.object({
  type: z.literal("hero"),
  heading: z.string(),
  subheading: z.string().optional(),
  cta: z
    .object({ label: z.string(), href: z.string() })
    .optional(),
  backgroundImage: z.string().url().optional(),
});

export const TextSchema = z.object({
  type: z.literal("text"),
  body: z.string(),
  align: z.enum(["left", "center", "right"]).default("left"),
});

export const GridSchema = z.object({
  type: z.literal("grid"),
  columns: z.number().int().min(1).max(6).default(3),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      image: z.string().url().optional(),
    })
  ),
});

// ── Discriminated union ──────────────────────────────────────────────────────

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSchema,
  TextSchema,
  GridSchema,
]);

export const PageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  sections: z.array(SectionSchema),
});

// ── Inferred types ───────────────────────────────────────────────────────────

export type HeroSection = z.infer<typeof HeroSchema>;
export type TextSection = z.infer<typeof TextSchema>;
export type GridSection = z.infer<typeof GridSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
