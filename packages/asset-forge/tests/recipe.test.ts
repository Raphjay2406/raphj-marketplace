import { describe, it, expect, vi } from "vitest";
import { executeRecipe } from "../src/recipe.js";

describe("executeRecipe", () => {
  it("runs steps in sequence and interpolates ${previous.artifact}", async () => {
    const workers = new Map<string, ReturnType<typeof vi.fn>>();
    workers.set("rodin-3d-gen", vi.fn(async () => ({
      schema_version: "4.0.0" as const, status: "ok" as const,
      artifact: { path: "a.glb" }, verdicts: [], followups: []
    })));
    workers.set("character-poser", vi.fn(async (input: Record<string, unknown>) => ({
      schema_version: "4.0.0" as const, status: "ok" as const,
      artifact: { path: "b.glb", base: input["model"] }, verdicts: [], followups: []
    })));
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "rodin-3d-gen", input: { prompt: "x" } },
        { worker: "character-poser", input: { model: "${previous.artifact.path}", pose: "p" } }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const result = await executeRecipe({
      recipe,
      dispatch: async (worker, input) => workers.get(worker)!(input)
    });
    expect(result.status).toBe("ok");
    expect(workers.get("character-poser")!.mock.calls[0][0].model).toBe("a.glb");
  });

  it("stops and returns partial when step status is failed", async () => {
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "w1", input: {} },
        { worker: "w2", input: {} }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const dispatch = vi.fn()
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "failed", artifact: null, verdicts: [{ validator: "x", pass: false }], followups: [] });
    const result = await executeRecipe({ recipe, dispatch });
    expect(result.status).toBe("failed");
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("injects followups between steps when followups_enabled", async () => {
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [
        { worker: "w1", input: {} },
        { worker: "w3", input: {} }
      ],
      validators_per_step: [], followups_enabled: true
    };
    const dispatch = vi.fn()
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [{ suggested_worker: "w2", reason: "correction" }] })
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [] })
      .mockResolvedValueOnce({ schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: [] });
    await executeRecipe({ recipe, dispatch });
    expect(dispatch).toHaveBeenCalledTimes(3); // w1 -> injected w2 -> w3
  });

  it("succeeds when a 15-step recipe runs under max_followup_hops=20", async () => {
    const steps = Array.from({ length: 15 }, (_, i) => ({ worker: `w${i}`, input: {} }));
    const recipe = {
      name: "t", version: "1.0.0",
      steps,
      validators_per_step: [], followups_enabled: false
    };
    const dispatch = vi.fn().mockResolvedValue({
      schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [], followups: []
    });
    const result = await executeRecipe({ recipe, dispatch, max_followup_hops: 20 });
    expect(result.status).toBe("ok");
    expect(dispatch).toHaveBeenCalledTimes(15);
    expect(result.error).toBeUndefined();
  });

  it("returns CIRCULAR_FOLLOWUP when self-referencing followup exceeds hop cap", async () => {
    const recipe = {
      name: "t", version: "1.0.0",
      steps: [{ worker: "self-ref", input: {} }],
      validators_per_step: [], followups_enabled: true
    };
    // worker always returns a followup targeting itself => infinite loop
    const dispatch = vi.fn().mockResolvedValue({
      schema_version: "4.0.0", status: "ok", artifact: {}, verdicts: [],
      followups: [{ suggested_worker: "self-ref", reason: "retry" }]
    });
    const result = await executeRecipe({ recipe, dispatch, max_followup_hops: 5 });
    expect(result.status).toBe("failed");
    expect(result.error?.code).toBe("CIRCULAR_FOLLOWUP");
    expect(result.error?.recovery_hint).toBe("escalate_user");
    // should have stopped at or before the hop cap
    expect(dispatch.mock.calls.length).toBeLessThanOrEqual(5);
  });
});
