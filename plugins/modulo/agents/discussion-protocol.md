---
name: discussion-protocol
description: Universal discussion-before-action protocol. ALL agents and commands that modify code MUST follow this protocol. No autonomous changes.
---

## Discussion-Before-Action Protocol

**This protocol is MANDATORY. No exceptions. No autonomous changes.**

Every agent or command that modifies code in the target project MUST follow these steps before making ANY change:

### Step 1: Present the Plan

Before modifying ANY file, state:

1. **WHAT** you plan to change
   - Specific files (exact paths)
   - Specific elements within those files
   - Scope: how many lines/components affected

2. **WHY** you're making this change
   - Reference the gap, bug, user request, or plan that motivates it
   - If from GAP-FIX.md, cite the specific gap

3. **HOW** you'll implement it
   - Exact approach (what CSS/JSX/Tailwind changes)
   - Exact values (colors, spacing, classes)
   - Diff preview when possible:
     ```
     File: src/components/sections/hero.tsx
     Line 24: Change `gap-4` → `gap-6 md:gap-8`
     Line 31: Change `text-gray-500` → `text-[var(--color-text-secondary)]`
     Reason: DNA spacing scale compliance
     ```

4. **Present as a numbered plan** — not prose, not vague descriptions

### Step 2: Wait for Approval

- Present the plan to the user via checkpoint
- Wait for explicit approval: "go ahead", "approved", "yes", etc.
- If user requests modifications to the plan → revise and re-present
- If user denies → ask what they'd prefer instead
- **NEVER proceed without explicit approval**

### Step 3: Execute

- Apply exactly what was approved — no additional changes
- No "while I'm here" improvements
- No refactoring adjacent code
- Stick to the approved scope

### Step 4: Show Results

- After changes are applied, show what was done:
  - Files modified with brief summary
  - If browser tools available: take before/after screenshots
  - If no browser tools: describe the change and ask user to preview

### Emergency Override

The user can grant temporary autonomy:
- "Auto-approve changes under 5 lines" — small changes proceed without checkpoint
- "Auto-approve this wave" — all section builds in the current wave proceed
- "Auto-approve this session" — all changes this session proceed (rare, user must explicitly say this)

**Default is ALWAYS discussion-first.** Override must be explicitly granted per scope.

### Where This Protocol Applies

| Command/Agent | Applies? | Notes |
|--------------|----------|-------|
| `/modulo:execute` | YES | Present wave summary before spawning builders |
| `/modulo:iterate` | YES | Show exact diff preview before any change |
| `/modulo:bugfix` | YES | Show bug diagnosis + fix plan before applying |
| `/modulo:change-plan` | YES | Show plan diff before saving |
| `section-builder` | Partial | Auto tasks proceed per plan, but deviations require discussion |
| `design-lead` | YES | Present wave plan before spawning |
| `/modulo:start-design` | NO | Discovery/research is exploratory, not code-modifying |
| `/modulo:plan-sections` | Partial | Each section plan already requires user approval |
| `/modulo:verify` | NO | Verification is read-only |
