# Genorah v4 — "Cinematic Intelligence"

**Status:** Design approved via brainstorming session, pending implementation planning
**Date:** 2026-04-12
**Author:** brainstorming session (16 locked decisions)
**Supersedes:** Current v3.25.0 architecture where explicitly noted
**Next step:** Implementation plan via `writing-plans` skill

---

## 1. Summary

Genorah v4 is the biggest update since the plugin's inception. It ships six tightly-coupled pillars that together break every hard ceiling surfaced in the v3.25 capability audit:

1. **Cinematic Canvas** — persistent single-canvas 3D with cross-section camera choreography, matching award-winning references (Sustainability bust, Skytronix drone, Lusion persistent-scene pattern)
2. **Asset Forge 2.0** — recipe-driven photoreal composite pipelines with 5 new MCP integrations and user-global caching
3. **A2A Protocol Layer** — L4 full protocol citizenship (internal + inbound + bidirectional + marketplace + MCP sampling v2)
4. **Agent Specialization** — 24 → 104 agents via tiered hybrid (10 directors + 94 workers, validators as skills)
5. **Design Beyond Archetypes** — generative, living, signature-locked, composable, neuro-aesthetically-judged
6. **Built Beyond Limits** — streaming pipeline, cross-project memory graph, agent marketplace, offline-first, self-improving judge

**Headline numbers:** 104 agents (was 24) · 50 archetypes (was 33) · 394-pt quality gate (was 354) · 7 MCP integrations (was 2) · ~885 tests (was 109) · 22-week estimated scope.

*Gate progression: 234 Design Craft + 120 UX Integrity = 354 (v3.25) → 254 Design Craft (+ Scene Craft 20) + 140 UX Integrity (+ Neuro-aesthetic 20) = 394 (v4).*

The release is named "Cinematic Intelligence" to reflect the two defining themes: (a) the cinematic 3D tier that the pipeline can now produce end-to-end, and (b) the protocol-typed, self-aware agent fleet that coordinates it.

---

## 2. Problem statement

### 2.1 What v3.25 cannot do

A capability audit of v3.25 surfaced five hard ceilings:

1. **No scroll-driven 3D choreography across sections.** Each section's 3D scene is static or locally animated. No pattern for "hero object position/rotation/scale responds to scroll progress across 3+ sections" or "camera flies from section hero to next section hero." Blocks cinematic hero moments that demand cross-section visual continuity.

2. **Character-to-product compositing is not orchestrated.** `character-consistency` (expression/pose variants), `inpainting-workflow` (mask edits), and `upscaling` exist as independent skills. No orchestrator chains them end-to-end. Builders must manually compose or accept asset drift.

3. **Mobile-framework specialization is bundled.** One `mobile-specialist` owns Swift, Kotlin, RN, Expo, and Flutter. No framework-specific sub-specialists means generic patterns ship where platform-idiomatic code is required.

4. **No structured protocol layer for agent communication.** All inter-agent messaging is freetext `SendMessage` + file-based handoffs + implicit `TodoWrite`. No typed message schema, no versioned handoff contract, no validation. Renaming a `GAP-FIX.md` field breaks polisher silently.

5. **Photoreal hero composition is not end-to-end.** `image-cascade` generates single subjects with optional ControlNet conditioning. No pattern for multi-layer composition (hero BG + product float + character + lighting coherence). Nano-banana texture generation for 3D is silent in fallback paths.

### 2.2 What v4 must enable

Two concrete reference images guide the design:

- A **Sustainability** landing page with a photoreal 3D bust covered in flowers, cinematic lighting, scroll-driven scene cohesion
- A **Skytronix** drone hero with dark cinematic treatment, floating product, scene-based composition

Neither is reachable with current v3.25 skills. v4 targets exactly this tier while keeping the existing 33 archetypes working unchanged.

### 2.3 Strategic goals (user-stated, April 2026)

1. Push design boundaries beyond the current system
2. Better asset generation
3. Interactive 3D hero + interconnected sections like the reference images
4. Built beyond current limitations
5. More specialized agents that are very good at a specific task (narrow over generalist)
6. Full agent-to-agent communication compatibility

---

## 3. Architectural principles

### 3.1 Tiered hybrid agent topology

**Tier 1 — Directors (10 agents)** hold *taste* decisions. They are:
- The only tier that talks to the user
- Stateful across the project lifecycle
- Each with an owned context budget that does not spill into workers

**Tier 2 — Workers (94 agents)** produce *artifacts*. They are:
- Stateless (spawned fresh per task, no memory across calls)
- Narrow: one technology domain or one artifact type per worker
- Tiered isolation: worktree for code-writing workers, in-process for artifact-returning workers

**Tier 3 — Validators** exist as *skills*, not agents. They are invoked by workers for self-verdict before the worker returns. No orchestration overhead; verdicts travel inside the worker's `Result<T>` envelope.

### 3.2 Typed message protocol

Every worker returns the same envelope shape:

```typescript
interface Result<T> {
  artifact: T;                              // typed artifact
  verdicts: Verdict[];                       // self-check validator verdicts
  trace: {                                   // optional (env-flagged off for cost)
    decisions: Decision[];
    skills_used: string[];
    cost: { tokens_in, tokens_out, api_spend_usd };
  };
  status: "ok" | "partial" | "failed";
  followups: Followup[];                     // suggested next worker calls
}

interface Verdict {
  validator: string;                         // skill id
  pass: boolean;
  score?: number;
  notes?: string;
}

interface Followup {
  suggested_worker: string;
  reason: string;
  context_override?: object;
}
```

The same envelope is used internally (Claude Code subagent calls) and externally (A2A task responses). External callers see a protocol-compliant shape; internal callers see a type-checked object.

### 3.3 L4 protocol citizenship

v4 commits to the maximum A2A compatibility level:

- **L1 (internal)** — JSON-schema-validated messages replacing freetext SendMessage
- **L2 (inbound)** — every agent publishes `/.well-known/agent.json` per Google A2A v0.3. External orchestrators (LangGraph, CrewAI, AutoGen) can call into Genorah agents
- **L3 (bidirectional)** — Genorah can call out to third-party A2A agents; AG-UI events emitted per CopilotKit v1.0 spec for external dashboards
- **L4 (citizenship)** — MCP sampling v2 support (Genorah agents callable by any MCP host), A2A agent marketplace participation, contribution to the A2A spec working group

### 3.4 Transport: MCP-native default, HTTP opt-in, cloud v4.1

- **Default:** Genorah agents expose themselves as MCP primitives. Works out of the box inside any MCP host. No separate infrastructure.
- **Opt-in:** local embedded Node.js HTTP daemon exposes A2A endpoints on `localhost:N` for local dev and local A2A orchestrators.
- **Deferred to v4.1:** cloud relay at `agents.genorah.dev` that proxies WAN A2A calls back to the local daemon via WebSocket.

### 3.5 Agent identity: semver + channel

Every agent has a stable ID: `genorah/<agent-name>@<semver>+<channel>` (e.g. `genorah/creative-director@4.0.0+stable`). Channels: `stable`, `beta`, `canary`. External callers pin to a channel or exact version.

### 3.6 Structured error taxonomy

Every failure returns:

```typescript
interface StructuredError {
  code: "WORKER_TIMEOUT" | "VALIDATOR_REJECTED" | "DNA_DRIFT"
      | "COST_CAP_HIT" | "PROVIDER_UNAVAILABLE" | "SCHEMA_MISMATCH"
      | ...;
  message: string;
  recovery_hint: "retry_with_fallback" | "escalate_user"
               | "skip_and_continue" | "rerun_upstream";
  retry_strategy?: {
    max_attempts: number;
    backoff_ms: number;
    fallback_worker?: string;
  };
}
```

Directors read `recovery_hint` and auto-recover when possible. User escalation is reserved for genuine ambiguity or cost decisions.

---

## 4. Pillar 1 — Cinematic Canvas

### 4.1 Activation: 5-tier 3D intensity

Every project's Design DNA declares a `3d_intensity` level:

| Tier | Description |
|---|---|
| `none` | No 3D, no canvas (most projects) |
| `accent` | Small Spline embeds or isolated 3D accents, no persistent canvas |
| `section` | One section is a 3D showcase, rest HTML |
| `cinematic` | Persistent single canvas with camera choreography (the Sustainability / Skytronix tier) |
| `immersive` | Full WebGPU experience, scroll-hijacked, minimal HTML (Lusion / Active Theory tier) |

Tiers `cinematic` and `immersive` activate the full new Pillar 1 stack. Lower tiers keep existing v3.25 3D skills unchanged.

### 4.2 Mandated stack for `cinematic`

- **R3F v9 + drei** (base)
- **Theatre.js 0.8** (camera choreography via keyframe editor)
- **GSAP ScrollTrigger + Lenis** (scroll timeline binding)

Validators reject code that deviates from this stack in `cinematic`/`immersive` tiers. Spline remains available at `accent` tier for prototyping.

### 4.3 WebGPU policy

- **`immersive` tier:** WebGPU-first, WebGL2 fallback mandatory
- **`cinematic` tier:** WebGL2 default, WebGPU opt-in for compute-heavy effects (hair, fluid, foliage)
- Both tiers require a capability probe + static fallback image path

### 4.4 HTML coexistence

- **Default:** HTML-over-canvas — sections render normally, canvas is a fixed background, camera responds to scroll without moving sections
- **`immersive` only:** HTML-in-canvas via drei `<Html>` for signature moments (HTML can be occluded by 3D meshes)
- Scene-director decides per-section

### 4.5 Mobile strategy

**Adaptive loading + static fallback, combined:**
- Cinematic bundle ships to all devices but is lazy-loaded only if a capability probe passes: WebGL2 OK + battery >20% + connection ≥4G + deviceMemory ≥4GB
- Devices that fail the probe receive a DNA-matched static hero image generated by the `flux-hero-gen` worker
- The `battery-aware` and `low-bandwidth-mode` skills operationalize the probe

### 4.6 New archetypes (17)

All 17 proposed archetypes ship in v4.0 as the WebGPU-native tier (#34–#50):

Cinematic 3D · Volumetric · Biomorphic Compute · Temporal Glass · Neo-Physical · Signal Noise · Kinetic Industrial · Narrative Cinema · Ambient Computing · Post-Flat · Living Data · Organic Machinery · Hyperreal Minimal · Liminal Brutalism · Sonic Visual · Quantum Editorial · Archive Futurist

Each ships with DNA preset, reference sites, archetype-component-variants, tension zones, and arc templates.

### 4.7 New 6th hard gate: Scroll Coherence

Adds to the existing 5 hard gates (motion presence, responsive, compatibility, registry, archetype specificity):

> **6. Scroll Coherence (cinematic/immersive only)** — camera rotation and position must be continuous across section boundaries. No unmount/remount of `<Canvas>` between sections. No `<Canvas>` instance per section.

### 4.8 Performance budgets

Hard caps enforced for `cinematic`/`immersive` tier:

| Metric | Budget |
|---|---|
| LCP | ≤ 2.4s (on Moto G Power, 4G) |
| JS (main thread, gzipped) | ≤ 280 KB |
| Total transfer | ≤ 5.5 MB |
| CLS | ≤ 0.05 |
| INP | ≤ 180 ms |

### 4.9 New workers (8)

`hero-camera-choreographer`, `morph-target-author`, `webgpu-shader-author`, `webgl2-fallback-author`, `r3f-scene-builder`, `gltf-lod-generator`, `ktx2-encoder`, `spline-embed-author`

### 4.10 New skills (5)

`persistent-canvas-pattern`, `theatre-choreography`, `webgpu-compute-shaders`, `webgl2-fallback-generator`, `scroll-coherence-validator`

---

## 5. Pillar 2 — Asset Forge 2.0

### 5.1 New MCP integrations (5)

| Integration | Role | Worker |
|---|---|---|
| **Rodin Gen-2** | Hard-surface PBR 3D ($0.35/model) | `rodin-3d-gen` |
| **Meshy 5** | Fast-prototype 3D ($0.20/model) | `meshy-prototyper` |
| **Flux Kontext** | DNA-locked hero images with reference conditioning | `flux-hero-gen` |
| **Recraft V3** | Native SVG vector brand marks | `recraft-vector-author` |
| **Kling 2.1** | Programmatic video hero reels ($0.35/sec) | `video-reel-gen` |

Existing MCPs retained: `nano-banana` (character iteration), `stitch` (mockup generation), `playwright` (visual QA), `obsidian`, `obsidian-fs`.

All MCPs remain optional — pipeline gracefully degrades to text prompts.

### 5.2 Composite pipeline: recipes + followups hybrid

Composites are described as YAML recipes:

```yaml
# recipes/photoreal-character-product.yml
name: photoreal-character-product
version: 1.0.0
steps:
  - worker: rodin-3d-gen
    input: { prompt: ${brand.character_prompt}, style: ${dna.archetype} }
  - worker: character-poser
    input: { model: ${previous.artifact}, pose: ${recipe.pose} }
  - worker: inpainter
    input: { base: ${previous.artifact}, mask: "hands", prompt: ${brand.product_prompt} }
  - worker: upscaler
    input: { image: ${previous.artifact}, scale: 2 }
validators_per_step: [dna-compliance, license, provenance]
```

A thin `compositor` worker reads the recipe and dispatches the named workers via the protocol layer. Workers return `followups` in their `Result<T>` envelopes; `asset-director` injects these as dynamic corrections between recipe steps.

Recipes are versioned, shareable, and become part of the v4.1 marketplace story.

### 5.3 Cost governance

Combined model:
- **Per-project soft budget** — DNA declares `asset_budget_usd: 30`; `asset-director` tracks spend, warns at 80%, requires confirmation past 100%
- **Cache-first** — every worker checks user-global cache (sha256-keyed) before any provider call
- **Downgrade chain** — on soft-cap breach with `auto_downgrade: true`, provider cascades (Rodin → Meshy, Kling → Flux still image, Flux Kontext → nano-banana)

### 5.4 Provenance tracking (full)

Every asset records in `public/assets/MANIFEST.json`:
- File path + sha256
- Provider + model + seed + prompt
- Reference images (paths or sha256s)
- Cost (USD + tokens)
- Duration
- DNA-compliance verdict
- Cache hit/miss
- Parent composite (if derivative)

C2PA content credentials deferred to v4.1.

### 5.5 Caching strategy

- **User-global cache** at `~/.claude/genorah/asset-cache/` — shared across all Genorah projects for the same user
- **sha256-keyed** — prompt + provider + model + seed + reference hashes
- **CDN-shared pool** at `cache.genorah.dev` deferred to v4.1 (opt-in)

### 5.6 Mandatory pipeline

Every 3D asset ships through: Meshopt (gltfpack) + KTX2/Basis + progressive GLB via `EXT_mesh_lods`. Draco relegated to legacy compat. Enforced by `gltf-lod-generator` and `ktx2-encoder` workers.

### 5.7 New 13th quality category: Scene Craft (20 pts)

Applies only to `cinematic`/`immersive` tiers. Scoring dimensions:
- Camera choreography coherence
- Scene graph economy (no wasted meshes)
- Lighting consistency with DNA palette
- Material realism vs archetype target
- Performance budget compliance

Adds to the existing 234-pt Design Craft axis, bringing it to 254. Total quality gate: **374 pts** (254 Design Craft + 120 UX Integrity).

### 5.8 New workers (8)

`flux-hero-gen`, `nano-banana-iterator`, `rodin-3d-gen`, `meshy-prototyper`, `character-poser`, `inpainter`, `upscaler`, `recraft-vector-author`, `video-reel-gen`

### 5.9 New skills (5)

`photoreal-compositing-pipeline`, `composite-recipes`, `texture-provenance`, `user-global-asset-cache`, `cost-governance`

---

## 6. Pillar 3 — A2A Protocol Layer

### 6.1 Scope: L4 full citizenship (see §3.3)

### 6.2 Agent cards

Every agent's frontmatter generates a `/.well-known/agent.json` conforming to Google A2A v0.3:

```json
{
  "schema_version": "a2a-v0.3",
  "id": "genorah/creative-director",
  "version": "4.0.0",
  "channel": "stable",
  "name": "Creative Director",
  "description": "...",
  "capabilities": [
    { "id": "review-plan", "input_schema_ref": "...", "output_schema_ref": "..." },
    { "id": "approve-wave", "input_schema_ref": "...", "output_schema_ref": "..." }
  ],
  "auth": {
    "local": { "type": "none" },
    "remote": { "type": "oauth2", "flow": "authorization_code_pkce" }
  },
  "streaming": { "supports_sse": true, "ag_ui_events": true },
  "mcp": { "sampling_v2_compatible": true }
}
```

### 6.3 Transport layers

- **MCP-native** (default, always on) — agents registered as MCP primitives; discoverable via `tools/list`
- **Embedded HTTP daemon** (opt-in) — Node.js server started with `/gen:start-project`, exposes `/a2a/*` endpoints; binds to `127.0.0.1` only
- **Cloud relay** (deferred to v4.1) — at `agents.genorah.dev`, WebSocket-proxies to local daemon

### 6.4 Auth model

- **Local (daemon on 127.0.0.1):** no auth — localhost-only
- **Cloud (v4.1):** OAuth 2.1 with PKCE, per-user scopes

### 6.5 Error envelope

Per §3.6. Every failure at every layer returns a structured error.

### 6.6 AG-UI event emission

All 16 CopilotKit standard events emitted during pipeline execution:
`TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`, `TOOL_CALL_END`, `STATE_DELTA`, `UI_RENDER`, `AGENT_STATE_UPDATE`, `ARTIFACT_CREATED`, `ERROR`, etc.

External dashboards subscribe via SSE; the Visual Companion also consumes these events for live rendering.

### 6.7 MCP sampling v2 support

Genorah agents register as MCP primitives. An MCP host running elsewhere can invoke `creative-director` the same way Claude Code invokes it internally.

### 6.8 Marketplace

Agents can be published to a registry (TBD host for v4.0, possibly `registry.genorah.dev`). Installation flow downloads agent manifest + code, runs in a sandboxed execution layer with safety validators, and registers as a Genorah worker or director.

### 6.9 New commands

- `/gen:agents-publish <agent-name>` — publish agent to marketplace
- `/gen:agents-discover <query>` — search marketplace for third-party agents
- `/gen:agents-install <agent-id>` — install a third-party agent

### 6.10 New skills

`a2a-agent-card-generator`, `result-envelope-schema`, `ag-ui-event-emitter`, `mcp-sampling-v2-adapter`, `agent-protocol-validator`, `agent-marketplace-client`

---

## 7. Pillar 4 — Agent Specialization

### 7.1 The 10 directors

| Director | Role |
|---|---|
| `master-orchestrator` | Project-level coordination, state ownership |
| `wave-director` | Per-wave routing and merge |
| `creative-director` | Taste enforcement, archetype personality |
| `scene-director` | Cross-section 3D choreography (stateful scene graph) |
| `narrative-director` | Story arc coherence across sections |
| `asset-director` | Composite pipeline + cost + provenance |
| `protocol-director` | A2A traffic, schema validation, error routing |
| `quality-director` | 374-pt gate verdict, hard-gate enforcement |
| `mobile-director` | Framework routing (Swift/Kotlin/RN/Expo/Flutter) |
| `research-director` | Parallel research orchestration |

Each director holds its own context budget. Only directors talk to the user.

### 7.2 The 94 workers (18 domains)

| Domain | Count | Examples |
|---|---|---|
| 3D | 8 | hero-camera-choreographer, webgpu-shader-author |
| Motion | 6 | gsap-choreographer, theatre-sequencer |
| Asset | 8 | flux-hero-gen, rodin-3d-gen, inpainter |
| Content | 5 | microcopy-author, brand-voice-enforcer |
| Mobile | 5 | swift-author, kotlin-author, flutter-author |
| Section build | 5 | nextjs-section, astro-section |
| Integration | 8 | supabase, stripe, hydrogen, medusa |
| Polish | 5 | polisher, visual-refiner, perf-polisher |
| Critics | 8 | typography-critic, awwwards-judge-simulator |
| Research | 6 | sotd-scout, competitor-analyzer |
| Observability | 6 | lighthouse-runner, synthetic-persona-prober |
| CMS | 3 | sanity, contentful, payload |
| DB/API | 3 | prisma-schema, api-route, edge-function |
| Testing | 3 | playwright-test, vitest, storybook |
| Deployment | 3 | vercel-config, ci-pipeline, docker |
| AI-feature | 3 | chat-ui, rag-pipeline, agent-trace-ui |
| Ingestion | 4 | sitemap-crawler, dna-reverse-engineer, interaction-replay-fitter, cms-schema-introspector |
| Misc | 5 | sitemap, og-image, legal-doc, email-template, n8n-workflow |

### 7.3 Worker lifecycle

- **Stateless** — spawned per task, no memory across calls
- **Tiered isolation**:
  - *Worktree workers* (~35) — anything that writes repo files (section builders, polishers, asset writers). Use existing git-worktree pattern.
  - *In-process workers* (~59) — anything that returns a deliverable without repo writes (shader author returns a string, microcopy author returns JSON, camera choreographer returns a keyframe file). No worktree overhead.
- Director decides per-dispatch based on artifact type

### 7.4 Validators as skills

Validators remain skills (not agents). Workers invoke them before returning. Verdicts travel inside `Result<T>.verdicts`. No third agent tier.

---

## 8. Pillar 5 — Design Beyond Archetypes (all 5 dimensions)

### 8.1 Generative archetypes

Each project can optionally synthesize a one-off archetype from brand references (competitor URLs, mood boards, non-web references like editorial print, cinema stills, fashion editorials). The 50 fixed archetypes become seed templates that generative mode remixes.

**New:** `archetype-synthesizer` worker + `reference-embedding-miner` worker + `archetype-dna-translator` skill. Uses Flux Kontext for reference-to-DNA.

**Command:** `/gen:archetype-synth <reference-urls-or-images>`

### 8.2 Living Systems (context-responsive)

Archetypes morph with user signals at runtime:
- Time-of-day (warm palette at dusk, cool at midnight)
- Scroll velocity (slow = more whitespace, fast = denser visuals)
- Pointer idle (ambient motion revealed after 3s of stillness)
- Battery, connection speed, device capability
- Returning-visitor signals (fewer onboarding moments on visit 3+)

**Ships as:** `real-time-personalization` skill elevated to first-class; new `@genorah/living-system-runtime` npm package injected into builds.

### 8.3 Signature DNA

Every project gets a bespoke 3D signature mark:
- Rodin-generated from brand essence
- Cryptographically unique (collision-checked against a signed ledger)
- Persists across all canvases as continuity anchor
- Reappears at brand moments (loader, transitions, footer, favicon source)

**Ships as:** `signature-dna-forge` worker + Rodin integration. C2PA content credentials in v4.1.

**Command:** `/gen:signature-mark`

### 8.4 Multi-archetype blending with Tension Council

Formal protocol to blend N archetypes (e.g. 60% Brutalist + 30% Biomorphic + 10% Japanese Minimal). When archetypes disagree on a design decision, a **Tension Council** convenes: `creative-director`, `brand-voice-director` (new sub-role of creative-director), `narrative-director` vote 3-way.

**Ships as:** `archetype-arbitration` skill + 3-agent voting protocol. Extends existing `archetype-mixing` skill.

### 8.5 Neuro-aesthetic gate (14th quality category)

Adds 20 pts to UX Integrity axis, bringing total to 140:
- Fixation mapping (where eyes land first)
- Saccade path prediction (reading order)
- Attention heatmap (what competes for focus)
- Hick's Law on choices
- Reading grade & cognitive load per section

**Ships as:** `eye-tracking-simulation` skill promoted to gate axis + new `neuro-aesthetic-gate` skill.

**Final quality gate: 254 Design Craft + 140 UX Integrity = 394 pts** (updates the earlier 374 number by adding the 20-pt neuro-aesthetic gate).

---

## 9. Pillar 6 — Built Beyond Limits (all 8 features)

### 9.1 F1 — Streaming pipeline (AG-UI events)

Visual Companion renders partial sections mid-build; external dashboards subscribe via SSE. Builders emit `ARTIFACT_CREATED` events as each worker returns. No more "wait for wave complete."

### 9.2 F2 — Cross-project memory graph (sqlite-vec)

Every decision, score, and critic finding becomes a retrievable embedding. Knowledge Base vault becomes a typed graph queryable by natural language:
- "Show me all times Brutalist + AI-Native mix scored >220"
- "What archetype + intensity combos consistently ship under the JS budget?"

**Storage:** embedded `sqlite-vec` at `~/.claude/genorah/memory.db`. Extends existing `semantic-index` + `cross-project-kb` skills.

**Command:** `/gen:memory-query <natural-language-question>`

### 9.3 F3 — Self-improving quality judge

Per-project deltas logged on `/gen:postship` (expected score vs actual score, what the critic missed). Cross-project weights auto-adjusted quarterly on `/gen:recalibrate`. Existing `judge-calibration` skill operationalized.

### 9.4 F4 — Agent marketplace

Registry service (`registry.genorah.dev`, TBD infra) + publish/install flow + sandbox for third-party agent code. Pairs with L4 A2A citizenship. See §6.8 and §6.9.

### 9.5 F5 — Offline-first mode

All skills cacheable; pipeline runnable with zero MCP servers. Current fallbacks are partial; v4 makes them total. Matters for Claude Max users on planes, for air-gapped client engagements, and for CI environments with restricted egress.

### 9.6 F6 — Live synthetic-user streaming

6 Playwright personas (Skeptic CFO, First-timer, Power user, Mobile, Screen-reader, B1 non-native) probe **mid-build**, not post-build. Findings hot-patched into `GAP-FIX.md` before polisher runs. Catches UX problems before they are baked in.

Extends existing `synthetic-user-testing` skill. `synthetic-persona-prober` worker.

### 9.7 F7 — Server-driven UI + agentic UX as production defaults

v3.20 axes (`server-driven-ui`, `agentic-ux-patterns`, `ai-ui-components`) promoted from opt-in skills to defaults for AI product sites. New archetype-component-variants for these patterns.

### 9.8 F8 — Full WebGPU + WebGL2 fallback everywhere

Compute-shader-backed UI effects (blur, dither, color grading, particle systems) with WebGL2/CSS fallback branching baked into the component registry. Not just 3D — general UI.

---

## 10. Data flow example (hero section build)

```
User → /gen:build
  ↓
master-orchestrator reads STATE.md, spawns wave-director for Wave 2
  ↓
wave-director identifies hero section needs → dispatches in parallel:
  ├─ scene-director (stateful)
  │   ↓ reads recipe "hero-camera-choreography.yml"
  │   ↓ dispatches hero-camera-choreographer → morph-target-author → theatre-sequencer
  │   ↓ theatre-sequencer followup: "gsap-choreographer for scroll binding"
  │   ↓ scene-director dispatches gsap-choreographer
  │   ↓ scene bundle → sections/hero/scene/
  │
  ├─ asset-director (stateful)
  │   ↓ reads recipe "photoreal-bust.yml"
  │   ↓ dispatches rodin-3d-gen → character-poser → inpainter → upscaler
  │   ↓ cache-first check before each provider call
  │   ↓ cost tracked vs DNA.asset_budget_usd
  │   ↓ validators per step: dna-compliance, license, provenance
  │   ↓ MANIFEST.json updated
  │
  └─ nextjs-section worker (in worktree)
      ↓ imports scene bundle + asset paths
      ↓ self-validates: archetype-specificity, motion-presence, scroll-coherence
      ↓ returns Result<T>
  ↓
wave-director collects 3 Result<T> envelopes
  ↓
quality-director runs full 394-pt gate
  ↓ pass: wave-director merges worktrees, marks wave complete, emits AG-UI event
  ↓ fail: routes followups to critics + polisher (2-cycle max, then escalate)
  ↓
master-orchestrator updates STATE.md, picks next wave
```

### 10.1 Invariants

- Only directors hold persistent state across worker calls
- Every worker call produces one `Result<T>` envelope — no side-channel handoffs
- Validators run inside workers before artifact return
- All state durably written to `.planning/genorah/*.md` + manifest JSON
- AG-UI events emitted at every state transition
- On crash/resume: `master-orchestrator` reads STATE.md + partial Result envelopes, continues from last checkpoint

---

## 11. Error handling

See §3.6 for the error envelope. Failure modes and their handling:

| Failure | Detector | Handler | Recovery |
|---|---|---|---|
| Worker timeout | protocol-director | dispatching director | retry once, fallback worker, escalate |
| Validator rejects | worker self-check | director | polisher with GAP-FIX |
| DNA drift | dna-drift-detection validator | quality-director | block wave, rerun with tighter context |
| Cost cap hit | asset-director | asset-director | downgrade chain or user prompt |
| MCP provider down | asset worker | asset-director | cascade providers |
| Schema mismatch | protocol-director | protocol-director | reject dispatch, diagnose |
| WebGPU unavailable | runtime probe | scene-director | WebGL2 path, then static fallback |
| Mid-wave crash | session-start hook | master-orchestrator | resume from checkpoint |
| External A2A fails | protocol-director | calling director | retry per card, skip and log |
| Untrusted marketplace output | sandbox | protocol-director | quarantine, safety validators, reject |
| Circular followups | protocol-director | protocol-director | cycle break after 3 hops |
| Cross-wave drift | consistency-auditor | wave-director | block merge, polisher |

Escalation rules:
- 2-cycle polisher max before user escalation (existing rule retained)
- `recovery_hint: "escalate_user"` surfaces immediately
- Cost-cap escalation always asks before overspend
- Marketplace safety failures always escalate

Observability:
- Every failure logged to `.planning/genorah/errors.jsonld` (queryable graph)
- Every error emits AG-UI event
- Self-improving judge (F3) learns from error patterns quarterly

---

## 12. Testing strategy

Target: **~885 tests passing at v4.0 ship** (109 retained from v3.25 + ~776 new).

| Layer | Count | Scope |
|---|---|---|
| Unit | ~600 (+500) | Every validator skill, every schema version, every error handler, every new archetype DNA preset |
| Contract | ~120 (new) | A2A card spec compliance, Result envelope schema, AG-UI events, composite recipes, marketplace sandbox |
| Integration | ~80 (+40) | Full pipeline per flagship archetype, photoreal recipe E2E, scroll-coherence, inbound A2A, offline-first, cost governance, cross-project memory |
| Visual regression | ~50 (new) | 50 archetypes × reference hero × 4 breakpoints; deterministic scene keyframes; signature mark stability |
| Performance | ~20 (new) | LCP/JS budgets for cinematic; WebGPU render budget for immersive; asset cost cap; memory graph p99 |
| Chaos | ~15 (new) | MCP kills, out-of-order messages, worker crash + resume, circular followups, malformed marketplace output |

New test infrastructure:
- `/gen:self-audit` expanded for new pillars
- `/gen:regression-suite` runs full pyramid locally or in CI
- Shakedown harness extended with A2A smoke + marketplace install smoke

---

## 13. Migration from v3.25

- v3.25 projects continue working unchanged — new tier system is additive
- New command `/gen:migrate-v3-to-v4`:
  - Maps existing archetypes (33 unchanged)
  - Adds default `3d_intensity: accent` + `asset_budget_usd: 20` to legacy DNA
  - Installs new agent definitions without removing old ones
  - Updates `CONTEXT.md` schema to v4 Result envelope compatible
- v3.25 agents deprecated but not removed — 12-month deprecation window
- v3.25 commands alias to v4 equivalents where behavior is preserved

---

## 14. Scope, staging, and timeline

**Full v4.0 scope: 22 weeks estimated.**

Suggested internal staging (not separate releases — just internal milestones):

| Milestone | Weeks | Focus |
|---|---|---|
| M1 | 4 | Pillar 3 (protocol) + Pillar 4 agent splits — foundation |
| M2 | 4 | Pillar 1 (Cinematic Canvas) + 17 new archetypes |
| M3 | 4 | Pillar 2 (Asset Forge 2.0) + 5 new MCPs |
| M4 | 4 | Pillar 5 (beyond archetypes) + neuro-aesthetic gate |
| M5 | 4 | Pillar 6 (marketplace, memory, streaming, offline) |
| M6 | 2 | Test hardening, migration command, docs, ship |

Deferred to v4.1:
- Cloud relay (`agents.genorah.dev`)
- C2PA content credentials
- CDN-shared asset cache pool
- Community recipe marketplace beyond initial registry

---

## 15. Open questions (for implementation plan)

- Which marketplace registry host? (`registry.genorah.dev` stub vs GitHub-backed vs IPFS)
- sqlite-vec binary distribution for Windows users
- AG-UI event schema version pinning strategy
- Exact `Result<T>` JSON-schema $id policy for additive vs breaking changes
- Shape of sandbox execution layer for third-party marketplace agents (deno sandbox? Node vm? separate process?)

These are implementation-planning questions, not brainstorming questions — they go to the `writing-plans` skill.

---

## 16. Decisions locked (reference)

For traceability, the 16 brainstorming decisions:

1. Agent granularity: **D (tiered hybrid)**
2. Tier structure: 10 directors (own context) + technology-domain workers + validators-as-skills
3. Worker lifecycle: **B (tiered isolation)** + stateless workers + stateful directors
4. Worker catalog: **75 + new categories = 94 workers** (all additions accepted)
5. Worker return contract: **D (Result<T> envelope)**
6. Protocol scope: **L4 (full citizenship)**
7. Transport: **D (MCP-native + embedded HTTP, cloud v4.1)**
8. Identity/auth/errors: **all recommendations** (semver+channel, no-local/OAuth-cloud, structured errors)
9. 3D activation: **D (5-tier intensity)**
10. Stack/WebGPU/HTML: **all recommendations** (mandate R3F stack, WebGPU-first immersive / WebGL2 cinematic, hybrid HTML)
11. Mobile/archetypes: **a (adaptive + static fallback)** + **17 new archetypes**
12. MCP integrations: **comprehensive (+5)**
13. Composite orchestration: **C+D hybrid (recipes + followups)**
14. Cost/provenance/caching: **all recommendations**
15. Beyond-archetypes dimensions: **all 5**
16. Beyond-limits features: **all 8**

---

**End of design document.**
