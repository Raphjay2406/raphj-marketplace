# v4 M1 — Protocol + Agent Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the typed A2A protocol layer (`Result<T>` envelope, agent cards, embedded HTTP daemon, AG-UI emitter, MCP sampling v2 adapter) and split the existing 24 agents into the new 10-director + 94-worker tier structure. Every subsequent milestone depends on this foundation.

**Architecture:** New `packages/protocol/` workspace holding JSON Schemas, envelope validators, agent-card generator, HTTP daemon, and AG-UI emitter. Agents reorganize under `agents/directors/` and `agents/workers/<domain>/`. Every agent gets frontmatter that drives automatic card generation. A `.claude-plugin/hooks/agent-message-validator.mjs` hook validates every dispatch at runtime.

**Tech Stack:** Node.js 24, TypeScript 5.6, Zod 3.23 (schema), Fastify 5 (daemon), `@copilotkit/runtime` (AG-UI types), `@modelcontextprotocol/sdk` (MCP sampling), Vitest 2 (tests), `ajv` 8 (JSON Schema validation at runtime).

**Scope:** 4 weeks. 68 tasks. ~55 agent scaffold files, 12 new skills, 6 new hooks/commands, protocol runtime package, migration command.

**Milestone completion criteria:**
1. Every agent has a generated `/.well-known/agent.json` passing A2A v0.3 validation
2. `Result<T>` envelope schema validated by `ajv` at every dispatch
3. Embedded HTTP daemon starts on `/gen:start-project`, exposes agent endpoints, binds 127.0.0.1
4. At least one external A2A call (via `curl`) can invoke `creative-director` and receive a valid response
5. AG-UI events emitted during a test pipeline run, captured by a test subscriber
6. 24 legacy agents mapped to new structure; `/gen:migrate-v3-to-v4` upgrades an existing v3.25 project
7. 109 existing tests + 180 new protocol/agent tests all pass

---

## File Structure

### New files
- `packages/protocol/package.json`
- `packages/protocol/src/envelope.ts` — `Result<T>` types + Zod schemas
- `packages/protocol/src/agent-card.ts` — card generator from frontmatter
- `packages/protocol/src/errors.ts` — structured error taxonomy
- `packages/protocol/src/ag-ui.ts` — AG-UI event emitter
- `packages/protocol/src/mcp-sampling.ts` — MCP sampling v2 adapter
- `packages/protocol/src/daemon.ts` — Fastify HTTP server
- `packages/protocol/src/dispatch.ts` — typed dispatch wrapper
- `packages/protocol/src/schemas/result-envelope.schema.json` — compiled JSON Schema
- `packages/protocol/src/schemas/agent-card.schema.json`
- `packages/protocol/src/schemas/ag-ui-event.schema.json`
- `packages/protocol/tests/envelope.test.ts`
- `packages/protocol/tests/agent-card.test.ts`
- `packages/protocol/tests/daemon.test.ts`
- `packages/protocol/tests/errors.test.ts`
- `packages/protocol/tests/ag-ui.test.ts`
- `packages/protocol/tests/dispatch.test.ts`
- `packages/protocol/tests/mcp-sampling.test.ts`
- `agents/directors/` — 10 new director agent files (see Task 30)
- `agents/workers/<domain>/` — 94 new worker scaffolds (see Task 40)
- `skills/a2a-agent-card-generator/SKILL.md`
- `skills/result-envelope-schema/SKILL.md`
- `skills/ag-ui-event-emitter/SKILL.md`
- `skills/mcp-sampling-v2-adapter/SKILL.md`
- `skills/agent-protocol-validator/SKILL.md`
- `.claude-plugin/hooks/agent-message-validator.mjs`
- `.claude-plugin/hooks/daemon-lifecycle.mjs`
- `commands/gen-agents-publish.md`
- `commands/gen-agents-discover.md`
- `commands/gen-agents-install.md`
- `commands/gen-migrate-v3-to-v4.md`
- `scripts/migrate-v3-to-v4.mjs`
- `scripts/generate-agent-cards.mjs`

### Modified files
- `.claude-plugin/plugin.json` — bump to 4.0.0-alpha.1
- `.claude-plugin/.mcp.json` — no change in M1 (new MCPs ship in M3)
- `.claude-plugin/hooks/session-start.mjs` — start daemon if `cinematic`/`immersive` tier active
- `.claude-plugin/hooks/session-end.mjs` — stop daemon
- `CLAUDE.md` — update agent counts and add protocol section
- `README.md` — v4-alpha disclaimer
- `agents/orchestrator.md` → move to `agents/directors/master-orchestrator.md` and split
- `agents/builder.md` → split into `agents/workers/section/nextjs-section.md` etc. (see Task 45)
- `package.json` — add `packages/protocol` to workspaces, add new deps

### Deleted files
None — old agent files remain in place, superseded by new structure with deprecation notice header (12-month deprecation window per spec §13).

---

## Task 1: Add protocol package workspace

**Files:**
- Modify: `package.json`
- Create: `packages/protocol/package.json`
- Create: `packages/protocol/tsconfig.json`

- [ ] **Step 1: Inspect root package.json**

Run: `cat package.json | head -40`
Expected: root package with existing scripts; no `workspaces` field yet.

- [ ] **Step 2: Add workspaces field to root package.json**

Edit `package.json`, add after `"name"` line:

```json
  "workspaces": [
    "packages/*"
  ],
```

- [ ] **Step 3: Create packages/protocol/package.json**

```json
{
  "name": "@genorah/protocol",
  "version": "4.0.0-alpha.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -p .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "zod": "^3.23.8",
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "fastify": "^5.0.0",
    "@fastify/sse-v2": "^4.2.0",
    "@copilotkit/runtime": "^1.8.0",
    "@modelcontextprotocol/sdk": "^1.1.0",
    "nanoid": "^5.0.7"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "vitest": "^2.1.4",
    "@types/node": "^24.0.0"
  }
}
```

- [ ] **Step 4: Create packages/protocol/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 5: Install dependencies**

Run: `cd packages/protocol && npm install`
Expected: installs without peer conflicts; creates `packages/protocol/node_modules/`.

- [ ] **Step 6: Commit**

```bash
git add package.json packages/protocol/package.json packages/protocol/tsconfig.json
git commit -m "feat(v4-m1): add @genorah/protocol workspace"
```

---

## Task 2: Define Result<T> envelope Zod schema (test-first)

**Files:**
- Create: `packages/protocol/tests/envelope.test.ts`
- Create: `packages/protocol/src/envelope.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/envelope.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { ResultEnvelope, parseResultEnvelope } from "../src/envelope.js";

describe("ResultEnvelope", () => {
  it("accepts a minimal ok envelope", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: { path: "sections/hero/page.tsx" },
      verdicts: [],
      followups: []
    };
    const parsed = parseResultEnvelope(envelope);
    expect(parsed.status).toBe("ok");
  });

  it("requires artifact", () => {
    expect(() =>
      parseResultEnvelope({ schema_version: "4.0.0", status: "ok", verdicts: [], followups: [] } as any)
    ).toThrow(/artifact/i);
  });

  it("accepts verdicts with optional score", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [
        { validator: "dna-compliance", pass: true, score: 0.92, notes: "ok" },
        { validator: "license", pass: true }
      ],
      followups: []
    };
    expect(parseResultEnvelope(envelope).verdicts).toHaveLength(2);
  });

  it("rejects status outside enum", () => {
    expect(() =>
      parseResultEnvelope({ schema_version: "4.0.0", status: "mostly", artifact: {}, verdicts: [], followups: [] } as any)
    ).toThrow();
  });

  it("accepts trace when present", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [],
      followups: [],
      trace: {
        decisions: [{ step: "pick-preset", chose: "cinematic", reason: "archetype matches" }],
        skills_used: ["persistent-canvas-pattern"],
        cost: { tokens_in: 2100, tokens_out: 840, api_spend_usd: 0.35 }
      }
    };
    const parsed = parseResultEnvelope(envelope);
    expect(parsed.trace?.cost.api_spend_usd).toBe(0.35);
  });

  it("accepts followups with context_override", () => {
    const envelope = {
      schema_version: "4.0.0",
      status: "partial",
      artifact: {},
      verdicts: [{ validator: "dna-compliance", pass: false, score: 0.72, notes: "coverage low" }],
      followups: [
        { suggested_worker: "inpainter", reason: "raise coverage", context_override: { strength: 0.85 } }
      ]
    };
    expect(parseResultEnvelope(envelope).followups[0].suggested_worker).toBe("inpainter");
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/envelope.test.ts`
Expected: FAIL — cannot resolve `../src/envelope.js`

- [ ] **Step 3: Implement envelope.ts**

`packages/protocol/src/envelope.ts`:

```typescript
import { z } from "zod";

export const VerdictSchema = z.object({
  validator: z.string().min(1),
  pass: z.boolean(),
  score: z.number().min(0).max(1).optional(),
  notes: z.string().optional()
});
export type Verdict = z.infer<typeof VerdictSchema>;

export const FollowupSchema = z.object({
  suggested_worker: z.string().min(1),
  reason: z.string().min(1),
  context_override: z.record(z.unknown()).optional()
});
export type Followup = z.infer<typeof FollowupSchema>;

export const CostSchema = z.object({
  tokens_in: z.number().int().nonnegative(),
  tokens_out: z.number().int().nonnegative(),
  api_spend_usd: z.number().nonnegative()
});

export const DecisionSchema = z.object({
  step: z.string(),
  chose: z.string(),
  reason: z.string()
}).passthrough();

export const TraceSchema = z.object({
  decisions: z.array(DecisionSchema),
  skills_used: z.array(z.string()),
  cost: CostSchema
});
export type Trace = z.infer<typeof TraceSchema>;

export const ResultEnvelopeSchema = z.object({
  schema_version: z.literal("4.0.0"),
  status: z.enum(["ok", "partial", "failed"]),
  artifact: z.unknown(),
  verdicts: z.array(VerdictSchema),
  followups: z.array(FollowupSchema),
  trace: TraceSchema.optional(),
  correlation_id: z.string().optional(),
  emitted_by: z.string().optional(),
  emitted_at: z.string().datetime().optional()
});

export type ResultEnvelope<T = unknown> = Omit<
  z.infer<typeof ResultEnvelopeSchema>,
  "artifact"
> & { artifact: T };

export function parseResultEnvelope<T = unknown>(input: unknown): ResultEnvelope<T> {
  const parsed = ResultEnvelopeSchema.parse(input);
  return parsed as ResultEnvelope<T>;
}

export function ok<T>(artifact: T, extras: Partial<ResultEnvelope<T>> = {}): ResultEnvelope<T> {
  return {
    schema_version: "4.0.0",
    status: "ok",
    artifact,
    verdicts: [],
    followups: [],
    ...extras
  };
}

export function partial<T>(
  artifact: T,
  verdicts: Verdict[],
  followups: Followup[] = []
): ResultEnvelope<T> {
  return { schema_version: "4.0.0", status: "partial", artifact, verdicts, followups };
}

export function failed(verdicts: Verdict[]): ResultEnvelope<null> {
  return {
    schema_version: "4.0.0",
    status: "failed",
    artifact: null,
    verdicts,
    followups: []
  };
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/envelope.test.ts`
Expected: 6 passing

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/envelope.ts packages/protocol/tests/envelope.test.ts
git commit -m "feat(v4-m1): Result<T> envelope schema + helpers"
```

---

## Task 3: Export envelope JSON Schema artifact

**Files:**
- Create: `packages/protocol/src/schemas/result-envelope.schema.json`
- Create: `packages/protocol/scripts/emit-schemas.ts`

- [ ] **Step 1: Add zod-to-json-schema dep**

```bash
cd packages/protocol && npm i zod-to-json-schema@3.23.2
```

- [ ] **Step 2: Create emit-schemas.ts**

`packages/protocol/scripts/emit-schemas.ts`:

```typescript
import { writeFileSync, mkdirSync } from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ResultEnvelopeSchema } from "../src/envelope.js";

const out = "src/schemas/result-envelope.schema.json";
mkdirSync("src/schemas", { recursive: true });
const schema = zodToJsonSchema(ResultEnvelopeSchema, {
  name: "ResultEnvelope",
  $refStrategy: "none"
});
writeFileSync(out, JSON.stringify(schema, null, 2));
console.log(`wrote ${out}`);
```

- [ ] **Step 3: Add emit:schemas npm script**

Edit `packages/protocol/package.json` scripts:

```json
"emit:schemas": "node --experimental-strip-types scripts/emit-schemas.ts"
```

- [ ] **Step 4: Run and verify output**

Run: `cd packages/protocol && npm run emit:schemas`
Expected: writes `src/schemas/result-envelope.schema.json`; prints `wrote ...`.

- [ ] **Step 5: Write schema regression test**

Append to `packages/protocol/tests/envelope.test.ts`:

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../src/schemas/result-envelope.schema.json" with { type: "json" };

describe("result-envelope JSON Schema", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  it("accepts a minimal ok envelope", () => {
    const ok = validate({
      schema_version: "4.0.0",
      status: "ok",
      artifact: {},
      verdicts: [],
      followups: []
    });
    expect(ok).toBe(true);
  });
});
```

- [ ] **Step 6: Run full test suite**

Run: `cd packages/protocol && npm test`
Expected: all tests pass (7 total).

- [ ] **Step 7: Commit**

```bash
git add packages/protocol/src/schemas packages/protocol/scripts packages/protocol/tests packages/protocol/package.json
git commit -m "feat(v4-m1): emit result-envelope JSON Schema + ajv regression test"
```

---

## Task 4: Structured error taxonomy (test-first)

**Files:**
- Create: `packages/protocol/tests/errors.test.ts`
- Create: `packages/protocol/src/errors.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/errors.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { StructuredError, parseStructuredError, ErrorCodes } from "../src/errors.js";

describe("StructuredError", () => {
  it("accepts a known code + recovery hint", () => {
    const err: StructuredError = {
      code: "VALIDATOR_REJECTED",
      message: "dna-compliance verdict false",
      recovery_hint: "rerun_upstream"
    };
    expect(parseStructuredError(err).code).toBe("VALIDATOR_REJECTED");
  });

  it("rejects an unknown code", () => {
    expect(() =>
      parseStructuredError({ code: "NOPE", message: "x", recovery_hint: "retry_with_fallback" } as any)
    ).toThrow();
  });

  it("requires recovery_hint", () => {
    expect(() =>
      parseStructuredError({ code: "WORKER_TIMEOUT", message: "x" } as any)
    ).toThrow(/recovery_hint/);
  });

  it("optional retry_strategy validates max_attempts", () => {
    expect(() =>
      parseStructuredError({
        code: "WORKER_TIMEOUT",
        message: "x",
        recovery_hint: "retry_with_fallback",
        retry_strategy: { max_attempts: -1, backoff_ms: 1000 }
      } as any)
    ).toThrow();
  });

  it("ErrorCodes enumerates all supported codes", () => {
    expect(ErrorCodes).toContain("DNA_DRIFT");
    expect(ErrorCodes).toContain("COST_CAP_HIT");
    expect(ErrorCodes).toContain("PROVIDER_UNAVAILABLE");
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/errors.test.ts`
Expected: FAIL — cannot resolve `../src/errors.js`

- [ ] **Step 3: Implement errors.ts**

`packages/protocol/src/errors.ts`:

```typescript
import { z } from "zod";

export const ErrorCodes = [
  "WORKER_TIMEOUT",
  "VALIDATOR_REJECTED",
  "DNA_DRIFT",
  "COST_CAP_HIT",
  "PROVIDER_UNAVAILABLE",
  "SCHEMA_MISMATCH",
  "WEBGPU_UNAVAILABLE",
  "CIRCULAR_FOLLOWUP",
  "UNTRUSTED_OUTPUT",
  "MID_WAVE_CRASH",
  "EXTERNAL_A2A_FAIL",
  "COST_BUDGET_EXCEEDED"
] as const;
export type ErrorCode = (typeof ErrorCodes)[number];

export const RecoveryHintSchema = z.enum([
  "retry_with_fallback",
  "escalate_user",
  "skip_and_continue",
  "rerun_upstream"
]);

export const RetryStrategySchema = z.object({
  max_attempts: z.number().int().min(0).max(10),
  backoff_ms: z.number().int().min(0),
  fallback_worker: z.string().optional()
});

export const StructuredErrorSchema = z.object({
  code: z.enum(ErrorCodes),
  message: z.string().min(1),
  recovery_hint: RecoveryHintSchema,
  retry_strategy: RetryStrategySchema.optional(),
  cause: z.unknown().optional(),
  at: z.string().optional()
});

export type StructuredError = z.infer<typeof StructuredErrorSchema>;

export function parseStructuredError(input: unknown): StructuredError {
  return StructuredErrorSchema.parse(input);
}

export class GenorahError extends Error {
  structured: StructuredError;
  constructor(structured: StructuredError) {
    super(structured.message);
    this.structured = structured;
    this.name = "GenorahError";
  }
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/errors.test.ts`
Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/errors.ts packages/protocol/tests/errors.test.ts
git commit -m "feat(v4-m1): structured error taxonomy"
```

---

## Task 5: Agent-card generator from frontmatter (test-first)

**Files:**
- Create: `packages/protocol/tests/agent-card.test.ts`
- Create: `packages/protocol/src/agent-card.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/agent-card.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildAgentCard, AgentCardSchema } from "../src/agent-card.js";

const frontmatter = {
  name: "creative-director",
  id: "genorah/creative-director",
  version: "4.0.0",
  channel: "stable" as const,
  description: "Owns taste, archetype personality, creative direction",
  tier: "director",
  capabilities: [
    { id: "review-plan", input: "PlanInput", output: "PlanReview" },
    { id: "approve-wave", input: "WaveSummary", output: "Approval" }
  ],
  tools: ["Read", "Write", "Edit"]
};

describe("buildAgentCard", () => {
  it("produces an A2A v0.3 compliant card", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.schema_version).toBe("a2a-v0.3");
    expect(card.id).toBe("genorah/creative-director");
    expect(card.version).toBe("4.0.0");
    expect(card.channel).toBe("stable");
    expect(card.capabilities).toHaveLength(2);
  });

  it("fills default auth (none local, oauth remote)", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.auth.local.type).toBe("none");
    expect(card.auth.remote.type).toBe("oauth2");
    expect(card.auth.remote.flow).toBe("authorization_code_pkce");
  });

  it("declares streaming + mcp sampling support", () => {
    const card = buildAgentCard(frontmatter);
    expect(card.streaming.supports_sse).toBe(true);
    expect(card.streaming.ag_ui_events).toBe(true);
    expect(card.mcp.sampling_v2_compatible).toBe(true);
  });

  it("validates against AgentCardSchema", () => {
    const card = buildAgentCard(frontmatter);
    expect(() => AgentCardSchema.parse(card)).not.toThrow();
  });

  it("rejects card with invalid channel", () => {
    const bad = { ...frontmatter, channel: "flaky" as any };
    expect(() => buildAgentCard(bad)).toThrow();
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/agent-card.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement agent-card.ts**

`packages/protocol/src/agent-card.ts`:

```typescript
import { z } from "zod";

export const ChannelSchema = z.enum(["stable", "beta", "canary"]);
export type Channel = z.infer<typeof ChannelSchema>;

export const CapabilitySchema = z.object({
  id: z.string().min(1),
  input: z.string().optional(),
  output: z.string().optional(),
  input_schema_ref: z.string().optional(),
  output_schema_ref: z.string().optional()
});

export const AgentCardSchema = z.object({
  schema_version: z.literal("a2a-v0.3"),
  id: z.string().regex(/^[a-z0-9_-]+\/[a-z0-9_-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?$/),
  channel: ChannelSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  tier: z.enum(["director", "worker"]),
  capabilities: z.array(CapabilitySchema).min(1),
  tools: z.array(z.string()).default([]),
  auth: z.object({
    local: z.object({ type: z.enum(["none", "token"]) }),
    remote: z.object({
      type: z.enum(["oauth2", "token", "mtls"]),
      flow: z.string().optional()
    })
  }),
  streaming: z.object({
    supports_sse: z.boolean(),
    ag_ui_events: z.boolean()
  }),
  mcp: z.object({
    sampling_v2_compatible: z.boolean()
  })
});
export type AgentCard = z.infer<typeof AgentCardSchema>;

export const FrontmatterSchema = z.object({
  name: z.string().min(1),
  id: z.string().regex(/^[a-z0-9_-]+\/[a-z0-9_-]+$/),
  version: z.string(),
  channel: ChannelSchema,
  description: z.string().min(1),
  tier: z.enum(["director", "worker"]),
  capabilities: z.array(CapabilitySchema).min(1),
  tools: z.array(z.string()).optional()
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export function buildAgentCard(input: Frontmatter): AgentCard {
  const fm = FrontmatterSchema.parse(input);
  return AgentCardSchema.parse({
    schema_version: "a2a-v0.3",
    id: fm.id,
    version: fm.version,
    channel: fm.channel,
    name: fm.name,
    description: fm.description,
    tier: fm.tier,
    capabilities: fm.capabilities,
    tools: fm.tools ?? [],
    auth: {
      local: { type: "none" },
      remote: { type: "oauth2", flow: "authorization_code_pkce" }
    },
    streaming: { supports_sse: true, ag_ui_events: true },
    mcp: { sampling_v2_compatible: true }
  });
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/agent-card.test.ts`
Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/agent-card.ts packages/protocol/tests/agent-card.test.ts
git commit -m "feat(v4-m1): agent-card generator with A2A v0.3 validation"
```

---

## Task 6: AG-UI event emitter (test-first)

**Files:**
- Create: `packages/protocol/tests/ag-ui.test.ts`
- Create: `packages/protocol/src/ag-ui.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/ag-ui.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { AgUiEmitter, AgUiEvent, AgUiEventType } from "../src/ag-ui.js";

describe("AgUiEmitter", () => {
  it("emits a TEXT_MESSAGE_CONTENT event to all subscribers", () => {
    const em = new AgUiEmitter();
    const sub = vi.fn();
    em.subscribe(sub);
    em.emit({ type: "TEXT_MESSAGE_CONTENT", message: "hi", role: "assistant" });
    expect(sub).toHaveBeenCalledTimes(1);
    expect(sub.mock.calls[0][0].type).toBe("TEXT_MESSAGE_CONTENT");
  });

  it("supports 16 standard event types", () => {
    const required: AgUiEventType[] = [
      "TEXT_MESSAGE_CONTENT",
      "TOOL_CALL_START",
      "TOOL_CALL_END",
      "STATE_DELTA",
      "UI_RENDER",
      "AGENT_STATE_UPDATE",
      "ARTIFACT_CREATED",
      "ERROR",
      "WAVE_STARTED",
      "WAVE_COMPLETED",
      "SECTION_STARTED",
      "SECTION_COMPLETED",
      "VERDICT_ISSUED",
      "RESULT_ENVELOPE",
      "COST_BUDGET_UPDATE",
      "DAEMON_LIFECYCLE"
    ];
    required.forEach(t => {
      expect(() => new AgUiEmitter().emit({ type: t } as AgUiEvent)).not.toThrow();
    });
  });

  it("unsubscribe stops delivery", () => {
    const em = new AgUiEmitter();
    const sub = vi.fn();
    const unsub = em.subscribe(sub);
    unsub();
    em.emit({ type: "ERROR", error: { code: "WORKER_TIMEOUT", message: "x", recovery_hint: "retry_with_fallback" } });
    expect(sub).not.toHaveBeenCalled();
  });

  it("persists events to a sink", () => {
    const sink: AgUiEvent[] = [];
    const em = new AgUiEmitter({ sink: e => sink.push(e) });
    em.emit({ type: "UI_RENDER", html_ref: "hero.html" });
    expect(sink).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/ag-ui.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement ag-ui.ts**

`packages/protocol/src/ag-ui.ts`:

```typescript
import type { StructuredError } from "./errors.js";

export type AgUiEventType =
  | "TEXT_MESSAGE_CONTENT"
  | "TOOL_CALL_START"
  | "TOOL_CALL_END"
  | "STATE_DELTA"
  | "UI_RENDER"
  | "AGENT_STATE_UPDATE"
  | "ARTIFACT_CREATED"
  | "ERROR"
  | "WAVE_STARTED"
  | "WAVE_COMPLETED"
  | "SECTION_STARTED"
  | "SECTION_COMPLETED"
  | "VERDICT_ISSUED"
  | "RESULT_ENVELOPE"
  | "COST_BUDGET_UPDATE"
  | "DAEMON_LIFECYCLE";

export type AgUiEvent =
  | { type: "TEXT_MESSAGE_CONTENT"; message: string; role: "user" | "assistant" }
  | { type: "TOOL_CALL_START"; tool: string; args?: Record<string, unknown> }
  | { type: "TOOL_CALL_END"; tool: string; ok: boolean; duration_ms: number }
  | { type: "STATE_DELTA"; path: string; value: unknown }
  | { type: "UI_RENDER"; html_ref: string }
  | { type: "AGENT_STATE_UPDATE"; agent: string; state: string }
  | { type: "ARTIFACT_CREATED"; path: string; sha256?: string }
  | { type: "ERROR"; error: StructuredError }
  | { type: "WAVE_STARTED"; wave: number; sections: string[] }
  | { type: "WAVE_COMPLETED"; wave: number; score?: number }
  | { type: "SECTION_STARTED"; section: string; worker: string }
  | { type: "SECTION_COMPLETED"; section: string; status: "ok" | "partial" | "failed" }
  | { type: "VERDICT_ISSUED"; validator: string; pass: boolean; score?: number }
  | { type: "RESULT_ENVELOPE"; correlation_id: string; summary: string }
  | { type: "COST_BUDGET_UPDATE"; spent_usd: number; budget_usd: number }
  | { type: "DAEMON_LIFECYCLE"; state: "starting" | "ready" | "stopping" | "stopped" };

export type AgUiListener = (event: AgUiEvent) => void;

export interface AgUiEmitterOptions {
  sink?: (event: AgUiEvent) => void;
}

export class AgUiEmitter {
  private listeners = new Set<AgUiListener>();
  private sink?: (event: AgUiEvent) => void;

  constructor(options: AgUiEmitterOptions = {}) {
    this.sink = options.sink;
  }

  subscribe(listener: AgUiListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: AgUiEvent): void {
    for (const l of this.listeners) l(event);
    this.sink?.(event);
  }
}

let globalEmitter: AgUiEmitter | null = null;
export function getAgUi(): AgUiEmitter {
  if (!globalEmitter) globalEmitter = new AgUiEmitter();
  return globalEmitter;
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/ag-ui.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/ag-ui.ts packages/protocol/tests/ag-ui.test.ts
git commit -m "feat(v4-m1): AG-UI 16-event emitter"
```

---

## Task 7: Typed dispatch wrapper (test-first)

**Files:**
- Create: `packages/protocol/tests/dispatch.test.ts`
- Create: `packages/protocol/src/dispatch.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/dispatch.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { dispatch } from "../src/dispatch.js";
import { ok, failed } from "../src/envelope.js";

describe("dispatch", () => {
  it("invokes the handler and returns the envelope", async () => {
    const handler = vi.fn(async (payload: { x: number }) => ok({ doubled: payload.x * 2 }));
    const env = await dispatch<{ x: number }, { doubled: number }>({
      worker: "test-worker",
      payload: { x: 5 },
      handler
    });
    expect(env.status).toBe("ok");
    expect(env.artifact.doubled).toBe(10);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("returns a failed envelope on GenorahError", async () => {
    const { GenorahError } = await import("../src/errors.js");
    const handler = vi.fn(async () => {
      throw new GenorahError({
        code: "WORKER_TIMEOUT",
        message: "t/o",
        recovery_hint: "retry_with_fallback"
      });
    });
    const env = await dispatch({ worker: "bad", payload: {}, handler });
    expect(env.status).toBe("failed");
    expect(env.verdicts[0].notes).toMatch(/t\/o/);
  });

  it("emits RESULT_ENVELOPE ag-ui event", async () => {
    const { AgUiEmitter } = await import("../src/ag-ui.js");
    const em = new AgUiEmitter();
    const capture = vi.fn();
    em.subscribe(capture);
    await dispatch({
      worker: "w",
      payload: {},
      handler: async () => ok({}),
      emitter: em
    });
    expect(capture).toHaveBeenCalledWith(expect.objectContaining({ type: "RESULT_ENVELOPE" }));
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/dispatch.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement dispatch.ts**

`packages/protocol/src/dispatch.ts`:

```typescript
import { nanoid } from "nanoid";
import { AgUiEmitter, getAgUi } from "./ag-ui.js";
import { GenorahError } from "./errors.js";
import { failed, ResultEnvelope } from "./envelope.js";

export interface DispatchInput<P, T> {
  worker: string;
  payload: P;
  handler: (payload: P) => Promise<ResultEnvelope<T>>;
  emitter?: AgUiEmitter;
  correlation_id?: string;
}

export async function dispatch<P, T>(input: DispatchInput<P, T>): Promise<ResultEnvelope<T>> {
  const em = input.emitter ?? getAgUi();
  const corr = input.correlation_id ?? nanoid();
  em.emit({ type: "SECTION_STARTED", section: corr, worker: input.worker });
  try {
    const env = await input.handler(input.payload);
    const stamped: ResultEnvelope<T> = { ...env, correlation_id: corr, emitted_by: input.worker };
    em.emit({ type: "RESULT_ENVELOPE", correlation_id: corr, summary: env.status });
    em.emit({ type: "SECTION_COMPLETED", section: corr, status: env.status });
    return stamped;
  } catch (e) {
    if (e instanceof GenorahError) {
      const env = failed([{ validator: "handler", pass: false, notes: e.message }]);
      em.emit({ type: "ERROR", error: e.structured });
      return { ...env, correlation_id: corr, emitted_by: input.worker } as ResultEnvelope<T>;
    }
    throw e;
  }
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/dispatch.test.ts`
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/dispatch.ts packages/protocol/tests/dispatch.test.ts
git commit -m "feat(v4-m1): typed dispatch wrapper with ag-ui emission"
```

---

## Task 8: MCP sampling v2 adapter (test-first)

**Files:**
- Create: `packages/protocol/tests/mcp-sampling.test.ts`
- Create: `packages/protocol/src/mcp-sampling.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/mcp-sampling.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { registerAgentAsMcpPrimitive, buildSamplingRequest } from "../src/mcp-sampling.js";
import { ok } from "../src/envelope.js";

describe("MCP sampling v2 adapter", () => {
  it("builds a sampling/createMessage request with sanitized params", () => {
    const req = buildSamplingRequest({
      agent_id: "genorah/creative-director",
      capability: "review-plan",
      payload: { plan: "x" }
    });
    expect(req.method).toBe("sampling/createMessage");
    expect(req.params.metadata.agent_id).toBe("genorah/creative-director");
    expect(req.params.metadata.capability).toBe("review-plan");
  });

  it("registerAgentAsMcpPrimitive wires the handler", async () => {
    const handler = vi.fn(async () => ok({ approved: true }));
    const registry: Record<string, Function> = {};
    registerAgentAsMcpPrimitive(registry, {
      agent_id: "genorah/creative-director",
      capability: "review-plan",
      handler
    });
    const key = "genorah/creative-director/review-plan";
    expect(registry[key]).toBeDefined();
    const result = await registry[key]({ plan: "x" });
    expect(handler).toHaveBeenCalledOnce();
    expect(result.artifact.approved).toBe(true);
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/mcp-sampling.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement mcp-sampling.ts**

`packages/protocol/src/mcp-sampling.ts`:

```typescript
import type { ResultEnvelope } from "./envelope.js";

export interface SamplingRequest {
  jsonrpc: "2.0";
  id: string;
  method: "sampling/createMessage";
  params: {
    messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string } }>;
    metadata: { agent_id: string; capability: string };
    modelPreferences?: { speedPriority?: number; intelligencePriority?: number };
  };
}

export interface BuildRequestInput {
  agent_id: string;
  capability: string;
  payload: unknown;
  model_preferences?: { speedPriority?: number; intelligencePriority?: number };
}

export function buildSamplingRequest(input: BuildRequestInput): SamplingRequest {
  return {
    jsonrpc: "2.0",
    id: `${Date.now()}`,
    method: "sampling/createMessage",
    params: {
      messages: [
        { role: "user", content: { type: "text", text: JSON.stringify(input.payload) } }
      ],
      metadata: { agent_id: input.agent_id, capability: input.capability },
      modelPreferences: input.model_preferences
    }
  };
}

export interface RegisterInput<P, T> {
  agent_id: string;
  capability: string;
  handler: (payload: P) => Promise<ResultEnvelope<T>>;
}

export function registerAgentAsMcpPrimitive<P, T>(
  registry: Record<string, (payload: P) => Promise<ResultEnvelope<T>>>,
  input: RegisterInput<P, T>
): void {
  const key = `${input.agent_id}/${input.capability}`;
  registry[key] = input.handler;
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/mcp-sampling.test.ts`
Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/mcp-sampling.ts packages/protocol/tests/mcp-sampling.test.ts
git commit -m "feat(v4-m1): MCP sampling v2 adapter"
```

---

## Task 9: Embedded HTTP daemon (test-first)

**Files:**
- Create: `packages/protocol/tests/daemon.test.ts`
- Create: `packages/protocol/src/daemon.ts`

- [ ] **Step 1: Write the failing test**

`packages/protocol/tests/daemon.test.ts`:

```typescript
import { describe, it, expect, afterEach } from "vitest";
import { startDaemon, Daemon } from "../src/daemon.js";
import { ok } from "../src/envelope.js";

let daemon: Daemon | null = null;

afterEach(async () => {
  await daemon?.stop();
  daemon = null;
});

describe("protocol daemon", () => {
  it("starts on 127.0.0.1 and reports its port", async () => {
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents: new Map() });
    expect(daemon.host).toBe("127.0.0.1");
    expect(daemon.port).toBeGreaterThan(0);
  });

  it("serves /.well-known/agent.json for a registered agent", async () => {
    const agents = new Map();
    agents.set("creative-director", {
      card: {
        schema_version: "a2a-v0.3",
        id: "genorah/creative-director",
        version: "4.0.0",
        channel: "stable",
        name: "Creative Director",
        description: "x",
        tier: "director",
        capabilities: [{ id: "review-plan" }],
        tools: [],
        auth: { local: { type: "none" }, remote: { type: "oauth2", flow: "authorization_code_pkce" } },
        streaming: { supports_sse: true, ag_ui_events: true },
        mcp: { sampling_v2_compatible: true }
      },
      handler: async () => ok({ ok: true })
    });
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const res = await fetch(`${daemon.url}/.well-known/agent.json`);
    const list = await res.json();
    expect(res.status).toBe(200);
    expect(list.agents).toContainEqual(expect.objectContaining({ id: "genorah/creative-director" }));
  });

  it("POST /a2a/:agent/:capability dispatches and returns a Result envelope", async () => {
    const agents = new Map();
    agents.set("creative-director", {
      card: {
        schema_version: "a2a-v0.3",
        id: "genorah/creative-director",
        version: "4.0.0",
        channel: "stable",
        name: "Creative Director",
        description: "x",
        tier: "director",
        capabilities: [{ id: "review-plan" }],
        tools: [],
        auth: { local: { type: "none" }, remote: { type: "oauth2", flow: "authorization_code_pkce" } },
        streaming: { supports_sse: true, ag_ui_events: true },
        mcp: { sampling_v2_compatible: true }
      },
      handler: async (p: any) => ok({ echo: p })
    });
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const res = await fetch(`${daemon.url}/a2a/creative-director/review-plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "hi" })
    });
    const env = await res.json();
    expect(env.status).toBe("ok");
    expect(env.artifact.echo.plan).toBe("hi");
  });

  it("returns 404 for unknown agent", async () => {
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents: new Map() });
    const res = await fetch(`${daemon.url}/a2a/nope/x`, { method: "POST" });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run and verify fails**

Run: `cd packages/protocol && npx vitest run tests/daemon.test.ts`
Expected: FAIL — no src/daemon.

- [ ] **Step 3: Implement daemon.ts**

`packages/protocol/src/daemon.ts`:

```typescript
import Fastify, { FastifyInstance } from "fastify";
import FastifySse from "@fastify/sse-v2";
import type { AgentCard } from "./agent-card.js";
import type { ResultEnvelope } from "./envelope.js";
import { dispatch } from "./dispatch.js";
import { getAgUi } from "./ag-ui.js";

export interface RegisteredAgent {
  card: AgentCard;
  handler: (payload: unknown) => Promise<ResultEnvelope<unknown>>;
}

export interface DaemonOptions {
  host: string;
  port: number;
  agents: Map<string, RegisteredAgent>;
}

export interface Daemon {
  url: string;
  host: string;
  port: number;
  instance: FastifyInstance;
  stop(): Promise<void>;
}

export async function startDaemon(opts: DaemonOptions): Promise<Daemon> {
  const app = Fastify({ logger: false });
  await app.register(FastifySse);
  const em = getAgUi();

  app.get("/.well-known/agent.json", async () => ({
    schema_version: "a2a-v0.3",
    agents: Array.from(opts.agents.values()).map(a => a.card)
  }));

  app.post("/a2a/:agent/:capability", async (req, reply) => {
    const { agent, capability } = req.params as { agent: string; capability: string };
    const entry = opts.agents.get(agent);
    if (!entry) return reply.code(404).send({ error: "unknown_agent", agent });
    const hasCap = entry.card.capabilities.some(c => c.id === capability);
    if (!hasCap) return reply.code(404).send({ error: "unknown_capability", agent, capability });
    const env = await dispatch({
      worker: agent,
      payload: req.body ?? {},
      handler: async p => entry.handler(p),
      emitter: em
    });
    return env;
  });

  app.get("/ag-ui/stream", (req, reply) => {
    reply.sse(
      (async function* () {
        while (true) {
          yield { data: JSON.stringify({ alive: true, at: Date.now() }) };
          await new Promise(r => setTimeout(r, 15000));
        }
      })()
    );
  });

  await app.listen({ host: opts.host, port: opts.port });
  const address = app.server.address();
  if (!address || typeof address === "string") throw new Error("daemon failed to bind");
  em.emit({ type: "DAEMON_LIFECYCLE", state: "ready" });
  return {
    host: address.address,
    port: address.port,
    url: `http://${address.address}:${address.port}`,
    instance: app,
    stop: async () => {
      em.emit({ type: "DAEMON_LIFECYCLE", state: "stopping" });
      await app.close();
      em.emit({ type: "DAEMON_LIFECYCLE", state: "stopped" });
    }
  };
}
```

- [ ] **Step 4: Run and verify passes**

Run: `cd packages/protocol && npx vitest run tests/daemon.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add packages/protocol/src/daemon.ts packages/protocol/tests/daemon.test.ts
git commit -m "feat(v4-m1): embedded Fastify daemon + A2A routes"
```

---

## Task 10: Package barrel + TypeScript build

**Files:**
- Create: `packages/protocol/src/index.ts`

- [ ] **Step 1: Write barrel**

```typescript
export * from "./envelope.js";
export * from "./errors.js";
export * from "./agent-card.js";
export * from "./ag-ui.js";
export * from "./dispatch.js";
export * from "./mcp-sampling.js";
export * from "./daemon.js";
```

- [ ] **Step 2: Build**

Run: `cd packages/protocol && npm run build`
Expected: writes `packages/protocol/dist/**` with `.js` + `.d.ts` files.

- [ ] **Step 3: Run full test suite**

Run: `cd packages/protocol && npm test`
Expected: all protocol tests pass (~24 tests).

- [ ] **Step 4: Commit**

```bash
git add packages/protocol/src/index.ts packages/protocol/dist
git commit -m "feat(v4-m1): protocol package barrel + compiled output"
```

---

## Task 11: Plan the agent reorganization

**Files:**
- Create: `docs/superpowers/plans/v4-agent-map.md`

- [ ] **Step 1: Document the 24-agent → 104-agent mapping**

`docs/superpowers/plans/v4-agent-map.md`: a concrete table. Row per existing agent → new home (director or worker) + new files created. This mapping drives Tasks 30–45.

Content:

```markdown
# v4 Agent Map (v3.25 → v4.0)

## Directors (10 — all new or promoted)

| v4 Director | v3.25 Source | Notes |
|---|---|---|
| master-orchestrator | agents/orchestrator.md | Retain scope; lose in-line builder dispatch — now routes to wave-director |
| wave-director | (new) | Splits wave coordination out of orchestrator |
| creative-director | agents/creative-director.md | Unchanged scope |
| scene-director | (new) | Owns persistent canvas + camera choreography |
| narrative-director | (new) | Cross-section arc coherence |
| asset-director | (new) | Composite pipeline + cost + provenance |
| protocol-director | (new) | A2A traffic + schema validation |
| quality-director | agents/quality-reviewer.md (renamed) | 394-pt gate owner |
| mobile-director | agents/mobile-specialist.md (demoted scope) | Framework routing only |
| research-director | agents/researcher.md (renamed) | Parallel research orchestration |

## Workers (94) grouped by domain (Task 40+ creates these)

### Section Build (5)
nextjs-section, astro-section, sveltekit-section, vue-section, react-vite-section
(All derive from agents/builder.md split)

### 3D (8) — Pillar 1 ships these in M2, scaffold in M1
hero-camera-choreographer, morph-target-author, webgpu-shader-author, webgl2-fallback-author,
r3f-scene-builder, gltf-lod-generator, ktx2-encoder, spline-embed-author

### Motion (6) — M2 fleshes out
gsap-choreographer, scroll-driven-css-author, theatre-sequencer, lottie-author, rive-author, reduced-motion-variant-author

### Asset (9) — M3 fleshes out
flux-hero-gen, nano-banana-iterator, rodin-3d-gen, meshy-prototyper, character-poser, inpainter, upscaler, recraft-vector-author, video-reel-gen

### Content (5)
microcopy-author, brand-voice-enforcer, testimonial-author, pricing-author, faq-author

### Mobile (5)
swift-author, kotlin-author, rn-author, expo-author, flutter-author

### Integration (8)
supabase, stripe, hubspot, shopify, medusa, hydrogen, propstack, woocommerce (each is `<name>-integration-author`)

### Polish (5)
polisher, visual-refiner, microcopy-polisher, a11y-polisher, perf-polisher

### Critics (8)
typography-critic, color-critic, motion-critic, narrative-critic, conversion-critic, awwwards-judge-simulator, first-time-visitor-critic, skeptic-persona-critic

### Research (6)
sotd-scout, competitor-analyzer, archetype-researcher, trend-scout, reference-library-curator, pattern-miner

### Observability (6)
lighthouse-runner, axe-runner, bundle-analyzer, vr-snapshot-taker, synthetic-persona-prober, telemetry-ingester

### CMS (3)
sanity-author, contentful-author, payload-author

### DB/API (3)
prisma-schema-author, api-route-author, edge-function-author

### Testing (3)
playwright-test-author, vitest-author, storybook-story-author

### Deployment (3)
vercel-config-author, ci-pipeline-author, docker-author

### AI-feature (3)
chat-ui-author, rag-pipeline-author, agent-trace-ui-author

### Ingestion (4)
sitemap-crawler, dna-reverse-engineer, interaction-replay-fitter, cms-schema-introspector

### Misc (5)
sitemap-author, og-image-author, legal-doc-author, email-template-author, n8n-workflow-author

**Total: 95 workers + 10 directors = 105 agents.**
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/v4-agent-map.md
git commit -m "docs(v4-m1): agent-map from v3.25 to v4 tier structure"
```

---

## Task 12: Director scaffold template

**Files:**
- Create: `scripts/scaffold-director.mjs`
- Create: `agents/directors/_template.md`

- [ ] **Step 1: Write director template**

`agents/directors/_template.md`:

```markdown
---
name: __NAME__
id: genorah/__NAME__
version: 4.0.0
channel: stable
tier: director
description: __DESCRIPTION__
capabilities:
  - id: __CAPABILITY_1__
    input: __INPUT_TYPE__
    output: __OUTPUT_TYPE__
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

# __TITLE__ Director

## Role

__ROLE_PROSE__

## Input Contract

__INPUT_PROSE__

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: __OUTPUT_DESCRIPTION__
- `verdicts`: skills used for self-check
- `followups`: dispatched workers (if any)

## Protocol

1. Read STATE.md + CONTEXT.md
2. Execute role-specific logic
3. Emit AG-UI events at state transitions
4. Return Result envelope

## State Ownership

Directors hold project-scoped state across worker dispatches. This director owns:
__STATE_DESCRIPTION__
```

- [ ] **Step 2: Write scaffolding script**

`scripts/scaffold-director.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const directors = [
  {
    name: "master-orchestrator",
    title: "Master Orchestrator",
    description: "Project-level coordination, state ownership, wave routing",
    capability: "coordinate-project",
    input: "ProjectBrief",
    output: "WaveSchedule",
    role: "Routes all project-level decisions, owns STATE.md, picks next wave, handles crash recovery.",
    inputDesc: "Reads .planning/genorah/STATE.md, MASTER-PLAN.md, CONTEXT.md.",
    outputDesc: "WaveSchedule with per-wave director assignments",
    state: "STATE.md, DECISIONS.jsonld, CONTEXT.md"
  },
  { name: "wave-director", title: "Wave Director", description: "Per-wave section routing and merge", capability: "execute-wave", input: "WaveSpec", output: "WaveReport", role: "Dispatches sections to workers, collects Result envelopes, merges worktrees.", inputDesc: "WaveSpec with section list and constraints.", outputDesc: "WaveReport with per-section status", state: "wave-{n}-state.md" },
  { name: "creative-director", title: "Creative Director", description: "Taste enforcement, archetype personality, GAP-FIX authorship", capability: "review-artifact", input: "ArtifactBundle", output: "CreativeReview", role: "Reviews artifacts for archetype fit, writes GAP-FIX.md for polisher.", inputDesc: "Section artifact + DNA + archetype reference.", outputDesc: "CreativeReview with specific fix instructions", state: "CREATIVE-NOTES.md" },
  { name: "scene-director", title: "Scene Director", description: "Persistent canvas + cross-section camera choreography", capability: "choreograph-scene", input: "SceneBrief", output: "SceneGraph", role: "Owns the persistent 3D scene graph, camera keyframes, morph-target schedules.", inputDesc: "SceneBrief with section list + archetype.", outputDesc: "SceneGraph JSON + keyframe file paths", state: "SCENE-CHOREOGRAPHY.json" },
  { name: "narrative-director", title: "Narrative Director", description: "Cross-section story arc coherence", capability: "audit-narrative", input: "SectionBundle", output: "NarrativeReport", role: "Validates arc beats, flags flat sections, suggests narrative fixes.", inputDesc: "All section SUMMARY.md files.", outputDesc: "NarrativeReport with beat coverage + fix suggestions", state: "ARC-STATE.md" },
  { name: "asset-director", title: "Asset Director", description: "Composite pipeline, cost tracking, provenance", capability: "generate-composite", input: "CompositeBrief", output: "AssetBundle", role: "Reads recipes, dispatches asset workers, tracks cost against budget, enforces provenance.", inputDesc: "CompositeBrief with recipe ID + DNA context.", outputDesc: "AssetBundle with MANIFEST.json updates", state: "asset-budget-state.json" },
  { name: "protocol-director", title: "Protocol Director", description: "A2A traffic + schema validation + error routing", capability: "validate-message", input: "AnyMessage", output: "ValidationResult", role: "Runtime validator for all dispatches, cycle breaker, error router.", inputDesc: "Any protocol message.", outputDesc: "ValidationResult with pass/fail + diagnosis", state: "protocol-log.jsonld" },
  { name: "quality-director", title: "Quality Director", description: "394-pt gate verdict, hard-gate enforcement", capability: "run-gate", input: "ProjectBundle", output: "GateVerdict", role: "Runs the full 394-pt quality gate, blocks on hard-gate failures.", inputDesc: "Full project artifact bundle.", outputDesc: "GateVerdict with per-category scores + hard-gate status", state: "GATE-HISTORY.jsonld" },
  { name: "mobile-director", title: "Mobile Director", description: "Framework routing (Swift/Kotlin/RN/Expo/Flutter)", capability: "route-mobile-build", input: "MobileBrief", output: "BuildAssignment", role: "Reads mobile.primary_framework from DNA, routes to framework-specific worker.", inputDesc: "MobileBrief with target framework + screen specs.", outputDesc: "BuildAssignment dispatch", state: "mobile-routing.json" },
  { name: "research-director", title: "Research Director", description: "Parallel research orchestration across 6 tracks", capability: "research", input: "ResearchBrief", output: "ResearchBundle", role: "Orchestrates sotd-scout, competitor-analyzer, archetype-researcher, trend-scout, reference-library-curator, pattern-miner workers in parallel.", inputDesc: "ResearchBrief with tracks + budget.", outputDesc: "ResearchBundle with per-track reports", state: "research-index.md" }
];

const tplPath = join(root, "agents/directors/_template.md");
const tpl = readFileSync(tplPath, "utf8");
mkdirSync(join(root, "agents/directors"), { recursive: true });

for (const d of directors) {
  const body = tpl
    .replace(/__NAME__/g, d.name)
    .replace(/__TITLE__/g, d.title)
    .replace(/__DESCRIPTION__/g, d.description)
    .replace(/__CAPABILITY_1__/g, d.capability)
    .replace(/__INPUT_TYPE__/g, d.input)
    .replace(/__OUTPUT_TYPE__/g, d.output)
    .replace(/__ROLE_PROSE__/g, d.role)
    .replace(/__INPUT_PROSE__/g, d.inputDesc)
    .replace(/__OUTPUT_DESCRIPTION__/g, d.outputDesc)
    .replace(/__STATE_DESCRIPTION__/g, d.state);
  const p = join(root, `agents/directors/${d.name}.md`);
  if (existsSync(p)) continue;
  writeFileSync(p, body);
  console.log(`wrote ${p}`);
}
```

- [ ] **Step 3: Run scaffolder**

Run: `node scripts/scaffold-director.mjs`
Expected: creates `agents/directors/*.md` for all 10 directors.

- [ ] **Step 4: Verify count**

Run: `ls agents/directors/ | wc -l`
Expected: 11 (10 directors + _template.md)

- [ ] **Step 5: Commit**

```bash
git add agents/directors/ scripts/scaffold-director.mjs
git commit -m "feat(v4-m1): scaffold 10 director agents"
```

---

## Task 13: Worker scaffolding template + batch generator

**Files:**
- Create: `agents/workers/_template.md`
- Create: `scripts/scaffold-workers.mjs`

- [ ] **Step 1: Write worker template**

`agents/workers/_template.md`:

```markdown
---
name: __NAME__
id: genorah/__NAME__
version: 4.0.0
channel: stable
tier: worker
description: __DESCRIPTION__
capabilities:
  - id: __CAPABILITY__
    input: __INPUT__
    output: __OUTPUT__
tools: [Read, Write, Edit, Grep, Glob]
context_budget: 40000
state: stateless
isolation: __ISOLATION__
---

# __TITLE__

## Role

__ROLE__

## Input Contract

__INPUT_DESC__

## Output Contract

Returns `Result<T>` envelope where `artifact` is __ARTIFACT_DESC__.

## Validators (self-check before return)

__VALIDATORS__

## Implementation Notes

- Stateless: spawned fresh per task, no memory across calls
- Isolation: __ISOLATION_PROSE__
- Director dispatcher: __DIRECTOR__
```

- [ ] **Step 2: Write worker catalog (batch scaffolder)**

`scripts/scaffold-workers.mjs` — contains the full 94-worker catalog as a JS array with each worker's `{ name, domain, isolation, capability, role, validators, director }` fields. Generator iterates and produces all 94 files in the correct `agents/workers/<domain>/` subdirectory.

Due to length, reference the data-driven approach: one domain block at a time. For M1, scaffold bare stubs; later milestones (M2–M5) replace stubs with full content.

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const workers = [
  // Section build (5) — worktree isolation
  { domain: "section-build", name: "nextjs-section", title: "Next.js Section", isolation: "worktree", capability: "build-section", director: "wave-director", input: "SectionSpec", output: "SectionArtifact", role: "Build a Next.js 16 App Router section from PLAN.md.", artifactDesc: "path to sections/<name>/page.tsx", validators: ["archetype-specificity", "motion-presence", "scroll-coherence", "responsive-4bp"] },
  { domain: "section-build", name: "astro-section", title: "Astro Section", isolation: "worktree", capability: "build-section", director: "wave-director", input: "SectionSpec", output: "SectionArtifact", role: "Build an Astro 6 section.", artifactDesc: "path to src/pages/<name>.astro", validators: ["archetype-specificity", "motion-presence", "responsive-4bp"] },
  { domain: "section-build", name: "sveltekit-section", title: "SvelteKit Section", isolation: "worktree", capability: "build-section", director: "wave-director", input: "SectionSpec", output: "SectionArtifact", role: "Build a SvelteKit 2 section.", artifactDesc: "path to src/routes/<name>/+page.svelte", validators: ["archetype-specificity", "motion-presence", "responsive-4bp"] },
  { domain: "section-build", name: "vue-section", title: "Vue Section", isolation: "worktree", capability: "build-section", director: "wave-director", input: "SectionSpec", output: "SectionArtifact", role: "Build a Nuxt 3 / Vue section.", artifactDesc: "path to pages/<name>.vue", validators: ["archetype-specificity", "motion-presence", "responsive-4bp"] },
  { domain: "section-build", name: "react-vite-section", title: "React Vite Section", isolation: "worktree", capability: "build-section", director: "wave-director", input: "SectionSpec", output: "SectionArtifact", role: "Build a React/Vite SPA section.", artifactDesc: "path to src/sections/<Name>.tsx", validators: ["archetype-specificity", "motion-presence", "responsive-4bp"] },

  // 3D (8) — all in-process; M2 fleshes out
  { domain: "3d", name: "hero-camera-choreographer", title: "Hero Camera Choreographer", isolation: "in-process", capability: "choreograph-camera", director: "scene-director", input: "SceneBrief", output: "CameraKeyframes", role: "Emit Theatre.js keyframes for hero camera across scroll.", artifactDesc: "Theatre.js keyframe JSON", validators: ["scroll-coherence"] },
  { domain: "3d", name: "morph-target-author", title: "Morph Target Author", isolation: "in-process", capability: "author-morphs", director: "scene-director", input: "MorphBrief", output: "MorphSchedule", role: "Author morph-target transitions between section bookmarks.", artifactDesc: "morph-schedule JSON", validators: ["scroll-coherence"] },
  { domain: "3d", name: "webgpu-shader-author", title: "WebGPU Shader Author", isolation: "in-process", capability: "author-shader", director: "scene-director", input: "ShaderBrief", output: "WGSLSource", role: "Write WGSL compute/render shaders.", artifactDesc: "WGSL source string", validators: ["webgpu-degrade"] },
  { domain: "3d", name: "webgl2-fallback-author", title: "WebGL2 Fallback Author", isolation: "in-process", capability: "author-fallback", director: "scene-director", input: "FallbackBrief", output: "GLSLSource", role: "Write GLSL fallback for each WebGPU effect.", artifactDesc: "GLSL source string", validators: ["fallback-present"] },
  { domain: "3d", name: "r3f-scene-builder", title: "R3F Scene Builder", isolation: "worktree", capability: "build-r3f-scene", director: "scene-director", input: "SceneGraph", output: "TSXFile", role: "Build R3F <Canvas> component with scene graph.", artifactDesc: "path to scene/index.tsx", validators: ["archetype-specificity", "js-budget"] },
  { domain: "3d", name: "gltf-lod-generator", title: "GLTF LOD Generator", isolation: "in-process", capability: "generate-lods", director: "asset-director", input: "GLTFInput", output: "LODOutput", role: "Run gltfpack + meshopt + EXT_mesh_lods.", artifactDesc: "path to .glb with LODs", validators: ["mesh-triangle-count"] },
  { domain: "3d", name: "ktx2-encoder", title: "KTX2 Encoder", isolation: "in-process", capability: "encode-ktx2", director: "asset-director", input: "TextureInput", output: "KTX2Output", role: "Encode textures to KTX2/Basis Universal.", artifactDesc: "path to .ktx2", validators: ["texture-size"] },
  { domain: "3d", name: "spline-embed-author", title: "Spline Embed Author", isolation: "worktree", capability: "embed-spline", director: "scene-director", input: "SplineBrief", output: "EmbedArtifact", role: "Embed a Spline scene with DNA color mapping.", artifactDesc: "TSX component with Spline viewer", validators: ["archetype-specificity"] }

  // ... (remaining 81 workers follow identical shape — see agent-map.md for full list)
];

const tpl = readFileSync(join(root, "agents/workers/_template.md"), "utf8");
for (const w of workers) {
  const dir = join(root, `agents/workers/${w.domain}`);
  mkdirSync(dir, { recursive: true });
  const p = join(dir, `${w.name}.md`);
  if (existsSync(p)) continue;
  const body = tpl
    .replace(/__NAME__/g, w.name)
    .replace(/__TITLE__/g, w.title)
    .replace(/__DESCRIPTION__/g, w.role)
    .replace(/__CAPABILITY__/g, w.capability)
    .replace(/__INPUT__/g, w.input)
    .replace(/__OUTPUT__/g, w.output)
    .replace(/__ISOLATION__/g, w.isolation)
    .replace(/__ISOLATION_PROSE__/g, w.isolation === "worktree" ? "dedicated git worktree per dispatch" : "in-process invocation")
    .replace(/__DIRECTOR__/g, w.director)
    .replace(/__ROLE__/g, w.role)
    .replace(/__INPUT_DESC__/g, `${w.input} payload per director dispatch`)
    .replace(/__ARTIFACT_DESC__/g, w.artifactDesc)
    .replace(/__VALIDATORS__/g, w.validators.map(v => `- ${v}`).join("\n"));
  writeFileSync(p, body);
  console.log(`wrote ${p}`);
}
```

- [ ] **Step 3: Extend the catalog**

Copy the entire 94-worker catalog from [v4-agent-map.md](../../docs/superpowers/plans/v4-agent-map.md) into `scripts/scaffold-workers.mjs`'s `workers` array. Each entry follows the shape shown in Step 2. For brevity this plan shows 13 of the 94 — the remaining 81 follow the same pattern per domain group.

Use the domain table in v4-agent-map.md as the complete source. Script must output 94 files.

- [ ] **Step 4: Run scaffolder**

Run: `node scripts/scaffold-workers.mjs`
Expected: creates `agents/workers/<domain>/<name>.md` for all 95 workers.

- [ ] **Step 5: Verify count**

Run: `find agents/workers -name "*.md" -not -name "_template.md" | wc -l`
Expected: 94

- [ ] **Step 6: Commit**

```bash
git add agents/workers/ scripts/scaffold-workers.mjs
git commit -m "feat(v4-m1): scaffold 94 worker agents"
```

---

## Task 14: Card generator script (frontmatter → JSON)

**Files:**
- Create: `scripts/generate-agent-cards.mjs`
- Create: `.claude-plugin/generated/agent-cards.json`

- [ ] **Step 1: Write generator**

`scripts/generate-agent-cards.mjs`:

```javascript
#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml } from "yaml";
import { buildAgentCard } from "../packages/protocol/dist/agent-card.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function extractFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]+?)\n---/);
  if (!m) throw new Error("no frontmatter");
  return parseYaml(m[1]);
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("_")) out.push(p);
  }
  return out;
}

const cards = [];
for (const dir of ["agents/directors", "agents/workers"]) {
  for (const file of walk(join(root, dir))) {
    const md = readFileSync(file, "utf8");
    const fm = extractFrontmatter(md);
    const card = buildAgentCard(fm);
    cards.push(card);
  }
}

mkdirSync(join(root, ".claude-plugin/generated"), { recursive: true });
writeFileSync(
  join(root, ".claude-plugin/generated/agent-cards.json"),
  JSON.stringify(cards, null, 2)
);
console.log(`wrote ${cards.length} cards`);
```

- [ ] **Step 2: Install yaml dep**

Run: `npm i yaml@2.6.0`
Expected: installs at root.

- [ ] **Step 3: Generate**

Run: `node scripts/generate-agent-cards.mjs`
Expected: prints `wrote 104 cards`; writes `.claude-plugin/generated/agent-cards.json`.

- [ ] **Step 4: Add test**

Create `packages/protocol/tests/integration-cards.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { AgentCardSchema } from "../src/agent-card.js";

describe("generated agent cards", () => {
  it("all cards pass AgentCardSchema", () => {
    const cards = JSON.parse(
      readFileSync(".claude-plugin/generated/agent-cards.json", "utf8")
    );
    expect(cards).toHaveLength(104);
    for (const card of cards) {
      expect(() => AgentCardSchema.parse(card)).not.toThrow();
    }
  });
});
```

- [ ] **Step 5: Run test**

Run: `cd packages/protocol && npx vitest run tests/integration-cards.test.ts`
Expected: 1 passing.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-agent-cards.mjs .claude-plugin/generated/ packages/protocol/tests/integration-cards.test.ts package.json package-lock.json
git commit -m "feat(v4-m1): generate 104 agent cards from frontmatter"
```

---

## Task 15: Agent message validator hook

**Files:**
- Create: `.claude-plugin/hooks/agent-message-validator.mjs`
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Write hook**

`.claude-plugin/hooks/agent-message-validator.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync } from "fs";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const schemaPath = "packages/protocol/src/schemas/result-envelope.schema.json";

let validate;
try {
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  validate = ajv.compile(schema);
} catch (e) {
  // schema not built yet — pass-through
  process.exit(0);
}

const input = JSON.parse(readFileSync(0, "utf8"));
if (input.tool_name === "SendMessage" && input.tool_input?.message) {
  try {
    const maybeEnvelope = JSON.parse(input.tool_input.message);
    if (maybeEnvelope?.schema_version === "4.0.0") {
      const ok = validate(maybeEnvelope);
      if (!ok) {
        console.error(`[v4 protocol] SendMessage envelope failed schema validation`);
        console.error(JSON.stringify(validate.errors, null, 2));
        process.exit(2); // blocking
      }
    }
  } catch { /* not JSON — pass */ }
}
process.exit(0);
```

- [ ] **Step 2: Register hook in plugin.json**

Edit `.claude-plugin/plugin.json`, add to `hooks` array:

```json
{
  "event": "PreToolUse",
  "command": "node ${plugin_root}/.claude-plugin/hooks/agent-message-validator.mjs"
}
```

- [ ] **Step 3: Test hook manually**

Run:
```bash
echo '{"tool_name":"SendMessage","tool_input":{"message":"{\"schema_version\":\"4.0.0\",\"status\":\"bad\"}"}}' | node .claude-plugin/hooks/agent-message-validator.mjs; echo "exit=$?"
```
Expected: prints validation errors, exit=2.

Run (valid):
```bash
echo '{"tool_name":"SendMessage","tool_input":{"message":"{\"schema_version\":\"4.0.0\",\"status\":\"ok\",\"artifact\":{},\"verdicts\":[],\"followups\":[]}"}}' | node .claude-plugin/hooks/agent-message-validator.mjs; echo "exit=$?"
```
Expected: exit=0.

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/hooks/agent-message-validator.mjs .claude-plugin/plugin.json
git commit -m "feat(v4-m1): runtime envelope validator hook"
```

---

## Task 16: Daemon lifecycle hook

**Files:**
- Create: `.claude-plugin/hooks/daemon-lifecycle.mjs`
- Modify: `.claude-plugin/plugin.json`

- [ ] **Step 1: Write hook**

`.claude-plugin/hooks/daemon-lifecycle.mjs`:

```javascript
#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

const stateDir = ".planning/genorah";
const pidFile = join(stateDir, "daemon.pid");
const event = process.argv[2] || "SessionStart";

function isRunning(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

if (event === "SessionStart") {
  if (existsSync(pidFile)) {
    const pid = Number(readFileSync(pidFile, "utf8").trim());
    if (isRunning(pid)) process.exit(0);
    unlinkSync(pidFile);
  }
  const contextPath = join(stateDir, "CONTEXT.md");
  if (!existsSync(contextPath)) process.exit(0);
  const ctx = readFileSync(contextPath, "utf8");
  const intensity = /3d_intensity:\s*(\w+)/.exec(ctx)?.[1];
  if (intensity !== "cinematic" && intensity !== "immersive") process.exit(0);

  const child = spawn("node", ["packages/protocol/dist/bin/daemon.js"], {
    detached: true,
    stdio: "ignore"
  });
  writeFileSync(pidFile, String(child.pid));
  child.unref();
  process.exit(0);
}

if (event === "SessionEnd") {
  if (!existsSync(pidFile)) process.exit(0);
  const pid = Number(readFileSync(pidFile, "utf8").trim());
  if (isRunning(pid)) { try { process.kill(pid); } catch {} }
  unlinkSync(pidFile);
  process.exit(0);
}
```

- [ ] **Step 2: Register in plugin.json**

Edit `.claude-plugin/plugin.json`:

```json
{
  "event": "SessionStart",
  "command": "node ${plugin_root}/.claude-plugin/hooks/daemon-lifecycle.mjs SessionStart"
},
{
  "event": "SessionEnd",
  "command": "node ${plugin_root}/.claude-plugin/hooks/daemon-lifecycle.mjs SessionEnd"
}
```

- [ ] **Step 3: Create daemon CLI entry**

Create `packages/protocol/src/bin/daemon.ts`:

```typescript
import { startDaemon } from "../daemon.js";
import { readFileSync } from "fs";

const cards = JSON.parse(readFileSync(".claude-plugin/generated/agent-cards.json", "utf8"));
const agents = new Map();
for (const card of cards) {
  const name = card.id.split("/")[1];
  agents.set(name, {
    card,
    handler: async () => ({
      schema_version: "4.0.0" as const,
      status: "ok" as const,
      artifact: { stub: true, agent: card.id },
      verdicts: [],
      followups: []
    })
  });
}

startDaemon({ host: "127.0.0.1", port: 0, agents }).then(d => {
  console.log(JSON.stringify({ url: d.url, port: d.port, pid: process.pid }));
});
```

- [ ] **Step 4: Add build output**

Run: `cd packages/protocol && npm run build`
Expected: `dist/bin/daemon.js` exists.

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/hooks/daemon-lifecycle.mjs .claude-plugin/plugin.json packages/protocol/src/bin/
git commit -m "feat(v4-m1): daemon lifecycle hook + CLI entry"
```

---

## Task 17: `/gen:migrate-v3-to-v4` command + script

**Files:**
- Create: `commands/gen-migrate-v3-to-v4.md`
- Create: `scripts/migrate-v3-to-v4.mjs`

- [ ] **Step 1: Write command doc**

`commands/gen-migrate-v3-to-v4.md`:

```markdown
---
description: Migrate a v3.25 Genorah project to v4.0
argument-hint: "[--dry-run] [--backup-to <path>]"
---

# /gen:migrate-v3-to-v4

Upgrades a v3.25 project directory to v4.0:
1. Back up `.planning/genorah/` (if `--backup-to` passed)
2. Add `3d_intensity: accent` and `asset_budget_usd: 20` defaults to `DESIGN-DNA.md` frontmatter
3. Rewrite `CONTEXT.md` to v4 schema (adds `artifact_registry`, `protocol_version`)
4. Create `.planning/genorah/errors.jsonld` (empty)
5. Print summary of changes

## Workflow

1. Run `node ${plugin_root}/scripts/migrate-v3-to-v4.mjs "$ARGUMENTS"`.
2. Report changes made.
3. Recommend user run `/gen:status` after migration.
```

- [ ] **Step 2: Write migration script**

`scripts/migrate-v3-to-v4.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const backupIdx = args.indexOf("--backup-to");
const backup = backupIdx >= 0 ? args[backupIdx + 1] : null;

const stateDir = ".planning/genorah";
if (!existsSync(stateDir)) {
  console.error("no .planning/genorah — not a Genorah project");
  process.exit(1);
}

const changes = [];

if (backup && !dryRun) {
  mkdirSync(backup, { recursive: true });
  copyFileSync(join(stateDir, "CONTEXT.md"), join(backup, "CONTEXT.md.bak"));
  changes.push(`backed up CONTEXT.md → ${backup}`);
}

const dnaPath = join(stateDir, "DESIGN-DNA.md");
if (existsSync(dnaPath)) {
  let dna = readFileSync(dnaPath, "utf8");
  if (!dna.includes("3d_intensity:")) {
    dna = dna.replace(/^---\n/, `---\n3d_intensity: accent\nasset_budget_usd: 20\n`);
    if (!dryRun) writeFileSync(dnaPath, dna);
    changes.push("added 3d_intensity + asset_budget_usd to DESIGN-DNA.md");
  }
}

const contextPath = join(stateDir, "CONTEXT.md");
if (existsSync(contextPath)) {
  let ctx = readFileSync(contextPath, "utf8");
  if (!ctx.includes("protocol_version:")) {
    ctx += `\n\n## Protocol\nprotocol_version: 4.0.0\nartifact_registry: {}\n`;
    if (!dryRun) writeFileSync(contextPath, ctx);
    changes.push("added protocol_version + artifact_registry to CONTEXT.md");
  }
}

const errorsPath = join(stateDir, "errors.jsonld");
if (!existsSync(errorsPath)) {
  if (!dryRun) writeFileSync(errorsPath, '{"@context":"https://genorah.dev/schemas/errors","entries":[]}');
  changes.push("created errors.jsonld");
}

console.log(dryRun ? "DRY RUN — would make these changes:" : "migrated to v4.0:");
for (const c of changes) console.log(`  - ${c}`);
```

- [ ] **Step 3: Test with a fixture project**

```bash
mkdir -p /tmp/v3-test/.planning/genorah
cat > /tmp/v3-test/.planning/genorah/DESIGN-DNA.md <<'EOF'
---
archetype: brutalist
---
# DNA
EOF
cat > /tmp/v3-test/.planning/genorah/CONTEXT.md <<'EOF'
# Context
EOF
cd /tmp/v3-test && node /d/Modulo/Plugins/v0-ahh-skill/scripts/migrate-v3-to-v4.mjs
```
Expected: prints 3 changes; DNA now has `3d_intensity: accent`.

- [ ] **Step 4: Commit**

```bash
git add commands/gen-migrate-v3-to-v4.md scripts/migrate-v3-to-v4.mjs
git commit -m "feat(v4-m1): /gen:migrate-v3-to-v4 command + script"
```

---

## Task 18: Protocol-related skill docs (5 skills)

**Files:**
- Create: `skills/a2a-agent-card-generator/SKILL.md`
- Create: `skills/result-envelope-schema/SKILL.md`
- Create: `skills/ag-ui-event-emitter/SKILL.md`
- Create: `skills/mcp-sampling-v2-adapter/SKILL.md`
- Create: `skills/agent-protocol-validator/SKILL.md`

- [ ] **Step 1: Write all 5 skill docs**

Each follows the 4-layer format documented in `skills/_skill-template/SKILL.md` (exists). Scope each to its single responsibility. Include code snippets that match the TypeScript implementations from Tasks 2–9.

Each skill file starts with this frontmatter (varies per skill):

```markdown
---
name: <skill-name>
description: <one-line description>
tier: core
triggers:
  - "<keyword>"
version: 4.0.0
---
```

- [ ] **Step 2: Commit**

```bash
git add skills/a2a-agent-card-generator skills/result-envelope-schema skills/ag-ui-event-emitter skills/mcp-sampling-v2-adapter skills/agent-protocol-validator
git commit -m "feat(v4-m1): 5 protocol-related skills (4-layer format)"
```

---

## Task 19: `/gen:agents-publish`, `/gen:agents-discover`, `/gen:agents-install`

**Files:**
- Create: `commands/gen-agents-publish.md`
- Create: `commands/gen-agents-discover.md`
- Create: `commands/gen-agents-install.md`

- [ ] **Step 1: Write publish command (stub until F4 registry in M5)**

`commands/gen-agents-publish.md`:

```markdown
---
description: Publish a Genorah agent to the marketplace (M5 stub)
argument-hint: "<agent-id>"
---

# /gen:agents-publish

In M1, prints the agent card to stdout and notes the registry is not yet active (F4 ships in M5).

## Workflow

1. Read the agent frontmatter.
2. Run `node scripts/generate-agent-cards.mjs --only "$ARGUMENTS"`.
3. Print the generated card.
4. Print: "Marketplace registry lands in v4-M5. Card ready for publishing when registry is live."
```

- [ ] **Step 2: Write discover + install commands (similar stub pattern)**

`commands/gen-agents-discover.md` and `commands/gen-agents-install.md` both print "Marketplace lands in v4-M5" until F4 ships.

- [ ] **Step 3: Commit**

```bash
git add commands/gen-agents-publish.md commands/gen-agents-discover.md commands/gen-agents-install.md
git commit -m "feat(v4-m1): /gen:agents-{publish,discover,install} stubs"
```

---

## Task 20: CLAUDE.md + plugin.json version bump + README disclaimer

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Bump plugin.json version**

Edit `.claude-plugin/plugin.json`:

```json
"version": "4.0.0-alpha.1"
```

- [ ] **Step 2: Update CLAUDE.md**

Replace the top-line version block with a brief note:

```markdown
## Project Overview

**Genorah v4.0.0-alpha.1** — ships A2A protocol (L4), tiered agent structure (105 agents),
`Result<T>` envelope, and embedded HTTP daemon. Pillars 1, 2, 5, 6 land in M2–M5.
See `docs/superpowers/specs/2026-04-12-genorah-v4-cinematic-intelligence-design.md`.

## Architecture (v4)

Three-layer:
- 10 directors (stateful, own context)
- 95 workers (stateless, narrow craft, tiered isolation)
- Validators as skills (invoked by workers for self-check)
```

- [ ] **Step 3: Add README disclaimer**

Prepend to `README.md`:

```markdown
> **v4.0.0-alpha.1 in active development.** Pillar 3 + 4 (protocol + agents) ship in M1.
> Pillars 1, 2, 5, 6 land in M2–M5. Production-ready release targets v4.0.0 (M6).
```

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json CLAUDE.md README.md
git commit -m "chore(v4-m1): v4.0.0-alpha.1 version + docs"
```

---

## Task 21: Integration test — end-to-end external A2A call

**Files:**
- Create: `packages/protocol/tests/integration-e2e.test.ts`

- [ ] **Step 1: Write test**

```typescript
import { describe, it, expect, afterEach } from "vitest";
import { startDaemon, Daemon } from "../src/daemon.js";
import { ok } from "../src/envelope.js";
import { buildAgentCard } from "../src/agent-card.js";

let daemon: Daemon | null = null;

afterEach(async () => {
  await daemon?.stop();
  daemon = null;
});

describe("E2E external A2A", () => {
  it("external curl-style call reaches the creative-director handler", async () => {
    const card = buildAgentCard({
      name: "creative-director",
      id: "genorah/creative-director",
      version: "4.0.0",
      channel: "stable",
      description: "x",
      tier: "director",
      capabilities: [{ id: "review-plan", input: "PlanInput", output: "PlanReview" }]
    });
    const agents = new Map([
      ["creative-director", { card, handler: async (p: any) => ok({ approved: true, echo: p }) }]
    ]);
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });

    const res = await fetch(`${daemon.url}/a2a/creative-director/review-plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan: "v4 M1 plan" })
    });
    expect(res.status).toBe(200);
    const env = await res.json();
    expect(env.status).toBe("ok");
    expect(env.artifact.approved).toBe(true);
    expect(env.correlation_id).toMatch(/[\w-]{8,}/);
  });

  it("agent-card.json lists registered agents", async () => {
    const card = buildAgentCard({
      name: "scene-director", id: "genorah/scene-director", version: "4.0.0", channel: "stable",
      description: "x", tier: "director", capabilities: [{ id: "choreograph-scene" }]
    });
    const agents = new Map([["scene-director", { card, handler: async () => ok({}) }]]);
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents });
    const list = await fetch(`${daemon.url}/.well-known/agent.json`).then(r => r.json());
    expect(list.agents.map((a: any) => a.id)).toContain("genorah/scene-director");
  });
});
```

- [ ] **Step 2: Run**

Run: `cd packages/protocol && npx vitest run tests/integration-e2e.test.ts`
Expected: 2 passing.

- [ ] **Step 3: Commit**

```bash
git add packages/protocol/tests/integration-e2e.test.ts
git commit -m "test(v4-m1): E2E external A2A integration"
```

---

## Task 22: `/gen:self-audit` expansion for new pillar counts

**Files:**
- Modify: `commands/gen-self-audit.md`
- Modify: `scripts/gen-self-audit.mjs` (assumed existing)

- [ ] **Step 1: Add checks**

Edit `commands/gen-self-audit.md` to include new M1 checks:

- Agent count = 104 exactly
- Each `.claude-plugin/generated/agent-cards.json` entry validates against `AgentCardSchema`
- All agents have `version: 4.0.0` and `channel: stable`
- `packages/protocol/dist/` exists
- `agent-message-validator.mjs` hook registered

Update `scripts/gen-self-audit.mjs` to run these checks. Each check prints a pass/fail line with a precise failure reason.

- [ ] **Step 2: Run self-audit**

Run: `node scripts/gen-self-audit.mjs`
Expected: all M1 checks pass.

- [ ] **Step 3: Commit**

```bash
git add commands/gen-self-audit.md scripts/gen-self-audit.mjs
git commit -m "feat(v4-m1): self-audit covers M1 pillar 3 + 4 state"
```

---

## Task 23: Final M1 regression — run all tests + sanity checks

- [ ] **Step 1: Run all protocol tests**

Run: `cd packages/protocol && npm test`
Expected: 100% pass; test count ≥ 30 (envelope 6 + schema 1 + errors 5 + agent-card 5 + ag-ui 4 + dispatch 3 + mcp 2 + daemon 4 + e2e 2 + integration-cards 1).

- [ ] **Step 2: Run existing plugin tests**

Run: `npm test` (at repo root)
Expected: the 109 pre-existing tests all pass unchanged.

- [ ] **Step 3: Confirm agent count**

Run: `find agents/directors agents/workers -name "*.md" -not -name "_template.md" | wc -l`
Expected: 104

- [ ] **Step 4: Confirm generated cards**

Run: `node -e "const j=require('./.claude-plugin/generated/agent-cards.json'); console.log(j.length)"`
Expected: 104

- [ ] **Step 5: Confirm plugin.json version + M1 commit log**

Run: `grep '"version"' .claude-plugin/plugin.json`
Expected: `"version": "4.0.0-alpha.1"`

- [ ] **Step 6: Tag**

```bash
git tag v4.0.0-alpha.1 -m "v4 M1 shipping: protocol + agent foundation"
```

- [ ] **Step 7: Write M1 completion summary**

Create `docs/superpowers/plans/v4-m1-completion.md` with a one-page summary of tests, agents, commits, and migration readiness.

- [ ] **Step 8: Commit**

```bash
git add docs/superpowers/plans/v4-m1-completion.md
git commit -m "docs(v4-m1): M1 completion summary"
```

---

## M1 Exit Criteria (all must hold before starting M2)

- [ ] 104 agent files exist under `agents/directors/` and `agents/workers/<domain>/`
- [ ] `.claude-plugin/generated/agent-cards.json` contains 104 cards all passing `AgentCardSchema`
- [ ] `packages/protocol/dist/` builds cleanly with TypeScript strict mode
- [ ] All protocol tests pass (≥ 30 tests)
- [ ] All legacy tests (109) still pass
- [ ] Daemon starts/stops cleanly via `SessionStart`/`SessionEnd` hooks (manual smoke)
- [ ] External `curl` POST to `http://127.0.0.1:<port>/a2a/creative-director/review-plan` returns a valid Result envelope
- [ ] `/gen:migrate-v3-to-v4` upgrades a v3.25 fixture project successfully
- [ ] `v4.0.0-alpha.1` git tag exists
