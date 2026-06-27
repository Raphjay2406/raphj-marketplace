import { promises as fs } from "node:fs";
import * as path from "node:path";

export type ImageFile = { bytes: Buffer; mime: string; name: string };

const EXT: Record<string, string> = { png: "png", jpeg: "jpg", webp: "webp" };

export function resolveOutputPaths(opts: {
  outputDir: string;
  outputPath?: string;
  outputFormat: string;
  count: number;
  ts: number;
}): string[] {
  const ext = EXT[opts.outputFormat] ?? "png";
  const abs = (p: string) => (path.isAbsolute(p) ? p : path.resolve(opts.outputDir, p));
  if (opts.count === 1) {
    return [abs(opts.outputPath ?? path.resolve(opts.outputDir, `gpt-image-${opts.ts}.${ext}`))];
  }
  const base = opts.outputPath
    ? opts.outputPath.replace(/\.[^.]+$/, "")
    : path.resolve(opts.outputDir, `gpt-image-${opts.ts}`);
  return Array.from({ length: opts.count }, (_, i) => abs(`${base}-${i}.${ext}`));
}

export async function writeBase64(filePath: string, b64: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(b64, "base64"));
}

export async function readImageFile(filePath: string): Promise<ImageFile> {
  const bytes = await fs.readFile(filePath); // throws ENOENT with the path if missing
  return { bytes, mime: sniffMime(bytes, filePath), name: path.basename(filePath) };
}

export function sniffMime(bytes: Buffer, filePath: string): string {
  if (bytes.length >= 2 && bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "image/png";
}
