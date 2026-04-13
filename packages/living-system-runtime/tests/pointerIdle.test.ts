// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { subscribePointerIdle } from "../src/signals/pointerIdle.js";

describe("pointerIdle", () => {
  it("subscribes and returns unsubscribe function", () => {
    const cb = vi.fn();
    const unsub = subscribePointerIdle(cb, 500);
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
