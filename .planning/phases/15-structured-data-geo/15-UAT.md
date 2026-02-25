---
status: complete
phase: 15-structured-data-geo
source: 15-01-SUMMARY.md, 15-02-SUMMARY.md
started: 2026-02-25T12:00:00Z
updated: 2026-02-25T12:05:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Schema Status Matrix with Honest Deprecation
expected: Layer 1 has a schema status table with 9 types. FAQPage = "Restricted" (gov/health), HowTo = "Deprecated", WebSite = no rich result. Each has AI engine value rating.
result: pass

### 2. Per-Page-Type Recipe Table
expected: A table mapping 11+ page types to specific schema combinations with caveats for deprecated/restricted types.
result: pass

### 3. TypeScript Interfaces (No schema-dts)
expected: 25+ plain TypeScript interfaces for JSON-LD types that do NOT import from schema-dts. Each interface extends a common SchemaBase with @type and @context.
result: pass

### 4. @graph Combination Pattern
expected: A code pattern showing how to combine multiple schema types in a single @graph array with @id cross-references and conditional inclusion.
result: pass

### 5. FAQ Schema with Restriction Warning
expected: FAQ schema pattern has a prominent warning that FAQ rich results are restricted to government and health sites since 2023, but notes FAQ schema still has GEO/AI engine value.
result: pass

### 6. HowTo Schema with Deprecation Warning
expected: HowTo schema pattern has a prominent warning that HowTo rich results are deprecated (Aug-Sep 2023), but notes the schema still provides AI extraction value.
result: pass

### 7. GEO Content Patterns (BLUF, Question Headings, Quotable Stats, FAQ-First)
expected: Four distinct GEO content structuring patterns with TSX code examples. Each should mention archetype intensity tiers.
result: pass

### 8. Schema Audit Protocol
expected: A 14-item content-schema consistency checklist that runs after every quality-reviewer pass, with a 4-step auto-fix protocol.
result: pass

### 9. SEO-Emotional Arc Beat Mapping
expected: A table mapping all 10 beat types to SEO/GEO guidance. 4 high-impact beats with required elements and 6 purely emotional beats with no required SEO elements.
result: pass

### 10. Archetype-to-GEO Intensity Mapping
expected: All 19 design archetypes mapped to one of 4 GEO intensity tiers (Full, Moderate, Subtle, Minimal).
result: pass

### 11. Machine-Readable Constraint Table
expected: 18+ rows of enforceable parameters. 16 HARD constraints and 2 SOFT constraints. Includes beat-specific enforcement for HOOK, TENSION, PROOF, CLOSE.
result: pass

### 12. Anti-Patterns Coverage
expected: 8 anti-patterns in standard format covering schema-content mismatch through ignoring audit after iteration.
result: pass

## Summary

total: 12
passed: 12
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
