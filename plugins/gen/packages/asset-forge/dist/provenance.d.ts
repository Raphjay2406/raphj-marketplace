import { ManifestEntry, Manifest } from "./schemas/manifest.schema.js";
export interface WriterOptions {
    path: string;
}
export declare class ProvenanceWriter {
    private opts;
    constructor(opts: WriterOptions);
    read(): Manifest;
    append(entry: Omit<ManifestEntry, "recorded_at">): Promise<void>;
}
//# sourceMappingURL=provenance.d.ts.map