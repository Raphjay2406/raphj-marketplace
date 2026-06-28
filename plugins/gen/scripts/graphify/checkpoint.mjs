// scripts/graphify/checkpoint.mjs
// Pure helpers for the post-tool-use graphify trigger.
// No I/O, no side effects — safe to unit-test and dynamically import.

const CHECKPOINT_KINDS = new Set(['section-shipped', 'decision-made', 'commit-made', 'asset-generated']);

/**
 * Returns true when the journal event kind is a graphify checkpoint.
 * @param {{ kind?: string }} event
 * @returns {boolean}
 */
export function isCheckpoint(event) {
  return !!event && CHECKPOINT_KINDS.has(event.kind);
}

/**
 * Returns true when a graphify update should fire (debounce check).
 * @param {{ now: number, lastStampMs: number|null, debounceMs?: number }} opts
 * @returns {boolean}
 */
export function shouldUpdate({ now, lastStampMs, debounceMs = 30000 }) {
  if (lastStampMs == null) return true;
  return now - lastStampMs >= debounceMs;
}
