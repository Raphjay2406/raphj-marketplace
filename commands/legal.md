---
description: "Generate legal templates — privacy policy, TOS, accessibility statement, AI disclosure. Disclaimer: always review with counsel."
argument-hint: "privacy-policy | tos | accessibility | ai-disclosure | cookie-banner"
allowed-tools: Read, Write, Edit, Bash
recommended-model: opus-4-6
---

# /gen:legal

v3.12. Template generator, not legal advice. See `skills/privacy-policy-generator/SKILL.md` + `skills/ai-disclosure/SKILL.md` + `skills/cookie-compliance/SKILL.md`.

## Subcommands

- `privacy-policy [--jurisdictions us-ca,eu,uk,brazil]` — privacy policy for `/privacy`
- `tos` — terms at `/terms`
- `accessibility` — statement at `/accessibility`
- `ai-disclosure` — privacy paragraph + `/ai-training-data` route if self-hosting AI
- `cookie-banner [--region eu|us|global]` — banner component

Every output prefixed with:

```
/*
 * TEMPLATE — NOT LEGAL ADVICE
 * Generated: {date}
 * Review with counsel before publishing.
 */
```
