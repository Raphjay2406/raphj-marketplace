# Phase 9: Integration & Polish - Research

**Researched:** 2026-02-24
**Domain:** Figma MCP integration, design system export (Storybook + design tokens), progress reporting for multi-agent pipeline, error recovery for wave-based builds -- all as SKILL.md markdown knowledge bases and agent protocol enhancements for a Claude Code plugin
**Confidence:** HIGH (core topics verified via official docs and MCP tooling references)

## Summary

Phase 9 produces 4 deliverables that complete the Modulo end-to-end workflow: a Figma Integration skill for reading designs via MCP tools and translating them to the existing plan-then-execute pipeline, a Design System Export skill for producing Storybook stories and design tokens packages from built projects, a progress reporting system that extends the design-lead and build-orchestrator agents with structured status updates, and an error recovery system that extends agents with diagnosis, option presentation, and checkpoint resume capabilities.

The Figma MCP server (as of Feb 2026) provides 13 tools including `get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs`, and Code Connect tools. The recommended workflow is: get_metadata first for large designs, then get_design_context on specific nodes, get_screenshot for visual reference, and get_variable_defs for design tokens. The skill must teach Claude how to translate Figma's React+Tailwind output into project-specific DNA-compliant code, flagging non-token colors for user decision.

For design system export, Storybook 10 is current (10.1.x) with CSF Factories as the recommended story format. Style Dictionary 5 is the current version for multi-platform token transformation, with first-class W3C DTCG format support (the DTCG spec reached its first stable version 2025.10). The skill should document CSF Factories format for story generation and Style Dictionary 5 with DTCG tokens for export.

Progress reporting and error recovery are agent protocol enhancements, not standalone skills. They integrate into the existing design-lead and build-orchestrator agents by extending STATE.md format and adding structured error handling protocols. The key architectural insight is that these are markdown protocol definitions that teach Claude how to report and recover, not application code.

**Primary recommendation:** Build each deliverable in the 4-layer skill format where it's a skill (Figma integration, design system export) and as agent protocol sections where it's behavioral (progress reporting, error recovery). All four integrate into the existing plan-then-execute pipeline via well-defined trigger points, matching the Phase 4 pattern of enriching existing agents with new knowledge.

## Standard Stack

This phase produces markdown files (skills, agent protocol enhancements). The "stack" is the technologies these skills will document and recommend.

### Core Technologies (Skills Will Reference)
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Figma MCP Server | Current (Feb 2026) | Design-to-code bridge via 13 MCP tools | Official Figma tool, available in Claude Code via `claude mcp add` |
| Figma Code Connect | CLI + UI | Maps Figma components to codebase components | Official Figma tool, enriches MCP output with real implementation details |
| Storybook | 10.1.x | Component documentation and interaction testing | Industry standard, CSF Factories format is the new recommended approach |
| Style Dictionary | 5.3.x | Multi-platform design token transformation | First-class W3C DTCG support, outputs CSS/JSON/any format |
| W3C DTCG Spec | 2025.10 (stable) | Vendor-neutral design token format | First stable version, backed by Figma/Adobe/Google/Microsoft/etc. |
| pixelmatch | 6.x | Pixel-level image comparison | Used by Playwright internally, 150 lines, zero dependencies |
| Playwright MCP | Current | Browser automation for screenshots/visual QA | Already established in Phase 4 live-testing skill |

### Supporting Technologies
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| @storybook/test | 10.x | Play function interaction testing (Vitest + Testing Library) | Story interaction testing for hover, click, keyboard |
| @storybook/addon-a11y | 10.x | Accessibility testing in Storybook | Automated a11y checks for exported components |
| tokens-studio/configurator | Current | Figma Variables to Style Dictionary bridge | When syncing tokens back to Figma |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Style Dictionary 5 | Tokens Studio CLI | Style Dictionary is more established, DTCG support is mature, broader platform support |
| CSF Factories (Storybook 10) | CSF3 (Storybook 8) | CSF3 still works but Storybook 10 is current; CSF Factories have better type safety and less boilerplate |
| pixelmatch | Playwright built-in toHaveScreenshot | Playwright's built-in requires test framework; pixelmatch works with raw image data for more flexible overlay diff |
| W3C DTCG format | Custom JSON format | DTCG is the industry standard now (stable since Oct 2025), future-proof |

## Architecture Patterns

### How Phase 9 Artifacts Integrate with the Existing Pipeline

Phase 9 creates 2 new skills and extends 2 existing agent protocols:

```
Phase 9 Deliverables         -> Integration Point               -> When Triggered
----------------------------    ---------------------------------    ----------------
figma-integration skill      -> figma-translator agent (rewrite)  -> /modulo:start-design --figma
                             -> section-planner agent              -> Plan generation from Figma data
                             -> quality-reviewer agent             -> Visual QA overlay diff in verify step

design-system-export skill   -> new export command or agent        -> /modulo:export (post-build)
                             -> quality-reviewer agent              -> Verifying export completeness

progress-reporting protocol  -> design-lead agent (extension)      -> Every task, every wave, every milestone
                             -> build-orchestrator agent            -> During wave execution
                             -> STATE.md format (extension)         -> Machine-readable status

error-recovery protocol      -> design-lead agent (extension)      -> On any failure
                             -> build-orchestrator agent            -> On builder failure
                             -> section-builder agent               -> On task failure
                             -> STATE.md format (extension)         -> Failure log, checkpoint state
```

### Pattern 1: Figma-to-Pipeline Bridge (Not Direct Code Generation)

**What:** The Figma integration skill does NOT generate code directly. It translates Figma designs into PLAN.md files that flow through the normal execute pipeline.
**When to use:** Figma Integration skill.
**Why:** User decision in CONTEXT.md: "Figma import produces PLAN.md files that go through the normal execute pipeline -- user reviews plans before code is written."

```
Figma Design
  |
  v
[get_metadata] -> page structure overview
  |
  v
[get_design_context per node] -> layout, components, styles
  |
  v
[get_variable_defs] -> design tokens from Figma
  |
  v
[get_screenshot] -> visual reference for QA
  |
  v
DNA Translation Layer:
  - Map Figma colors to DNA tokens (flag unmapped as user decision)
  - Map Figma typography to DNA type scale
  - Map Figma spacing to DNA spacing scale
  - Detect Code Connect components -> use directly
  - Detect unrecognized components -> Claude's discretion
  |
  v
PLAN.md Generation:
  - One PLAN.md per section (matching normal pipeline)
  - Beat assignments from emotional arc
  - Figma screenshot as reference target
  - Visual specification from Figma layout data
  |
  v
Normal Execute Pipeline (/modulo:execute)
```

**Confidence: HIGH** -- Directly from user decisions in CONTEXT.md.

### Pattern 2: Hybrid DNA-Figma Token Resolution

**What:** When Figma variables exist, they take precedence for color/spacing/typography. DNA fills gaps for motion, interactions, forbidden patterns, and missing tokens.
**When to use:** Figma Integration skill DNA translation layer.
**Why:** User decision: "Hybrid DNA relationship: Figma styles used where present, DNA fills gaps."

```markdown
### Token Resolution Priority
1. Figma Variable (via get_variable_defs) -> Use directly
2. Figma Style (via get_design_context) -> Map to nearest DNA token
3. Raw hex/value (not in Figma variables) -> FLAG for user decision:
   a) Map to existing DNA token
   b) Add as new DNA token
   c) Keep as-is (document deviation)
4. Not in Figma at all -> DNA provides (motion, interactions, forbidden patterns)
```

**Confidence: HIGH** -- Directly from CONTEXT.md decisions.

### Pattern 3: Storybook CSF Factories + Style Dictionary DTCG Export

**What:** Design system export produces two artifacts: Storybook stories in CSF Factories format and a design tokens package in W3C DTCG format via Style Dictionary 5.
**When to use:** Design System Export skill.
**Why:** Storybook 10 is current with CSF Factories as the recommended format. Style Dictionary 5 with DTCG is the industry standard for token packages.

```typescript
// Storybook 10 CSF Factories format
import preview from '../.storybook/preview';
import { Button } from './components/ui/Button';

const meta = preview.meta({ component: Button });

export const Primary = meta.story({
  args: { variant: 'primary', children: 'Get Started' },
});

export const WithHover = meta.story({
  args: { variant: 'primary', children: 'Get Started' },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await userEvent.hover(button!);
    await expect(button).toHaveStyle('transform: translateY(-2px)');
  },
});
```

```json
// W3C DTCG token format (Style Dictionary 5 input)
{
  "color": {
    "$type": "color",
    "bg": {
      "primary": { "$value": "#0a0a0a", "$description": "Primary background" },
      "secondary": { "$value": "#141414", "$description": "Secondary background" }
    },
    "accent": {
      "1": { "$value": "#ff4d00", "$description": "Primary accent" }
    }
  },
  "spacing": {
    "$type": "dimension",
    "section": { "$value": "6rem" },
    "block": { "$value": "3rem" },
    "element": { "$value": "1.5rem" }
  }
}
```

**Confidence: HIGH** -- Storybook 10 verified via npm/releases. Style Dictionary 5 verified via npm. DTCG stable spec verified via W3C announcement.

### Pattern 4: STATE.md Extended Format for Progress Reporting

**What:** STATE.md gains per-task status tracking, timestamps, and structured failure logging alongside existing wave/section tracking.
**When to use:** Progress reporting protocol and error recovery protocol.
**Why:** User decision: "Per-task updates -- every task within a section's PLAN.md shows status" and "STATE.md (machine-readable)."

```markdown
## Task Progress (Current Wave)
| Section | Task | Status | Started | Duration | Notes |
|---------|------|--------|---------|----------|-------|
| 03-hero | Task 1: Create component | COMPLETE | 14:32 | 2m | - |
| 03-hero | Task 2: Add animations | IN_PROGRESS | 14:34 | - | Adding scroll-driven reveal |
| 04-features | Task 1: Create grid | PENDING | - | - | - |

## Failure Log
| Time | Section | Task | Type | Severity | Resolution |
|------|---------|------|------|----------|------------|
| 14:28 | 02-nav | Task 3 | Build error | MINOR | Auto-fixed: missing import |
| 14:35 | 03-hero | Task 2 | Type error | MINOR | Isolated, continuing |
```

**Confidence: HIGH** -- Extensions to existing STATE.md format, consistent with Phase 2 architecture.

### Pattern 5: Structured Error Diagnosis and Recovery

**What:** When a failure occurs, the agent produces a structured diagnosis with code context, 2-3 fix options with trade-offs, and lets the user choose. For minor failures, Claude isolates and continues. For critical failures, Claude pauses.
**When to use:** Error recovery protocol in all pipeline agents.
**Why:** User decisions: "Claude's discretion -- isolate minor vs pause on critical" and "2-3 fix options with trade-offs, user picks."

```markdown
### Error Diagnosis Template

## Failure Report: [Section] / [Task]

**Type:** [build-error | type-error | runtime-error | dependency-error | timeout | context-rot]
**Severity:** [MINOR | MAJOR | CRITICAL]
**Location:** [file:line or agent context]

### What Happened
[Specific description with code context]

### Root Cause
[Analysis of why this happened]

### Fix Options
1. **[Quick fix]** -- [description]
   - Trade-off: [what you give up]
   - Risk: LOW
2. **[Proper fix]** -- [description]
   - Trade-off: [takes longer]
   - Risk: LOW
3. **[Restart approach]** -- [description]
   - Trade-off: [loses progress on this task]
   - Risk: NONE

### Recommendation
Option [N] because [reason].

### Awaiting User Decision
```

**Confidence: HIGH** -- Based on established error handling patterns adapted to this specific pipeline.

### Pattern 6: Visual QA Overlay Diff

**What:** During the verify step, screenshot the built page and compare against Figma export using pixel-level diff. Highlight differences as an overlay image.
**When to use:** Figma Integration skill, quality-reviewer verify step.
**Why:** User decision: "Visual QA: overlay diff comparison as part of verify step."

The workflow:
1. `get_screenshot` from Figma MCP for the design reference
2. `Playwright_screenshot` from Playwright MCP for the built page (same viewport)
3. pixelmatch comparison to produce diff overlay
4. Report significant differences (threshold-based, accounting for anti-aliasing)
5. Present overlay to user with highlighted regions

**Confidence: MEDIUM** -- The concept is sound, but the exact implementation depends on how screenshots are exchanged between MCP tools. pixelmatch requires raw image data (Uint8Array) which may need canvas processing. The skill should document the approach and flag that implementation details depend on available MCP tool capabilities.

### Anti-Patterns to Avoid

- **Direct Figma-to-code generation:** The Figma skill MUST produce PLAN.md files, not code. Code comes from the execute pipeline. Skipping the plan step bypasses user review and quality enforcement.
- **Hardcoding Figma values over DNA tokens:** Figma values should map to DNA tokens. Only user-approved exceptions can use raw values.
- **Auto-generating all stories:** Not every component needs a story. The export skill should curate based on reusability and complexity (user decision: "Claude's discretion on what to export").
- **Custom token format:** Use W3C DTCG, not a custom JSON schema. The spec is stable and industry-standard.
- **Progress polling:** Don't create a separate progress mechanism. Extend STATE.md and inline conversation reporting (existing patterns).
- **Silent retry on failure:** User decision: "Build failures bubble to user (no auto-retry)" from Phase 2.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Design token transformation | Custom JSON-to-CSS converter | Style Dictionary 5 with DTCG | Handles references, theming, multi-platform output, battle-tested |
| Visual comparison | Custom image diffing | pixelmatch (used by Playwright internally) | 150 lines, zero deps, handles anti-aliasing |
| Component documentation | Custom docs site | Storybook 10 with CSF Factories | Industry standard, play functions, auto-controls, a11y addon |
| Figma design extraction | Custom Figma REST API integration | Figma MCP server tools | Official tooling, maintained by Figma, integrated with Code Connect |
| Token format specification | Custom token JSON schema | W3C DTCG format ($value, $type, $description) | First stable industry standard (Oct 2025), supported by all major tools |
| Story interaction testing | Custom test scripts | @storybook/test (Vitest + Testing Library) | Built into Storybook, play functions, visual debugging panel |
| Screenshot comparison | Custom canvas manipulation | Playwright MCP toHaveScreenshot or pixelmatch | Established tooling with threshold configuration |

**Key insight:** Every external integration in this phase has an established, maintained tool. The skills should teach Claude how to use these tools effectively, not how to build alternatives.

## Common Pitfalls

### Pitfall 1: Figma MCP get_design_context Token Truncation
**What goes wrong:** Large Figma frames return truncated design context, causing missing components or styles.
**Why it happens:** `get_design_context` has output limits. Complex frames with many layers exceed the token budget.
**How to avoid:** The Figma Integration skill must document the two-step approach:
1. Call `get_metadata` first to get the node structure
2. Call `get_design_context` on individual child nodes, not the entire page
3. For multi-page files: process page by page (user decision)
**Warning signs:** If the skill shows `get_design_context` called on a full page without checking response size first.

**Confidence: HIGH** -- Documented in official Figma MCP server guide.

### Pitfall 2: Figma get_variable_defs Alias Resolution
**What goes wrong:** `get_variable_defs` returns resolved values instead of alias references, losing the token hierarchy.
**Why it happens:** Known limitation (reported by multiple users on Figma forums as of Feb 2026). The tool returns final resolved values, not the alias chain.
**How to avoid:** The skill should document:
- Use `get_variable_defs` output as the starting point
- Cross-reference with the DNA token system to reconstruct semantic relationships
- When a Figma value matches a DNA token value, map to the DNA token name
- Flag ambiguous matches for user decision
**Warning signs:** If the skill assumes get_variable_defs returns perfect token hierarchies.

**Confidence: HIGH** -- Multiple Figma forum reports confirm this limitation.

### Pitfall 3: Storybook Version Confusion (8 vs 10)
**What goes wrong:** Generating stories in CSF3 format when the project uses Storybook 10 with CSF Factories.
**Why it happens:** Most online tutorials and Claude's training data reference Storybook 7/8 patterns. Storybook 10 is current as of Feb 2026.
**How to avoid:** The Design System Export skill must use CSF Factories format:
```typescript
// CORRECT (Storybook 10 CSF Factories)
import preview from '../.storybook/preview';
const meta = preview.meta({ component: Button });
export const Primary = meta.story({ args: { ... } });

// WRONG (Storybook 8 CSF3 -- outdated)
const meta = { component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
```
**Warning signs:** If code examples use `satisfies Meta<typeof X>` or `export default meta` pattern.

**Confidence: HIGH** -- Storybook 10.1.x verified via npm as current. CSF Factories promoted from experimental to preview.

### Pitfall 4: Style Dictionary v3 Patterns in v5 Context
**What goes wrong:** Using `require()` style config, v3 token format, or deprecated transforms.
**Why it happens:** Most tutorials reference Style Dictionary v3. Version 5 is current with DTCG support and ESM-only.
**How to avoid:** The skill must use Style Dictionary 5 patterns:
- ESM config (`export default { ... }`)
- DTCG format tokens (`$value`, `$type`, `$description`)
- Updated transform groups and platform configs
**Warning signs:** `require('style-dictionary')` or `value` instead of `$value` in token files.

**Confidence: HIGH** -- Style Dictionary 5.3.x confirmed via npm.

### Pitfall 5: Silent Failure in Multi-Agent Builds
**What goes wrong:** A section-builder encounters an error but the orchestrator doesn't detect it, leading to incomplete waves marked as complete.
**Why it happens:** Task tool communication is one-way. If a spawned agent fails silently, the orchestrator may not know.
**How to avoid:** The error recovery protocol must define:
1. Every builder writes SUMMARY.md with explicit `status: COMPLETE | FAILED | PARTIAL`
2. Orchestrator checks SUMMARY.md after each builder finishes
3. Missing SUMMARY.md after reasonable time = treat as FAILED
4. FAILED status triggers diagnosis flow, not silent skip
**Warning signs:** If the protocol doesn't define how failure propagates from builder to orchestrator.

**Confidence: HIGH** -- Based on Phase 2 architecture where builders already write SUMMARY.md.

### Pitfall 6: Failure Log Bloating STATE.md
**What goes wrong:** Detailed failure logs push STATE.md over the 100-line budget established in Phase 2.
**Why it happens:** Each failure with diagnosis, options, and resolution adds 10-20 lines. Multiple failures can quickly exceed limits.
**How to avoid:** The error recovery protocol must define:
1. STATE.md gets a compact failure summary (1 line per failure: time, section, type, resolution)
2. Detailed diagnosis goes to a separate file: `.planning/modulo/FAILURE-LOG.md`
3. STATE.md links to FAILURE-LOG.md for details
4. Only the most recent 5 failures stay in STATE.md; older ones move to FAILURE-LOG.md
**Warning signs:** If the protocol puts full diagnosis in STATE.md.

**Confidence: HIGH** -- Existing 100-line budget constraint from Phase 2 design-lead agent.

### Pitfall 7: Progress Reporting Token Overhead
**What goes wrong:** Per-task status updates consume excessive conversation tokens, leaving less context for actual building.
**Why it happens:** If every task status change triggers a verbose report, the conversation fills with status noise.
**How to avoid:** The progress reporting protocol must be tiered:
1. Per-task: compact one-liner in STATE.md (machine-readable)
2. Per-section: brief inline highlight in conversation ("Section 03-hero complete, 4/4 tasks passed")
3. Per-wave: detailed wave summary with scores and screenshots (user review gate)
4. Milestones: full report with Awwwards scores and next steps
**Warning signs:** If every task generates a multi-paragraph report.

**Confidence: HIGH** -- User decision: "detailed status in STATE.md (machine-readable), key milestones and scores highlighted inline in conversation."

## Code Examples

### Figma MCP Tool Call Sequence (for Skill Documentation)
```markdown
### Recommended Figma Import Workflow

#### Step 1: Get page structure
Use `get_metadata` with the Figma file URL to get an overview of all frames/pages.
This returns a sparse XML with layer IDs, names, types, and positions.

#### Step 2: Select target frame
User identifies which frame/page to import (for multi-page files).

#### Step 3: Get design context per section
For each major section/frame, call `get_design_context` with the specific node ID.
This returns React + Tailwind representation (customize per prompt for other frameworks).
If truncated, break into smaller node queries.

#### Step 4: Get design tokens
Call `get_variable_defs` to extract Figma variables (colors, spacing, typography).
Map to DNA tokens using the hybrid resolution protocol.

#### Step 5: Capture visual reference
Call `get_screenshot` for each section to use as visual QA reference.
Save to `.planning/modulo/figma-references/[section-name].png`

#### Step 6: Check Code Connect
Call `get_code_connect_map` to find components already mapped to codebase.
Use CodeConnectSnippet components directly instead of generating new ones.

#### Step 7: Translate to PLAN.md files
For each section, generate a PLAN.md following the standard format:
- Beat assignment from emotional arc
- Visual specification from Figma layout data
- Component structure from Figma component hierarchy
- Reference: Figma screenshot for visual QA
```

### Storybook 10 CSF Factories Story Generation
```typescript
// Source: Storybook 10 official docs + blog
// components/ui/Button.stories.ts
import preview from '../.storybook/preview';
import { userEvent, within, expect } from '@storybook/test';
import { Button } from './Button';

const meta = preview.meta({
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
});

// Visual documentation stories
export const Primary = meta.story({
  args: { variant: 'primary', children: 'Get Started' },
});

export const Secondary = meta.story({
  args: { variant: 'secondary', children: 'Learn More' },
});

export const Ghost = meta.story({
  args: { variant: 'ghost', children: 'Cancel' },
});

// Interaction testing with play function
export const HoverState = meta.story({
  args: { variant: 'primary', children: 'Hover Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.hover(button);
    // Verify hover state is applied
    await expect(button).toHaveClass('hover');
  },
});

export const ClickInteraction = meta.story({
  args: { variant: 'primary', children: 'Click Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  },
});

export const KeyboardNavigation = meta.story({
  args: { variant: 'primary', children: 'Tab to Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
});
```

### W3C DTCG Token Package Structure
```json
// tokens/color.json (W3C DTCG format for Style Dictionary 5)
{
  "color": {
    "$type": "color",
    "bg": {
      "primary": {
        "$value": "#0a0a0a",
        "$description": "Primary background (DNA bg-primary)"
      },
      "secondary": {
        "$value": "#141414",
        "$description": "Secondary background (DNA bg-secondary)"
      },
      "tertiary": {
        "$value": "#1a1a2e",
        "$description": "Tertiary background (DNA bg-tertiary)"
      }
    },
    "text": {
      "primary": {
        "$value": "#f5f5f5",
        "$description": "Primary text color"
      },
      "secondary": {
        "$value": "#a3a3a3",
        "$description": "Secondary text color"
      }
    },
    "accent": {
      "1": { "$value": "#ff4d00", "$description": "Primary accent (DNA accent-1)" },
      "2": { "$value": "#00d4ff", "$description": "Secondary accent (DNA accent-2)" },
      "3": { "$value": "#a855f7", "$description": "Tertiary accent (DNA accent-3)" }
    }
  }
}
```

### Style Dictionary 5 Configuration (Multi-Platform Export)
```javascript
// style-dictionary.config.mjs (ESM, Style Dictionary 5)
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: ':root',
        },
      }],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.json',
        format: 'json/nested',
      }],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/figma/',
      files: [{
        destination: 'figma-tokens.json',
        format: 'json/flat',
        options: {
          // Figma-compatible flat format for syncing back
        },
      }],
    },
  },
};
```

### Error Recovery: Builder Failure Propagation
```markdown
### SUMMARY.md Failure Format (Section Builder Output)

## Section: 03-hero
**Status:** FAILED
**Wave:** 2
**Completed Tasks:** 2/5
**Failed At:** Task 3: Add scroll-driven parallax

### Failure Details
- **Type:** Build error
- **File:** src/components/sections/Hero.tsx:45
- **Error:** `Property 'animationTimeline' does not exist on type 'CSSProperties'`
- **Context:** TypeScript strict mode rejects `animation-timeline` CSS property

### Checkpoint State
- Task 1: COMPLETE (Hero component shell created)
- Task 2: COMPLETE (Typography and content placed)
- Task 3: FAILED (scroll-driven animation)
- Task 4: NOT_STARTED (responsive adaptations)
- Task 5: NOT_STARTED (interaction states)

### Files Modified (Safe to Keep)
- src/components/sections/Hero.tsx (partial, tasks 1-2 complete)
- src/styles/hero.css (partial)

### Suggested Recovery
1. Use inline style object with `animationTimeline` (bypasses TS check)
2. Switch to Motion `useScroll` approach (avoids CSS property type issue)
3. Restart task 3 with `@ts-expect-error` annotation
```

### Progress Reporting: Wave Summary Format
```markdown
### Wave 2 Complete

**Sections Built:** 03-hero, 04-features, 05-social-proof
**Duration:** 12 minutes
**Tasks:** 14/15 complete (1 auto-fixed minor error)

| Section | Tasks | Status | Layout Pattern | Beat |
|---------|-------|--------|---------------|------|
| 03-hero | 5/5 | COMPLETE | Full-bleed split | HOOK |
| 04-features | 5/5 | COMPLETE | Asymmetric grid | BUILD |
| 05-social-proof | 4/5 | COMPLETE (1 auto-fix) | Horizontal scroll | PROOF |

**Anti-Slop Score:** 28/35 (passing)
**DNA Compliance:** PASSED (all tokens match)
**Layout Diversity:** PASSED (3 distinct patterns)

**Canary Check:** 5/5 correct (context healthy)

**Next:** Wave 3 -- sections 06-cta, 07-footer
**Review Gate:** Awaiting user approval to proceed to Wave 3.
```

## State of the Art

### Technology Changes Relevant to Phase 9

| Old Approach | Current Approach | When Changed | Impact on Skills |
|--------------|------------------|--------------|-----------------|
| Figma REST API for design extraction | Figma MCP server (13 tools) | 2025 | Skill uses MCP tools, not REST API |
| `get_code` tool name | `get_design_context` (renamed) | Late 2025 | Use current tool name in all documentation |
| Style Dictionary v3 (CommonJS) | Style Dictionary v5 (ESM, DTCG) | 2025-2026 | ESM config, $value/$type format |
| Custom token JSON format | W3C DTCG spec 2025.10 (stable) | Oct 2025 | Use standard format, future-proof |
| Storybook 8 CSF3 | Storybook 10 CSF Factories | 2025-2026 | `preview.meta()` / `meta.story()` pattern |
| Custom screenshot comparison | pixelmatch (Playwright internal) | Stable | Use established diffing library |
| Manual progress tracking | STATE.md per-task tracking | Phase 2 foundation | Extend existing pattern |
| Silent retry on failure | User-approved recovery | Phase 2 decision | No auto-retry, bubble to user |

### Figma MCP Server Tools (Complete List)
| Tool | Purpose | Key Parameters |
|------|---------|---------------|
| `get_design_context` | Layout, styles, components for a node | fileKey, nodeId |
| `get_metadata` | Sparse XML of node structure | fileKey, nodeId |
| `get_screenshot` | Visual snapshot of selection | fileKey, nodeId |
| `get_variable_defs` | Design tokens (colors, spacing, typography) | fileKey, nodeId |
| `get_code_connect_map` | Component-to-code mappings | fileKey |
| `add_code_connect_map` | Create new component mapping | fileKey, mappings |
| `get_code_connect_suggestions` | Auto-detected mapping opportunities | fileKey |
| `send_code_connect_mappings` | Confirm suggested mappings | fileKey, mappings |
| `generate_figma_design` | Push code as design layers to Figma | fileKey, design data |
| `generate_diagram` | Create FigJam diagrams from Mermaid | diagram spec |
| `get_figjam` | FigJam metadata + screenshots | fileKey |
| `create_design_system_rules` | Generate rule files for agent context | fileKey |
| `whoami` | Authenticated user info (remote only) | none |

### Storybook Evolution
| Version | Status | Story Format | Key Feature |
|---------|--------|-------------|-------------|
| Storybook 8 | Superseded | CSF3 (objects) | `satisfies Meta`, `StoryObj` types |
| Storybook 10 | Current (10.1.x) | CSF Factories (preview) | `preview.meta()`, `meta.story()`, ESM-only |
| Storybook 11 | Upcoming (Spring 2026) | CSF Factories (default) | Factories become the standard |

### Style Dictionary Evolution
| Version | Status | Token Format | Key Feature |
|---------|--------|-------------|-------------|
| v3 | Legacy | Custom (`value`, `type`) | CommonJS, established |
| v4 | Supported | DTCG + custom dual support | First DTCG support |
| v5 | Current (5.3.x) | DTCG recommended | ESM-only, improved transforms |

**Deprecated/outdated:**
- `get_code` Figma MCP tool name -- renamed to `get_design_context`
- `require('style-dictionary')` -- use ESM import
- `value`/`type` token format -- use `$value`/`$type` (DTCG)
- Storybook CSF3 `export default meta` pattern -- use CSF Factories `preview.meta()`
- Manual Figma API token extraction -- use MCP tools

## Open Questions

### 1. Figma Screenshot Format and Exchange Between MCP Tools
- **What we know:** `get_screenshot` from Figma MCP returns an image. `Playwright_screenshot` from Playwright MCP captures page screenshots.
- **What's unclear:** The exact format of screenshots from each tool (base64? file path? URL?) and whether they can be directly compared via pixelmatch without intermediate conversion. The skill needs to document the format bridging step.
- **Recommendation:** Document the overlay diff as a conceptual workflow. The actual implementation will depend on what the MCP tools return at runtime. Include a fallback approach: save both screenshots to disk, load with canvas/sharp, compare with pixelmatch. Mark this as requiring validation during implementation.

**Confidence: MEDIUM** -- Concept is sound but exact MCP tool output formats need runtime validation.

### 2. Storybook CSF Factories Maturity for Non-React Frameworks
- **What we know:** CSF Factories are "Preview" status for React in Storybook 10. Vue, Angular, and Web Components support is expected in 10.x releases.
- **What's unclear:** Whether Astro projects (using React islands) can use CSF Factories or need CSF3 fallback.
- **Recommendation:** Document CSF Factories as the primary format for React/Next.js projects. Include CSF3 as a fallback for Astro projects or if CSF Factories aren't available. The skill should detect the framework and recommend the appropriate format.

**Confidence: MEDIUM** -- CSF Factories confirmed for React but Astro integration needs validation.

### 3. Style Dictionary 5 Figma Sync-Back Format
- **What we know:** Style Dictionary 5 can output multiple formats. Figma Variables API accepts specific formats for token sync.
- **What's unclear:** The exact JSON format Figma expects for variable import, and whether Style Dictionary has a built-in format for this.
- **Recommendation:** Document the three output formats (CSS, JSON, Figma-compatible) as specified in user decisions. The Figma-compatible format should match the Figma Variables API structure. Include a note that this may require a custom Style Dictionary formatter.

**Confidence: MEDIUM** -- Multi-format output is confirmed, but Figma sync-back format specifics need validation.

### 4. Error Recovery for Mid-Wave Crashes
- **What we know:** The design-lead writes CONTEXT.md after every wave. STATE.md tracks section status. Builders write SUMMARY.md on completion.
- **What's unclear:** If Claude Code itself crashes mid-wave (session interruption), how do we detect which builders completed vs. which were in progress? SUMMARY.md may not exist for in-progress builders.
- **Recommendation:** The error recovery protocol should define:
  1. Check for SUMMARY.md in each section directory
  2. No SUMMARY.md + files modified = INTERRUPTED (needs assessment)
  3. No SUMMARY.md + no files = NOT_STARTED (restart from scratch)
  4. The `/modulo:execute resume` flow already handles this to some extent via CONTEXT.md
  5. Add a pre-wave checkpoint: write STATE.md with `IN_PROGRESS` status BEFORE spawning builders

**Confidence: HIGH** -- Existing CONTEXT.md session recovery covers most cases. Gap is detecting partial builder completion.

### 5. Progress Reporting and Context Budget
- **What we know:** Per-task updates to STATE.md are requested. STATE.md has a 100-line budget. Design-lead has turn-based context zones.
- **What's unclear:** Whether per-task STATE.md updates create excessive file I/O that slows builds.
- **Recommendation:** Batch STATE.md updates -- update at task completion (not task start), and batch multiple task completions in a single write when possible. The conversation-level reporting can be more real-time.

## Skill-Specific Research Findings

### 09-01: Figma Integration Skill

**What to build:** A 4-layer SKILL.md that teaches Claude how to read Figma designs via MCP tools and translate them into PLAN.md files for the normal execute pipeline. Also rewrites the existing `agents/figma-translator.md` to use the new skill.

**Key sections to include:**
1. **Layer 1 (Decision Guidance):** MCP tool selection decision tree (when to use each of the 13 tools), DNA-Figma hybrid token resolution protocol, non-token color flagging flow
2. **Layer 2 (Examples):** Complete Figma import workflow with MCP tool call sequence, example PLAN.md generated from Figma data, visual QA overlay diff example
3. **Layer 3 (Integration):** How Figma import connects to the plan-then-execute pipeline, Code Connect component mapping, multi-page handling protocol
4. **Layer 4 (Anti-Patterns):** Direct code generation (bypassing pipeline), hardcoding Figma values over DNA tokens, ignoring responsive handling, trusting get_variable_defs aliases

**Existing file to rewrite:** `agents/figma-translator.md` (currently 60 lines, generic). Needs full rewrite to reference the new skill and use structured MCP tool workflow.

**Estimated size:** 500-700 lines (skill) + 100-150 lines (agent rewrite)

### 09-02: Design System Export Skill

**What to build:** A 4-layer SKILL.md that teaches Claude how to export the generated design system as Storybook stories and a design tokens package.

**Key sections to include:**
1. **Layer 1 (Decision Guidance):** What to export (curation criteria), story depth decision tree (visual-only vs. interaction testing), token format selection
2. **Layer 2 (Examples):** CSF Factories story templates for common component types (Button, Card, SectionWrapper, Navigation), Style Dictionary 5 config for CSS + JSON + Figma format output, DTCG token file structure
3. **Layer 3 (Integration):** How export reads from DNA and built components, Storybook project setup, Style Dictionary configuration, token file generation from DESIGN-DNA.md
4. **Layer 4 (Anti-Patterns):** Exporting everything (over-documentation), using CSF3 instead of Factories, custom token format instead of DTCG, missing play functions for interactive components

**New skill:** `skills/design-system-export/SKILL.md` (no existing skill to rewrite)

**Estimated size:** 500-700 lines

### 09-03: Progress Reporting System

**What to build:** Agent protocol extensions (not a standalone skill) that add structured progress reporting to design-lead and build-orchestrator agents. Includes STATE.md format extension.

**Key sections to include:**
1. **Per-task reporting:** STATE.md task progress table format, compact one-liner updates
2. **Per-section reporting:** Inline conversation highlights on section completion
3. **Per-wave reporting:** Detailed wave summary template with scores, layout diversity check, canary check
4. **Milestone reporting:** Full report with Awwwards scores, anti-slop gate scores, DNA compliance
5. **Screenshot protocol:** Automatic at 4 breakpoints (375, 768, 1024, 1440px) after final wave only; on-demand via /modulo:verify mid-build
6. **Review gates:** Wave completion pauses for user approval before next wave

**Integration points:**
- `agents/design-lead.md` -- add progress reporting sections
- STATE.md format -- add task progress table
- CONTEXT.md format -- add progress summary section

**Estimated size:** 200-300 lines of agent protocol additions across multiple files

### 09-04: Error Recovery System

**What to build:** Agent protocol extensions that add structured error diagnosis, option presentation, checkpoint resume, and failure pattern tracking.

**Key sections to include:**
1. **Failure classification:** MINOR (auto-isolate, continue), MAJOR (pause, present options), CRITICAL (stop wave, present options)
2. **Diagnosis template:** Structured format with code context, root cause, fix options, trade-offs
3. **Checkpoint/resume protocol:** What state to capture before each wave, how to detect interrupted builders, how `/modulo:execute resume` works
4. **Failure log:** `.planning/modulo/FAILURE-LOG.md` format, STATE.md compact summary
5. **Pattern escalation:** Track failures, escalate after 3 repeated same-type failures
6. **Common failure types:** Build errors, type errors, dependency errors, timeout, context rot, missing files

**Integration points:**
- `agents/design-lead.md` -- add error handling sections
- `agents/section-builder.md` -- add SUMMARY.md failure format
- STATE.md format -- add failure summary and checkpoint state
- New file: `.planning/modulo/FAILURE-LOG.md` template

**Estimated size:** 300-400 lines of agent protocol additions across multiple files

## Sources

### Primary (HIGH confidence)
- Figma MCP Server Developer Docs: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/ -- All 13 tools listed, tool descriptions and parameters
- Figma MCP Server Guide (GitHub): https://github.com/figma/mcp-server-guide -- Recommended implement-design workflow, tool call sequence
- Figma Code Connect Integration: https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/ -- CodeConnectSnippet format, CLI vs UI mappings
- Storybook 10 Blog: https://storybook.js.org/blog/storybook-10/ -- CSF Factories format, ESM-only, migration from CSF3
- Storybook npm: https://www.npmjs.com/package/storybook -- v10.1.11 confirmed as latest
- Style Dictionary npm: https://www.npmjs.com/package/style-dictionary -- v5.3.0 confirmed as latest
- Style Dictionary DTCG Docs: https://styledictionary.com/info/dtcg/ -- $value/$type format, conversion from v3
- W3C DTCG Stable Spec Announcement: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/ -- v2025.10
- Storybook Interaction Testing Docs: https://storybook.js.org/docs/writing-tests/interaction-testing -- @storybook/test package, play functions
- Playwright Visual Comparisons: https://playwright.dev/docs/test-snapshots -- toHaveScreenshot, pixelmatch internally
- pixelmatch GitHub: https://github.com/mapbox/pixelmatch -- API, anti-aliasing detection, threshold configuration

### Secondary (MEDIUM confidence)
- Figma MCP get_variable_defs limitations: https://forum.figma.com/ask-the-community-7/mcp-server-get-variable-defs-not-returning-aliases-47630 -- Alias resolution issue
- Claude Code to Figma Integration Blog: https://www.figma.com/blog/introducing-claude-code-to-figma/ -- Feb 2026 announcement
- Multi-Agent Error Recovery (Galileo): https://galileo.ai/blog/multi-agent-ai-system-failure-recovery -- Patterns for stateful agent recovery
- Checkpoint/Restore in AI Agents: https://eunomia.dev/blog/2025/05/11/checkpointrestore-systems-evolution-techniques-and-applications-in-ai-agents/ -- Checkpoint patterns
- Figma MCP Trigger Specific Tools: https://developers.figma.com/docs/figma-mcp-server/trigger-specific-tools/ -- get_design_context and get_variable_defs prompting guidance

### Tertiary (LOW confidence)
- Figma screenshot exchange format between MCP tools -- not documented, needs runtime validation
- CSF Factories for Astro -- not confirmed, React is the primary supported framework
- Style Dictionary 5 Figma sync-back formatter -- may require custom formatter, not verified

## Metadata

**Confidence breakdown:**
- Figma MCP tools/workflow: HIGH -- verified via official Figma developer docs and GitHub guide
- Storybook 10 CSF Factories: HIGH -- verified via npm, official blog, and docs
- Style Dictionary 5 + DTCG: HIGH -- verified via npm, official docs, and W3C announcement
- Visual QA overlay diff: MEDIUM -- concept verified, MCP screenshot exchange format needs runtime validation
- Progress reporting patterns: HIGH -- extensions to existing Phase 2 STATE.md format, consistent with architecture
- Error recovery patterns: HIGH -- based on established multi-agent patterns, adapted to Modulo's specific pipeline
- Figma get_variable_defs alias limitation: HIGH -- confirmed by multiple forum reports
- Figma Code Connect integration: HIGH -- verified via official developer docs

**Research date:** 2026-02-24
**Valid until:** 45 days (Figma MCP tools are actively evolving; Storybook 10 is stable; DTCG spec is stable)
