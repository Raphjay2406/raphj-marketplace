import { describe, it, expect, vi } from "vitest";
import { dispatch } from "../src/dispatch.js";
import { ok, failed } from "../src/envelope.js";

describe("dispatch", () => {
  it("invokes the handler and returns the envelope", async () => {
    const handler = vi.fn(async (payload: { x: number }) => ok({ doubled: payload.x * 2 }));
    const env = await dispatch<{ x: number }, { doubled: number }>({
      worker: "test-worker",
      payload: { x: 5 },
      handler
    });
    expect(env.status).toBe("ok");
    expect(env.artifact.doubled).toBe(10);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("returns a failed envelope on GenorahError", async () => {
    const { GenorahError } = await import("../src/errors.js");
    const handler = vi.fn(async () => {
      throw new GenorahError({
        code: "WORKER_TIMEOUT",
        message: "t/o",
        recovery_hint: "retry_with_fallback"
      });
    });
    const env = await dispatch({ worker: "bad", payload: {}, handler });
    expect(env.status).toBe("failed");
    expect(env.verdicts[0].notes).toMatch(/t\/o/);
  });

  it("emits RESULT_ENVELOPE ag-ui event", async () => {
    const { AgUiEmitter } = await import("../src/ag-ui.js");
    const em = new AgUiEmitter();
    const capture = vi.fn();
    em.subscribe(capture);
    await dispatch({
      worker: "w",
      payload: {},
      handler: async () => ok({}),
      emitter: em
    });
    expect(capture).toHaveBeenCalledWith(expect.objectContaining({ type: "RESULT_ENVELOPE" }));
  });
});
