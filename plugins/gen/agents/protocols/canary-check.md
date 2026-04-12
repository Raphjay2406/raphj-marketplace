---
name: canary-check
description: "Canary protocol for detecting context drift across agent invocations — flags DNA/archetype deviation early."
---

# Canary Check Protocol

> Protocol document for the Genorah 2.0 build pipeline. Executed by the build-orchestrator after every wave. Detects context rot before it produces bad output by testing the orchestrator's recall of key project identity and state facts.

## Purpose

Canary checks detect context rot BEFORE it manifests in built output. By testing the orchestrator's recall of key DNA identity facts and current build state, we catch attention degradation early -- when a re-read of CONTEXT.md can fix it, rather than after a section ships with wrong colors and generic layouts.

The name comes from "canary in a coal mine" -- a small, cheap test that detects a dangerous condition before it causes harm.

---

## When to Run

| Trigger | Required | Notes |
|---------|----------|-------|
| After EVERY wave completion | MANDATORY | Cannot be skipped, even if previous check was healthy |
| Before constructing next wave's spawn prompts | MANDATORY | Spawn prompts built from stale memory propagate rot to builders |
| User manually requests | OPTIONAL | User can trigger at any time via orchestrator |
| After session resume | MANDATORY | First action in any new session to verify clean context |

**Integration point:** Build-orchestrator runs this as Step 9 in the wave execution protocol (after post-wave coherence checkpoint, before next wave prep).

---

## The 5 Questions

### DNA Recall (Tests Identity Drift)

These test whether the orchestrator still remembers the project's fundamental visual identity. These facts are static -- they never change during a build (unless the user explicitly modifies DNA).

| # | Question | Expected Answer | Why This Question |
|---|----------|-----------------|-------------------|
| 1 | What is our project's display font? | Exact font name from DNA | Display font is the most visually distinctive DNA element. Getting it wrong = identity lost |
| 2 | What is our accent color hex value? | Exact hex value (e.g., `#FF6B35`) | Accent is the most frequently used expressive color. Wrong hex = visual drift |
| 3 | What patterns are forbidden by our archetype? | List of forbidden patterns from DNA | Forbidden patterns are the negative space of identity. Forgetting them = archetype violations |

### State Recall (Tests Context Drift)

These test whether the orchestrator still tracks the current build state. These facts change every wave -- getting them wrong means the orchestrator has lost track of progress.

| # | Question | Expected Answer | Why This Question |
|---|----------|-----------------|-------------------|
| 4 | What layout patterns have been used in completed sections? | List of layout patterns (e.g., bento-grid, split-asymmetric) | Layout diversity is enforced per spawn prompt. Wrong list = builders get wrong constraints |
| 5 | What beat type is assigned to the next section to build? | Exact beat name (e.g., PEAK, BREATHE) | Beat assignment drives all parameters. Wrong beat = wrong whitespace, density, animation |

---

## Procedure

### Step 1: Answer from Memory

The orchestrator answers ALL 5 questions from memory. No file reads. No peeking at CONTEXT.md or DESIGN-DNA.md.

**Format:**
```
CANARY CHECK -- Wave [N] Complete

1. Display font: [answer]
2. Accent hex: [answer]
3. Forbidden patterns: [answer]
4. Layout patterns used: [answer]
5. Next beat type: [answer]
```

### Step 2: Verify Against CONTEXT.md

After writing all 5 answers, the orchestrator reads `.planning/genorah/CONTEXT.md` and compares:

- Question 1: Compare against DNA Identity > Display font
- Question 2: Compare against DNA Identity > Colors > accent
- Question 3: Compare against DNA Identity > FORBIDDEN
- Question 4: Compare against Build State > Layout patterns used
- Question 5: Compare against Next Wave Instructions > section beat from MASTER-PLAN.md

### Step 3: Score

Each answer is binary: CORRECT or INCORRECT. No partial credit.

- Font name must be exact (case-sensitive)
- Hex value must be exact (case-insensitive, with or without #)
- Forbidden patterns: must list all items (missing one = incorrect)
- Layout patterns: must list all used patterns (missing one = incorrect)
- Beat type: must be exact name

### Step 4: Record and Act

Record the score in CONTEXT.md and take the appropriate action per the scoring table below.

---

## Scoring and Consequences

| Score | Status | Indicator | Action |
|-------|--------|-----------|--------|
| **5/5** | HEALTHY | All recall intact | Log `Canary: HEALTHY (5/5)` in CONTEXT.md Next Wave section. Continue normally |
| **4/5** | DEGRADING | Minor drift starting | Log `Canary: DEGRADING (4/5)` in CONTEXT.md. Re-read CONTEXT.md carefully. Add extra DNA emphasis to next spawn prompts (bold the forgotten element). Continue with caution |
| **3/5** | DEGRADING | Significant drift | Log `Canary: DEGRADING (3/5)` in CONTEXT.md. Re-read CONTEXT.md carefully. Force-rewrite CONTEXT.md from source files (not from memory). Add extra DNA emphasis to next spawn prompts. Continue but recommend new session to user |
| **2/5** | ROT_DETECTED | Critical drift | TRIGGER SESSION BOUNDARY. Log `Canary: ROT_DETECTED (2/5)` in CONTEXT.md. Save CONTEXT.md with full resume instructions. Message to user: "Context rot detected (2/5). Strongly recommend starting a new session." |
| **1/5** | ROT_DETECTED | Severe drift | Same as 2/5 but message is stronger: "Context rot confirmed (1/5). Quality cannot be guaranteed. Start a new session." |
| **0/5** | ROT_DETECTED | Total drift | Same as 1/5. Orchestrator should NOT continue building even if user requests it. Warn explicitly: "0/5 canary score. Continuing will produce generic output." |

### Escalation Path

```
5/5 HEALTHY     ->  Continue normally
4/5 DEGRADING   ->  Re-read + extra emphasis
3/5 DEGRADING   ->  Force rewrite + recommend new session
0-2 ROT_DETECTED -> TRIGGER SESSION BOUNDARY (mandatory save, recommend new session)
```

---

## Question Substitution

The 5 default questions above work for most projects. However, questions CAN be adapted per project as long as these principles are maintained:

### Substitution Rules

| Rule | Requirement |
|------|-------------|
| **3 DNA + 2 state** | Always 3 questions testing identity recall, 2 testing state recall |
| **Unambiguous answers** | Every question must have exactly ONE correct answer (not subjective) |
| **Verifiable from CONTEXT.md** | Every answer must be checkable against a specific line in CONTEXT.md |
| **Identity questions are static** | DNA recall questions test facts that don't change during a build |
| **State questions are dynamic** | State recall questions test facts that change every wave |

### Alternative DNA Questions (pick 3)

- "What is our body font?" -- tests secondary font recall
- "What is our signature element and its parameters?" -- tests signature recall
- "What is our archetype name?" -- tests archetype recall
- "What is our primary background color hex?" -- tests color recall
- "What motion easing does our DNA specify?" -- tests motion recall

### Alternative State Questions (pick 2)

- "What sections are in the current wave?" -- tests wave awareness
- "What shared components are available?" -- tests design system awareness
- "What did the CD flag in the last review?" -- tests creative direction recall
- "What patterns should we AVOID per lessons learned?" -- tests feedback recall

---

## v2.0 Additions

### Decision Memory Verification

In addition to the 5 standard questions, the canary check now includes a **decision memory probe**:

**Question 6 (OPTIONAL but recommended after Wave 2+):**
> "Name the last 3 decisions from the decision log and which agent made them."

| Scoring | Criteria |
|---------|----------|
| CORRECT | All 3 decisions named accurately (decision + agent) |
| PARTIAL | 2 of 3 correct, or all 3 decisions correct but agents wrong |
| INCORRECT | Fewer than 2 correct, or cannot recall any decisions |

**How it affects the canary score:**
- Question 6 does NOT replace any of the core 5 questions
- If CORRECT: no score change (bonus confidence signal)
- If PARTIAL: treat as a soft warning -- add decision summaries to next spawn prompts
- If INCORRECT: deduct 1 from the canary score (e.g., 5/5 becomes 4/5 effective)

**Why this matters:** Decision recall indicates whether the orchestrator is maintaining a coherent mental model of the project's evolution. Forgetting decisions leads to contradictory instructions in spawn prompts.

### Artifact Name Check

**Question 7 (OPTIONAL but recommended):**
> "What are the current file names in the artifact registry? Name at least 5."

The orchestrator should be able to name key artifact paths from the registry in CONTEXT.md without reading the file.

| Scoring | Criteria |
|---------|----------|
| CORRECT | 5+ artifact paths named correctly |
| PARTIAL | 3-4 correct |
| INCORRECT | Fewer than 3 correct |

**How it affects the canary score:**
- Same treatment as Question 6: CORRECT = no change, PARTIAL = soft warning, INCORRECT = -1 effective score
- If the orchestrator cannot name artifact paths, spawn prompts may reference wrong file locations

**Combined v2.0 check format:**
```
CANARY CHECK -- Wave [N] Complete (v2.0)

1. Display font: [answer]
2. Accent hex: [answer]
3. Forbidden patterns: [answer]
4. Layout patterns used: [answer]
5. Next beat type: [answer]
6. Last 3 decisions: [answer]
7. Artifact paths (5+): [answer]

Core score: [X]/5
Decision memory: [CORRECT/PARTIAL/INCORRECT]
Artifact recall: [CORRECT/PARTIAL/INCORRECT]
Effective score: [adjusted]
```

---

## Anti-Gaming Rules

The canary check is only useful if it tests actual recall, not file-reading ability.

### Rule 1: Answer Before Reading

The orchestrator MUST write all 5 answers BEFORE reading any files. If the orchestrator reads CONTEXT.md first and then "answers from memory," the check is meaningless -- it tested reading comprehension, not recall.

**Enforcement:** The protocol explicitly states the order: write answers, THEN read and verify. The orchestrator's system prompt includes this as a hard rule.

### Rule 2: No Hedging

Answers must be specific. "I think it's something like..." or "probably Helvetica" counts as INCORRECT. The canary tests confident recall, not vague recognition.

### Rule 3: Honest Scoring

If the orchestrator scores itself 5/5 but the quality reviewer later finds identity drift in built output, the canary scoring is suspect. The quality reviewer can trigger a re-check.

---

## Integration with Build Pipeline

### Where in the Wave Cycle

```
Step 1-6:  Wave execution (spawn builders, collect results)
Step 7:    Post-wave coherence checkpoint
Step 8:    Design system aggregation
Step 9:    CANARY CHECK  <-- here
Step 10:   CONTEXT.md rewrite
Step 11:   Next wave preparation (or session boundary)
```

### Why After Coherence, Before Rewrite

The canary check runs AFTER the coherence checkpoint because:
- Coherence checkpoint catches builder output issues (wrong backgrounds, layout repeats)
- Canary check catches orchestrator context issues (forgotten DNA, lost state)

The canary check runs BEFORE CONTEXT.md rewrite because:
- If canary detects rot, the CONTEXT.md rewrite should be done from source files, not from the orchestrator's degraded memory
- A HEALTHY canary means the orchestrator can safely rewrite CONTEXT.md from memory + current wave results

### Canary Results Inform Session Decision

After the canary check:
- HEALTHY: proceed to CONTEXT.md rewrite and next wave prep
- DEGRADING: proceed but add extra context to next spawn prompts
- ROT_DETECTED: write CONTEXT.md with resume instructions, recommend session boundary

---

## Example Canary Check

```
CANARY CHECK -- Wave 2 Complete

1. Display font: Playfair Display
2. Accent hex: #E63946
3. Forbidden patterns: drop shadows, gradients on text, rounded corners > 8px, stock photography
4. Layout patterns used: hero-fullscreen, bento-grid, split-asymmetric
5. Next beat type: BREATHE

Verifying against CONTEXT.md...
- Q1: CORRECT (DNA Identity: Display: Playfair Display)
- Q2: CORRECT (DNA Identity: accent #E63946)
- Q3: CORRECT (DNA Identity: FORBIDDEN: drop shadows, gradients on text, rounded corners > 8px, stock photography)
- Q4: CORRECT (Build State: Layout patterns: hero-fullscreen, bento-grid, split-asymmetric)
- Q5: CORRECT (Next Wave: 06-spacer is BREATHE beat)

Score: 5/5 HEALTHY
Action: Continue normally. Logged in CONTEXT.md.
```
