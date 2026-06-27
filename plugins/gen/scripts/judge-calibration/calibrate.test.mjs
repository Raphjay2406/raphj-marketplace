import { test } from "node:test";
import { strict as assert } from "node:assert";
import { calibrateWeights } from "./calibrate.mjs";

test("increases weight on category with high mean error", () => {
  const current = { "Creative Courage": 1.2, "Color System": 1.2, "Typography": 1.2 };
  const delta = {
    samples: 5, mean_error: 20,
    missed_category_counts: { "Creative Courage": 4, "Color System": 1 }
  };
  const next = calibrateWeights(current, delta, { max_shift: 0.2 });
  assert.ok(next["Creative Courage"] > current["Creative Courage"]);
  assert.ok(next["Creative Courage"] <= current["Creative Courage"] + 0.2);
});

test("does not shift when mean_error < 10", () => {
  const current = { A: 1, B: 1 };
  const next = calibrateWeights(
    current,
    { samples: 3, mean_error: 5, missed_category_counts: { A: 1 } },
    { max_shift: 0.2 }
  );
  assert.deepEqual(next, current);
});
