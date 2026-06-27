export type ToolResult = {
  content: Array<{ type: "text"; text: string } | { type: "image"; data: string; mimeType: string }>;
  isError?: boolean;
};

const PREVIEW_MAX_BYTES = 1_500_000;

export function successContent(paths: string[], firstB64: string, mime: string, meta: object): ToolResult {
  const content: ToolResult["content"] = [
    { type: "text", text: JSON.stringify({ saved: paths, ...meta }, null, 2) },
  ];
  // base64 length * 3/4 ≈ decoded bytes
  if (firstB64 && (firstB64.length * 3) / 4 <= PREVIEW_MAX_BYTES) {
    content.push({ type: "image", data: firstB64, mimeType: mime });
  }
  return { content };
}

export function errorContent(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
