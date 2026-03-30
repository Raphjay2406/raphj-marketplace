# Agent Memory System

3-layer memory architecture for accumulating knowledge across waves without context window bloat. Each layer serves a different time horizon: short-term (living context), medium-term (growing design system), and cross-session (reviewer feedback with platform memory).

**Consumers:** build-orchestrator, creative-director, section-builder (via spawn prompts), quality-reviewer

---

## Layer 1: Living Context File (CONTEXT.md)

**Purpose:** Short-term project memory -- current state, recent decisions, immediate next steps.

| Property | Value |
|----------|-------|
| Location | `.planning/genorah/CONTEXT.md` |
| Size target | 80-100 lines (hard ceiling: 120 lines) |
| Update cadence | Full rewrite after every wave (NEVER append) |
| Lifetime | Created after Design DNA generation; retired after final quality review |

### Ownership (Split)

| Section | Written By | Read By |
|---------|-----------|---------|
| DNA Identity (anchor tokens) | Orchestrator | Orchestrator, CD |
| Build State (section status table) | Orchestrator | Orchestrator |
| Emotional Arc Position | Orchestrator | Orchestrator |
| Feedback Loop (lessons learned) | Orchestrator | Orchestrator |
| Next Wave Instructions | Orchestrator | Orchestrator |
| Creative Direction Notes | Creative Director | Orchestrator, CD |

### Format

```markdown
# Project Context

## DNA Identity
Archetype: [name]
Primary: [hex] | Accent: [hex] | Signature: [element]
Display: [font] | Body: [font]
Forbidden: [pattern1], [pattern2], [pattern3]

## Build State
| Section | Status | Wave | Beat | Layout | Score |
|---------|--------|------|------|--------|-------|
| hero    | DONE   | 2    | HOOK | split  | 29/35 |
| about   | BUILD  | 3    | REVEAL | full | --    |
...

## Emotional Arc Position
Current beat: [beat type] at section [N]
Arc template: [archetype template name]
Next expected: [beat type]

## Feedback Loop
REPLICATE: [pattern that scored well, section, why]
REPLICATE: [another pattern]
AVOID: [pattern that lost points, section, deduction]
AVOID: [another pattern]

## Creative Direction Notes
Overall: [CD's assessment of creative trajectory]
Strengths: [what's working]
Drift: [any observed drift from archetype/DNA]
Push: [opportunities for more boldness]
Calibration: [archetype fidelity notes]

## Next Wave Instructions
Wave [N]: [sections], [concerns], [dependencies]
```

### Growth Management

Full rewrite after every wave prevents unbounded growth. Specific compression rules:

| Rule | Trigger | Action |
|------|---------|--------|
| Creative notes trim | Every rewrite | Keep only LAST wave's observations; previous are superseded |
| Build state compact | Every rewrite | One row per section, compact format |
| Feedback loop trim | Every rewrite | Keep last 2 waves of lessons only |
| Over-limit compression | File exceeds 100 lines | Compress feedback to top 3 items, abbreviate section statuses to DONE/BUILD/WAIT only |
| Hard ceiling breach | File exceeds 120 lines | Emergency trim: remove arc position detail, reduce feedback to top 2, single-line creative notes |

### Lifecycle

1. **Creation:** After Design DNA generation. Initial CONTEXT.md contains DNA identity anchor + empty build state table + empty creative notes
2. **First population:** After section planning produces master plan. Build state table populated with all sections (status: PLANNED)
3. **Wave updates:** Full rewrite after every wave. Orchestrator writes 5 sections, CD writes creative notes
4. **Retirement:** After all waves complete and final quality review passes. Final CONTEXT.md serves as project record

---

## Layer 2: Growing Design System (DESIGN-SYSTEM.md)

**Purpose:** Medium-term memory -- accumulated reusable components and shared patterns discovered during the build.

| Property | Value |
|----------|-------|
| Location | `.planning/genorah/DESIGN-SYSTEM.md` |
| Size target | No hard ceiling (reference document, not LLM context) |
| Update cadence | After every wave, orchestrator appends new entries |
| Lifetime | Created at Wave 0; grows through project lifecycle |

### Ownership

| Operation | Agent |
|-----------|-------|
| Write (aggregate from SUMMARY.md files) | Build-orchestrator |
| Read (populate spawn prompt "Shared Components" section) | Build-orchestrator |
| Flag misuse (during review) | Creative Director, Quality Reviewer |

### Format

```markdown
# Design System

## Shared Components

### Wave 0-1 (Foundation)
| Component | Path | Usage | Added |
|-----------|------|-------|-------|
| Navbar | src/components/nav.tsx | Global navigation | Wave 0 |
| Footer | src/components/footer.tsx | Global footer | Wave 0 |
| ThemeProvider | src/components/theme.tsx | DNA token provider | Wave 0 |

### Wave 2+ (Builder Proposals)
| Component | Path | Usage | Proposed By | Wave |
|-----------|------|-------|-------------|------|
| GradientText | src/components/ui/gradient-text.tsx | DNA-colored gradient text | section-03-hero | Wave 2 |
| StaggerList | src/components/ui/stagger-list.tsx | Animated list with DNA timing | section-05-features | Wave 2 |

## Patterns Established
| Pattern | Description | First Used | Wave |
|---------|-------------|------------|------|
| Card pattern | DNA-surface card with border-radius, shadow | section-04-services | Wave 2 |
| Stat counter | Animated number with DNA accent color | section-06-stats | Wave 3 |
```

### Growth Protocol: "Builder Proposes, Orchestrator Collects"

```
Step 1: Builder identifies reusable component during build
         |
Step 2: Builder lists it in SUMMARY.md under `reusable_components`
         (fields: name, path, usage description)
         |
Step 3: Wave completes, orchestrator reads ALL builder SUMMARY.md files
         |
Step 4: Orchestrator appends new components to DESIGN-SYSTEM.md
         |
Step 5: Orchestrator includes "Shared Components Available" in next wave's spawn prompts
         |
Step 6: Next wave's builders can import and reuse listed components
```

**No approval gate.** If a builder proposes it, it gets listed. The Creative Director or Quality Reviewer can flag misuse during their review cycles, but component listing is automatic.

### What Gets Listed

| List | Don't List |
|------|------------|
| Components used by 2+ sections (or likely to be) | One-off section-specific markup |
| Utility components (GradientText, AnimatedCounter) | Layout wrappers that don't generalize |
| Shared patterns (card styles, list animations) | Section-specific content components |
| Theme utilities (DNA token helpers) | Third-party component wrappers (just import directly) |

### Spawn Prompt Integration

The orchestrator includes a "Shared Components Available" section in every builder spawn prompt:

```markdown
### Shared Components Available
- GradientText (src/components/ui/gradient-text.tsx) -- DNA-colored gradient text
- StaggerList (src/components/ui/stagger-list.tsx) -- animated list with DNA timing tokens
- Use these before creating new components. Import paths are absolute from project root.
```

---

## Layer 3: Reviewer Feedback Loop

**Purpose:** Quality learning -- patterns that worked, patterns that failed, accumulating across waves so builders learn from previous waves' successes and mistakes.

| Property | Value |
|----------|-------|
| Location | Distributed: CONTEXT.md "Feedback Loop" section + spawn prompt "Lessons Learned" section + platform memory |
| Size target | 10 lines in CONTEXT.md, 10 lines in spawn prompts |
| Update cadence | After every quality review cycle |
| Lifetime | Feedback accumulates per project; platform memory persists across projects |

### Feedback Flow

```
Quality Reviewer completes wave review
    |
    +---> GAP-FIX.md files (immediate: polisher fixes these)
    |
    +---> Lessons learned summary (accumulated: feeds future waves)
    |
    v
Orchestrator reads reviewer's lessons learned
    |
    +---> CONTEXT.md "Feedback Loop" section (max 10 lines, last 2 waves)
    |
    +---> Spawn prompt "Lessons Learned" section (max 10 lines, next wave builders)
    |
    v
Next wave's builders read "Lessons Learned" in their spawn prompt
    |
    +---> Adjust approach based on what worked and what to avoid
```

### Lessons Learned Format

The quality reviewer produces lessons in this structured format:

```markdown
## Lessons Learned (Wave N)

REPLICATE: [pattern] scored well in [section] -- [why it worked]
REPLICATE: [pattern] scored well in [section] -- [why it worked]
AVOID: [pattern] lost [N] points in [section] -- [what went wrong]
AVOID: [pattern] lost [N] points in [section] -- [what went wrong]
PATTERNS_SEEN: [recurring pattern across sections, positive or negative]
DESIGN_SYSTEM_PROPOSALS: [components from builder SUMMARY.md files worth listing]
```

### Spawn Prompt Embedding

Orchestrator distills lessons into a compact section for builder spawn prompts:

```markdown
### Lessons Learned (from previous waves)
REPLICATE: DNA gradient on headings scored 3/3 in Typography (hero section) -- archetype-aligned
REPLICATE: GSAP ScrollTrigger with DNA timing tokens scored well in Motion (features section)
AVOID: Generic "Learn More" CTA lost 2 points in UX Intelligence (services section) -- use specific action verb
AVOID: Missing hover state on cards lost 1 point in Depth & Polish (pricing section)
```

Builders see this at spawn time and calibrate their output accordingly. No additional file reads required.

### Platform Memory Integration

```yaml
# In quality-reviewer.md frontmatter:
memory: project
```

- The `memory: project` field enables Claude Code's built-in persistent memory for the reviewer agent
- **Cross-session:** Reviewer remembers quality patterns from previous sessions automatically
- **Capacity:** 200-line limit, auto-curated by Claude Code platform
- **Scope:** Per-project -- patterns from one project don't leak to another
- **Relationship to file-based feedback:** Platform memory supplements the file-based loop. File-based feedback is the primary channel (explicit, inspectable, version-controlled). Platform memory is the secondary channel (implicit, cross-session, automatic)

### What Platform Memory Captures vs. File-Based Feedback

| Aspect | File-Based (CONTEXT.md + spawn prompts) | Platform Memory (memory: project) |
|--------|------------------------------------------|-----------------------------------|
| Durability | Per-wave, trimmed to last 2 waves | Per-project, 200-line auto-curated |
| Visibility | Explicit, inspectable in files | Implicit, managed by platform |
| Content | Specific REPLICATE/AVOID items | Broader patterns and tendencies |
| Cross-session | Lost at session boundary | Survives session boundaries |
| Control | Orchestrator curates | Platform auto-curates |

---

## Cross-Layer Interactions

```
Builder SUMMARY.md
    |
    v
Orchestrator collects after wave completion
    |
    +-------> DESIGN-SYSTEM.md (Layer 2: medium-term)
    |              |
    |              +---> Spawn prompt "Shared Components" (next wave builders see what's available)
    |
    +-------> CONTEXT.md "Build State" (Layer 1: short-term)
                   |
                   +---> Spawn prompt "Assignment" section (next wave builders see project state)

Quality Reviewer lessons learned
    |
    v
Orchestrator aggregates after review cycle
    |
    +-------> CONTEXT.md "Feedback Loop" (Layer 1: short-term, last 2 waves)
    |              |
    |              +---> Spawn prompt "Lessons Learned" (next wave builders learn from mistakes)
    |
    +-------> Reviewer platform memory (Layer 3: cross-session, auto-managed)
```

### Information Lifecycle

| Information Type | Created By | Stored In | Consumed By | Lifespan |
|-----------------|-----------|-----------|-------------|----------|
| Build progress | Orchestrator | CONTEXT.md | Orchestrator, CD | Current wave + history |
| Creative notes | CD | CONTEXT.md | Orchestrator, CD | Last wave only |
| Reusable components | Builders (proposed) | DESIGN-SYSTEM.md | Orchestrator (for spawn prompts) | Project lifetime |
| Quality lessons | Reviewer | CONTEXT.md + spawn prompts | Builders (next wave) | Last 2 waves |
| Quality patterns | Reviewer | Platform memory | Reviewer (next session) | Project lifetime |
| DNA identity | Orchestrator | CONTEXT.md | All agents | Project lifetime (anchor) |

---

## Memory System Rules

1. **No agent reads everything.** Each agent reads only the layers relevant to its role
2. **No unbounded growth.** CONTEXT.md has hard ceiling (120 lines). DESIGN-SYSTEM.md grows but is a reference doc (not loaded into context windows). Feedback is trimmed to last 2 waves
3. **Orchestrator is the memory coordinator.** It reads SUMMARY.md files, updates DESIGN-SYSTEM.md, rewrites CONTEXT.md, and embeds lessons in spawn prompts. No other agent manages memory
4. **File-based is primary, platform memory is secondary.** File-based memory is explicit, inspectable, and version-controlled. Platform memory supplements with cross-session persistence
5. **Builders are stateless.** They receive everything they need in their spawn prompt. They do not read CONTEXT.md, DESIGN-SYSTEM.md, or any memory files directly
6. **Rewrite beats append.** CONTEXT.md is rewritten (not appended) after every wave. This forces the orchestrator to synthesize current state rather than accumulate stale information
