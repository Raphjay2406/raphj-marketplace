export interface LedgerEntry {
    provider: string;
    cost_usd: number;
    at?: number;
    note?: string;
}
export interface LedgerOptions {
    budget_usd: number;
    warn_at: number;
    downgrade_chain?: Record<string, string>;
}
export type LedgerStatus = "ok" | "warn" | "exceeded";
export declare class CostLedger {
    readonly opts: LedgerOptions;
    readonly entries: LedgerEntry[];
    constructor(opts: Partial<LedgerOptions> & {
        budget_usd: number;
    });
    get spend_usd(): number;
    record(entry: LedgerEntry): void;
    preview(entry: LedgerEntry): {
        would_exceed: boolean;
        projected_spend: number;
    };
    status(): LedgerStatus;
    pickDowngrade(provider: string): string | null;
}
//# sourceMappingURL=cost-ledger.d.ts.map