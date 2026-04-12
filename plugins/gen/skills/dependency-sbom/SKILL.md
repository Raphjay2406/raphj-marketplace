---
name: dependency-sbom
description: Software Bill of Materials generation (CycloneDX format). License scanning + vulnerability audit. Required for regulated industries + supply chain compliance.
tier: domain
triggers: sbom, cyclonedx, license-scan, dependency-audit, supply-chain
version: 0.1.0
---

# SBOM + License Scan

## Layer 1 — CycloneDX generation

```bash
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

Produces JSON listing:
- Every npm dependency (direct + transitive)
- Version, license, homepage
- Hash (integrity)
- Vulnerabilities (if known)

## Layer 2 — License allowlist

```json
// .sbom-policy.json
{
  "allowed_licenses": [
    "MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC",
    "CC0-1.0", "Unlicense"
  ],
  "disallowed_licenses": [
    "GPL-2.0", "GPL-3.0", "AGPL-3.0"  // copyleft incompatible with proprietary
  ],
  "review_licenses": [
    "LGPL-2.1", "LGPL-3.0", "MPL-2.0"  // ok-with-care
  ]
}
```

Check via:

```bash
npx license-checker --production --failOn "GPL-2.0;GPL-3.0;AGPL-3.0"
```

## Layer 3 — Vulnerability audit

```bash
npm audit --audit-level=high --production
# or
npx snyk test
# or
trivy fs package.json
```

Block CI on HIGH/CRITICAL. MODERATE logs warning.

## Layer 4 — Font license

Web fonts have separate licenses:
- Google Fonts: SIL Open Font License (most) or Apache-2.0 — free commercial
- Adobe Fonts: requires active subscription (ties to CC or standalone)
- Monotype Fonts: per-view pricing, often expensive
- Custom / foundry: per-license agreement

`docs/FONTS.md` lists all fonts + source + license + terms.

## Layer 5 — Code dependency audit

For generated sites:
- Dependabot alerts in GitHub
- Socket.dev for supply-chain analysis (malicious packages, typosquats)
- renovate for automated updates with testing

## Layer 6 — Integration

- `/gen:security sbom` generates SBOM
- `/gen:security audit` runs full audit (SBOM + licenses + vulnerabilities)
- CI runs on every PR + weekly cron
- Ledger: `sbom-generated`, `license-violation`, `vulnerability-detected`

## Layer 7 — Anti-patterns

- ❌ No SBOM for regulated customers — compliance blocker
- ❌ Transitive GPL via direct MIT dep — linked via npm; still triggers copyleft
- ❌ Stale SBOM committed to repo — auto-regenerate on CI
- ❌ Ignoring MODERATE vulnerabilities — compound
