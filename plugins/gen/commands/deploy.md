---
description: "Deploy project to configured platform (Vercel default, Netlify, Cloudflare Pages). Subcommands: preview | production | rollback. Production requires ship-check PASS."
argument-hint: "[preview|production|rollback <sha>] [--smoke] [--regression] [--lighthouse]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
recommended-model: sonnet-4-6
---

# /gen:deploy

v3.6 automated deploys.

## Subcommands

### `preview` (default)

1. Verify build succeeds locally (`npm run build`)
2. Run platform CLI: `vercel deploy` (or netlify/wrangler)
3. Capture preview URL
4. Optional: run `--smoke` (Playwright) or `--regression` check
5. Output URL + ledger emit

### `production`

1. **Gate**: `/gen:ship-check` must PASS (auto-run if not recent)
2. Explicit confirmation prompt (destination URL + commit SHA)
3. Run platform CLI production deploy
4. Capture + verify URL
5. Optional: snapshot new regression baseline
6. Ledger emit `{kind: "production-deployed", payload: {url, sha}}`

### `rollback <sha>`

1. Identify deployment at SHA (platform API)
2. Confirm rollback target with user
3. Execute platform rollback
4. Ledger emit

## Flags

- `--smoke` — run Playwright smoke test against preview/prod URL
- `--regression` — `/gen:regression check --baseline production`
- `--lighthouse` — Lighthouse CI against URL
- `--no-gate` — skip ship-check gate (DANGEROUS; use only for hotfixes)

## Config

`.claude/genorah.local.md`:
```yaml
deploy:
  platform: vercel
  project_id: prj_abc123
  team: team_xyz
```

## Anti-patterns

- ❌ Production deploy without ship-check — bypasses quality enforcement
- ❌ `--no-gate` as default — defeats the point of enforcement
- ❌ Rollback without investigation — address root cause before rollback (unless user-facing emergency)
