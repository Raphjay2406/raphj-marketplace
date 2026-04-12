/**
 * Task 7: Performance budget types and runtime enforcement.
 *
 * Tracks per-scene draw calls, triangle counts, and texture memory.
 * Emits warnings when budgets are exceeded.
 */
import type { PerfBudget } from "./schemas/canvas-config.js";
export type { PerfBudget };
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
export declare class PerfBudgetTracker {
    private budget;
    private violations;
    private onViolation?;
    constructor(budget: PerfBudget, onViolation?: (v: PerfViolation) => void);
    /**
     * Check a snapshot against the budget. Emits violations for any exceeded metric.
     */
    check(snapshot: PerfSnapshot): PerfViolation[];
    getViolations(): PerfViolation[];
    clearViolations(): void;
    updateBudget(budget: Partial<PerfBudget>): void;
}
export declare class FpsSampler {
    private samples;
    private maxSamples;
    private lastTime;
    constructor(windowSize?: number);
    /**
     * Record a frame. `now` is DOMHighResTimeStamp or Date.now().
     * Returns the current moving average FPS.
     */
    tick(now: number): number;
    average(): number;
    reset(): void;
}
