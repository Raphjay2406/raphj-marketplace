// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { subscribeScrollVelocity } from "../src/signals/scrollVelocity.js";

describe("scrollVelocity", () => {
  it("subscribes and returns unsubscribe function", () => {
    const cb = vi.fn();
    const unsub = subscribeScrollVelocity(cb);
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
