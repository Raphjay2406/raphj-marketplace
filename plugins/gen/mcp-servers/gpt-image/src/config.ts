import { readFileSync } from "node:fs";

export interface Config {
  apiKey: string;
  outputDir: string;
  model: string;
  baseUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Set it in the MCP server env (see .env.example)."
    );
  }
  return {
    apiKey,
    outputDir: env.GPT_IMAGE_OUTPUT_DIR?.trim() || process.cwd(),
    model: env.GPT_IMAGE_MODEL?.trim() || "gpt-image-2",
    baseUrl: env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1",
  };
}

/** Only the gpt-image-2 family lacks transparent-background support. */
export function modelSupportsTransparent(model: string): boolean {
  return !model.startsWith("gpt-image-2");
}

/**
 * The gpt-image-2 family REJECTS the `input_fidelity` edit parameter (HTTP 400 — it is always
 * high-fidelity), whereas gpt-image-1 / 1.5 accept it. Confirmed against the live API.
 */
export function modelSupportsInputFidelity(model: string): boolean {
  return !model.startsWith("gpt-image-2");
}

/**
 * Zero-dependency .env loader. Parses simple KEY=VALUE lines from `filePath` and merges them into
 * `env`, but NEVER overrides a value already present (real shell env wins). Missing file = no-op.
 * Lines starting with `#`, and blank lines, are ignored; surrounding quotes are stripped.
 */
export function loadEnvFile(filePath: string, env: NodeJS.ProcessEnv = process.env): void {
  let text: string;
  try {
    text = readFileSync(filePath, "utf8");
  } catch {
    return; // no .env present — rely on the real environment
  }
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue; // skips blanks and `#` comments
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (env[key] === undefined || env[key] === "") env[key] = val;
  }
}
