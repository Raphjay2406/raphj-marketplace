---
name: client-review-workflow
tier: domain
description: "Shareable client-review microsite with commenting, approval tracking, diff-vs-previous-version. Generates read-only preview URL with comment overlay (data-genorah-id targeted). Routes approvals/changes back as structured feedback into /gen:feedback or /gen:iterate queue."
triggers: ["client review", "review share", "client feedback", "approval", "stakeholder review", "shareable preview"]
used_by: ["review-share", "feedback", "iterate"]
version: "3.2.0"
---

## Layer 1: Decision Guidance

### Why

Client feedback today: screenshots in email, Loom videos, Slack threads — unstructured. This skill produces a dedicated review URL with pinnable comments anchored to `data-genorah-id` elements + approval checkboxes per section. Comments serialize as structured JSON that feeds the refinement-queue.

### When to Use

- Post-`/gen:audit` with passing score, before final ship.
- Iterative client rounds (version-compare feature).
- Multi-stakeholder sign-off (legal, marketing, design).

### When NOT to Use

- Internal dev-only reviews (`/gen:review` command better).
- Ad-hoc quick checks (link-share a deploy preview instead).
- Not-yet-shippable builds (quality too low to waste client attention).

## Layer 2: Artifact

### `/brand-review` route (generated)

Static export with:
- Full rendered site at a snapshot URL (read-only overlay)
- Comment pins on any element with `data-genorah-id` (click to open comment form)
- Per-section "Approve" checkbox ("Approve hero", "Approve pricing", etc.)
- Side-by-side diff vs previous version (if exists)
- Anonymous or authenticated (configurable via PROJECT.md)

### Comment schema

```json
{
  "id": "cmt-2026-04-12T10:30-hero.cta-primary",
  "section": "hero",
  "selector": "[data-genorah-id='hero.cta-primary']",
  "bbox": { "x": 420, "y": 260, "w": 180, "h": 48 },
  "author": "client@example.com",
  "created_at": "2026-04-12T10:30:00Z",
  "text": "Can we make this feel more premium? The copy is fine but the button looks cheap.",
  "status": "open|resolved|wontfix",
  "resolution_notes": null
}
```

Stored at `.planning/genorah/review-queue/{id}.json`. Mirrors interactive-refinement-queue shape so `/gen:iterate --from-queue` can consume both.

### Approval tracking

```json
{
  "section": "hero",
  "approvers": [
    { "email": "client@example.com", "approved_at": "2026-04-12T11:00Z", "version": "v3" },
    { "email": "legal@example.com", "approved_at": "2026-04-12T11:45Z", "version": "v3" }
  ],
  "status": "pending|approved|rejected|revise"
}
```

Written to `.planning/genorah/APPROVALS.md` (Dataview-compatible frontmatter for Obsidian vault).

### Diff mode

When previous version exists, side-by-side diff:
- Before screenshot (from `audit/refs/{version-id}.png`)
- After screenshot (current)
- Changed regions highlighted (from dna-drift + reference-diff-protocol data)

### Share URL generation

Option A: Deploy to Vercel preview with `/review` route + short-code URL (`https://project.vercel.app/review/abc123`).

Option B: Standalone static export as HTML bundle in `.planning/genorah/client-review/` ready to deploy manually.

Authentication options:
- Public link (shareable, no login)
- Passcode-protected (generated 8-char code)
- Email-gated (magic link via resend/postmark)

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| data_genorah_id_required | on | — | — | HARD on comment targets |
| comment_max_length | 1 | 2000 | chars | HARD |
| approval_versions_tracked | 1 | 10 | count | SOFT (history) |
| auth_modes | public, passcode, email-magic | — | enum | user choice |

## Layer 3: Integration Context

- **`/gen:review-share`** — new v3.2 command generating and publishing the review URL.
- **`/gen:iterate --from-queue`** — consumes review-queue comments same as refinement-queue (interactive-refinement shape-compatible).
- **interactive-refinement** — sibling skill; shared comment schema.
- **`/gen:feedback`** — existing command; pulls approval data from APPROVALS.md into DECISIONS.md.
- **Obsidian vault** — APPROVALS.md syncs as a Dataview-queryable artifact.

## Layer 4: Anti-Patterns

- ❌ **No `data-genorah-id` discipline** — without stable selectors, comment pins drift on rebuild. Enforce via interactive-refinement skill.
- ❌ **Exposing unreleased builds as public URLs** — default to passcode; public only with explicit opt-in.
- ❌ **Approving across versions without clear version labels** — client approves v3 hero, dev ships v4 without re-approval → trust broken. Tie approvals to a version hash.
- ❌ **Mixing client comments with dev-refinement queue** — same shape but different origin. Namespace: `review-queue/` vs `refinement-queue/`.
- ❌ **Email-based auth without bot protection** — magic link endpoints need rate-limit + captcha, especially on public-facing review URLs.
