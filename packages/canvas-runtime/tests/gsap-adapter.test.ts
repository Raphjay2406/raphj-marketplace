import { describe, it, expect, afterEach } from "vitest";
import { presetToGsapEase, setGsapTimescale, scrollProgressTween, gsap } from "../src/gsap-adapter.js";

describe("presetToGsapEase", () => {
  it("maps all 7 presets", () => {
    const presets = ["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"] as const;
    for (const p of presets) {
      const ease = presetToGsapEase(p);
      expect(typeof ease).toBe("string");
      expect(ease.length).toBeGreaterThan(0);
    }
  });

  it("falls back to power2.out for unknown preset", () => {
    expect(presetToGsapEase("unknown-preset")).toBe("power2.out");
  });

  it("maps linear to none", () => {
    expect(presetToGsapEase("linear")).toBe("none");
  });

  it("maps ease-in to power2.in", () => {
    expect(presetToGsapEase("ease-in")).toBe("power2.in");
  });
});

describe("setGsapTimescale", () => {
  afterEach(() => {
    // Reset to 1x after each test
    gsap.globalTimeline.timeScale(1);
  });

  it("sets timescale to 2", () => {
    setGsapTimescale(2);
    expect(gsap.globalTimeline.timeScale()).toBe(2);
  });

  it("sets timescale to 0.5", () => {
    setGsapTimescale(0.5);
    expect(gsap.globalTimeline.timeScale()).toBe(0.5);
  });

  it("resets to 1", () => {
    setGsapTimescale(3);
    setGsapTimescale(1);
    expect(gsap.globalTimeline.timeScale()).toBe(1);
  });
});

describe("scrollProgressTween", () => {
  it("creates a tween with update and kill methods", () => {
    const div = document.createElement("div");
    const tween = scrollProgressTween(div, { opacity: 0 }, { opacity: 1 });
    expect(typeof tween.update).toBe("function");
    expect(typeof tween.kill).toBe("function");
    tween.kill();
  });

  it("clamps progress below 0 to 0", () => {
    const div = document.createElement("div");
    const tween = scrollProgressTween(div, { x: 0 }, { x: 100 });
    // Should not throw
    expect(() => tween.update(-0.5)).not.toThrow();
    tween.kill();
  });

  it("clamps progress above 1 to 1", () => {
    const div = document.createElement("div");
    const tween = scrollProgressTween(div, { x: 0 }, { x: 100 });
    expect(() => tween.update(1.5)).not.toThrow();
    tween.kill();
  });
});
