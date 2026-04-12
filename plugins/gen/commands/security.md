---
description: "Security commands — sbom, audit, rotate, csp, font-audit, moderation-queue."
argument-hint: "sbom | audit | rotate <service> | csp init | font-audit | moderation-queue"
allowed-tools: Read, Write, Edit, Bash, Grep
recommended-model: sonnet-4-6
---

# /gen:security

v3.17. Security operations surface.

## Subcommands

- `sbom` — generate CycloneDX SBOM
- `audit` — full security audit (SBOM + licenses + vulnerabilities + secret scan)
- `rotate <service>` — guided secret rotation (stripe/hubspot/supabase/openai/anthropic/...)
- `csp init` — initialize CSP middleware + report-only mode
- `font-audit` — verify all fonts tracked in docs/FONTS.md
- `moderation-queue` — review flagged AI-generated content

## See also

- `skills/prompt-injection-defense/SKILL.md`
- `skills/pii-regex-v2026/SKILL.md`
- `skills/dependency-sbom/SKILL.md`
- `skills/content-moderation/SKILL.md`
- `skills/csp-generator/SKILL.md`
- `skills/api-key-rotation/SKILL.md`
- `skills/font-license-tracker/SKILL.md`
