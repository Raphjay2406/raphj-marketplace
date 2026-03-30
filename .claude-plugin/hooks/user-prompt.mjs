/**
 * UserPromptSubmit hook for Genorah v2.0
 *
 * 1. Stale-reference translation: detects old /modulo:* commands and flags
 *    and injects migration hints.
 * 2. Flow-state awareness: when the user seems lost, reads STATE.md and
 *    suggests the contextually correct next command.
 *
 * Protocol: reads JSON from stdin, writes JSON to stdout.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ── Stale reference map ────────────────────────────────────────────
const STALE_REFS = [
  { pattern: /\/modulo:execute/i,        msg: "`/modulo:execute` is now `/gen:build`" },
  { pattern: /\/modulo:lets-discuss/i,    msg: "`/modulo:lets-discuss` is now `/gen:discuss`" },
  { pattern: /\/modulo:plan-dev/i,        msg: "`/modulo:plan-dev` is now `/gen:plan`" },
  { pattern: /\/modulo:bug-fix/i,         msg: "`/modulo:bug-fix` is now `/gen:bugfix`" },
  { pattern: /\/modulo:start-project/i,   msg: "Commands now use `/gen:` prefix. Use `/gen:start-project`" },
  { pattern: /\/modulo:iterate/i,         msg: "Commands now use `/gen:` prefix. Use `/gen:iterate`" },
  { pattern: /\/modulo:audit/i,           msg: "Commands now use `/gen:` prefix. Use `/gen:audit`" },
  { pattern: /\/modulo:status/i,          msg: "Commands now use `/gen:` prefix. Use `/gen:status`" },
  { pattern: /--from-gaps/i,             msg: "`--from-gaps` removed. `/gen:iterate` auto-reads GAP-FIX.md" },
  { pattern: /\.planning\/modulo/i,       msg: "Artifact directory is now `.planning/genorah/`" },
];

// ── Lost-user signals ──────────────────────────────────────────────
const LOST_SIGNALS = [
  /what\s*now/i,
  /what\s*next/i,
  /what\s*should\s*i/i,
  /where\s*am\s*i/i,
  /\bhelp\b/i,
  /\bstuck\b/i,
];

function suggestFromPhase(stateContent) {
  const lower = stateContent.toLowerCase();

  if (/complete|audit/.test(lower))           return "/gen:audit or /gen:iterate";
  if (/build|wave\s*\d/i.test(lower))         return "/gen:build --resume or /gen:iterate";
  if (/plan/.test(lower))                      return "/gen:build or /gen:discuss";
  if (/discover|research/.test(lower))         return "/gen:discuss or /gen:plan";

  return "/gen:start-project";
}

// ── Main ───────────────────────────────────────────────────────────
try {
  const raw = readFileSync(0, "utf-8");           // stdin (fd 0)
  const { user_message = "" } = JSON.parse(raw);

  const hints = [];

  // 1. Stale reference translation
  for (const { pattern, msg } of STALE_REFS) {
    if (pattern.test(user_message)) {
      hints.push(msg);
    }
  }

  // 2. Flow-state awareness -- only when user seems lost
  const isLost = LOST_SIGNALS.some((rx) => rx.test(user_message));
  if (isLost) {
    const statePath = join(process.cwd(), ".planning", "genorah", "STATE.md");
    if (existsSync(statePath)) {
      const state = readFileSync(statePath, "utf-8");
      const suggestion = suggestFromPhase(state);
      hints.push(`Current project state detected. Try: ${suggestion}`);
    } else {
      hints.push("No project state found. Start with `/gen:start-project`");
    }
  }

  // Output
  if (hints.length > 0) {
    const additionalContext =
      "<!-- genorah:user-prompt-hook -->\n" +
      hints.map((h) => `- ${h}`).join("\n") +
      "\n<!-- /genorah:user-prompt-hook -->";
    process.stdout.write(JSON.stringify({ additionalContext }));
  } else {
    process.stdout.write("{}");
  }
} catch {
  // Graceful failure -- emit empty object so the hook never blocks
  process.stdout.write("{}");
}
