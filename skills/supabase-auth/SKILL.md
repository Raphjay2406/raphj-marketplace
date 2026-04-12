---
name: supabase-auth
description: Supabase Auth patterns — email/password, OAuth, magic link, phone, MFA (TOTP/SMS), Passkeys/WebAuthn, Row Level Security integration. @supabase/ssr for Next.js App Router.
tier: domain
triggers: supabase-auth, supabase, auth-supabase, ssr-supabase, rls-auth
version: 0.1.0
---

# Supabase Auth

## Layer 1 — When to use

Default Auth for any Supabase-backed project. Covers email/password + OAuth providers + magic link + MFA + Passkey.

## Layer 2 — Setup (Next.js App Router)

```ts
// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );
}
```

```ts
// utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

## Layer 3 — Auth patterns

### Email/password sign-up

```ts
'use server';
export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}
```

### OAuth (Google)

```ts
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${location.origin}/auth/callback`,
    queryParams: { access_type: 'offline', prompt: 'consent' },
  },
});
```

### Magic link

```ts
await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl } });
```

### MFA enrollment

```ts
const { data: factor } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
// Display factor.totp.qr_code; user scans with authenticator app
await supabase.auth.mfa.challenge({ factorId: factor.id });
await supabase.auth.mfa.verify({ factorId: factor.id, challengeId, code });
```

## Layer 4 — RLS integration

Policies use `auth.uid()`:

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own posts"
  ON posts FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Users can manage their own posts"
  ON posts FOR ALL
  USING (author_id = auth.uid());

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (published_at IS NOT NULL);
```

See `skills/supabase-rls/SKILL.md` for full RLS pattern library.

## Layer 5 — Middleware for session refresh

```ts
// middleware.ts (Next.js)
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();  // refreshes session cookie

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Layer 6 — Integration

- `/gen:supabase init` scaffolds client + server utils + middleware + auth routes
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Chains with `skills/api-routes/SKILL.md` auth templates
- Chains with `skills/biometric-auth-webauthn/SKILL.md` for Passkey on top of Supabase

## Layer 7 — Anti-patterns

- ❌ Using `SUPABASE_SERVICE_ROLE_KEY` in client — bypasses RLS; huge security hole
- ❌ Omitting middleware session refresh — auth silently expires
- ❌ Hardcoding redirectTo — fails in preview/production split
- ❌ MFA optional for admin accounts — weakest link
- ❌ `@supabase/auth-helpers-*` legacy packages — migrated to `@supabase/ssr`
