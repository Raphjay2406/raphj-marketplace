---
name: mobile-testing
description: Simulator + real device testing per platform. Maestro + Detox + XCUITest + Espresso; EAS Build / Submit; TestFlight / Play internal track.
tier: domain
triggers: mobile-testing, maestro, detox, xcuitest, espresso, testflight, eas-build
version: 0.1.0
---

# Mobile Testing

`/gen:mobile-test [--platform ios|android|both] [--device simulator|real]`

## Layer 1 — Framework choice

| Framework | Scope | Recommended for |
|---|---|---|
| Maestro | Cross-platform E2E | Default for RN/Expo/Flutter/native |
| Detox | React Native-specific | Complex RN flows |
| XCUITest | iOS native | Native iOS apps |
| Espresso | Android native | Native Android apps |
| Appium | Cross-platform | Legacy; avoid unless required |

## Layer 2 — Maestro flow (default)

```yaml
# .maestro/signup.yaml
appId: com.example.app
---
- launchApp
- tapOn: "Get Started"
- inputText: "test@example.com"
- tapOn: "Continue"
- assertVisible: "Check your email"
```

Run: `maestro test .maestro/signup.yaml`.

## Layer 3 — iOS simulator

```bash
# Boot
xcrun simctl boot "iPhone 15 Pro"
# Install built app
xcrun simctl install booted path/to/App.app
# Launch + UI test
xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 15 Pro'
```

## Layer 4 — Android emulator

```bash
# Start
emulator -avd Pixel_8_API_34 &
# Test
./gradlew connectedAndroidTest
```

## Layer 5 — Real device

### iOS (TestFlight)

```bash
# Via EAS
eas build --platform ios --profile preview
eas submit --platform ios --latest
# Users tap TestFlight link → install → test
```

### Android (Play internal)

```bash
eas build --platform android --profile preview
eas submit --platform android --track internal
```

## Layer 6 — CI integration

GitHub Actions matrix running Maestro on both platforms:
```yaml
strategy:
  matrix:
    platform: [ios, android]
```

Uses Firebase Test Lab or BrowserStack for real-device fleet.

## Layer 7 — Integration

- `/gen:mobile-test` generates Maestro suites from PLAN.md user journeys
- Results feed mobile-quality-gate cold-start / FPS measurements
- Ledger: `mobile-test-ran` with results per platform

## Layer 8 — Anti-patterns

- ❌ Only simulator testing — misses real hardware quirks
- ❌ Shipping without TestFlight / internal track — users find issues in production
- ❌ Maestro flows hand-written in every project — derive from PLAN.md journey
- ❌ No frame-drop tracking in tests — perf regression invisible
