---
description: "Scaffold a headless CMS (Sanity or Payload) with DNA-themed Studio/Admin, auto-generated collections/schemas from emotional arc, and live content preview wiring."
argument-hint: "sanity | payload"
allowed-tools: Read, Write, Edit, Bash, Glob
---

# /gen:cms-init

Initialize a headless CMS bound to the project's DNA, emotional arc, and content plan. Generates schemas/collections automatically from `MASTER-PLAN.md` + `CONTENT.md` + emotional-arc beat map.

## Workflow

### 1. Validate prerequisites

- `.planning/genorah/DESIGN-DNA.md` exists (DNA needed for Studio theming).
- `.planning/genorah/MASTER-PLAN.md` exists (needed to derive content types).
- `.planning/genorah/CONTENT.md` exists (seeds initial content).
- Framework is Next.js or Astro (check package.json).

If any missing: emit error with next-action suggestion.

### 2. Validate CMS arg

- `sanity` → route to `cms-sanity` skill.
- `payload` → route to `cms-payload` skill. **Next.js only** — block if Astro.
- Anything else: ask user.

### 3. Scaffold

**Sanity:**
```bash
pnpm create sanity@latest --template clean --typescript --output-path ./sanity
```
- Copy Sanity config with DNA theme vars.
- Create `/studio/[[...tool]]/page.tsx` route.

**Payload:**
```bash
pnpm dlx create-payload-app@latest --template website --db postgres
```
- Prompt for Postgres connection string (offer Vercel Postgres marketplace link).
- Merge Payload Next config with existing next.config.

### 4. Generate schemas/collections from emotional arc

For each section in MASTER-PLAN.md, determine its beat type, look up field template from the CMS skill (beat → fields map), generate file:
- Sanity: `sanity/schemaTypes/{beatSlug}.ts`
- Payload: `collections/{BeatName}.ts`

Skip BREATHE sections (typically inline-content, not CMS).

### 5. Seed content from CONTENT.md

Parse CONTENT.md sections, map each to its matching CMS entry, insert as draft. Editors review in Studio/Admin before publish.

### 6. Wire live preview

**Sanity:** Presentation tool config in sanity.config, VisualEditing component in layout, preview routes for draft mode.
**Payload:** draft preview via `_status=draft` query, admin-only bypass cookie.

### 7. Webhooks

**Sanity:** project webhook → `/api/sanity/revalidate` → `revalidateTag('sanity')`. Generate secret and write to `.env.local`.
**Payload:** Local API means no webhook needed; just `revalidatePath` after mutations inside same app.

### 8. Update project docs

Append to `.planning/genorah/PROJECT.md`:
```yaml
cms:
  provider: sanity  # or payload
  schemas_generated: [hero-section, features-section, ...]
  studio_route: /studio   # or /admin
  env_vars: [SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN, SANITY_WEBHOOK_SECRET]
```

### 9. Report

```
CMS: sanity initialized
Studio: http://localhost:3000/studio
Schemas: 7 generated (hero, features, pricing, testimonials, faq, cta, footer)
Env vars to set: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN, SANITY_WEBHOOK_SECRET
Next: run the app, log into Studio with your Sanity account
```

## Notes

- Payload requires Next.js — block gracefully with "use Sanity for Astro projects".
- Schema generation is deterministic per beat type; editors can extend post-init.
- Re-running `/gen:cms-init` is a no-op if scaffold exists (idempotent); use `--force` to regenerate schemas.
