import type { ImageFile } from "./files.js";

export type ImageResult = { images: string[]; usage?: unknown };

export type GenerateParams = {
  prompt: string; size: string; quality: string; background: string; output_format: string; n: number;
};

export type EditParams = {
  images: ImageFile[]; mask?: ImageFile; prompt: string;
  size: string; quality: string; background: string; output_format: string; input_fidelity: string;
};

export class OpenAiImageError extends Error {
  constructor(message: string, readonly status: number, readonly isPolicy: boolean) {
    super(message);
    this.name = "OpenAiImageError";
  }
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class OpenAiImageClient {
  private fetchImpl: typeof fetch;
  private sleep: (ms: number) => Promise<void>;

  constructor(
    private cfg: { apiKey: string; model: string; baseUrl: string },
    deps: { fetchImpl?: typeof fetch; sleep?: (ms: number) => Promise<void> } = {}
  ) {
    this.fetchImpl = deps.fetchImpl ?? fetch;
    this.sleep = deps.sleep ?? defaultSleep;
  }

  async generate(p: GenerateParams): Promise<ImageResult> {
    const body: Record<string, unknown> = {
      model: this.cfg.model, prompt: p.prompt, n: p.n,
      size: p.size, quality: p.quality, output_format: p.output_format,
    };
    if (p.background !== "auto") body.background = p.background;
    return this.request(`${this.cfg.baseUrl}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async edit(p: EditParams): Promise<ImageResult> {
    const form = new FormData();
    form.set("model", this.cfg.model);
    form.set("prompt", p.prompt);
    for (const img of p.images) {
      form.append("image[]", new Blob([new Uint8Array(img.bytes)], { type: img.mime }), img.name);
    }
    if (p.mask) form.set("mask", new Blob([new Uint8Array(p.mask.bytes)], { type: p.mask.mime }), p.mask.name);
    form.set("size", p.size);
    form.set("quality", p.quality);
    form.set("output_format", p.output_format);
    form.set("input_fidelity", p.input_fidelity);
    if (p.background !== "auto") form.set("background", p.background);
    return this.request(`${this.cfg.baseUrl}/images/edits`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.cfg.apiKey}` }, // let fetch set the multipart boundary
      body: form,
    });
  }

  private async request(url: string, init: RequestInit, attempt = 0): Promise<ImageResult> {
    const res = await this.fetchImpl(url, init);
    if (res.ok) {
      const json = (await res.json()) as { data?: { b64_json?: string }[]; usage?: unknown };
      return { images: (json.data ?? []).map((d) => d.b64_json).filter((b): b is string => !!b), usage: json.usage };
    }
    const text = await res.text();
    let message = text;
    try {
      const j = JSON.parse(text) as { error?: { message?: string } };
      if (j.error?.message) message = j.error.message;
    } catch { /* keep raw text */ }
    const isPolicy = /safety|policy|moderation|rejected/i.test(message);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await this.sleep(400 * 2 ** attempt + Math.floor(Math.random() * 200));
      return this.request(url, init, attempt + 1);
    }
    throw new OpenAiImageError(message, res.status, isPolicy);
  }
}
