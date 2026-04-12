---
name: typography-rules
tier: core
description: "Butterick-derived typography rules — smart quotes, en/em dashes, hyphenation-as-HTML, single-space-after-period, hierarchy math, ligatures, widow/orphan control. Silently auto-applied to generated TSX visible strings via dna-compliance-check hook. Distilled from bencium-marketplace/typography (MIT, preserves Matthew Butterick attribution)."
triggers: ["typography", "typography rules", "smart quotes", "en dash", "em dash", "hyphenation", "butterick", "practical typography", "copy rules", "punctuation"]
used_by: ["builder", "content-specialist", "polisher", "dna-compliance-check"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### Why Typography Rules

Generated LLM copy almost always ships typographic crimes that would fail a first-year design review: straight quotes instead of smart quotes, double-hyphens instead of em dashes, two-spaces-after-period, un-hyphenated compound modifiers. These are **silent quality markers** — the reader can't articulate why the copy "feels amateur" but they feel it.

This skill encodes Matthew Butterick's *Practical Typography* rules as enforceable checks. Auto-applied by the dna-compliance-check hook during build, not left to chance.

**Source attribution:** Rules distilled from `bencium-marketplace/typography` (MIT), which credits Matthew Butterick's *Practical Typography* (https://practicaltypography.com). Preserve this attribution in all derivative work.

### When to Use

- Every Write/Edit on `.tsx|.jsx|.mdx|.md` with visible user-facing strings.
- Content-specialist output for CONTENT.md.
- Builder emits JSX with button text, headings, body copy.
- Polisher cleanup pass.

### When NOT to Use

- Code strings (import paths, class names, config values).
- API responses / structured data.
- Test fixtures.

## Layer 2: The Rules

### 1. Smart Quotes (Required)

- Double: `"` and `"` (U+201C, U+201D) — **not** `"` (U+0022)
- Single: `'` and `'` (U+2018, U+2019) — **not** `'` (U+0027) — including apostrophes
- Primes (feet/inches/minutes): `′` `″` — **not** `'` or `"`

**Wrong:** `"Hello," she said. "It's cold."`
**Right:** `"Hello," she said. "It's cold."`

Exception: code blocks, URLs, email addresses, numeric inputs expecting straight quotes.

### 2. Dashes

- Hyphen `-` (U+002D): compound modifiers only (well-known, 10-minute, cold-pressed)
- En dash `–` (U+2013): number ranges (2020–2025), score (Red Sox 4–2), relationship (NY–LA flight)
- Em dash `—` (U+2014): parenthetical interruption — like this — no spaces around it (American style) or — like this — with spaces (British/many modern style; pick one and stick with it)
- **Never** two hyphens `--` for an em dash. Use the actual character.

### 3. Spaces After Period

One space. Not two. Full stop.

### 4. Hyphenation for Compound Modifiers

- `well-designed interface` — hyphenate when it modifies the noun
- `the interface is well designed` — no hyphen when it's a predicate

### 5. Ligatures

Enabled by default when the font supports them: `ff`, `fi`, `fl`, `ffi`, `ffl` should render as single glyphs. Use `font-feature-settings: "liga" 1;` in CSS unless disabling intentionally.

### 6. Widow/Orphan Control

Headlines should not break with a single word on the last line (a "runt"). Use:
- CSS `text-wrap: balance;` for headlines (h1-h3)
- CSS `text-wrap: pretty;` for body paragraphs (2 lines max orphan)
- Non-breaking space `\u00A0` between last two words manually if needed

### 7. Number Typography

- Tabular numerals in tables / dashboards: `font-variant-numeric: tabular-nums;`
- Proportional numerals in prose (default)
- Fractions: `½ ⅓ ⅔ ¼ ¾` (U+00BD etc.) — not `1/2`
- Multiplication: `×` (U+00D7), not `x` or `*` — e.g., "1920×1080"
- Minus: `−` (U+2212) in math contexts, not `-`

### 8. Quotation Paragraphs

Block quotes don't need opening/closing quote marks. If using inline quotes, smart quotes only. Multi-paragraph quotes: open each paragraph with `"` but close only the final paragraph.

### 9. Ellipses

`…` (U+2026), not three periods. Though styleguides disagree on whether to add a leading space or not — prefer no-leading-space in digital contexts, one trailing space before continuing text.

### 10. Apostrophes in Plurals and Possessives

- Possessive: `Chris's`, `the 1990s`, `CEOs`, `NASA's`
- Plural: `the 1990s` (no apostrophe before s)
- Decades: `the '90s` (smart apostrophe, not straight)
- Possessive of nouns ending in s: both `James's` and `James'` acceptable; pick one (prefer `'s` for pronunciation clarity)

## Layer 3: Integration Context

### dna-compliance-check.sh integration

Hook pre-commit greps staged `.tsx|.jsx|.mdx|.md` files for common violations:

```bash
# Straight quotes in visible JSX strings (inside > ... < or after >, before <)
grep -Pn '>[^<]*["][^<]*<' file.tsx  # likely violations

# Double-hyphen in text that isn't a CLI flag
grep -Pn '(^|[^-])--[^->a-zA-Z0-9]' file.md  # likely em-dash violations

# Double-space after period
grep -Pn '\.\s{2,}' file.md
```

### Builder + content-specialist behavior

When generating JSX strings or Markdown content:

1. **Always** emit smart quotes (U+201C, U+201D, U+2018, U+2019).
2. **Always** emit em dash (U+2014) or en dash (U+2013) in the right contexts, not hyphens.
3. Single space after period.
4. Hyphenate compound modifiers before nouns.

### CSS defaults

Genorah's design-system-scaffold now emits these CSS rules as part of baseline typography:

```css
body {
  font-feature-settings: "liga" 1, "kern" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  text-wrap: balance;
  font-feature-settings: "liga" 1, "kern" 1;
}

p {
  text-wrap: pretty;
  hyphens: auto;
}

.tabular {
  font-variant-numeric: tabular-nums;
}
```

### Polisher pass

On `/gen:audit`, polisher scans and auto-fixes:
- Replace `"..."` with `"..."` in JSX string literals
- Replace `--` with `—` in visible prose
- Replace `' (U+2019)` with itself (no-op to confirm presence)
- Flag any remaining straight quotes in visible copy as WARNING in audit report

## Layer 4: Anti-Patterns

- ❌ **Smart quotes in code** — attribute values, import paths, className strings must use straight quotes.
- ❌ **Em dash without context** — decoration, not punctuation. Used for parenthetical interruption OR pause stronger than comma, not as a "cool-looking" dash replacement everywhere.
- ❌ **Hyphens for number ranges** — `2020-2025` is wrong; `2020–2025` is right (en dash).
- ❌ **Straight apostrophes** — `don't`, `can't`, `won't` all use U+2019 smart apostrophe, not straight. This is the single most common typography crime.
- ❌ **Two spaces after period** — typewriter-era convention. Dead for 30+ years.
- ❌ **Fraction-as-slash** — `1/2` reads amateur in prose. Use `½` or typeset properly. OK in code / data contexts.
- ❌ **Ignoring Butterick attribution** — this skill stands on Butterick's *Practical Typography*. Preserve credit in derivative documentation.
