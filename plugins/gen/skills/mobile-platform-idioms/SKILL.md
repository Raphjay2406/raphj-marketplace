---
name: mobile-platform-idioms
description: Platform-specific gestures, haptics, transitions. iOS swipe-back + UIImpactFeedback; Android predictive back + ripple + shared element transitions; iPad multitasking; Android foldables.
tier: domain
triggers: platform-idioms, haptics, swipe-back, predictive-back, shared-element, foldable, ipad
version: 0.1.0
---

# Mobile Platform Idioms

Platform parity is NOT pixel parity. Users expect native idioms; fighting them degrades UX.

## Layer 1 — iOS idioms

### Swipe-back

Built into `NavigationStack` / `UINavigationController`. Do NOT disable unless modal sheet. Required expectation.

### Haptics

```swift
// Primary button tap
UIImpactFeedbackGenerator(style: .medium).impactOccurred()
// Toggle state change
UISelectionFeedbackGenerator().selectionChanged()
// Success / error
UINotificationFeedbackGenerator().notificationOccurred(.success)
```

Apply to:
- Primary CTA presses
- Toggle switches
- Pull-to-refresh completion
- Form submit

NOT to:
- Scroll momentum (overwhelming)
- Typing (platform handles)

### Context menus (long-press)

UIContextMenuInteraction for actionable lists. Android equivalent is popup menu.

### Dynamic Island (iPhone 14 Pro+)

Live Activities for persistent long-running tasks (delivery tracking, order status). 1-line summary + detail pull-down.

## Layer 2 — Android idioms

### Predictive back (Android 14+)

```xml
<!-- AndroidManifest.xml -->
<application android:enableOnBackInvokedCallback="true">
```

```kotlin
// In Compose
BackHandler {
  // Handle back
}
```

Predictive back gesture shows peek of previous screen during swipe.

### Material motion

Shared element transitions between screens:

```kotlin
// Compose
SharedTransitionLayout {
    AnimatedContent { ... }
}
```

### Ripple on touch

Default in Material3 clickable components. Do NOT disable without reason.

### System back button

Always respected. `BackHandler` in Compose or `onBackPressed` in view system. Never trap.

### Haptics

```kotlin
view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
// or
HapticFeedbackConstants.CONFIRM (API 30+)
```

## Layer 3 — iPad multitasking

- Slide-over (floating window) — support even if primary device is iPhone
- Split-view — layout scales down; not cropped
- Stage Manager — app survives window resize

Test: simulator → Hardware menu → "Toggle Slide Over" / "Toggle Split View."

## Layer 4 — Android foldables

Posture-aware layouts using Jetpack WindowManager:

```kotlin
val foldingFeature = windowInfoTracker.windowLayoutInfo(this).firstOrNull()?.displayFeatures
  ?.firstOrNull { it is FoldingFeature } as? FoldingFeature

if (foldingFeature?.state == FoldingFeature.State.HALF_OPENED) {
  // Table-top or book posture
}
```

## Layer 5 — RN / Flutter equivalents

### React Native

```ts
import { HapticFeedback } from 'react-native-haptic-feedback';
HapticFeedback.trigger('impactMedium');
```

Swipe-back: `react-navigation` enables by default on iOS (`gestureEnabled: true`). Android back button handled automatically.

### Flutter

```dart
import 'package:flutter/services.dart';
HapticFeedback.mediumImpact();
```

`CupertinoPageRoute` on iOS + `MaterialPageRoute` on Android give native feel. `WillPopScope` for Android back.

## Layer 6 — Integration

- Builder spawn prompt for mobile specialists includes this skill
- mobile-quality-gate includes "platform idioms" check; disabled swipe-back fails
- Ledger: `platform-idiom-violation` when detected

## Layer 7 — Anti-patterns

- ❌ Disabling iOS swipe-back as "design choice" — users fight muscle memory
- ❌ Haptics on every scroll event — fatigue + battery drain
- ❌ Custom back button replacing system back on Android — users expect system
- ❌ No foldable support when targeting Android — Samsung users affected
- ❌ Ignoring iPad multitasking — App Store review flag on iPad version
