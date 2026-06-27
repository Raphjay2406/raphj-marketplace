import { readFileSync, existsSync, appendFileSync } from "fs";

export class DeltaLog {
  constructor(path) { this.path = path; }

  async append(entry) {
    appendFileSync(this.path, JSON.stringify(entry) + "\n");
  }

  async read() {
    if (!existsSync(this.path)) return [];
    return readFileSync(this.path, "utf8")
      .trim().split("\n").filter(Boolean).map(JSON.parse);
  }

  async delta() {
    const rows = await this.read();
    if (rows.length === 0) return { samples: 0, mean_error: 0, missed_category_counts: {} };
    const mean_error = rows.reduce(
      (s, r) => s + Math.abs(r.predicted_score - r.actual_post_ship_score), 0
    ) / rows.length;
    const missed_category_counts = {};
    for (const r of rows) {
      for (const c of (r.missed_categories || [])) {
        missed_category_counts[c] = (missed_category_counts[c] || 0) + 1;
      }
    }
    return { samples: rows.length, mean_error, missed_category_counts };
  }
}
