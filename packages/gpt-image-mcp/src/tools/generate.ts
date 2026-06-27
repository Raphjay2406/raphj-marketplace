import { resolveOutputPaths, writeBase64 } from "../files.js";
import { modelSupportsTransparent } from "../config.js";
import { successContent, errorContent, formatError, type ToolResult } from "../result.js";
import type { OpenAiImageClient } from "../openai.js";
import type { GenerateArgs } from "../schemas.js";

const MIME: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

export function makeGenerateHandler(deps: {
  client: OpenAiImageClient; outputDir: string; model: string; now?: () => number;
}): (args: GenerateArgs) => Promise<ToolResult> {
  return async (args) => {
    if (args.background === "transparent" && !modelSupportsTransparent(deps.model)) {
      return errorContent(`background "transparent" is not supported by model "${deps.model}". Use a gpt-image-1/1.5 model, or set background to "opaque"/"auto".`);
    }
    try {
      const result = await deps.client.generate({
        prompt: args.prompt, size: args.size, quality: args.quality,
        background: args.background, output_format: args.output_format, n: args.n,
      });
      const ts = (deps.now ?? Date.now)();
      const paths = resolveOutputPaths({ outputDir: deps.outputDir, outputPath: args.output_path, outputFormat: args.output_format, count: result.images.length, ts });
      await Promise.all(result.images.map((b64, i) => writeBase64(paths[i], b64)));
      return successContent(paths, result.images[0] ?? "", MIME[args.output_format] ?? "image/png", { model: deps.model, usage: result.usage });
    } catch (e) {
      return errorContent(formatError(e));
    }
  };
}
