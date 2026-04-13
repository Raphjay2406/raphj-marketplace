#!/usr/bin/env node
/**
 * run-persona.mjs — Synthetic persona streaming runner
 * Emits AGENT_STATE_UPDATE NDJSON to stdout as each persona traverses sections.
 * Used by synthetic-persona-prober worker in mid-wave streaming mode.
 */

const PERSONAS = [
  { id: "first-timer",    valuePropThreshold: 8,  touchTarget: false, a11yDependent: false },
  { id: "skeptic",        valuePropThreshold: 10, touchTarget: false, a11yDependent: false },
  { id: "mobile-thumb",   valuePropThreshold: 10, touchTarget: true,  a11yDependent: false },
  { id: "screen-reader",  valuePropThreshold: 10, touchTarget: false, a11yDependent: true  },
  { id: "returning-pro",  valuePropThreshold: 5,  touchTarget: false, a11yDependent: false },
  { id: "c-suite",        valuePropThreshold: 6,  touchTarget: false, a11yDependent: false },
];

/**
 * Emit a single AGENT_STATE_UPDATE event to stdout as NDJSON.
 * @param {object} event
 */
export function emitStateUpdate(event) {
  process.stdout.write(JSON.stringify({ type: "AGENT_STATE_UPDATE", ...event }) + "\n");
}

/**
 * Probe a single section for a persona.
 * Returns a PersonaFinding: { status, detail, croFlags }
 *
 * @param {object} persona
 * @param {string} section — section slug
 * @param {object} dnaAnchor — { archetype, primary, bg, surface }
 * @returns {{ status: string, detail: string, croFlags: string[], converted: boolean }}
 */
export function probeSection(persona, section, dnaAnchor = {}) {
  const archetype = dnaAnchor.archetype ?? "generic";
  const croFlags = [];
  let status = "converted";
  let detail = "";

  // First-timer: value prop clarity (simulated heuristic)
  if (persona.id === "first-timer" && section === "hero") {
    const clarityScore = dnaAnchor.valuePropClarity ?? 75;
    if (clarityScore < 60) {
      status = "confused";
      detail = `Value prop clarity score ${clarityScore} < 60 threshold`;
    }
  }

  // Skeptic: pricing visibility
  if (persona.id === "skeptic" && section === "pricing") {
    const hasAboveFoldPrice = dnaAnchor.pricingAboveFold ?? true;
    if (!hasAboveFoldPrice) {
      status = "abandoned";
      detail = "No price visible above fold";
    }
  }

  // Mobile-thumb: touch target size
  if (persona.touchTarget) {
    const minTouchTarget = dnaAnchor.minTouchTargetPx ?? 44;
    if (minTouchTarget < 44) {
      status = "confused";
      detail = `Touch target ${minTouchTarget}px < 44px minimum`;
      croFlags.push("touch-target-too-small");
    }
  }

  // Screen-reader: landmark presence
  if (persona.a11yDependent) {
    const hasLandmarks = dnaAnchor.hasLandmarks ?? true;
    if (!hasLandmarks) {
      status = "confused";
      detail = "Missing ARIA landmarks or broken focus order";
      croFlags.push("missing-landmarks");
    }
  }

  // Generic CTA detection
  const ctaLabel = dnaAnchor.ctaLabel ?? "";
  if (["submit", "click here", "learn more"].includes(ctaLabel.toLowerCase())) {
    croFlags.push("generic-cta");
  }

  // Luxury archetype: hide pricing is expected, not a bug
  if (persona.id === "skeptic" && archetype === "luxury" && status === "abandoned") {
    status = "converted";
    detail = "Luxury archetype: pricing intentionally withheld above fold";
    croFlags.length = 0;
  }

  return { status, detail, croFlags, converted: status === "converted" };
}

/**
 * Run all 6 personas across the given sections.
 * Emits AGENT_STATE_UPDATE events to stdout.
 *
 * @param {string[]} sections
 * @param {object} dnaAnchor
 * @param {string} waveId
 * @returns {Promise<object>} PersonaProbeReport
 */
export async function runAllPersonas(sections, dnaAnchor = {}, waveId = "wave-0") {
  const allFindings = await Promise.all(
    PERSONAS.map(async (persona) => {
      const sectionFindings = [];
      for (const section of sections) {
        emitStateUpdate({
          agent: "synthetic-persona-prober",
          wave_id: waveId,
          persona_id: persona.id,
          section,
          status: "visiting",
          ts: new Date().toISOString(),
        });

        const finding = probeSection(persona, section, dnaAnchor);

        emitStateUpdate({
          agent: "synthetic-persona-prober",
          wave_id: waveId,
          persona_id: persona.id,
          section,
          status: finding.status,
          detail: finding.detail || undefined,
          ts: new Date().toISOString(),
        });

        sectionFindings.push({ section, ...finding });
      }
      const converted = sectionFindings.every(f => f.converted);
      return { personaId: persona.id, findings: sectionFindings, converted };
    })
  );

  const completionRate = allFindings.filter(r => r.converted).length / PERSONAS.length;
  const confusionMap = buildConfusionMap(allFindings);
  const croFlags = collectCroFlags(allFindings);

  const report = { waveId, completionRate, confusionMap, croFlags, personas: allFindings };

  emitStateUpdate({
    agent: "synthetic-persona-prober",
    wave_id: waveId,
    persona_id: "all",
    section: "summary",
    status: "findings_ready",
    detail: `completion_rate=${(completionRate * 100).toFixed(0)}% cro_flags=${croFlags.length}`,
    ts: new Date().toISOString(),
  });

  return report;
}

function buildConfusionMap(findings) {
  const map = {};
  for (const { findings: sFindings } of findings) {
    for (const f of sFindings) {
      if (f.status === "confused" || f.status === "abandoned") {
        map[f.section] = (map[f.section] ?? 0) + 1;
      }
    }
  }
  return map;
}

function collectCroFlags(findings) {
  const flags = new Set();
  for (const { findings: sFindings } of findings) {
    for (const f of sFindings) {
      for (const flag of f.croFlags ?? []) flags.add(flag);
    }
  }
  return [...flags];
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith("run-persona.mjs")) {
  const sections = (process.env.SECTIONS ?? "hero,features,pricing,cta").split(",");
  const waveId = process.env.WAVE_ID ?? "wave-cli";
  const dnaAnchor = {};
  runAllPersonas(sections, dnaAnchor, waveId).then(report => {
    process.stderr.write(JSON.stringify(report, null, 2) + "\n");
  });
}
