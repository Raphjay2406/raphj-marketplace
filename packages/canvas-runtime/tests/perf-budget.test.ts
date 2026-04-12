import { describe, it, expect, vi } from "vitest";
import { PerfBudgetTracker, FpsSampler, type PerfSnapshot } from "../src/perf-budget.js";

const DEFAULT_BUDGET = {
  maxDrawCalls: 150,
  maxTriangles: 500_000,
  maxTextureBytes: 64 * 1024 * 1024,
  targetFps: 60 as const,
};

function makeSnapshot(overrides: Partial<PerfSnapshot> = {}): PerfSnapshot {
  return {
    drawCalls: 50,
    triangles: 100_000,
    textureBytes: 10 * 1024 * 1024,
    fps: 60,
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("PerfBudgetTracker", () => {
  it("returns no violations when all metrics are within budget", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    const violations = tracker.check(makeSnapshot());
    expect(violations).toHaveLength(0);
  });

  it("reports drawCalls violation", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    const violations = tracker.check(makeSnapshot({ drawCalls: 200 }));
    expect(violations).toHaveLength(1);
    expect(violations[0].metric).toBe("maxDrawCalls");
    expect(violations[0].actual).toBe(200);
    expect(violations[0].ratio).toBeCloseTo(200 / 150);
  });

  it("reports triangles violation", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    const violations = tracker.check(makeSnapshot({ triangles: 600_000 }));
    expect(violations).toHaveLength(1);
    expect(violations[0].metric).toBe("maxTriangles");
  });

  it("reports textureBytes violation", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    const violations = tracker.check(makeSnapshot({ textureBytes: 128 * 1024 * 1024 }));
    expect(violations).toHaveLength(1);
    expect(violations[0].metric).toBe("maxTextureBytes");
  });

  it("reports multiple simultaneous violations", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    const violations = tracker.check(makeSnapshot({
      drawCalls: 300,
      triangles: 1_000_000,
    }));
    expect(violations).toHaveLength(2);
  });

  it("calls onViolation callback for each violation", () => {
    const cb = vi.fn();
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET, cb);
    tracker.check(makeSnapshot({ drawCalls: 999 }));
    expect(cb).toHaveBeenCalledOnce();
    expect(cb.mock.calls[0][0].metric).toBe("maxDrawCalls");
  });

  it("accumulates violations across frames and clears them", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    tracker.check(makeSnapshot({ drawCalls: 200 }));
    tracker.check(makeSnapshot({ drawCalls: 200 }));
    expect(tracker.getViolations()).toHaveLength(2);
    tracker.clearViolations();
    expect(tracker.getViolations()).toHaveLength(0);
  });

  it("updateBudget changes limits", () => {
    const tracker = new PerfBudgetTracker(DEFAULT_BUDGET);
    tracker.updateBudget({ maxDrawCalls: 500 });
    const violations = tracker.check(makeSnapshot({ drawCalls: 200 }));
    expect(violations).toHaveLength(0); // 200 < 500
  });
});

describe("FpsSampler", () => {
  it("returns 0 before first tick", () => {
    const sampler = new FpsSampler();
    expect(sampler.average()).toBe(0);
  });

  it("returns non-zero FPS after two ticks", () => {
    const sampler = new FpsSampler();
    sampler.tick(0);
    const fps = sampler.tick(16.67); // ~60fps
    expect(fps).toBeGreaterThan(50);
    expect(fps).toBeLessThan(70);
  });

  it("averages over a window", () => {
    const sampler = new FpsSampler(3);
    sampler.tick(0);
    sampler.tick(16); // ~62 fps
    sampler.tick(33); // ~62 fps
    sampler.tick(50); // ~58 fps
    const avg = sampler.average();
    expect(avg).toBeGreaterThan(50);
  });

  it("evicts oldest sample after window fills", () => {
    const sampler = new FpsSampler(2);
    sampler.tick(0);
    sampler.tick(100); // 10 fps
    sampler.tick(200); // 10 fps
    // Window is now [10, 10], average ~10
    const avg = sampler.average();
    expect(avg).toBeCloseTo(10, 0);
  });

  it("resets state", () => {
    const sampler = new FpsSampler();
    sampler.tick(0);
    sampler.tick(16);
    sampler.reset();
    expect(sampler.average()).toBe(0);
  });
});
