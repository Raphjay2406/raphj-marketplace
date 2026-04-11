---
description: Manage shared design system across multiple projects — create parent DNA, inherit tokens, track cross-project consistency
argument-hint: "[--create | --inherit parent-path | --sync | --diff project-path]"
allowed-tools: Read, Write, Edit, Grep, Glob, TodoWrite
---

# /gen:design-system

Multi-project design system governance. Creates shared parent DNA, inherits locked tokens into child projects, syncs drift, and diffs brand consistency across company sites.

---

## Workflow

### Step 1 — Parse arguments

Read the flag from the user invocation:

| Flag | Action |
|------|--------|
| `--create` | Generate a new PARENT-DNA.md at shared location |
| `--inherit <parent-path>` | Merge parent locked tokens into current project DNA |
| `--sync` | Compare current project DNA against its declared parent, report drift |
| `--diff <project-path>` | Side-by-side token comparison between current project and another project |

If no flag is provided, ask the user which operation they need.

---

### Step 2a — Create shared design system (`--create`)

1. Read the current project's `.planning/genorah/DESIGN-DNA.md`.
2. Ask the user for the **company name** (used as the shared DNA filename).
3. Classify every token into LOCKED or FLEXIBLE:
   - **LOCKED** (company-wide, immutable per project): `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`, `--color-border`, `--font-display`, `--font-body`, `--font-mono`, logo reference, favicon reference.
   - **FLEXIBLE** (project-specific, overridable): `--color-accent`, `--color-muted`, `--color-glow`, `--color-tension`, `--color-highlight`, `--color-signature`, signature element, archetype, motion tokens, type scale ratios, spacing scale.
4. Present the classification to the user for confirmation. Allow them to move tokens between categories.
5. Write `~/.genorah/shared-dna/[company-name].md` with the format:

```markdown
# Parent Design DNA: [Company Name]
# Created: [ISO date]
# Source project: [current project path]

## Locked Tokens (company-wide)
<!-- These tokens are enforced across all child projects -->
--color-primary: [value]
--color-secondary: [value]
--font-display: [value]
--font-body: [value]
[...all locked tokens]

## Flexible Tokens (defaults, overridable per project)
--color-accent: [value]
--color-signature: [value]
[...all flexible tokens with current values as defaults]

## Brand Rules
- [Any brand constraints the user specifies]
```

6. Update the current project's DESIGN-DNA.md to add inheritance header:
```yaml
# Inherits from: ~/.genorah/shared-dna/[company-name].md
# Role: source project
```

---

### Step 2b — Inherit from parent (`--inherit`)

1. Read the parent DNA file at the provided path.
2. Read the current project's `.planning/genorah/DESIGN-DNA.md`.
3. For every **LOCKED** token in the parent: override the project value unconditionally.
4. For every **FLEXIBLE** token: keep the project value if it exists, otherwise use the parent default.
5. Rewrite `.planning/genorah/DESIGN-DNA.md` with inheritance markers at the top:

```yaml
# Inherited from: [parent path]
# Inherited on: [ISO date]
# Locked tokens: primary, secondary, bg, surface, text, border, font-display, font-body, font-mono
# Project-specific: accent, signature, archetype, motion, glow, tension, highlight
```

6. Regenerate the Tailwind v4 `@theme` block to reflect merged values.
7. Report: list every token that was overridden by the parent vs kept from the project.

---

### Step 2c — Sync against parent (`--sync`)

1. Read the inheritance header from current project's DESIGN-DNA.md to find the parent path.
   - If no inheritance header exists, abort: "This project does not inherit from a shared design system. Use --inherit first."
2. Read the parent DNA file.
3. Compare every locked token: parent value vs project value.
4. Report drift:

```
Drift Report — [project name] vs [parent name]
================================================
LOCKED TOKENS:
  --color-primary: IN SYNC (oklch(0.65 0.25 265))
  --color-secondary: DRIFTED
    Parent: oklch(0.55 0.15 280)
    Project: oklch(0.60 0.20 275)
  --font-display: IN SYNC (Instrument Serif)

FLEXIBLE TOKENS:
  --color-accent: project-specific (no enforcement)
  --color-signature: project-specific (no enforcement)

Summary: 1 locked token(s) out of sync.
```

5. If drift is found, ask: "Update drifted tokens from parent? (y/n)"
6. On confirmation, update the project DNA and regenerate Tailwind theme.

---

### Step 2d — Diff between projects (`--diff`)

1. Read current project's `.planning/genorah/DESIGN-DNA.md`.
2. Read the target project's `.planning/genorah/DESIGN-DNA.md` at the provided path.
3. Compare all tokens side by side:

```
Cross-Project Diff — [Project A] vs [Project B]
=================================================
MATCHING TOKENS (brand-consistent):
  --color-primary: oklch(0.65 0.25 265) [both]
  --font-display: Instrument Serif [both]

DIFFERENT TOKENS:
  --color-accent:
    A: oklch(0.75 0.20 30)
    B: oklch(0.70 0.30 150)
  --signature-element:
    A: diagonal-slash
    B: dot-grid

MISSING IN PROJECT B:
  --color-glow (defined in A, absent in B)

Summary: 8/14 tokens match. 4 differ. 2 missing.
```

4. If both projects share the same parent, note which differences are within FLEXIBLE bounds vs unexpected locked-token divergence.

---

## Completion

After any operation, output:

```
Design System Operation: [create|inherit|sync|diff]
Parent DNA: [path or "new"]
Locked tokens: [count]
Flexible tokens: [count]
Drift detected: [yes/no, count if yes]
Action taken: [summary]
```

## Rules

- Never overwrite a project's FLEXIBLE tokens during inherit or sync without user confirmation.
- Never delete the parent DNA file. It is the single source of truth.
- The `--create` operation requires an existing DESIGN-DNA.md in the current project.
- The `--inherit` operation creates DESIGN-DNA.md if it does not exist (bootstrapping a new child project).
- All token values must remain in their original format (oklch, rem, etc.) — no conversion during merge.
- When writing the parent DNA, include a `# Children` section listing all projects that have inherited from it (updated on each `--inherit` call).
- Drift sync only touches LOCKED tokens. FLEXIBLE token differences are informational only.
