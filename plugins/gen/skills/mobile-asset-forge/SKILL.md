---
name: mobile-asset-forge
description: Mobile asset generation — adaptive icons, splash screens, store graphics per iOS/Android/Expo. Derives all sizes from single master SVG + 1024 PNG. Integrates with asset-forge-manifest.
tier: domain
triggers: mobile-assets, app-icon, splash-screen, store-graphics, adaptive-icon, app-store, play-store
version: 0.1.0
---

# Mobile Asset Forge

`/gen:assets mobile [icon|splash|store|preview]` — derives complete mobile asset pack from minimal master inputs.

## Layer 1 — When to use

Every mobile project gets icon + splash + store graphics. Run once post-DNA lock; re-run on brand change.

## Layer 2 — Deliverables

### App icon

**iOS (AppIcon.appiconset):**
- 180×180 (iPhone @3x), 120×120 (iPhone @2x), 87×87 (@3x settings), 80×80 (@2x spotlight), 60×60 (settings @1x), 58×58 (@2x settings), 40×40 (@2x spotlight), 29×29 (settings), 20×20 (notification)
- 1024×1024 (App Store)

**Android (adaptive icon):**
- `mipmap-mdpi/ic_launcher.png` (48×48), hdpi (72), xhdpi (96), xxhdpi (144), xxxhdpi (192)
- `mipmap-anydpi-v26/ic_launcher.xml` with foreground + background layers (432×432 foreground)
- 1024×1024 (Play Store)

**Expo (auto-derives both):**
- `assets/icon.png` (1024×1024) + `assets/adaptive-icon.png` (1024×1024 foreground)

### Splash screen

**iOS** — LaunchScreen.storyboard pattern OR LaunchImages (deprecated; avoid).

**Android 12+** — Splash API:
- `res/values-v31/themes.xml` with `android:windowSplashScreenAnimatedIcon`
- 288×288 foreground (padded within 432 safe area)

**Expo** — `expo-splash-screen` config in `app.json`:
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#{DNA_BG}"
    }
  }
}
```

### Store graphics

**App Store (iOS):**
- 6.9" iPhone: 1320×2868
- 6.7" iPhone: 1290×2796
- 6.5" iPhone: 1242×2688
- 5.5" iPhone: 1242×2208
- 13" iPad Pro: 2064×2752
- 12.9" iPad Pro: 2048×2732

**Play Store (Android):**
- Phone screenshots: 1080×1920 or 1920×1080
- 7" tablet: 1200×1920
- 10" tablet: 1920×1200
- Feature graphic: 1024×500
- Icon: 512×512

## Layer 3 — Flow

1. Master inputs:
   - Icon source: 1024×1024 PNG OR SVG (preferred)
   - Splash foreground: 288 safe-area SVG
   - Screenshot templates: 3-5 compositions in Figma or generated via Stitch MCP
2. Sharp-based derivation of all sizes
3. Platform-specific metadata files (contents.json, adaptive XML, app.json splash config)
4. Manifest entries: every derived asset recorded with cache_key

## Layer 4 — Integration

- Extends asset-forge-manifest with mobile asset kinds (`mobile/icon-ios-*`, `mobile/splash-android`, etc.)
- License: `genorah-procedural` since all derivations are in-plugin
- `/gen:export mobile-assets` bundles into ready-to-drop zip

## Layer 5 — Anti-patterns

- ❌ Manually resizing in Photoshop — inconsistencies across sizes
- ❌ Icon with transparency on iOS — rejected by App Store review
- ❌ Splash animation heavier than 200KB — poor cold-start UX
- ❌ Screenshot templates that don't match archetype — inconsistent store listing
