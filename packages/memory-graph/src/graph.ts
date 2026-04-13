import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { DecisionRecord } from "./schema.js";

export interface GraphOptions { path: string; dims: number; }

export class MemoryGraph {
  private db: Database.Database;
  constructor(private opts: GraphOptions) {
    this.db = new Database(opts.path);
    sqliteVec.load(this.db);
  }
  async init(): Promise<void> {
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS vec_decisions USING vec0(embedding float[${this.opts.dims}]);
      CREATE TABLE IF NOT EXISTS decisions (
        rowid INTEGER PRIMARY KEY,
        project_id TEXT, decision_id TEXT, archetype TEXT,
        score INTEGER, category TEXT, summary TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_archetype ON decisions(archetype);
      CREATE INDEX IF NOT EXISTS idx_score ON decisions(score);
    `);
  }
  async record(d: DecisionRecord): Promise<void> {
    if (d.embedding.length !== this.opts.dims) throw new Error(`expected ${this.opts.dims} dims`);
    const rowid = this.db
      .prepare("INSERT INTO vec_decisions(embedding) VALUES (?)")
      .run(new Float32Array(d.embedding)).lastInsertRowid;
    this.db.prepare(`
      INSERT INTO decisions(rowid, project_id, decision_id, archetype, score, category, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(Number(rowid), d.project_id, d.decision_id, d.archetype, d.score, d.category, d.summary);
  }
  async query(q: {
    embedding: number[];
    k: number;
    filter?: { archetype?: string; min_score?: number; project_id?: string };
  }): Promise<Array<DecisionRecord & { distance: number }>> {
    const rows = this.db.prepare(`
      SELECT rowid, distance FROM vec_decisions WHERE embedding MATCH ? ORDER BY distance LIMIT ?
    `).all(new Float32Array(q.embedding), q.k * 4) as Array<{ rowid: number; distance: number }>;
    const out: Array<DecisionRecord & { distance: number }> = [];
    for (const r of rows) {
      const meta = this.db.prepare("SELECT * FROM decisions WHERE rowid = ?").get(r.rowid) as any;
      if (!meta) continue;
      if (q.filter?.archetype && meta.archetype !== q.filter.archetype) continue;
      if (q.filter?.min_score != null && meta.score < q.filter.min_score) continue;
      if (q.filter?.project_id && meta.project_id !== q.filter.project_id) continue;
      out.push({ ...meta, embedding: q.embedding, distance: r.distance });
      if (out.length === q.k) break;
    }
    return out;
  }
}
