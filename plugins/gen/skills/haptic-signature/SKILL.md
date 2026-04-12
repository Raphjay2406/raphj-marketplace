---
name: "haptic-signature"
description: "Mobile haptic brand signature — distinctive vibration patterns for reveal, success, and confirmation on iOS/Android. Web Vibration API + React Native Haptics + SwiftUI sensoryFeedback."
tier: "domain"
triggers: "haptic, vibration, brand haptic, haptic pattern, tactile feedback"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Mobile app where brand moment warrants tactile reinforcement.
- Successful critical actions (purchase, form submit, unlock).
- Archetype: ai-native, gaming, playful, luxury.

### When NOT to Use

- Desktop web — vibration API exists but discouraged on trackpads.
- High-frequency interactions (scroll, hover) — haptic fatigue.
- `prefers-reduced-motion` — skip haptic.

## Layer 2: Patterns

```ts
// Web: navigator.vibrate — pattern in ms [vibrate, pause, vibrate, ...]
export const HAPTIC_PATTERNS = {
  reveal: [12, 40, 20],
  success: [8, 20, 8, 20, 20],
  confirm: [15],
  error: [40, 30, 40],
};

export function haptic(kind: keyof typeof HAPTIC_PATTERNS) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  navigator.vibrate?.(HAPTIC_PATTERNS[kind]);
}
```

**iOS SwiftUI 6**: `.sensoryFeedback(.success, trigger: completed)`
**Android Compose**: `HapticFeedback.performHapticFeedback(HapticFeedbackType.Confirm)`
**React Native**: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`

## Layer 3: Integration Context

- Pairs with `sonic-logo` — fire together for multi-sensory brand moment.
- Documented in brandkit PDF as "haptic signature" with pattern visualization.
- Platform test: run on real iOS + Android devices; emulators don't reproduce accurately.

## Layer 4: Anti-Patterns

- Long vibrations (>500ms total) — annoying, battery drain.
- Haptic on every tap — loses brand distinctiveness.
- Not honoring system haptic off toggle — must respect OS-level disable.
