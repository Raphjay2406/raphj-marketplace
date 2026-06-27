import { test } from "node:test";
import { strict as assert } from "node:assert";
import { rmSync } from "fs";
import { DeltaLog } from "./delta-log.mjs";

const TMP = "/tmp/delta-log-test.jsonld";
try { rmSync(TMP); } catch {}

test("append + read roundtrips", async () => {
  const log = new DeltaLog(TMP);
  await log.append({
    project_id: "p1", predicted_score: 210, actual_post_ship_score: 195,
    missed_categories: ["Creative Courage"], observed_at: Date.now()
  });
  const entries = await log.read();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].predicted_score, 210);
});

test("delta() reports mean error per category", async () => {
  const log = new DeltaLog(TMP);
  await log.append({
    project_id: "p2", predicted_score: 220, actual_post_ship_score: 200,
    missed_categories: ["Creative Courage"], observed_at: Date.now()
  });
  const r = await log.delta();
  assert.ok(r.mean_error >= 15);
  assert.ok(r.missed_category_counts["Creative Courage"] >= 1);
});
