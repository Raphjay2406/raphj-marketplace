---
name: mobile-preview-companion
description: QR-code preview for mobile builds via Expo Go or internal TestFlight links. /gen:preview mobile emits QR to terminal + dashboard for on-device testing.
tier: domain
triggers: mobile-preview, expo-go, qr-code, on-device, live-reload
version: 0.1.0
---

# Mobile Preview Companion

Bridges dev-server ↔ phone with minimal friction.

## Layer 1 — When to use

During `/gen:build` or `/gen:iterate` for mobile projects; user scans QR to see live app.

## Layer 2 — Expo path (preferred)

```bash
# Start Expo dev server
npx expo start
# Output includes QR + URL (exp://192.168.1.10:8081)
```

Genorah parses output, extracts QR + URL, emits to:
- Terminal as ASCII QR
- Dashboard mobile-preview tab
- Clipboard

User scans with Expo Go app → app loads → HMR on file save.

## Layer 3 — Bare RN / native path

No Expo runtime → TestFlight / internal track (see `skills/mobile-testing`).

Shorter cycle: run on connected device via `npx react-native run-ios --device` or `adb install`.

## Layer 4 — Dev server URL configuration

App reads `NEXT_PUBLIC_DEV_SERVER_URL` (or equivalent) at build:
- Simulator: `http://localhost:3000`
- Real device: `http://<dev-machine-ip>:3000` (parsed from Expo output)

Gets tricky if dev machine on corporate network: use `ngrok` or `cloudflared tunnel`.

## Layer 5 — Integration

- `/gen:preview mobile` orchestrates above
- Dashboard QR tab auto-refreshes when Expo dev server restarts
- Ledger: `mobile-preview-started`

## Layer 6 — Anti-patterns

- ❌ QR only in terminal — user can't scan while reading terminal on same device
- ❌ No fallback for bare RN — forces all users to Expo
- ❌ Hard-coded localhost in prod builds — breaks on device
