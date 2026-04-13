import { describe, it, expect } from "vitest";
import { rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { MemoryGraph } from "../src/graph.js";

function tmpDb(): string {
  return join(tmpdir(), `memory-graph-test-${randomUUID()}.db`);
}

describe("MemoryGraph", () => {
  it("records a decision with embedding + metadata", async () => {
    const path = tmpDb();
    try {
      const g = new MemoryGraph({ path, dims: 4 });
      await g.init();
      await g.record({
        project_id: "proj-a", decision_id: "d-1",
        archetype: "brutalist", score: 218, category: "pre-ship-design-critique",
        summary: "chose wide-weight display over neutral humanist",
        embedding: [0.5, 0.5, 0, 0]
      });
      const res = await g.query({ embedding: [0.5, 0.5, 0, 0], k: 1 });
      expect(res[0].decision_id).toBe("d-1");
    } finally {
      try { rmSync(path); } catch {}
    }
  });

  it("filters by archetype + score range", async () => {
    const path = tmpDb();
    try {
      const g = new MemoryGraph({ path, dims: 4 });
      await g.init();
      await g.record({ project_id: "p1", decision_id: "d-1", archetype: "brutalist", score: 210, category: "x", summary: "", embedding: [1,0,0,0] });
      await g.record({ project_id: "p2", decision_id: "d-2", archetype: "minimal",  score: 185, category: "x", summary: "", embedding: [0,1,0,0] });
      const r = await g.query({ embedding: [1,0,0,0], k: 5, filter: { archetype: "brutalist", min_score: 200 } });
      expect(r).toHaveLength(1);
      expect(r[0].decision_id).toBe("d-1");
    } finally {
      try { rmSync(path); } catch {}
    }
  });
});
