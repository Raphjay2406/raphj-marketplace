// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { subscribeBattery } from "../src/signals/battery.js";

describe("battery", () => {
  it("calls cb with 1 when getBattery is unavailable", async () => {
    // happy-dom doesn't implement getBattery, so we get the fallback path
    const cb = vi.fn();
    const unsub = await subscribeBattery(cb);
    expect(cb).toHaveBeenCalledWith(1);
    expect(typeof unsub).toBe("function");
    unsub();
  });
});
