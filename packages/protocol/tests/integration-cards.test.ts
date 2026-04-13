import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { AgentCardSchema } from "../src/agent-card.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../../..");

describe("generated agent cards", () => {
  it("all cards pass AgentCardSchema", () => {
    const cards = JSON.parse(
      readFileSync(join(root, ".claude-plugin/generated/agent-cards.json"), "utf8")
    );
    expect(cards).toHaveLength(108);
    for (const card of cards) {
      expect(() => AgentCardSchema.parse(card)).not.toThrow();
    }
  });
});
