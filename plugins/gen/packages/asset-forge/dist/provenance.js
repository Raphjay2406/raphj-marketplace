import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { ManifestSchema } from "./schemas/manifest.schema.js";
export class ProvenanceWriter {
    opts;
    constructor(opts) {
        this.opts = opts;
    }
    read() {
        if (!existsSync(this.opts.path))
            return { schema_version: "4.0.0", entries: [] };
        return ManifestSchema.parse(JSON.parse(readFileSync(this.opts.path, "utf8")));
    }
    async append(entry) {
        const manifest = this.read();
        if (manifest.entries.some(e => e.sha256 === entry.sha256))
            return;
        manifest.entries.push({ ...entry, recorded_at: new Date().toISOString() });
        mkdirSync(dirname(this.opts.path), { recursive: true });
        writeFileSync(this.opts.path, JSON.stringify(manifest, null, 2));
    }
}
