export class CostLedger {
    opts;
    entries = [];
    constructor(opts) {
        this.opts = { warn_at: 0.8, ...opts };
    }
    get spend_usd() {
        return this.entries.reduce((s, e) => s + e.cost_usd, 0);
    }
    record(entry) {
        this.entries.push({ ...entry, at: entry.at ?? Date.now() });
    }
    preview(entry) {
        const projected = this.spend_usd + entry.cost_usd;
        return { would_exceed: projected > this.opts.budget_usd, projected_spend: projected };
    }
    status() {
        const ratio = this.spend_usd / this.opts.budget_usd;
        if (ratio > 1)
            return "exceeded";
        if (ratio >= this.opts.warn_at)
            return "warn";
        return "ok";
    }
    pickDowngrade(provider) {
        return this.opts.downgrade_chain?.[provider] ?? null;
    }
}
