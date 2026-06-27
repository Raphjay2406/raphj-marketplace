import { z } from "zod";

const SIZE = z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]);
const QUALITY = z.enum(["low", "medium", "high", "auto"]);
const BACKGROUND = z.enum(["transparent", "opaque", "auto"]);
const OUTPUT_FORMAT = z.enum(["png", "jpeg", "webp"]);

export const generateShape = {
  prompt: z.string().min(1).max(32000).describe("Text description of the image to generate."),
  size: SIZE.default("1024x1024"),
  quality: QUALITY.default("high"),
  background: BACKGROUND.default("auto").describe('"transparent" requires a gpt-image-1/1.5 model.'),
  output_format: OUTPUT_FORMAT.default("png"),
  n: z.number().int().min(1).max(4).default(1),
  output_path: z.string().optional().describe("Where to save (abs or relative to output dir). Auto-named if omitted."),
};

export const editShape = {
  image_path: z.union([z.string(), z.array(z.string()).min(1).max(16)]).describe("Input image path(s); extra images act as references."),
  prompt: z.string().min(1).max(32000).describe("What to change."),
  mask_path: z.string().optional().describe("PNG mask: transparent pixels mark the region to edit."),
  input_fidelity: z.enum(["high", "low"]).default("high").describe("Keep input detail (no-op on gpt-image-2 — always high)."),
  size: SIZE.default("auto"),
  quality: QUALITY.default("high"),
  background: BACKGROUND.default("auto"),
  output_format: OUTPUT_FORMAT.default("png"),
  output_path: z.string().optional(),
};

export type GenerateArgs = z.infer<z.ZodObject<typeof generateShape>>;
export type EditArgs = z.infer<z.ZodObject<typeof editShape>>;
