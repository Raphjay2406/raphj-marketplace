export interface LedgerOptions {
    path: string;
    dims: number;
    minDistance?: number;
}
export interface NearestResult {
    id: string;
    distance: number;
    metadata: unknown;
}
export declare class UniquenessLedger {
    private opts;
    private db;
    constructor(opts: LedgerOptions);
    init(): Promise<void>;
    record(id: string, embedding: number[], metadata: unknown): Promise<void>;
    nearest(embedding: number[], k: number): Promise<NearestResult[]>;
    close(): void;
}
//# sourceMappingURL=uniquenessLedger.d.ts.map