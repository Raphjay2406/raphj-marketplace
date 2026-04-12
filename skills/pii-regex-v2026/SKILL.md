---
name: pii-regex-v2026
description: Updated PII / secret detection patterns for 2026 formats. Stripe/AWS/GitHub/GitLab/Slack/Google/OpenAI/Anthropic/Supabase keys + standard PII (SSN, credit card, phone).
tier: core
triggers: pii-scan, secret-detection, token-regex
version: 0.1.0
---

# PII + Secret Regex v2026

Updates dna-compliance-check.sh patterns with current-format tokens.

## Layer 1 — Secret patterns (updated)

| Provider | Pattern (Node regex) | Notes |
|---|---|---|
| Stripe live | `/sk_live_[A-Za-z0-9]{24,}/` | Current format 24+ alphanumerics; legacy 20+ supported |
| Stripe test | `/sk_test_[A-Za-z0-9]{24,}/` | Same structure |
| Stripe restricted | `/rk_live_[A-Za-z0-9]{24,}/` | Restricted keys |
| AWS access | `/AKIA[0-9A-Z]{16}\|ASIA[0-9A-Z]{16}/` | exactly 16 chars after prefix |
| AWS secret | `/[A-Za-z0-9+/]{40}/` | harder to pattern-match reliably; use entropy check |
| GitHub PAT | `/ghp_[A-Za-z0-9]{36}/` | exactly 36 chars |
| GitHub App | `/ghs_[A-Za-z0-9]{36}/` | |
| GitHub OAuth | `/gho_[A-Za-z0-9]{36}/` | |
| GitHub refresh | `/ghr_[A-Za-z0-9]{76}/` | 76 chars |
| GitLab PAT | `/glpat-[A-Za-z0-9_\-]{20}/` | 20 chars |
| Slack bot | `/xoxb-[0-9]{11,13}-[0-9]{11,13}-[A-Za-z0-9]{24}/` | |
| Slack user | `/xoxp-[0-9]{11,13}-[0-9]{11,13}-[A-Za-z0-9]{24}/` | |
| OpenAI | `/sk-(proj-)?[A-Za-z0-9_\-]{48,}/` | Project keys have `proj-` prefix |
| Anthropic | `/sk-ant-(api03\|api04)-[A-Za-z0-9_\-]{93,}/` | |
| Google API | `/AIza[0-9A-Za-z_\-]{35}/` | |
| Supabase anon | `/eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/` | JWT format |
| Vercel | `/vercel_[A-Za-z0-9]{24}/` | |
| npm | `/npm_[A-Za-z0-9]{36}/` | |

## Layer 2 — PII patterns

| Data | Pattern | Notes |
|---|---|---|
| US SSN | `/\b\d{3}-\d{2}-\d{4}\b/` | False positive risk; context-aware |
| Credit card | `/\b(?:\d[ -]?){13,19}\b/` + Luhn check | Pattern alone fails; Luhn validates |
| US phone | `/\b\(?\d{3}\)?[ .\-]?\d{3}[ .\-]?\d{4}\b/` | |
| Email | `/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z\|a-z]{2,}\b/` | |
| IBAN | `/\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/` | |

## Layer 3 — Entropy check for unknown secrets

For high-entropy strings without prefix match:

```ts
function shannonEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const c of str) freq[c] = (freq[c] ?? 0) + 1;
  return -Object.values(freq).reduce((s, n) => {
    const p = n / str.length;
    return s + p * Math.log2(p);
  }, 0);
}

// Strings > 30 chars + entropy > 4.5 = likely secret
```

## Layer 4 — Integration

- `dna-compliance-check.sh` + `scripts/pii-scan.mjs` use these patterns
- Pre-commit + pre-push hooks
- CI secret scan via GitGuardian or equivalent
- Ledger: `secret-detected`

## Layer 5 — False positives

Whitelist for test fixtures:
```
__fixtures__/ __mocks__/ *.example docs/troubleshooting/
```

## Layer 6 — Anti-patterns

- ❌ Patterns lag token format changes — review quarterly
- ❌ No Luhn check on credit card — 80% false positive
- ❌ Treating all high-entropy strings as secret — UUIDs, hashes flagged
- ❌ Logging detected secrets — double exposure; log location only
