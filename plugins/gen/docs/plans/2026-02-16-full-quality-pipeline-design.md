# Full Quality Pipeline Design

**Date:** 2026-02-16
**Status:** Approved
**Scope:** End-to-end overhaul of Genorah's planning-to-execution pipeline to produce award-winning output

## Problem Statement

AI agents have fundamental limitations that cause quality loss during Genorah's concepting, planning, and implementation phases:

1. **Visual blindness** -- agents plan textually but can't see what they're describing
2. **Vague specifications** -- PLAN.md tasks leave too much interpretation to builders
3. **No real references** -- research phase relies on training data, not current award-winning sites
4. **Section incoherence** -- independent builders produce pages that feel like 5 different designers made them
5. **Autonomous changes** -- iterate/bugfix commands act without consulting the user first
6. **Weak content/copy** -- generic text kills even beautiful designs
7. **Missing wow factor** -- wow moments get implemented timidly or skipped
8. **Context rot** -- agent forgets DNA, references, and quality standards mid-session
9. **Plans get stale** -- project evolves but plans/DNA don't get updated
10. **Dead code** -- unused imports, components, and utilities accumulate
11. **Context window limits** -- compaction destroys critical design context

## Solution: 8-Section Full Quality Pipeline

### Section 1: Visual Reference System

**Files affected:** `commands/start-design.md`, new `REFERENCES.md` artifact

#### 1A. Browser-Assisted Reference Capture

During `start-design` Phase 2 (Research), when user provides reference URLs:

**Tool priority order:**
1. Playwright MCP -- preferred, headless, consistent
2. Chrome DevTools MCP -- fallback
3. Claude in Chrome -- fallback
4. WebFetch + user screenshots -- last resort

**Capture protocol per reference site (5 screenshots per site, max 5 sites = 25 screenshots):**
1. Navigate to URL, wait for load
2. Resize to 1440px, take full-page screenshot -> `screenshots/{site}-desktop-full.png`
3. Take viewport-only screenshot (above fold) -> `screenshots/{site}-desktop-fold.png`
4. Resize to 375px, take viewport screenshot -> `screenshots/{site}-mobile-fold.png`
5. Scroll to ~50%, take screenshot -> `screenshots/{site}-desktop-mid.png`
6. Scroll to bottom, take screenshot -> `screenshots/{site}-desktop-footer.png`

#### 1B. Pattern Extraction

For each reference site, analyze screenshots (multimodal) and document in `REFERENCES.md`:
- Color analysis (bg, text, accents, gradients, temperature, unique color moment)
- Typography analysis (fonts, sizes, tracking, leading, weight variety, typographic surprise)
- Layout analysis (hero pattern, grid approach, spacing character, container width, grid-breaking moment, diversity score)
- Motion/animation analysis (entrance, scroll behavior, hover effects, transition style, intensity, wow moment)
- Depth & polish analysis (shadow approach, glass/blur, border style, texture, micro-details)
- Content/copy quality (hero headline, CTA text, tone, friction reducers)
- Overall quality assessment (estimated Awwwards score, what makes it special, patterns to adopt, patterns NOT to copy)

#### 1C. Reference Pattern Flow

- REFERENCES.md -> DESIGN-DNA.md: Extracted patterns serve as concrete starting points for DNA generation
- REFERENCES.md -> Section PLAN.md: Each section references which pattern from which site it adapts
- REFERENCES.md -> Quality Reviewer: Reviewer compares built sections against reference quality bar
- REFERENCES.md -> Iterate/Bugfix: Reference screenshots serve as target quality bar

#### 1D. Fallback Without Browser Tools

- Use WebFetch to extract patterns from HTML/CSS
- Ask user to provide screenshots manually (checkpoint)
- State in research output that visual analysis was limited

---

### Section 2: Hyper-Specific PLAN.md Format

**Files affected:** `commands/plan-sections.md`, `agents/section-builder.md`

#### 2A. New PLAN.md Structure

Replace vague `<context>` and `<tasks>` with structured blocks:

**`<visual-specification>` block:**
- ASCII layout diagram showing exact element positions at desktop
- Exact Tailwind classes per element (table format)
- Responsive adaptations with ASCII diagrams for mobile (375px) and tablet (768px)
- Exact copy (all text pre-approved from CONTENT.md)
- Exact animation sequence (numbered: element -> animation -> timing -> easing -> delay)
- Background treatment specification (exact gradient orbs, grid, grain, colors, positions)

**`<component-structure>` block:**
- JSX blueprint (pseudo-JSX showing component tree)
- Props interface (TypeScript)
- Imports required (shared components, motion presets, utilities)

**`<wow-moment>` block:**
- Pattern name and source
- Full TSX implementation code (adapted with DNA tokens)
- Integration point in component tree
- Reduced motion fallback
- Verification criteria

**`<creative-tension>` block:**
- Type and description
- Exact specification (sizes, classes, approach)
- Verification criteria

#### 2B. Builder Role Shift

Section-builder becomes a "spec executor" -- translates the blueprint to working TSX. No creative decisions needed. Deviations from plan must be documented and justified.

---

### Section 3: Content Planning Phase

**Files affected:** `commands/start-design.md`, new `CONTENT.md` artifact

#### 3A. New Phase 3.75: Content Planning

Insert between Design DNA (Phase 3.5) and Section Planning. References `micro-copy` and `conversion-patterns` skills.

**Generate `.planning/genorah/CONTENT.md`:**
- Voice & tone definition (archetype-derived, forbidden phrases listed)
- Per-section content: headline, subheadline, body text, CTA text, friction reducers, status badges
- Testimonials with specific quotes, names, titles, companies
- Stats/metrics with values and labels
- Footer content

**User approves all content before section planning begins.**

#### 3B. Content Flow

Each PLAN.md's `<visual-specification>` pulls directly from approved CONTENT.md. No builder-generated text allowed.

#### 3C. Content Quality Gates

Quality reviewer verifies during `/gen:verify`:
- All approved copy present and unchanged
- No "Submit", "Learn More", "Click Here" on any button
- Headlines match approved text
- Social proof uses specific names/companies/metrics

---

### Section 4: Discussion-First Protocol

**Files affected:** All command files, new `agents/discussion-protocol.md`

#### 4A. Universal Discussion-Before-Action Rule

ALL commands that modify code MUST:
1. State WHAT they plan to change (specific files, specific elements)
2. State WHY (reference the gap, bug, or user request)
3. State HOW (exact approach: what CSS/JSX changes, what values)
4. Present as a numbered plan
5. Wait for user approval via checkpoint
6. Only proceed after explicit approval

#### 4B. Per-Command Changes

**`/gen:execute`:** Before spawning any wave, present section summaries and wait for approval. After each section completes, show screenshot + summary.

**`/gen:iterate`:** Before any code change, show exact diff preview (file, line, old -> new, reason). After applying, show before/after screenshot comparison.

**`/gen:bugfix`:** Before any fix, state bug, root cause, fix plan with specific diff preview and risk assessment. After fixing, verify no regression.

#### 4C. Emergency Override

User can say "auto-approve changes under 5 lines" or "auto-approve this wave" for faster iteration. Default is ALWAYS discussion-first.

---

### Section 5: Section Coherence System

**Files affected:** `agents/design-lead.md`, `agents/section-builder.md`

#### 5A. Page Context Snapshot

Design-lead passes a context snapshot to each builder containing:
- Adjacent sections (above/below): layout pattern, background, last/first elements, spacing
- Transition techniques to/from this section
- Layout patterns already used (for diversity enforcement)
- Visual continuity rules (background contrast, spacing accounts, transition style matching)
- Shared component inventory

#### 5B. Cross-Section Visual Rules

Added to design-lead:
1. Shadow consistency: all sections use DNA shadow system only
2. Spacing rhythm: section padding alternates per DNA scale, no identical adjacent padding
3. Background progression: planned across full page, no two adjacent sections same background
4. Typography consistency: all sections use DNA type scale only
5. Border-radius consistency: DNA radius system only
6. Animation consistency: DNA motion presets only

#### 5C. Coherence Checkpoint

After each wave, design-lead checks coherence before next wave:
- Shadow values match DNA across all sections
- Spacing follows planned rhythm
- Backgrounds alternate correctly
- Typography uses DNA scale only
- No adjacent sections share same layout pattern

---

### Section 6: Live Visual Feedback Loop

**Files affected:** `agents/design-lead.md`, `agents/section-builder.md`

#### 6A. Post-Build Screenshot Protocol

After each section completes (before marking complete):
1. Start dev server if needed
2. Take screenshots at 1440px, 768px, 375px
3. Capture hover/interactive states if applicable
4. Save to `.planning/genorah/sections/XX-{name}/screenshots/`
5. Present to user: "Does this match the plan? Any adjustments needed?"
6. User approves, requests changes, or requests rebuild

#### 6B. Scroll-Through GIF

After each wave completes:
1. Record scroll-through GIF of full page
2. Save to `.planning/genorah/progress/wave-[N]-scrollthrough.gif`
3. Present to user for holistic flow assessment

#### 6C. Before/After Comparison

For iterate/bugfix:
1. Screenshot before changes
2. Apply changes
3. Screenshot after changes
4. Present side-by-side to user

#### 6D. Fallback Without Browser Tools

Builder describes what was built in detail. User previews manually. Hard checkpoint -- no skipping.

---

### Section 7: Wow Factor Enforcement

**Files affected:** `commands/plan-sections.md`, `agents/section-builder.md`

#### 7A. Inline Implementation

PLAN.md embeds full TSX code for wow moments (adapted with DNA tokens), not just skill references.

#### 7B. Wow Moment Verification

Builder self-check includes:
- "Would I try to interact with this?" -- if No, make it bolder
- "Would I screenshot this?" -- if No, iterate

#### 7C. Wow Moment Minimums

Per page:
- At least 1 cursor-responsive moment
- At least 1 scroll-responsive moment
- At least 1 ambient element
- Total: 3-5 per page (more than 5 = circus)
- Concentrated at HOOK, PEAK, and CLOSE beats

#### 7D. Creative Tension Enforcement

Same as wow moments -- full specification embedded in plan, not just a reference.

---

### Section 8: Anti-Context-Rot + Session Management

**Files affected:** All agent files, `commands/start-design.md`, new artifacts

#### 8A. Mid-Section Quality Drift Prevention

Task-level DNA checkpoints:
- After EVERY task: Quick DNA check (3 questions -- colors, fonts, spacing)
- Every 3rd task: Expanded check (hover states, responsive, animations, no Tailwind defaults)
- Last task: Full 7-question self-check + element counting verification

#### 8B. Plan Mutation Protocol

Three scopes of change:
1. **Token change** (color/font/spacing): Update DNA + globals.css + grep-replace across built sections
2. **Section change** (layout/structure): Update PLAN.md, wave map, CONTENT.md. Re-approve. Mark as NEEDS_REBUILD if already built
3. **Direction change** (archetype swap): Stop all builds. Re-run brainstorm + DNA. Re-generate all plans. Full re-approval

All mutations logged in STATE.md mutation table.

#### 8C. Cross-Page Coherence

New artifact: `.planning/genorah/PAGE-CONSISTENCY.md`
- Shared elements (identical across pages): nav, footer, theme, fonts
- Per-page variation rules: hero diversity, color intensity, animation intensity, content density
- Pattern inventory per page
- Cross-page transition expectations

#### 8D. Dead Code Prevention

Import-before-create rule: check shared components, DNA presets, shadcn/ui before creating anything new.

Post-section cleanup: verify every import used, every function called, every class applied. Remove unused.

Design-lead wave cleanup: grep for unused exports, duplicate utilities, unused dependencies.

#### 8E. Context Window Management (80% Rule)

At ~80% context usage:
1. Stop all active builds
2. Write `.planning/genorah/.session-transfer.md` with:
   - Session summary (waves completed, sections done/in-progress/remaining)
   - Critical context summary (DNA anchor, reference anchor, emotional arc state, layout diversity state)
   - Active decisions made during session
   - Code state (build status, packages installed)
   - Explicit resume instructions (which files to read, in what order, what to do next)

#### 8F. No-Compact File Architecture

All critical context lives in FILES, not conversation history:
```
.planning/genorah/
  PROJECT.md, DESIGN-DNA.md, BRAINSTORM.md, CONTENT.md (NEW),
  REFERENCES.md (NEW), MASTER-PLAN.md, STATE.md,
  PAGE-CONSISTENCY.md (NEW), .session-transfer.md (NEW),
  .continue-here.md, research/screenshots/ (NEW),
  sections/XX-name/PLAN.md, SUMMARY.md, GAP-FIX.md, screenshots/ (NEW)
```

Conversation is coordination only. Knowledge survives compaction and session boundaries because it's in files.

---

## New Artifacts Summary

| Artifact | Created By | Purpose |
|----------|-----------|---------|
| `.planning/genorah/CONTENT.md` | start-design Phase 3.75 | All approved page copy |
| `.planning/genorah/REFERENCES.md` | start-design Phase 2 | Reference site analysis |
| `.planning/genorah/research/screenshots/` | design-researcher | Reference screenshots |
| `.planning/genorah/PAGE-CONSISTENCY.md` | plan-sections | Cross-page coherence rules |
| `.planning/genorah/.session-transfer.md` | design-lead (at 80%) | Session handoff document |
| `.planning/genorah/sections/XX/screenshots/` | section-builder | Built section screenshots |
| `.planning/genorah/progress/` | design-lead | Wave scroll-through GIFs |
| `agents/discussion-protocol.md` | New file | Universal discussion-before-action rules |

## Files to Modify

| File | Changes |
|------|---------|
| `commands/start-design.md` | Add Phase 2 reference capture, Phase 3.75 content planning |
| `commands/plan-sections.md` | New PLAN.md format with visual-specification, component-structure, wow-moment, creative-tension blocks |
| `commands/verify.md` | Add reference comparison, content verification, coherence check |
| `agents/design-lead.md` | Page context snapshots, coherence checkpoints, 80% rule, session transfer, plan mutation protocol |
| `agents/section-builder.md` | Task-level DNA checks, spec executor role, mid-section quality gates, dead code prevention |
| `agents/quality-reviewer.md` | Reference comparison, content verification, cross-page coherence |
| `agents/discussion-protocol.md` | NEW -- universal discussion-before-action rules |
| All iterate/bugfix/execute commands | Add discussion-first protocol reference |
| `.claude-plugin/plugin.json` | Version bump, new agent registration |
| `README.md` | Update for new features and workflow |

## Implementation Priority

1. Discussion-First Protocol (Section 4) -- most impactful for user trust
2. Hyper-Specific PLAN.md (Section 2) -- most impactful for build quality
3. Content Planning (Section 3) -- fixes weak copy problem
4. Anti-Context-Rot (Section 8) -- fixes mid-session quality drift
5. Visual Reference System (Section 1) -- requires browser tools but high impact
6. Section Coherence (Section 5) -- fixes "5 designers" problem
7. Live Visual Feedback (Section 6) -- requires browser tools
8. Wow Factor Enforcement (Section 7) -- builds on Section 2
