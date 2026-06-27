export interface LedgerEntry {
  provider: string;
  cost_usd: number;
  at?: number;
  note?: string;
}

export interface LedgerOptions {
  budget_usd: number;
  warn_at: number; // 0..1
  downgrade_chain?: Record<string, string>;
}

export type LedgerStatus = "ok" | "warn" | "exceeded";

export class CostLedger {
  readonly opts: LedgerOptions;
  readonly entries: LedgerEntry[] = [];

  constructor(opts: Partial<LedgerOptions> & { budget_usd: number }) {
    this.opts = { warn_at: 0.8, ...opts } as LedgerOptions;
  }

  get spend_usd(): number {
    return this.entries.reduce((s, e) => s + e.cost_usd, 0);
  }

  record(entry: LedgerEntry): void {
    this.entries.push({ ...entry, at: entry.at ?? Date.now() });
  }

  preview(entry: LedgerEntry): { would_exceed: boolean; projected_spend: number } {
    const projected = this.spend_usd + entry.cost_usd;
    return { would_exceed: projected > this.opts.budget_usd, projected_spend: projected };
  }

  status(): LedgerStatus {
    const ratio = this.spend_usd / this.opts.budget_usd;
    if (ratio > 1) return "exceeded";
    if (ratio >= this.opts.warn_at) return "warn";
    return "ok";
  }

  pickDowngrade(provider: string): string | null {
    return this.opts.downgrade_chain?.[provider] ?? null;
  }
}
