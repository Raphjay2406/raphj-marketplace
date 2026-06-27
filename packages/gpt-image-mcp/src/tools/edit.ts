import { resolveOutputPaths, writeBase64, readImageFile } from "../files.js";
import { modelSupportsTransparent } from "../config.js";
import { successContent, errorContent, formatError, type ToolResult } from "../result.js";
import type { OpenAiImageClient } from "../openai.js";
import type { EditArgs } from "../schemas.js";

const MIME: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

export function makeEditHandler(deps: {
  client: OpenAiImageClient; outputDir: string; model: string; now?: () => number;
}): (args: EditArgs) => Promise<ToolResult> {
  return async (args) => {
    if (args.background === "transparent" && !modelSupportsTransparent(deps.model)) {
      return errorContent(`background "transparent" is not supported by model "${deps.model}". Use a gpt-image-1/1.5 model, or set background to "opaque"/"auto".`);
    }
    try {
      const paths = Array.isArray(args.image_path) ? args.image_path : [args.image_path];
      const images = await Promise.all(paths.map(readImageFile));
      const mask = args.mask_path ? await readImageFile(args.mask_path) : undefined;
      const result = await deps.client.edit({
        images, mask, prompt: args.prompt, size: args.size, quality: args.quality,
        background: args.background, output_format: args.output_format, input_fidelity: args.input_fidelity,
      });
      const ts = (deps.now ?? Date.now)();
      const outPaths = resolveOutputPaths({ outputDir: deps.outputDir, outputPath: args.output_path, outputFormat: args.output_format, count: result.images.length, ts });
      await Promise.all(result.images.map((b64, i) => writeBase64(outPaths[i], b64)));
      return successContent(outPaths, result.images[0] ?? "", MIME[args.output_format] ?? "image/png", { model: deps.model, usage: result.usage });
    } catch (e) {
      return errorContent(formatError(e));
    }
  };
}
