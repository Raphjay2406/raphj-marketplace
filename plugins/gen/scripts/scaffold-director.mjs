#!/usr/bin/env node
/**
 * scaffold-director.mjs
 * Creates 10 director agent .md files under agents/directors/
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "agents", "directors");
mkdirSync(outDir, { recursive: true });

const directors = [
  {
    name: "master-orchestrator",
    title: "Master Orchestrator",
    description: "Project-level coordination, state ownership, and wave routing across all pipeline phases",
    capability: "orchestrate-project",
    input: "ProjectSpec",
    output: "WaveRouteMap",
    role: "Owns the full project lifecycle. Reads PROJECT.md and DESIGN-DNA.md on session start, routes each wave to wave-director, tracks phase transitions, and emits lifecycle AG-UI events.",
    inputDesc: "ProjectSpec from /gen:start-project or /gen:align: goals, archetype, section list, wave map",
    outputDesc: "WaveRouteMap — ordered wave assignments with section → worker bindings",
    state: "Owns STATE.md and CONTEXT.md. Writes phase, wave index, and completion flags."
  },
  {
    name: "wave-director",
    title: "Wave",
    description: "Per-wave section routing, parallel dispatch, and merge coordination",
    capability: "route-wave",
    input: "WaveSpec",
    output: "WaveMergeReport",
    role: "Receives a single wave from master-orchestrator. Dispatches section workers in parallel (max 4), collects SUMMARY.md artifacts, merges into STATE.md, and forwards to quality-director for gate check.",
    inputDesc: "WaveSpec: wave index, section list, DNA anchor, archetype, framework target",
    outputDesc: "WaveMergeReport — per-section build status, artifact paths, gate referral",
    state: "Writes per-wave merge records to STATE.md. Clears wave-in-progress flag on completion."
  },
  {
    name: "creative-director",
    title: "Creative",
    description: "Taste enforcement, archetype personality, GAP-FIX authoring, and Design DNA stewardship",
    capability: "enforce-taste",
    input: "SectionArtifact",
    output: "GapFixDirective",
    role: "Reviews all section artifacts against archetype specificity rules and Design DNA. Authors GAP-FIX.md directives when quality falls short. Holds final veto on creative decisions.",
    inputDesc: "SectionArtifact: built section files + SUMMARY.md + quality-director verdict",
    outputDesc: "GapFixDirective — ranked fix list with technique suggestions and DNA token corrections",
    state: "Maintains DECISIONS.md with creative rationale. Appends archetype drift warnings."
  },
  {
    name: "scene-director",
    title: "Scene",
    description: "Persistent 3D canvas management, cross-section camera choreography, and WebGPU/WebGL routing",
    capability: "direct-scene",
    input: "SceneSpec",
    output: "SceneManifest",
    role: "Owns the persistent WebGPU/WebGL canvas across all 3D sections. Routes work to 3D workers (r3f-scene-builder, webgpu-shader-author, etc.), enforces camera continuity, and validates LOD budgets.",
    inputDesc: "SceneSpec: canvas requirements, camera keyframes, asset refs from MASTER-PLAN.md",
    outputDesc: "SceneManifest — canvas config, camera timeline, asset import list, shader registry",
    state: "Owns .planning/genorah/scene-manifest.json. Tracks canvas state across waves."
  },
  {
    name: "narrative-director",
    title: "Narrative",
    description: "Cross-section story arc coherence, emotional beat sequencing, and arc validity enforcement",
    capability: "validate-arc",
    input: "SectionSequence",
    output: "ArcValidationReport",
    role: "Enforces the 10-beat emotional arc across the full page. Detects invalid sequences, flags flat story arcs, and coordinates with creative-director to inject breathe or tension beats as needed.",
    inputDesc: "SectionSequence: ordered section list with beat types from MASTER-PLAN.md",
    outputDesc: "ArcValidationReport — arc validity, beat sequence, flagged transitions, fix suggestions",
    state: "Writes arc position to CONTEXT.md. Maintains narrative thread across compaction."
  },
  {
    name: "asset-director",
    title: "Asset",
    description: "Composite asset pipeline coordination, cost governance, and provenance tracking",
    capability: "direct-assets",
    input: "AssetRequest",
    output: "AssetManifest",
    role: "Orchestrates all AI asset generation (nano-banana, flux, rodin, meshy). Enforces cost budgets, tracks provenance via preservation ledger, and validates DNA alignment before approving assets.",
    inputDesc: "AssetRequest: section beat type, DNA tokens, target dimensions, generation hints",
    outputDesc: "AssetManifest — approved asset paths, generation params, provenance records, cost tally",
    state: "Maintains ASSET-MANIFEST.json and appends to preservation.ledger.ndjson."
  },
  {
    name: "protocol-director",
    title: "Protocol",
    description: "A2A traffic management, schema validation, and inter-agent error routing",
    capability: "route-a2a",
    input: "A2AMessage",
    output: "RoutingDecision",
    role: "Validates all A2A messages against @genorah/protocol schemas. Routes messages to correct workers, handles retries on transient failures, and escalates permanent errors to master-orchestrator.",
    inputDesc: "A2AMessage: envelope with sender, recipient, payload, schema version",
    outputDesc: "RoutingDecision — route target, validation result, retry policy, escalation flag",
    state: "Logs all routing decisions to METRICS.md. Maintains error count per worker."
  },
  {
    name: "quality-director",
    title: "Quality",
    description: "394-point quality gate verdicts, hard gate enforcement, and Playwright visual QA coordination",
    capability: "run-quality-gate",
    input: "SectionArtifact",
    output: "QualityVerdict",
    role: "Runs the full 394-point quality gate (Design Craft 234 + UX Integrity 120 + Ingestion Fidelity 40). Enforces 5 hard gates, coordinates Playwright visual QA, and emits scored verdicts with pass/fail thresholds.",
    inputDesc: "SectionArtifact: built section + SUMMARY.md + archetype + DNA anchor",
    outputDesc: "QualityVerdict — total score, per-axis breakdown, hard gate results, SOTD readiness",
    state: "Writes audit results to .planning/genorah/audit/. Tracks score history in METRICS.md."
  },
  {
    name: "mobile-director",
    title: "Mobile",
    description: "Mobile framework routing (Swift/Kotlin/RN/Expo/Flutter), HIG compliance, and store submission",
    capability: "route-mobile",
    input: "MobileSpec",
    output: "MobileBuildPlan",
    role: "Routes mobile work to framework-specific workers based on target platform. Enforces HIG/Material You compliance, validates cold start budgets, and coordinates store submission validation.",
    inputDesc: "MobileSpec: target platforms, DNA tokens, navigation patterns, performance budget",
    outputDesc: "MobileBuildPlan — framework assignments, DNA bridge config, performance targets",
    state: "Writes mobile build state to STATE.md. Tracks per-platform quality gate scores."
  },
  {
    name: "research-director",
    title: "Research",
    description: "Parallel research orchestration, SOTD benchmarking, and competitive analysis coordination",
    capability: "orchestrate-research",
    input: "ResearchSpec",
    output: "ResearchReport",
    role: "Dispatches up to 6 research workers in parallel. Aggregates SOTD scout data, competitor analysis, archetype research, and trend signals into a unified ResearchReport used by creative-director.",
    inputDesc: "ResearchSpec: industry vertical, archetype candidates, reference targets, keyword seeds",
    outputDesc: "ResearchReport — benchmark scores, competitive gaps, trend signals, archetype fit scores",
    state: "Writes research findings to PROJECT.md. Maintains reference-library index."
  }
];

function buildDirectorMd(d) {
  return `---
name: ${d.name}
id: genorah/${d.name}
version: 4.0.0
channel: stable
tier: director
description: ${d.description}
capabilities:
  - id: ${d.capability}
    input: ${d.input}
    output: ${d.output}
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
context_budget: 120000
state: persistent
---

# ${d.title} Director

## Role

${d.role}

## Input Contract

${d.inputDesc}

## Output Contract

Returns \`Result<T>\` envelope per \`@genorah/protocol\`:
- \`artifact\`: ${d.outputDesc}
- \`verdicts\`: skills used for self-check
- \`followups\`: dispatched workers (if any)

## Protocol

1. Read STATE.md + CONTEXT.md
2. Execute role-specific logic
3. Emit AG-UI events at state transitions
4. Return Result envelope

## State Ownership

${d.state}
`;
}

let count = 0;
for (const d of directors) {
  const filePath = join(outDir, `${d.name}.md`);
  writeFileSync(filePath, buildDirectorMd(d));
  count++;
  console.log(`  created ${d.name}.md`);
}

console.log(`\nDone. Created ${count} director agent files in agents/directors/`);
