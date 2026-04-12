---
name: mobile-dna-bridge
description: Cross-platform theme bridge translating Design DNA to iOS (SwiftUI), Android (Material You / Compose), React Native (NativeWind), Flutter (ThemeData). Archetype-aware idiomatic platform mappings.
tier: domain
triggers: mobile-theme, dna-bridge, swiftui, compose, material-you, nativewind, flutter-theme
version: 0.1.0
---

# Mobile DNA Bridge

DNA lives in design tokens (12 colors + fonts + spacing + motion). Bridge translates to each platform's native idiom.

## Layer 1 — When to use

Every mobile project scaffolds its theme via this skill in Wave 0. Re-runs on DNA change.

## Layer 2 — iOS (SwiftUI)

`Sources/Theme/GenorahTheme.swift`:

```swift
import SwiftUI

extension Color {
    static let genorahPrimary = Color("genorahPrimary")
    static let genorahSecondary = Color("genorahSecondary")
    static let genorahAccent = Color("genorahAccent")
    static let genorahBg = Color("genorahBg")
}

extension Font {
    static let genorahDisplay: Font = .custom("{DNA_DISPLAY_FONT}", size: 34)
        .weight(.semibold)
    static let genorahBody: Font = .custom("{DNA_BODY_FONT}", size: 17)
}

struct GenorahTheme: EnvironmentKey {
    static let defaultValue = GenorahTheme(cornerRadius: 16)
    let cornerRadius: CGFloat
}
```

Assets.xcassets gets Color sets with light + dark appearance. Archetype determines radius defaults (Brutalist 0, Claymorphism 24, etc.).

## Layer 3 — Android (Material You + Compose)

`Theme.kt`:

```kotlin
private val LightColors = lightColorScheme(
    primary = Color(0xFF{DNA_PRIMARY_HEX}),
    secondary = Color(0xFF{DNA_SECONDARY_HEX}),
    tertiary = Color(0xFF{DNA_ACCENT_HEX}),
    background = Color(0xFF{DNA_BG_HEX}),
)

private val DarkColors = darkColorScheme(/* same with dark variants */)

@Composable
fun GenorahTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,  // Material You seed from wallpaper
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColors
        else -> LightColors
    }
    MaterialTheme(colorScheme = colorScheme, typography = GenorahTypography, shapes = GenorahShapes, content = content)
}
```

Shapes per archetype (Brutalist = sharp, Ethereal = rounded-lg).

## Layer 4 — React Native (NativeWind)

`tailwind.config.js`:

```js
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '{DNA_PRIMARY_HEX}',
        secondary: '{DNA_SECONDARY_HEX}',
        accent: '{DNA_ACCENT_HEX}',
      },
      fontFamily: {
        display: ['{DNA_DISPLAY_FONT}'],
        body: ['{DNA_BODY_FONT}'],
      },
      borderRadius: {
        DEFAULT: '{ARCHETYPE_RADIUS}px',
      },
    },
  },
};
```

Platform.select for iOS/Android-specific choices:

```tsx
const styles = Platform.select({
  ios: { borderRadius: 12 },       // iOS idiomatic
  android: { borderRadius: 8 },     // Material idiomatic
});
```

## Layer 5 — Flutter (ThemeData)

```dart
final ThemeData genorahLight = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF{DNA_PRIMARY_HEX}),
    brightness: Brightness.light,
  ),
  textTheme: TextTheme(
    displayLarge: TextStyle(fontFamily: '{DNA_DISPLAY_FONT}', fontSize: 34, fontWeight: FontWeight.w600),
    bodyMedium: TextStyle(fontFamily: '{DNA_BODY_FONT}', fontSize: 16),
  ),
  cardTheme: CardTheme(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular({ARCHETYPE_RADIUS}))),
);
```

Platform-adaptive widgets — `CupertinoButton` on iOS, `MaterialButton` on Android via `Platform.isIOS`.

## Layer 6 — Archetype idioms

| Archetype | iOS quirk | Android quirk |
|---|---|---|
| Brutalist | Sharp corners, no material blur | Elevation 0, no ripple |
| Ethereal | `.thinMaterial` backgrounds | Dynamic color high-saturation |
| Editorial | SF Pro Display + serif body | Headline style + Noto Serif |
| Kinetic | SwiftUI matchedGeometryEffect | Shared element transitions |
| Neo-Corporate | Inter via custom font | Inter + Material3 defaults |

## Layer 7 — Integration

- `/gen:mobile-theme init` generates platform theme file(s)
- Re-runs on DNA change
- Ledger: `mobile-theme-generated` with platform list

## Layer 8 — Anti-patterns

- ❌ Hardcoding hex in screens — use theme tokens
- ❌ Ignoring dark mode on iOS — Apple rejects no-dark apps now
- ❌ Material You dynamicColor disabled by default on Android — users love the personalization
- ❌ Universal radius across archetypes — defeats archetype specificity
