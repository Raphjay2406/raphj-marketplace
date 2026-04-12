// ---------------------------------------------------------------------------
// Budget tracker
// ---------------------------------------------------------------------------
export class PerfBudgetTracker {
    budget;
    violations = [];
    onViolation;
    constructor(budget, onViolation) {
        this.budget = budget;
        this.onViolation = onViolation;
    }
    /**
     * Check a snapshot against the budget. Emits violations for any exceeded metric.
     */
    check(snapshot) {
        const newViolations = [];
        if (snapshot.drawCalls > this.budget.maxDrawCalls) {
            const v = {
                metric: "maxDrawCalls",
                actual: snapshot.drawCalls,
                budget: this.budget.maxDrawCalls,
                ratio: snapshot.drawCalls / this.budget.maxDrawCalls,
            };
            newViolations.push(v);
            this.onViolation?.(v);
        }
        if (snapshot.triangles > this.budget.maxTriangles) {
            const v = {
                metric: "maxTriangles",
                actual: snapshot.triangles,
                budget: this.budget.maxTriangles,
                ratio: snapshot.triangles / this.budget.maxTriangles,
            };
            newViolations.push(v);
            this.onViolation?.(v);
        }
        if (snapshot.textureBytes > this.budget.maxTextureBytes) {
            const v = {
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
    getViolations() {
        return [...this.violations];
    }
    clearViolations() {
        this.violations = [];
    }
    updateBudget(budget) {
        this.budget = { ...this.budget, ...budget };
    }
}
// ---------------------------------------------------------------------------
// FPS sampler — lightweight moving average
// ---------------------------------------------------------------------------
export class FpsSampler {
    samples = [];
    maxSamples;
    lastTime = -1;
    constructor(windowSize = 60) {
        this.maxSamples = windowSize;
    }
    /**
     * Record a frame. `now` is DOMHighResTimeStamp or Date.now().
     * Returns the current moving average FPS.
     */
    tick(now) {
        if (this.lastTime >= 0) {
            const delta = now - this.lastTime;
            if (delta > 0) {
                const fps = 1000 / delta;
                this.samples.push(fps);
                if (this.samples.length > this.maxSamples)
                    this.samples.shift();
            }
        }
        this.lastTime = now;
        return this.average();
    }
    average() {
        if (this.samples.length === 0)
            return 0;
        return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    }
    reset() {
        this.samples = [];
        this.lastTime = -1;
    }
}
