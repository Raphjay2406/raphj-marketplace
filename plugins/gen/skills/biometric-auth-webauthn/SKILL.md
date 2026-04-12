---
name: biometric-auth-webauthn
description: Passkeys (WebAuthn) authentication patterns. Provider-aware (Clerk, Stytch, Supabase Auth, Auth0, custom). Email/password as fallback; Passkey as upgrade path after first login.
tier: domain
triggers: passkey, webauthn, biometric-auth, face-id, touch-id, windows-hello
version: 0.1.0
---

# Biometric Auth (Passkeys)

WebAuthn is the modern replacement for SMS OTP. Cross-device via passkey sync (Apple iCloud Keychain, Google Password Manager, 1Password, etc.).

## Layer 1 — When to use

- Any auth-bearing project post-2026 (user expectation)
- Offers fastest, most secure login path
- Reduces support costs (no password reset)

## Layer 2 — Provider patterns

### Clerk (easiest)

```tsx
import { SignIn } from '@clerk/nextjs';

<SignIn
  appearance={{ /* DNA-themed */ }}
  afterSignInUrl="/dashboard"
/>
// Clerk auto-supports Passkey when enabled in dashboard
```

### Stytch

```ts
const stytch = new Stytch({ project_id, secret });
await stytch.webauthn.authenticateStart({ user_id, domain });
// Browser prompts for Passkey
await stytch.webauthn.authenticate({ public_key_credential });
```

### Supabase Auth (via plugins)

Currently no native WebAuthn; use MFA with TOTP + delegate Passkey to Clerk/Stytch.

### Custom (SimpleWebAuthn)

```ts
// Server: generate registration options
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

const options = await generateRegistrationOptions({
  rpName: 'My App',
  rpID: 'example.com',
  userID: user.id,
  userName: user.email,
  attestationType: 'none',
  authenticatorSelection: {
    residentKey: 'preferred',
    userVerification: 'preferred',
    authenticatorAttachment: 'platform',
  },
});

// Client
import { startRegistration } from '@simplewebauthn/browser';
const credential = await startRegistration(options);

// Server: verify
const verification = await verifyRegistrationResponse({
  response: credential,
  expectedChallenge: options.challenge,
  expectedOrigin: 'https://example.com',
  expectedRPID: 'example.com',
});
```

## Layer 3 — UX pattern

**Progressive enhancement:**
1. First login: email/password (Passkey browser support optional)
2. After successful login: "Want faster next time? Add a Passkey." → WebAuthn register
3. Future logins: Passkey auto-suggested; email/password as fallback

```tsx
{isFirstLogin ? (
  <EmailPasswordForm />
) : (
  <PasskeyButton fallback={<EmailPasswordForm />} />
)}
```

## Layer 4 — Device sync

Passkeys sync across user's devices via platform (iCloud Keychain on Apple, Google Password Manager, etc.). Third-party password managers (1Password, Bitwarden) also support.

User registers on iPhone → logs in on MacBook Safari with same credential (synced).

## Layer 5 — Fallbacks

Always offer:
- Email magic link (for device without Passkey)
- Email/password (legacy)
- Account recovery via email

Never Passkey-only.

## Layer 6 — Integration

- Env vars vary by provider: `CLERK_SECRET_KEY`, `STYTCH_SECRET`, or (custom) `WEBAUTHN_RP_ID`
- `/gen:api auth-passkey` scaffolds SimpleWebAuthn routes
- Interaction-fidelity gate checks Passkey flow has focus-ring, accessible name on button

## Layer 7 — Anti-patterns

- ❌ Passkey-only (no fallback) — locks out users
- ❌ Forcing Passkey registration in middle of purchase flow — friction spike
- ❌ RPID mismatch — Passkey fails silently; user confused
- ❌ Server-side Passkey verification skipped — spoofable
- ❌ No account recovery — lost device = lost account
