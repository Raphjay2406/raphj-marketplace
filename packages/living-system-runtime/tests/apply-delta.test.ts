// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { applyDelta, revertDelta } from "../src/applyDelta.js";

describe("applyDelta", () => {
  it("sets CSS custom properties on :root", () => {
    applyDelta({ "--color-bg": "#0f0e12", "--density": "dense" });
    expect(document.documentElement.style.getPropertyValue("--color-bg")).toBe("#0f0e12");
    expect(document.documentElement.style.getPropertyValue("--density")).toBe("dense");
  });

  it("revertDelta removes only matching keys", () => {
    applyDelta({ "--x": "1" });
    revertDelta(["--x"]);
    expect(document.documentElement.style.getPropertyValue("--x")).toBe("");
  });
});
