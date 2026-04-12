---
name: supabase-rls
description: Row Level Security policy patterns. Per-table + per-operation + role-based. Common patterns library (owner-only, public-read, multi-tenant, admin-override).
tier: domain
triggers: supabase-rls, row-level-security, rls-policy, multi-tenant
version: 0.1.0
---

# Supabase Row Level Security

RLS is the main authorization surface in Supabase. Policies run per-row in Postgres — safe even with anon key.

## Layer 1 — Enable RLS

```sql
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- CRITICAL: enabling without policies blocks everyone. Add policies.
```

## Layer 2 — Pattern library

### Public read, owner write

```sql
CREATE POLICY "Public can read published" ON posts FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Owners manage their own" ON posts FOR ALL
  USING (author_id = auth.uid());
```

### Owner-only

```sql
CREATE POLICY "Users see own data" ON user_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update own data" ON user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Admin override

```sql
-- Admin role via JWT app_metadata
CREATE POLICY "Admins see all" ON posts FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Multi-tenant (company_id)

```sql
CREATE POLICY "Users see their company" ON projects FOR SELECT
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);

CREATE POLICY "Users manage their company's projects" ON projects FOR ALL
  USING (company_id = (auth.jwt() ->> 'company_id')::uuid);
```

### Shared resources via membership table

```sql
-- project_members(project_id, user_id, role)
CREATE POLICY "Members can read project" ON projects FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM project_members
    WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
  ));
```

### Invite-only read

```sql
CREATE POLICY "Invited users read draft" ON posts FOR SELECT
  USING (
    published_at IS NOT NULL
    OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM post_invites WHERE post_invites.post_id = posts.id AND post_invites.user_id = auth.uid())
  );
```

## Layer 3 — Service role bypass

`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — ONLY for server-only admin operations. Never expose client-side.

```ts
// Server-only: skill in server-action / API route
const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
```

## Layer 4 — Performance

Policies execute on every query. Keep fast:
- Index columns used in policies (`author_id`, `company_id`)
- Avoid `EXISTS` with unindexed subqueries
- Use stable/immutable function markers where appropriate

## Layer 5 — Testing

`supabase test` + pgtap:

```sql
-- tests/posts_rls.test.sql
BEGIN;
SELECT plan(3);

-- Insert user + post
INSERT INTO auth.users (id, email) VALUES ('u1', 'alice@example.com');
INSERT INTO posts (id, title, author_id) VALUES ('p1', 'Hello', 'u1');

-- Set auth context
SET LOCAL request.jwt.claims = '{"sub": "u1", "role": "authenticated"}';

SELECT is((SELECT count(*) FROM posts WHERE id = 'p1'), 1::bigint, 'owner can read own post');

SET LOCAL request.jwt.claims = '{"sub": "u2", "role": "authenticated"}';
SELECT is((SELECT count(*) FROM posts WHERE id = 'p1' AND published_at IS NULL), 0::bigint, 'non-owner cannot read unpublished');

SELECT * FROM finish();
ROLLBACK;
```

## Layer 6 — Integration

- `/gen:supabase rls <table>` generates policy scaffold per pattern
- Auto-enabled on `db-schema-from-content` Supabase output
- Ledger: `rls-policy-created`

## Layer 7 — Anti-patterns

- ❌ Enable RLS without policies — locks out everyone
- ❌ Using service role from client — bypasses all security
- ❌ `USING (true)` — effectively no security
- ❌ Policies that leak via `SELECT` but not `UPDATE` — inconsistent posture
- ❌ Missing indexes on policy columns — every query scans
- ❌ No test coverage for critical tables — silent breakage on schema change
