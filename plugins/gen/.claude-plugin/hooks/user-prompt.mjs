/**
 * UserPromptSubmit hook for Genorah v3.0
 *
 * 1. Stale-reference translation: detects old /modulo:* commands and injects migration hints.
 * 2. Flow-state awareness: when the user seems lost, reads STATE.md and suggests next cmd.
 * 3. v3.0 Smart Router: intent detection → maps natural language to /gen:* suggestions.
 * 4. v3.0 Action queue surfacing: if dashboard queued commands, surface them.
 * 5. v3.0 Model cascade advisory: if current wave recommends a different model, nudge.
 *
 * Protocol: reads JSON from stdin, writes JSON to stdout.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
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
// Tightened v3.0.1: single words like "help" false-triggered on docs questions.
// Now require combined lost-signal phrasing OR explicit "stuck" / "lost" keywords.
const LOST_SIGNALS = [
  /what\s*now\b/i,
  /what\s*(should\s*i|do\s*i)\s*(do|run)/i,
  /what'?s?\s*next/i,
  /where\s*am\s*i/i,
  /\bi['\s]*m\s*(stuck|lost|confused)\b/i,
  /\b(stuck|lost)\s*(here|now|on\s*this)\b/i,
  /\bhelp\s*me\s*(out|here|with\s*(this|what|where))\b/i,
];

// ── v3.0 Smart Router: intent → /gen:* ─────────────────────────────
// Fires only when user's message does NOT already start with /gen: and is not a /modulo: stale ref.
const INTENT_MAP = [
  { rx: /\b(fix|broken|error|bug|crash|not\s*working)\b/i,           to: "/gen:bugfix" },
  { rx: /\b(audit|score|review\s+quality|check\s+quality|lint)\b/i,  to: "/gen:audit" },
  { rx: /\b(self[\s-]?audit|plugin\s+audit|validate\s+plugin)\b/i,   to: "/gen:self-audit" },
  { rx: /\b(launch|deploy|ship|export|hand[\s-]?off)\b/i,            to: "/gen:export" },
  { rx: /\b(dashboard|cockpit|live\s+view|monitor)\b/i,              to: "/gen:dashboard" },
  { rx: /\b(benchmark|compare\s+(to|against)|competitor\s+sites)\b/i, to: "/gen:benchmark" },
  { rx: /\b(tournament|variants?|A\/?B|multiple\s+directions)\b/i,   to: "/gen:tournament" },
  { rx: /\b(companion|preview|localhost\s+view)\b/i,                 to: "/gen:companion" },
  { rx: /\bfeedback\b/i,                                             to: "/gen:feedback" },
  { rx: /\b(migrate|upgrade\s+project)\b/i,                          to: "/gen:migrate" },
  { rx: /\b(iterate|change\s+design|redesign\s+section|adjust)\b/i,  to: "/gen:iterate" },
  { rx: /\b(sync\s+(knowledge|vault|obsidian))\b/i,                  to: "/gen:sync-knowledge" },
];

function detectIntent(msg) {
  // Skip if user already invoked a slash command
  if (/^\s*\/gen:/.test(msg)) return null;
  if (/^\s*\/modulo:/.test(msg)) return null;
  for (const { rx, to } of INTENT_MAP) {
    if (rx.test(msg)) return to;
  }
  return null;
}

// ── v3.0 Action queue surface ──────────────────────────────────────
function queuedActions(cwd) {
  const queueDir = join(cwd, ".planning", "genorah", ".action-queue");
  if (!existsSync(queueDir)) return [];
  try {
    return readdirSync(queueDir).slice(0, 5);
  } catch { return []; }
}

// v3.0.1: state detection aligned with skills/pipeline-guidance Layer 2 algorithm.
// Falls back to STATE.md keyword matching when artifact files aren't readable.
function detectPipelineState(cwd) {
  const g = (p) => existsSync(join(cwd, ".planning", "genorah", p));
  const l = (p) => existsSync(join(cwd, ".planning", "modulo", p));

  if (!existsSync(join(cwd, ".planning", "genorah")) && existsSync(join(cwd, ".planning", "modulo"))) return "EMPTY_LEGACY";
  if (!existsSync(join(cwd, ".planning", "genorah"))) return "EMPTY";
  if (!g("PROJECT.md")) return "EMPTY";
  if (!g("BRAINSTORM.md")) return "DISCOVERY";
  if (!g("DESIGN-DNA.md")) return "RESEARCH";
  if (!g("MASTER-PLAN.md")) return "DNA_COMPLETE";

  // sections check
  try {
    const sectionsDir = join(cwd, ".planning", "genorah", "sections");
    if (!existsSync(sectionsDir)) return "PLANNING_COMPLETE";
    const secs = readdirSync(sectionsDir);
    const summaries = secs.filter(s => existsSync(join(sectionsDir, s, "SUMMARY.md")));
    if (summaries.length === 0) return "PLANNING_COMPLETE";
    const statuses = summaries.map(s => {
      try { return readFileSync(join(sectionsDir, s, "SUMMARY.md"), "utf-8"); } catch { return ""; }
    });
    if (statuses.some(c => /STATUS:\s*FAILED/i.test(c))) return "EXECUTION_FAILED";
    if (summaries.length < secs.length || statuses.some(c => !/STATUS:\s*COMPLETE/i.test(c))) return "EXECUTION_IN_PROGRESS";
  } catch { /* fall through */ }

  if (!g("audit/AUDIT-REPORT.md")) return "EXECUTION_COMPLETE";

  try {
    const audit = readFileSync(join(cwd, ".planning", "genorah", "audit", "AUDIT-REPORT.md"), "utf-8");
    const m = audit.match(/(?:score|total)[:\s]+(\d+)/i);
    if (m && parseInt(m[1], 10) >= 200) return "AUDIT_PASSED";
    return "AUDIT_BELOW_GATE";
  } catch { return "EXECUTION_COMPLETE"; }
}

// Compact form of pipeline-guidance Layer 2 mapping table.
// Authoritative table in skills/pipeline-guidance/SKILL.md.
const STATE_TO_COMMAND = {
  EMPTY:                  { cmd: "/gen:start-project",    why: "begin a new Genorah project" },
  EMPTY_LEGACY:           { cmd: "/gen:migrate",          why: "legacy .planning/modulo/ detected — migrate first" },
  DISCOVERY:              { cmd: "/gen:start-project",    why: "continue discovery" },
  RESEARCH:               { cmd: "/gen:start-project",    why: "lock direction + generate DNA" },
  DNA_COMPLETE:           { cmd: "/gen:plan",             why: "sections, waves, emotional arc" },
  PLANNING_COMPLETE:      { cmd: "/gen:build",            why: "wave-based implementation" },
  EXECUTION_IN_PROGRESS:  { cmd: "/gen:build --resume",   why: "continue current wave" },
  EXECUTION_FAILED:       { cmd: "/gen:bugfix",           why: "section failed — diagnose first" },
  EXECUTION_COMPLETE:     { cmd: "/gen:audit",            why: "score on 234-point gate" },
  AUDIT_BELOW_GATE:       { cmd: "/gen:iterate",          why: "improve lowest-scoring sections" },
  AUDIT_PASSED:           { cmd: "/gen:export",           why: "score passed — produce deliverables" },
  UNKNOWN:                { cmd: "/gen:status -v",        why: "diagnose current state" },
};

function suggestFromState(cwd) {
  const state = detectPipelineState(cwd);
  return STATE_TO_COMMAND[state] || STATE_TO_COMMAND.UNKNOWN;
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
    const { cmd, why } = suggestFromState(process.cwd());
    hints.push(`Suggested next: \`${cmd}\` — ${why}`);
  }

  // 3. v3.0 Smart Router — intent detection for natural-language prompts
  const suggested = detectIntent(user_message);
  if (suggested) {
    hints.push(`Intent suggests \`${suggested}\` — invoke explicitly to scope the workflow.`);
  }

  // 4. v3.0 Action queue surface — dashboard queued commands waiting for user invocation
  const queued = queuedActions(process.cwd());
  if (queued.length) {
    const cmds = queued.map(f => f.match(/-([a-z-]+)\.json$/)?.[1]).filter(Boolean);
    if (cmds.length) {
      hints.push(`Dashboard queued ${cmds.length} action(s): ${cmds.map(c => `/gen:${c}`).join(", ")}`);
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
