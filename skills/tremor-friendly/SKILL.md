---
name: tremor-friendly
description: Motor-impairment-friendly interaction — larger hit zones, confirmation dialogs, longer timeouts, avoid rapid double-taps. Parkinson's / essential tremor / dexterity issues.
tier: domain
triggers: tremor, motor-impairment, hit-zones, confirmation-dialog, accessibility-motor
version: 0.1.0
---

# Tremor-Friendly Mode

## Layer 1 — User preference detection

No standard media query yet. Detect via:
- Settings toggle in-app (explicit opt-in)
- iOS `UIAccessibility.isAssistiveTouchRunning` proxy
- Android Switch Access detection proxy

Default: apply baseline tremor-friendliness everywhere.

## Layer 2 — Baseline rules (apply always)

- Touch targets ≥ 44×44 (already in interaction-fidelity-gate I1)
- Spacing between targets ≥ 8px (avoid accidental adjacent tap)
- No double-tap requirements (one click does one thing)
- No dead-zone between target + visual edge

## Layer 3 — Enhanced mode (explicit opt-in)

When user enables:
- Touch targets 56×56 minimum
- Destructive actions always require confirmation dialog
- Drag-and-drop replaced by tap-to-select + tap-to-place
- Timeouts (session, notification, toast) 3× longer
- Double-tap-to-zoom disabled (accidental)

## Layer 4 — Form tolerance

- Submit button disabled until all required fields filled — prevents premature submit
- Back button preserves form state (tremor causes accidental back navigation)
- Auto-save drafts every 5s

## Layer 5 — Integration

- UX heuristic H3 (user control and freedom) strengthened
- Settings toggle in-app; preference persisted
- Ledger: `tremor-mode-enabled`

## Layer 6 — Anti-patterns

- ❌ Hover-only menus — users with tremor accidentally dismiss
- ❌ Rapid-timeout dropdowns (close after 2s idle) — can't interact in time
- ❌ Tiny checkbox in long list — hit zone failure
- ❌ Confirm dialog with "Yes/No" buttons adjacent — spacing required
