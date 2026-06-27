import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { resolveOutputPaths, writeBase64, readImageFile, sniffMime } from "../src/files.js";

const PNG_1x1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

describe("resolveOutputPaths", () => {
  it("uses output_path verbatim for n=1", () => {
    expect(resolveOutputPaths({ outputDir: "/out", outputPath: "/abs/pic.png", outputFormat: "png", count: 1, ts: 5 }))
      .toEqual(["/abs/pic.png"]);
  });
  it("auto-names for n=1 when no path", () => {
    expect(resolveOutputPaths({ outputDir: "/out", outputFormat: "png", count: 1, ts: 5 }))
      .toEqual([path.resolve("/out", "gpt-image-5.png")]);
  });
  it("uses prefix + index for n>1", () => {
    const r = resolveOutputPaths({ outputDir: "/out", outputPath: "/abs/pic.png", outputFormat: "jpeg", count: 2, ts: 5 });
    expect(r).toEqual(["/abs/pic-0.jpg", "/abs/pic-1.jpg"]);
  });
});

describe("sniffMime", () => {
  it("detects png from magic bytes", () => {
    expect(sniffMime(Buffer.from(PNG_1x1, "base64"), "x.bin")).toBe("image/png");
  });
});

describe("writeBase64 + readImageFile", () => {
  it("round-trips a png to disk", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gpt-image-"));
    const p = path.join(dir, "a.png");
    await writeBase64(p, PNG_1x1);
    const f = await readImageFile(p);
    expect(f.mime).toBe("image/png");
    expect(f.name).toBe("a.png");
    expect(f.bytes.length).toBeGreaterThan(0);
  });
  it("throws a clear error for a missing file", async () => {
    await expect(readImageFile("/no/such/file.png")).rejects.toThrow();
  });
});
