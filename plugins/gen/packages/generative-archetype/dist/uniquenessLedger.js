import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
export class UniquenessLedger {
    opts;
    db;
    constructor(opts) {
        this.opts = opts;
        this.db = new Database(opts.path);
        sqliteVec.load(this.db);
    }
    async init() {
        this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS sigs USING vec0(embedding float[${this.opts.dims}]);
      CREATE TABLE IF NOT EXISTS sig_meta (rowid INTEGER PRIMARY KEY, id TEXT, metadata TEXT);
    `);
    }
    async record(id, embedding, metadata) {
        if (embedding.length !== this.opts.dims) {
            throw new Error(`expected ${this.opts.dims} dims, got ${embedding.length}`);
        }
        const min = this.opts.minDistance ?? 0;
        if (min > 0) {
            const near = await this.nearest(embedding, 1);
            if (near.length && near[0].distance < min) {
                throw new Error(`new signature too similar to ${near[0].id} (d=${near[0].distance})`);
            }
        }
        const { lastInsertRowid } = this.db
            .prepare("INSERT INTO sigs(embedding) VALUES (?)")
            .run(new Float32Array(embedding));
        this.db
            .prepare("INSERT INTO sig_meta(rowid, id, metadata) VALUES (?, ?, ?)")
            .run(Number(lastInsertRowid), id, JSON.stringify(metadata));
    }
    async nearest(embedding, k) {
        const rows = this.db.prepare(`
      SELECT rowid, distance FROM sigs WHERE embedding MATCH ? ORDER BY distance LIMIT ?
    `).all(new Float32Array(embedding), k);
        const results = [];
        for (const r of rows) {
            const meta = this.db
                .prepare("SELECT id, metadata FROM sig_meta WHERE rowid = ?")
                .get(r.rowid);
            if (meta)
                results.push({ id: meta.id, distance: r.distance, metadata: JSON.parse(meta.metadata) });
        }
        return results;
    }
    close() {
        this.db.close();
    }
}
