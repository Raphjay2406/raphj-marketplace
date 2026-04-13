import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";

export interface LedgerOptions {
  path: string;
  dims: number;
  minDistance?: number;
}

export interface NearestResult { id: string; distance: number; metadata: unknown; }

export class UniquenessLedger {
  private db: Database.Database;

  constructor(private opts: LedgerOptions) {
    this.db = new Database(opts.path);
    sqliteVec.load(this.db);
  }

  async init(): Promise<void> {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS sigs USING vec0(embedding float[${this.opts.dims}]);
      CREATE TABLE IF NOT EXISTS sig_meta (rowid INTEGER PRIMARY KEY, id TEXT, metadata TEXT);
    `);
  }

  async record(id: string, embedding: number[], metadata: unknown): Promise<void> {
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

  async nearest(embedding: number[], k: number): Promise<NearestResult[]> {
    const rows = this.db.prepare(`
      SELECT rowid, distance FROM sigs WHERE embedding MATCH ? ORDER BY distance LIMIT ?
    `).all(new Float32Array(embedding), k) as Array<{ rowid: number; distance: number }>;
    const results: NearestResult[] = [];
    for (const r of rows) {
      const meta = this.db
        .prepare("SELECT id, metadata FROM sig_meta WHERE rowid = ?")
        .get(r.rowid) as { id: string; metadata: string } | undefined;
      if (meta) results.push({ id: meta.id, distance: r.distance, metadata: JSON.parse(meta.metadata) });
    }
    return results;
  }

  close(): void {
    this.db.close();
  }
}
