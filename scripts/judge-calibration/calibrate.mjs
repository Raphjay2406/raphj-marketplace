/**
 * Self-improving judge weight calibration.
 * Reads the post-ship delta log and bumps weights for categories with high miss rates.
 */

export function calibrateWeights(currentWeights, delta, opts = {}) {
  const maxShift = opts.max_shift ?? 0.2;
  if (delta.mean_error < 10) return { ...currentWeights };
  const next = { ...currentWeights };
  const total = Object.values(delta.missed_category_counts).reduce((s, n) => s + n, 0) || 1;
  for (const [cat, count] of Object.entries(delta.missed_category_counts)) {
    if (!(cat in next)) continue;
    const shift = Math.min(maxShift, (count / total) * maxShift * 2);
    next[cat] = +(next[cat] + shift).toFixed(2);
  }
  return next;
}

// CLI entry point: reads delta log + current weights, writes updated weights
if (process.argv[1] && process.argv[1].endsWith("calibrate.mjs")) {
  const { DeltaLog } = await import("./delta-log.mjs");
  const { readFileSync, writeFileSync, existsSync } = await import("fs");
  const { homedir } = await import("os");
  const { join } = await import("path");
  const { fileURLToPath } = await import("url");
  const { dirname } = await import("path");

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const weightsPath = join(__dirname, "../../skills/quality-gate-v3/weights.json");
  const deltaPath = join(homedir(), ".claude/genorah/post-ship-delta.jsonld");

  if (!existsSync(deltaPath)) {
    console.log("No delta log found at", deltaPath, "— nothing to calibrate.");
    process.exit(0);
  }

  const log = new DeltaLog(deltaPath);
  const delta = await log.delta();
  if (delta.samples < 3) {
    console.log(`Only ${delta.samples} samples — need ≥3 for reliable calibration. Skipping.`);
    process.exit(0);
  }

  const current = existsSync(weightsPath)
    ? JSON.parse(readFileSync(weightsPath, "utf8"))
    : {};

  const next = calibrateWeights(current, delta);
  writeFileSync(weightsPath, JSON.stringify(next, null, 2) + "\n");
  console.log("Calibrated weights written to", weightsPath);
  console.log("Delta:", JSON.stringify(delta, null, 2));
}
