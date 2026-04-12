---
description: "Live mobile preview on device via Expo Go QR or simulator/emulator. Alias: /gen:preview mobile."
argument-hint: "[--platform ios|android|both]"
allowed-tools: Read, Write, Edit, Bash
recommended-model: haiku-4-5
---

# /gen:mobile-preview

v3.7. See `skills/mobile-preview-companion/SKILL.md`.

## Flow

1. Detects project type (Expo / bare RN / native / Flutter)
2. Starts dev server / emulator / simulator
3. Emits QR + URL to terminal + dashboard
4. User scans with Expo Go (Expo) or launches simulator (bare)

## Integration

- Dashboard mobile-preview tab shows live QR + connection state
- Ledger: `mobile-preview-started`
