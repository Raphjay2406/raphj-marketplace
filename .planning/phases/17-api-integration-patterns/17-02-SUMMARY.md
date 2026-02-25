---
phase: 17-api-integration-patterns
plan: 02
subsystem: api-patterns-skill
tags: [api, anti-patterns, machine-readable-constraints, dna-connection, archetype-variants, integration-context, related-skills, pipeline-stage]
depends_on:
  requires: ["17-01"]
  provides: ["api-patterns SKILL.md complete (all 4 layers + constraints)", "machine-readable constraint table for quality-reviewer", "archetype voice variants for form UX"]
  affects: ["quality-reviewer agent (constraint checking)", "form-builder skill (related skill cross-reference)", "section-builder (form UX voice selection)"]
tech_stack:
  added: []
  patterns: ["4-layer skill format", "machine-readable constraints (HARD/SOFT)", "archetype voice variants for server-side messaging"]
key_files:
  created: []
  modified:
    - skills/api-patterns/SKILL.md
decisions:
  - "1600 total lines for complete skill -- Layers 3-4 added only 124 lines to existing 1476; reasonable for 22 patterns + 8 anti-patterns + 13 constraints"
  - "8 archetype voice groups (not 6) -- added Organic/Warm Artisan and Kinetic/Retro-Future to cover all 19 archetypes"
  - "8 related skills (not 6) -- added accessibility and nextjs-patterns/astro-patterns for comprehensive cross-referencing"
  - "13 constraints (9 HARD, 4 SOFT) -- env secret prefix is highest priority HARD constraint"
metrics:
  duration: "3m 05s"
  completed: "2026-02-25"
---

# Phase 17 Plan 02: API Patterns SKILL.md Layers 3-4 Summary

**One-liner:** Completed api-patterns skill with Layer 3 (DNA connection, 8 archetype voice variants, pipeline stage, 8 related skills) and Layer 4 (8 anti-patterns covering security, webhook verification, CRM quirks, and Context7 resilience) plus 13 machine-readable constraints for automated quality checking.

## What Was Built

Appended Layer 3 (Integration Context), Layer 4 (Anti-Patterns), and Machine-Readable Constraints to `skills/api-patterns/SKILL.md`, completing the 4-layer Domain-tier skill. Total file: 1600 lines (Layers 3-4 added 124 lines to the existing 1476).

### Layer 3: Integration Context

- **DNA Connection** -- 6 token mappings (Brand name, Brand description, --color-primary, --font-body, --font-display, Domain/metadataBase) with note that API patterns have lighter DNA coupling than visual skills
- **Archetype Variants** -- 8 archetype voice groups covering all 19 archetypes with Form UX Tone, Error Message Voice, and Success Message Voice columns
- **Pipeline Stage** -- Input from start-project/plan-dev/DNA, output to server actions and utility libraries, Wave 0/1/2+ positioning, Context7 integration points
- **Related Skills** -- 8 cross-references: form-builder, auth-ui, cms-integration, seo-meta, error-recovery, performance-guardian, nextjs-patterns/astro-patterns, accessibility

### Layer 4: Anti-Patterns (8 anti-patterns)

| # | Anti-Pattern | Severity | Layer 2 Cross-Reference |
|---|-------------|----------|------------------------|
| 1 | Client-Side Secret Exposure | Critical | Pattern 20 (Env Convention) |
| 2 | JSON-Parsing Webhook Body Before Verification | Critical | Patterns 13, 14, 16 |
| 3 | String Comparison for Webhook Signatures | Critical | Patterns 14, 16 |
| 4 | Unbounded Retries Without Backoff | High | Pattern 19 (Typed Client) |
| 5 | HubSpot Missing objectTypeId | Medium | Pattern 5 (HubSpot Forms) |
| 6 | Salesforce Web-to-Lead JSON Parsing | Medium | Pattern 6 (Web-to-Lead) |
| 7 | Turnstile Token Reuse | Medium | Patterns 11, 12 (Turnstile) |
| 8 | Context7 Over-Reliance Without Baseline | Medium | Layer 1 Context7 section |

### Machine-Readable Constraints (13 parameters)

- **9 HARD constraints:** env secret prefix, webhook body access, signature comparison, retry max attempts, retry base delay, retry 4xx behavior, HubSpot objectTypeId, Server Action directive, Astro prerender
- **4 SOFT constraints:** form submission timeout, CRM API timeout, .env.example generation, (and constraint priority documentation)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `3c2a429` | Layer 3 (Integration Context) -- DNA, archetypes, pipeline, related skills |
| 2 | `97e88d2` | Layer 4 (Anti-Patterns) + Machine-Readable Constraints |

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **1600 total lines** -- Above the 900-1200 target range, but only because Layers 1-2 were already 1476 lines (documented in Plan 01). Layers 3-4 added only 124 lines, which is within the expected ~150-200 line addition. No appendix extraction needed.
2. **8 archetype voice groups** -- Plan specified 6+ groups. Added Organic/Warm Artisan and Kinetic/Retro-Future to ensure all 19 archetypes have voice guidance, leaving no gaps for agents.
3. **8 related skills** -- Plan specified 6+ skills. Added `accessibility` and `nextjs-patterns`/`astro-patterns` for comprehensive cross-referencing that helps agents navigate the skill network.
4. **13 constraints (9 HARD, 4 SOFT)** -- Constraint priority note added to clarify that env secret prefix is the highest-priority constraint (security incident vs. integration bug).

## Full Phase Verification

All 6 API integration requirements verified as covered across the complete skill:

| Requirement | Coverage |
|------------|---------|
| API-01 (Context7 MCP) | Layer 1 Context7 subsection + Layer 2 Pattern 22 (3 workflow examples) + Layer 4 Anti-Pattern 8 |
| API-02 (Server-side proxy) | Layer 1 proxy principle + Layer 2 Patterns 1-3 + Layer 4 Anti-Pattern 1 |
| API-03 (CRM forms) | Layer 2 Patterns 5-12 + Layer 4 Anti-Patterns 5-7 + Layer 3 archetype voice variants |
| API-04 (Typed API client) | Layer 2 Patterns 17-19 + Layer 4 Anti-Pattern 4 |
| API-05 (Webhook receivers) | Layer 2 Patterns 13-16 + Layer 4 Anti-Patterns 2-3 |
| API-06 (Env management) | Layer 1 prefix rules + Layer 2 Patterns 20-21 + Layer 4 Anti-Pattern 1 |

## Next Phase Readiness

Phase 17 (API Integration Patterns) is complete. The `api-patterns` skill is a self-contained Domain-tier knowledge base ready for use by section-builder and specialist agents. No blockers for subsequent phases.
