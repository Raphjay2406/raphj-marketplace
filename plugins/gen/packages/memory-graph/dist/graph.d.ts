import { DecisionRecord } from "./schema.js";
export interface GraphOptions {
    path: string;
    dims: number;
}
export declare class MemoryGraph {
    private opts;
    private db;
    constructor(opts: GraphOptions);
    init(): Promise<void>;
    record(d: DecisionRecord): Promise<void>;
    query(q: {
        embedding: number[];
        k: number;
        filter?: {
            archetype?: string;
            min_score?: number;
            project_id?: string;
        };
    }): Promise<Array<DecisionRecord & {
        distance: number;
    }>>;
}
//# sourceMappingURL=graph.d.ts.map