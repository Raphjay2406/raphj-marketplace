/**
 * Task 7: Performance budget types and runtime enforcement.
 *
 * Tracks per-scene draw calls, triangle counts, and texture memory.
 * Emits warnings when budgets are exceeded.
 */
import type { PerfBudget } from "./schemas/canvas-config.js";

export type { PerfBudget };

// ---------------------------------------------------------------------------
// Per-frame snapshot
// ---------------------------------------------------------------------------
export interface PerfSnapshot {
  drawCalls: number;
  triangles: number;
  textureBytes: number;
  fps: number;
  timestamp: number;
}

export type PerfViolation = {
  metric: keyof Omit<PerfBudget, "targetFps">;
  actual: number;
  budget: number;
  ratio: number;
};

// ---------------------------------------------------------------------------
// Budget tracker
// ---------------------------------------------------------------------------
export class PerfBudgetTracker {
  private budget: PerfBudget;
  private violations: PerfViolation[] = [];
  private onViolation?: (v: PerfViolation) => void;

  constructor(budget: PerfBudget, onViolation?: (v: PerfViolation) => void) {
    this.budget = budget;
    this.onViolation = onViolation;
  }

  /**
   * Check a snapshot against the budget. Emits violations for any exceeded metric.
   */
  check(snapshot: PerfSnapshot): PerfViolation[] {
    const newViolations: PerfViolation[] = [];

    if (snapshot.drawCalls > this.budget.maxDrawCalls) {
      const v: PerfViolation = {
        metric: "maxDrawCalls",
        actual: snapshot.drawCalls,
        budget: this.budget.maxDrawCalls,
        ratio: snapshot.drawCalls / this.budget.maxDrawCalls,
      };
      newViolations.push(v);
      this.onViolation?.(v);
    }

    if (snapshot.triangles > this.budget.maxTriangles) {
      const v: PerfViolation = {
        metric: "maxTriangles",
        actual: snapshot.triangles,
        budget: this.budget.maxTriangles,
        ratio: snapshot.triangles / this.budget.maxTriangles,
      };
      newViolations.push(v);
      this.onViolation?.(v);
    }

    if (snapshot.textureBytes > this.budget.maxTextureBytes) {
      const v: PerfViolation = {
        metric: "maxTextureBytes",
        actual: snapshot.textureBytes,
        budget: this.budget.maxTextureBytes,
        ratio: snapshot.textureBytes / this.budget.maxTextureBytes,
      };
      newViolations.push(v);
      this.onViolation?.(v);
    }

    this.violations.push(...newViolations);
    return newViolations;
  }

  getViolations(): PerfViolation[] {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
  }

  updateBudget(budget: Partial<PerfBudget>): void {
    this.budget = { ...this.budget, ...budget };
  }
}

// ---------------------------------------------------------------------------
// FPS sampler — lightweight moving average
// ---------------------------------------------------------------------------
export class FpsSampler {
  private samples: number[] = [];
  private maxSamples: number;
  private lastTime = -1;

  constructor(windowSize = 60) {
    this.maxSamples = windowSize;
  }

  /**
   * Record a frame. `now` is DOMHighResTimeStamp or Date.now().
   * Returns the current moving average FPS.
   */
  tick(now: number): number {
    if (this.lastTime >= 0) {
      const delta = now - this.lastTime;
      if (delta > 0) {
        const fps = 1000 / delta;
        this.samples.push(fps);
        if (this.samples.length > this.maxSamples) this.samples.shift();
      }
    }
    this.lastTime = now;
    return this.average();
  }

  average(): number {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  reset(): void {
    this.samples = [];
    this.lastTime = -1;
  }
}
