---
description: "Generate a shareable client-review URL with pinnable comments + approval tracking. See skills/client-review-workflow."
argument-hint: "[--auth=public|passcode|email] [--deploy=vercel|static]"
allowed-tools: Read, Write, Edit, Bash, Glob
recommended-model: sonnet-4-6
---

# /gen:review-share

Publish a dedicated client review URL for the current build. See `skills/client-review-workflow/SKILL.md`.

## Workflow

1. Prereq: passing audit (score ≥170 minimum, ≥200 recommended).
2. Parse --auth + --deploy flags.
3. Generate review HTML bundle at `.planning/genorah/client-review/`.
4. Deploy based on --deploy:
   - `vercel`: creates Vercel preview with `/review` route
   - `static`: bundles HTML for user to deploy manually
5. If --auth=passcode: generate 8-char code, write to `APPROVALS.md`.
6. If --auth=email: scaffold Resend/Postmark magic-link flow.
7. Output shareable URL + auth instructions.
8. Render NEXT ACTION block (typical: wait for client feedback, then `/gen:iterate --from-queue`).
