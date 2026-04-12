---
name: mobile-quality-gate
description: Mobile-specific quality gate supplementing quality-gate-v3. Measures 60/120fps, cold start <600ms, warm <300ms, memory <150MB, battery impact, offline fallback, platform idioms, Dynamic Type scaling.
tier: domain
triggers: mobile-quality, mobile-gate, cold-start, fps, battery-impact, dynamic-type, offline
version: 0.1.0
---

# Mobile Quality Gate

Extends `quality-gate-v3` with mobile-only measurements. Applies to all sections in mobile pipeline projects.

## Layer 1 — When to use

Every mobile project gets this variant. Runs as `/gen:audit --platform mobile`.

## Layer 2 — Measurements

### Performance

| Check | Budget | Tooling |
|---|---|---|
| Cold start | ≤ 600ms (to interactive) | Instruments (iOS) / Systrace (Android) / Expo perf |
| Warm start | ≤ 300ms | Same |
| Scroll FPS | ≥ 60 (120 on ProMotion) | Instruments / Systrace |
| Memory peak | ≤ 150MB on low-end device | Profilers |
| Frame drops | < 1% during animation | Platform tools |

### Offline

| Check | Pass criteria |
|---|---|
| Every screen has offline fallback | UI doesn't infinite-spinner |
| Form drafts persist | Saved locally, synced on reconnect |
| Read-heavy flows cached | Previously-fetched data available |

### Platform idioms

| Check | iOS | Android |
|---|---|---|
| Back navigation | Swipe-back gesture | System back button + predictive back (A14+) |
| Haptics | UIImpactFeedbackGenerator on primary actions | HapticFeedbackConstants on long-press |
| Keyboard handling | Keyboard avoidance on form screens | SoftInputMode configured |
| Status bar | Respects safe area + style per screen | StatusBarCompat |

### Accessibility

| Check | Pass criteria |
|---|---|
| Dynamic Type (iOS) | Readable at XXXLarge | Largest accessibility size |
| Font scaling (Android) | Readable at 200% | `sp` units throughout |
| VoiceOver / TalkBack | Every interactive has accessibility label | Tested full flow |
| Color contrast | WCAG AA in both light + dark | Theme-aware |

### Adaptive layout

| Check | Requirement |
|---|---|
| Phone portrait | Primary layout |
| Phone landscape | Functional (may reduce) |
| Tablet | Distinct layout (not stretched phone) |
| Foldable (Android) | Posture-aware |
| iPad multitasking | Slide-over + split-view work |

## Layer 3 — Battery impact

10-minute session benchmark:
- Background CPU: < 5% avg
- Network requests: minimized, batched
- Location: only when in-use (unless background justified)
- GPS / camera / mic: released when not in active screen

Budget: ≤ 3% battery drain per 10-min active session.

## Layer 4 — Integration

- `/gen:audit --platform mobile` adds mobile-gate to standard Axis 1 + Axis 2
- Framework-specific runners: XCUITest / Espresso / Detox / Maestro
- Dashboard mobile tab shows FPS + memory + battery per build
- Ledger emits `mobile-gate-fired` with per-check verdicts

## Layer 5 — Anti-patterns

- ❌ Accepting 30fps on scroll — jank is immediate perceived quality drop
- ❌ Forever-spinner on offline — users uninstall
- ❌ iOS back-swipe disabled without reason — breaks muscle memory
- ❌ Dynamic Type unsupported — accessibility failure, App Store rejection surface
- ❌ Hot reload sparks FPS regression — test on production-mode builds only
