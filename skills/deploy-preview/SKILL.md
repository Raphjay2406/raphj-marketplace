---
name: deploy-preview
description: Automated preview deploys to Vercel / Netlify / Cloudflare Pages. Preview URL on every /gen:build. Optional visual-regression vs production post-deploy.
tier: domain
triggers: deploy, deploy-preview, vercel, netlify, cloudflare-pages, preview-url
version: 0.1.0
---

# Deploy Preview

`/gen:deploy [--preview|--production|--rollback <sha>]` with platform-adapter pattern.

## Layer 1 — When to use

After `/gen:build` or `/gen:iterate` completes, optionally auto-trigger preview deploy. Manual for production (requires ship-check PASS).

## Layer 2 — Platform adapters

### Vercel (default)

```bash
# Preview
vercel build --target=preview
vercel deploy --prebuilt

# Production
vercel build --target=production
vercel deploy --prebuilt --prod
```

Env vars via `vercel env pull` + `vercel env add`.

### Netlify

```bash
netlify build
netlify deploy --dir=dist               # preview
netlify deploy --dir=dist --prod        # production
```

### Cloudflare Pages

```bash
wrangler pages deploy dist
```

## Layer 3 — Preview URL capture

After deploy, parse platform CLI output for URL:
- Vercel: `https://<project>-<hash>-<team>.vercel.app`
- Netlify: `https://<hash>--<site>.netlify.app`
- Cloudflare: `https://<hash>.pages.dev`

Captured to:
- Ledger: `{kind: "preview-deployed", payload: {url, commit_sha, platform}}`
- Clipboard (when GUI available)
- `.planning/genorah/previews.md` — running list

## Layer 4 — Post-deploy checks

Optional flags:
- `--smoke` — Playwright smoke-test primary routes
- `--regression` — run `/gen:regression check --baseline production`
- `--lighthouse` — capture Lighthouse CI against preview URL

## Layer 5 — Rollback

```bash
# Vercel
vercel rollback <deployment-id>

# Git-based (all platforms)
git revert <sha> && <deploy command>
```

`/gen:deploy --rollback <sha>` wraps.

## Layer 6 — Integration

- `.claude/genorah.local.md` declares default platform + project ID
- Production deploy gated by `/gen:ship-check` PASS (checked pre-deploy)
- Env sync: `vercel env pull` before local build; CI secrets bound via platform dashboard

## Layer 7 — Anti-patterns

- ❌ Production deploy without ship-check — bypasses enforcement
- ❌ Force-push rollback — git history ambiguous; use `vercel rollback` or `git revert`
- ❌ Committing `.vercel/` directory — gitignored; contains project-local tokens
- ❌ Skipping `vercel env pull` — build uses stale env vars
