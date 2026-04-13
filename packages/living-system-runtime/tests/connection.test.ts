// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { subscribeConnection } from "../src/signals/connection.js";

describe("connection", () => {
  it("calls cb with 10000 when connection API is unavailable", () => {
    const cb = vi.fn();
    const unsub = subscribeConnection(cb);
    expect(cb).toHaveBeenCalledWith(10_000);
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
