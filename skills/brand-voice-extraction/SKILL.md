---
name: brand-voice-extraction
category: domain
description: "Extract brand voice from competitor + client URLs via Playwright. 5-axis analysis (formality, warmth, density, jargon, signature n-grams). Produces VOICE-PROFILE.md consumed by copy-intelligence to kill generic SaaS voice."
triggers: ["brand voice", "voice extraction", "competitor copy analysis", "tone analysis", "copy fingerprint", "voice profile", "voice mining"]
used_by: ["content-specialist", "copy-intelligence", "start-project", "discuss"]
version: "3.0.0"
mcp_required: ["playwright"]
---

## Layer 1: Decision Guidance

### Why Extract Voice

Genorah's biggest remaining "generic" failure mode is copy voice. DNA locks color/type/layout, archetype locks personality, but copy often defaults to generic SaaS voice ("Empowering teams to do their best work"). This skill feeds Content Specialist real voice data from real competitors + the client's existing site.

### When to Use

- End of `/gen:start-project`, after archetype lock, before content planning.
- Inside `/gen:discuss phase=content`, as refresher.
- When client provides 3+ competitor URLs in discovery.

### When NOT to Use

- Greenfield with no competitor set (fall back to archetype copy profile).
- Playwright unavailable (skip, note in SESSION-LOG).
- Highly regulated domain where voice is constrained (legal, finance) — extract but note constraints override.

## Layer 2: Technical Spec

### Input

- `competitor_urls[]` — 3-5 URLs from same/adjacent industry.
- `client_current_url` — optional; if provided, weight 2x to capture "where they are now".
- `archetype` — for per-axis weighting.

### Extraction

Playwright visits each URL, extracts:
- `h1`, `h2`, `h3` blocks (first 10 per page)
- `p` blocks in hero + about + features sections (first 20)
- All CTA text (`button`, `a.btn`, `a` with CTA class patterns)
- `meta[name="description"]` + `title`

Clean: strip navigation, footer, cookie banners (common selectors blocklist).

### 5-axis analysis

| Axis | Method | Output range |
|------|--------|--------------|
| Formality | Flesch-Kincaid grade + corporate lexicon hits (`synergy`, `leverage`, `empowering`) | 0=casual, 10=corporate |
| Warmth | Sentiment score + second-person pronoun ratio (`you`, `your`) + contractions | 0=cold, 10=warm |
| Density | Words per sentence + clause depth (commas/sentence) | 0=terse, 10=dense |
| Jargon | Industry-term frequency (noun-phrase extraction vs domain wordlist) | 0=plain, 10=jargon-heavy |
| Signature | Top-N unique n-grams (2-4) not in common-English frequency list | phrase list |

Libraries: `compromise` (NLP), `text-readability` (Flesch), `stopword` (filter), custom corporate-lexicon (shipped with skill).

### Output: VOICE-PROFILE.md

```markdown
# Voice Profile — {project}
Extracted: {ISO-8601} | Sources: 4 competitor URLs + client current site

## Axis Scores (0-10)
| Axis | Score | Interpretation |
|------|-------|----------------|
| Formality | 3.2 | Casual-conversational, contractions OK |
| Warmth | 7.8 | Second-person dominant, human tone |
| Density | 4.5 | Short-to-medium sentences |
| Jargon | 2.1 | Minimal; plain-language preferred |

## Signature Phrases (candidate for reuse/avoidance)
- "real work" (8x across references) — CANDIDATE
- "one place" (5x) — OVERUSED, avoid
- "built for teams" (6x) — AVOID (generic)

## Corporate Lexicon Hits to AVOID
- "empowering" (12x) — overused
- "seamless" (9x) — generic
- "leverage" (4x) — corporate

## CTA Patterns (actual vs generic)
- actual: "Start for free" (3x), "See it in action" (2x)
- generic to avoid: "Learn more", "Click here", "Submit"

## Recommendations
- Voice: casual-warm-plain. Direct, second-person, contractions.
- Lead with verbs. Avoid abstract nouns.
- Anchor claims with specific nouns (numbers, proper names).
```

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| url_count | 3 | 5 | int | HARD |
| blocks_per_url | — | 50 | count | SOFT |
| auth_walled_fallback | Wayback | — | — | try then skip |
| stopword_filter | on | on | bool | HARD |
| min_signature_phrase_freq | 3 | — | count | SOFT |

## Layer 3: Integration Context

- **`start-project`** — discovery asks for 3-5 competitor URLs; if provided, invokes this skill post-archetype.
- **Content-specialist** — reads VOICE-PROFILE.md as priority input; overrides archetype copy-profile defaults where they conflict.
- **Copy-intelligence skill** — consumes voice profile to generate micro-copy aligned to voice.
- **`/gen:discuss phase=content`** — can refresh profile on user request.

## Layer 4: Anti-Patterns

- ❌ **Running without archetype context** — Brutalist voice vs Ethereal voice are read differently; score interpretation depends on archetype.
- ❌ **Weighting competitors equally with client-current** — if client has existing voice, weight it 2x (they're showing you where they are).
- ❌ **Ignoring signature phrases** — the 3-5 most-repeated unique n-grams tell you what the industry *sounds like*. Either lean in or deliberately break pattern.
- ❌ **Hardcoding corporate lexicon** — industries differ; "leverage" is fine in PE, hostile in DTC. Lexicon should be configurable.
- ❌ **Skipping client existing site when available** — the biggest signal is where the client is today.
- ❌ **Copying reference voice directly** — extraction produces a *profile*, not a template. Content-specialist generates fresh copy aligned to the axes, not clones of references.
