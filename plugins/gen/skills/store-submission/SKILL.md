---
name: "store-submission"
description: "App Store and Play Store pre-submission validation. Asset checks, guidelines compliance, content policy, privacy requirements, and comprehensive readiness gate."
tier: "domain"
triggers: "app store, play store, store submission, app review, store listing, app assets, app publish"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a store submission specialist. Before any app reaches App Store Connect or Google Play Console, this skill runs a comprehensive pre-flight check covering assets, metadata, privacy compliance, content policy, and technical requirements. Catching rejection reasons before submission saves days of review cycles and avoids the morale cost of failed launches.

### When to Use

- **Before every App Store or Play Store submission** -- Run the full checklist to catch common rejection reasons before they cost you a review cycle
- **After major feature additions** -- New features may introduce new permission requirements, privacy data types, or content policy implications
- **When targeting new markets/locales** -- Localization requirements, regional compliance (GDPR, CCPA, COPPA), and locale-specific screenshots need validation
- **During CI/CD pipeline setup** -- Integrate automated checks into EAS Submit, Fastlane, or Gradle release workflows
- **When updating privacy declarations** -- Apple nutrition labels and Google data safety sections must match actual app behavior exactly

### When NOT to Use

- App is in early development without a submission target -- focus on building first
- Web-only deployment -- use `seo-technical` and `performance-patterns` instead
- Internal enterprise distribution (TestFlight-only or Firebase App Distribution) -- subset of checks apply but full store compliance is unnecessary
- Desktop app targeting Mac App Store -- overlaps exist but this skill targets iOS and Android specifically

### Quick vs Full Check Modes

**Quick Check** (pre-submission sanity):
1. App icon exists at correct dimensions
2. Screenshots exist for required device sizes
3. No placeholder content in metadata (title, description)
4. Privacy policy URL is accessible
5. No debug/dev code markers in production build
6. Bundle size within OTA/AAB limits

**Full Check** (comprehensive audit):
- All Quick Check items plus every item in the Layer 2 checklists
- Cross-references privacy declarations against actual code usage
- Validates localization completeness for all target markets
- Checks deep link configuration for both platforms
- Generates `audit/STORE-SUBMISSION-REPORT.md` with pass/fail per item

### Decision Tree

- If iOS-only -> run App Store + Cross-Platform checks, skip Play Store
- If Android-only -> run Play Store + Cross-Platform checks, skip App Store
- If cross-platform (RN/Expo/Flutter) -> run ALL three checklists
- If first submission -> Full Check mode mandatory
- If update submission -> Quick Check unless new permissions or data types added
- If targeting children (under 13) -> add COPPA/families policy layer to both platforms

### Pipeline Connection

- **Referenced by:** builder (final wave), reviewer during `/modulo:iterate`
- **Consumed at:** `/modulo:execute` (final validation gate before "ready to ship" status)
- **Triggers audit:** Generates `audit/STORE-SUBMISSION-REPORT.md` in project root
- **Blocks release:** Any FAIL item in the report prevents READY status

## Layer 2: Comprehensive Validation Checklists

### App Store (iOS)

#### Assets

| Asset | Requirement | Notes |
|-------|-------------|-------|
| App Icon | 1024x1024 PNG, no alpha channel, no rounded corners (system applies them) | Single icon; system generates all sizes from this |
| @1x/@2x/@3x variants | All image assets in asset catalog must have all scale variants | Missing variants cause blurry rendering on retina displays |
| Launch Screen | Storyboard-based or SwiftUI launch screen (static, no code) | `UILaunchStoryboardName` in Info.plist; Apple rejects animated launch screens |
| Screenshots (6.7") | 1290x2796 px (iPhone 15 Pro Max) | Required for all apps |
| Screenshots (6.5") | 1284x2778 px (iPhone 14 Plus / 13 Pro Max) | Required for all apps |
| Screenshots (5.5") | 1242x2208 px (iPhone 8 Plus) | Required if supporting older devices |
| Screenshots (12.9" iPad) | 2048x2732 px (iPad Pro 6th gen) | Required if app runs on iPad |
| App Preview Video | 15-30s, H.264, up to 500MB, no excessive UI chrome | Optional but highly recommended for discoverability |

**Screenshot rules:**
- Minimum 3 screenshots per device size, maximum 10
- Screenshots must reflect actual app UI (no misleading marketing renders)
- Text overlays allowed but must not obscure core functionality
- Each locale can have different screenshots (and should for localized content)

#### Info.plist Privacy Descriptions

Every system API that accesses user data requires a usage description string. Missing descriptions cause instant rejection.

| Key | API Protected | Example Description |
|-----|---------------|-------------------|
| `NSCameraUsageDescription` | Camera capture | "Used to scan QR codes for quick login" |
| `NSPhotoLibraryUsageDescription` | Photo library read | "Select photos for your profile picture" |
| `NSPhotoLibraryAddUsageDescription` | Photo library write | "Save generated images to your camera roll" |
| `NSLocationWhenInUseUsageDescription` | Location (foreground) | "Find nearby stores while using the app" |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Location (background) | "Track your delivery route in the background" |
| `NSMicrophoneUsageDescription` | Microphone | "Record voice messages in chat" |
| `NSContactsUsageDescription` | Contacts | "Find friends who already use the app" |
| `NSCalendarsUsageDescription` | Calendar | "Add event reminders to your calendar" |
| `NSFaceIDUsageDescription` | Face ID | "Authenticate securely with Face ID" |
| `NSBluetoothAlwaysUsageDescription` | Bluetooth | "Connect to your fitness tracker" |
| `NSSpeechRecognitionUsageDescription` | Speech recognition | "Convert voice notes to text" |
| `NSMotionUsageDescription` | Motion/accelerometer | "Track steps for your daily fitness goal" |
| `NSLocalNetworkUsageDescription` | Local network discovery | "Discover and connect to nearby devices" |
| `NSHealthShareUsageDescription` | HealthKit read | "Read your step count and heart rate data" |
| `NSHealthUpdateUsageDescription` | HealthKit write | "Log workouts to your health record" |

**Rules for descriptions:**
- Must explain WHY the app needs access, not just what it does
- Must be specific to your app's use case (not generic boilerplate)
- Language must match the app's primary locale
- Descriptions shown to users at permission prompt time -- they affect grant rates

#### Additional Info.plist Requirements

| Key | Purpose | Requirement |
|-----|---------|-------------|
| `UIBackgroundModes` | Background execution | Only declare modes actually used (audio, location, fetch, remote-notification, etc.) |
| `NSAppTransportSecurity` | HTTPS enforcement | Must use HTTPS for all network requests; exceptions require justification |
| `ITSAppUsesNonExemptEncryption` | Export compliance | Set to `NO` if only using HTTPS/TLS; otherwise file encryption documentation |
| `UIRequiredDeviceCapabilities` | Device filtering | Declare only capabilities truly required (GPS, camera, accelerometer) |
| `UIStatusBarStyle` | Status bar | Must be visible (not hidden behind content) on notched devices |

#### App Review Guidelines Compliance

| Check | Rejection Reason | How to Verify |
|-------|-----------------|---------------|
| No placeholder content | Guideline 2.1 -- App Completeness | Grep for "lorem ipsum", "test", "TODO", "coming soon", "placeholder", "TBD" in all user-facing strings |
| No broken links/buttons | Guideline 2.1 -- App Completeness | Tap every button, link, and navigation element; all must respond or be visibly disabled |
| No private API usage | Guideline 2.5.1 -- Software Requirements | Run `otool -L` on binary; no underscore-prefixed Apple frameworks |
| Minimum functionality | Guideline 4.2 -- Minimum Functionality | App must not be a simple website wrapper (WKWebView-only); must provide native value |
| Login test credentials | Guideline 2.1 -- App Completeness | If auth required, provide demo account in App Review Information notes |
| Crash-free launch | Guideline 2.1 -- Performance | Test on oldest supported iOS version on physical device; zero crashes on launch |
| No hidden features | Guideline 2.3.1 -- Accurate Metadata | All features must be discoverable through normal UI navigation |
| In-App Purchase rules | Guideline 3.1.1 -- IAP Required | Digital goods/services MUST use Apple IAP (not Stripe/PayPal for digital content) |
| Sign in with Apple | Guideline 4.8 -- Sign in with Apple | Required if app offers ANY third-party social login (Google, Facebook, etc.) |
| User-generated content | Guideline 1.2 -- User Generated Content | Must include reporting/blocking mechanism, content filtering, and ability to hide offensive content |

#### Privacy Requirements

| Requirement | Details |
|-------------|---------|
| App Tracking Transparency (ATT) | Must show ATT prompt (`requestTrackingAuthorization`) BEFORE accessing IDFA or using AdServices frameworks; rejection if tracking without consent |
| Privacy Nutrition Labels | Declare ALL data types collected (name, email, location, usage data, diagnostics, etc.) and whether each is linked to identity, used for tracking, or collected for app functionality |
| Privacy Policy URL | Must be publicly accessible (not behind login), describe all data practices, include contact information for privacy inquiries |
| Data Deletion | If app stores personal data, must provide in-app mechanism or clear instructions for users to request data deletion |
| Third-party SDKs | SDKs like Firebase, Amplitude, Sentry collect data -- their data types must be included in nutrition labels |
| HealthKit data | Special rules: cannot use for advertising, must have clear privacy policy section on health data handling |

#### Metadata Limits

| Field | Limit | Tips |
|-------|-------|------|
| App Name | 30 characters | Front-load keywords; avoid generic terms |
| Subtitle | 30 characters | Complement the name, do not repeat it |
| Keywords | 100 characters, comma-separated | No spaces after commas; use singular forms; avoid duplicating name/subtitle words |
| Description | 4,000 characters | First 3 lines visible without "more" tap; lead with value proposition |
| What's New | 4,000 characters | List user-facing changes; avoid internal jargon |
| Primary Category | 1 selection | Must accurately reflect app's main purpose |
| Secondary Category | 1 selection (optional) | Choose a genuinely relevant second category |
| Age Rating | Questionnaire-based | Answer honestly; Apple verifies and may change your rating |
| Copyright | Format: "YYYY Company Name" | e.g., "2026 Acme Inc." |
| Support URL | Required | Must be accessible and responsive |

#### Localization Checklist

- All user-facing strings extracted to `.strings` / `.stringsdict` files (no hardcoded strings)
- Screenshots provided per target locale (App Store Connect supports 40+ locales)
- Metadata (name, subtitle, keywords, description) translated per locale
- Right-to-left layout support if targeting Arabic, Hebrew, or Urdu markets
- Date, time, number, and currency formatting uses `Locale`-aware formatters
- Pluralization rules handled per language (`.stringsdict` for iOS)

#### Technical Requirements

| Requirement | Details |
|-------------|---------|
| Minimum deployment target | iOS 16+ recommended (iOS 15 is approaching end of practical support) |
| Required device capabilities | Declared in Info.plist; only list what the app truly requires |
| Bitcode | Removed in Xcode 14+; do not include |
| Entitlements | Must match Xcode capabilities (push notifications, iCloud, HealthKit, etc.) |
| Provisioning profiles | Valid distribution profile; not expired; correct team and bundle ID |
| Code signing | Automatic or manual; must use distribution certificate (not development) |
| Archive validation | Run `xcodebuild -exportArchive` with `method=app-store` and verify no errors |

---

### Play Store (Android)

#### Assets

| Asset | Requirement | Notes |
|-------|-------------|-------|
| App Icon | 512x512 PNG, 32-bit with alpha | Used in Play Store listing and search results |
| Feature Graphic | 1024x500 PNG or JPG | Displayed prominently in store listing; no text in margins |
| Screenshots (Phone) | Min 2, max 8; 16:9 or 9:16; min 320px, max 3840px on any side | Required for all apps |
| Screenshots (7" Tablet) | Min 2, max 8 | Required if app supports 7" tablets |
| Screenshots (10" Tablet) | Min 2, max 8 | Required if app supports 10" tablets |
| Screenshots (Chromebook) | Min 2, max 8 | Recommended if app supports ChromeOS |
| Promo Video | YouTube URL, landscape, 30s-2min recommended | Optional; auto-plays in listing if provided |

#### Data Safety Section

| Declaration | Details |
|-------------|---------|
| Data types collected | List every type: name, email, address, phone, payment info, location, photos, files, health, fitness, messages, search history, browsing history, app activity, crash logs, diagnostics |
| Data shared with third parties | Disclose ALL third-party recipients (analytics, advertising, crash reporting SDKs) |
| Encryption in transit | Confirm HTTPS/TLS for all network communication |
| Data deletion mechanism | Provide in-app deletion or web form URL; Google may verify |
| Privacy policy URL | Required for all apps; must be publicly accessible |
| Independent security review | Optional but recommended for apps handling sensitive data |

#### Store Listing Metadata

| Field | Limit | Notes |
|-------|-------|-------|
| Title | 30 characters | Concise and descriptive; no keyword stuffing |
| Short Description | 80 characters | Appears in search results and feature cards |
| Full Description | 4,000 characters | Supports basic formatting; lead with key features |
| Category | 1 selection | Must accurately reflect app purpose |
| IARC Content Rating | Questionnaire-based | International Age Rating Coalition; answer all questions accurately |
| Target Audience | Declare age groups | If targeting under 13: families policy applies |
| Content Declaration | Ads, government app, news | Must declare if app contains ads |
| Ads Declaration | Required | Must declare whether app contains ads, even if only from third-party SDKs |

#### APK/AAB Technical Requirements

| Requirement | Details |
|-------------|---------|
| Target SDK API Level | API 34+ (Android 14) required for new apps and updates as of 2024 |
| 64-bit native libraries | Mandatory; `arm64-v8a` and optionally `x86_64` |
| AAB format | Android App Bundle required (APK uploads no longer accepted for new apps) |
| R8/ProGuard | Enable minification and obfuscation for release builds |
| App signing | Google Play App Signing required; upload key signs the upload, Google signs the release |
| Version code | Must increment with every upload; `versionCode` in `build.gradle` |

#### Permissions Compliance

| Permission | Category | Requirement |
|------------|----------|-------------|
| `CAMERA` | Dangerous | Runtime request; explain why before prompt |
| `ACCESS_FINE_LOCATION` | Dangerous | Runtime request; must justify foreground and background separately |
| `ACCESS_BACKGROUND_LOCATION` | Dangerous | Requires separate runtime prompt AFTER foreground location granted; must be essential to app function |
| `READ_CONTACTS` | Dangerous | Runtime request; explain benefit to user |
| `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` | Dangerous (Android 13+) | Granular media permissions; prefer photo picker for simple selection |
| `QUERY_ALL_PACKAGES` | Special | Requires justification in Play Console; most apps should use specific `<queries>` instead |
| `POST_NOTIFICATIONS` | Dangerous (Android 13+) | Runtime request required; app must work without it |
| `FOREGROUND_SERVICE` | Normal | Must declare `foregroundServiceType` in manifest with justification |
| `SCHEDULE_EXACT_ALARM` | Special | Android 12+; must justify; prefer `setAndAllowWhileIdle` if possible |

**Rules:**
- Only declare permissions actually used in code
- Remove unused permissions from merged manifest (use `tools:node="remove"`)
- Provide pre-prompt rationale UI before showing system permission dialog
- Handle denial gracefully (app must not crash or become unusable)

#### Content Policy Compliance

| Policy | Check |
|--------|-------|
| Deceptive behavior | No dark patterns, no misleading UI elements, no fake system notifications |
| Impersonation | App must not mimic other apps or system UI deceptively |
| Placeholder content | No "lorem ipsum", "test data", "TODO" in user-visible text |
| Misleading ads | Ads must be clearly distinguishable from app content |
| Families policy | If targeting children: no behavioral advertising, COPPA-compliant data handling, teacher-approved content |
| Financial services | If providing financial features: comply with regional regulations, include required disclaimers |
| Health claims | Health-related apps must include appropriate disclaimers and not make unsupported medical claims |

#### Android 14+ Technical Requirements

| Feature | Requirement | Details |
|---------|-------------|---------|
| Predictive back gesture | Support required | Use `OnBackPressedCallback`, not `onBackPressed()` override |
| Edge-to-edge display | Android 15+ enforces | Use `enableEdgeToEdge()` in Activity; handle system bar insets |
| Photo picker | Preferred for media | Use `PickVisualMedia` contract instead of direct file access permissions |
| Foreground service types | Declared in manifest | `dataSync`, `location`, `mediaPlayback`, etc. with justification |
| Notification permission | Runtime request | Android 13+; `POST_NOTIFICATIONS` is a dangerous permission |
| Per-app language | Support recommended | Use `LocaleManager` for in-app language switching |

---

### Common Rejection Reasons Reference

A curated list of the most frequent rejection reasons with their guideline numbers and fix strategies. Use this as a quick-reference during pre-submission review.

#### Apple App Store Top Rejection Reasons (2024-2025)

| Rank | Guideline | Rejection Reason | Fix Strategy |
|------|-----------|-----------------|--------------|
| 1 | 2.1 | App Completeness -- placeholder content, broken features, incomplete UI | Complete all features; remove unfinished sections; test every screen and flow |
| 2 | 4.0 | Design -- non-standard UI, poor iPad support, ignoring iOS conventions | Follow HIG; support all declared device sizes; use native navigation patterns |
| 3 | 2.3.3 | Accurate Screenshots -- screenshots do not match actual app UI | Regenerate screenshots from current build; no marketing renders that misrepresent |
| 4 | 5.1.1 | Data Collection and Storage -- missing privacy descriptions or nutrition labels | Audit all APIs and SDKs; complete all privacy declarations before submission |
| 5 | 4.2 | Minimum Functionality -- app is too simple, website wrapper, or limited utility | Add native value: offline support, notifications, device features, haptic feedback |
| 6 | 3.1.1 | In-App Purchase Required -- digital goods sold outside Apple IAP | Use StoreKit for ALL digital goods/services; physical goods can use external payment |
| 7 | 2.5.1 | Software Requirements -- use of private APIs or deprecated frameworks | Run Apple static analysis; remove any private API calls; update deprecated APIs |
| 8 | 5.1.2 | Data Use and Sharing -- actual data practices don't match declarations | Audit third-party SDK data flows; update nutrition labels to match reality |
| 9 | 4.8 | Sign in with Apple -- missing when third-party login is present | Add Sign in with Apple button alongside Google/Facebook/email login options |
| 10 | 2.1 | Performance -- crashes on launch, slow performance, excessive resource usage | Test on oldest supported device; fix all crashes; optimize launch time |

#### Google Play Store Top Rejection Reasons (2024-2025)

| Rank | Policy | Rejection Reason | Fix Strategy |
|------|--------|-----------------|--------------|
| 1 | Data Safety | Inaccurate or incomplete data safety declarations | Audit all SDKs; declare all collected data types; verify encryption claims |
| 2 | Deceptive Behavior | Misleading UI, fake system dialogs, deceptive ads | Remove dark patterns; clearly distinguish ads from content; no fake alerts |
| 3 | Target API Level | Target SDK below current year requirement (API 34+) | Update `targetSdkVersion` in `build.gradle`; address all behavior changes |
| 4 | Families Policy | Targeting children without COPPA compliance | Complete families policy declaration; remove behavioral ads; verify content |
| 5 | Permissions | Requesting unnecessary permissions or QUERY_ALL_PACKAGES without justification | Remove unused permissions; use specific `<queries>` instead of broad access |
| 6 | Content Rating | Missing or inaccurate IARC questionnaire responses | Complete rating questionnaire honestly; update when content changes |
| 7 | App Functionality | Crashes, ANRs, or broken features on target devices | Test on range of devices via Firebase Test Lab; fix all crash paths |
| 8 | Metadata | Keyword stuffing, misleading descriptions, or excessive special characters | Write natural descriptions; avoid emoji spam; accurately describe features |
| 9 | Ad Policy | Interstitial ads at app launch or on exit; ads interfering with app function | Defer first ad impression; never show ads during critical flows; respect back button |
| 10 | Impersonation | App name/icon too similar to established apps | Use original branding; check trademark databases; differentiate clearly |

---

### CI/CD Integration Templates

Automated store submission checks integrated into common mobile CI/CD systems.

#### Fastlane (iOS) Pre-Submission Lane

```ruby
# Fastfile -- pre-submission lane
lane :pre_submit_check do
  # Verify screenshots exist for all required sizes
  screenshots_dir = "./fastlane/screenshots"
  required_sizes = ["6.7", "6.5", "5.5", "iPad"]
  required_sizes.each do |size|
    dir = File.join(screenshots_dir, size)
    UI.user_error!("Missing screenshots for #{size} inch") unless File.directory?(dir)
    count = Dir[File.join(dir, "*.png")].length
    UI.user_error!("Need 3+ screenshots for #{size}, found #{count}") if count < 3
  end

  # Check for placeholder content
  placeholder_patterns = ["lorem ipsum", "TODO", "FIXME", "coming soon", "placeholder"]
  placeholder_patterns.each do |pattern|
    matches = sh("grep -ri '#{pattern}' ../src/ || true").strip
    UI.user_error!("Found placeholder: #{pattern}") unless matches.empty?
  end

  # Verify no debug code
  debug_patterns = ["console.log", "localhost", "127.0.0.1", "debugMode"]
  debug_patterns.each do |pattern|
    matches = sh("grep -rn '#{pattern}' ../src/ || true").strip
    UI.important("Warning: Found debug marker '#{pattern}'") unless matches.empty?
  end

  # Check bundle size
  ipa_path = lane_context[SharedValues::IPA_OUTPUT_PATH]
  if ipa_path && File.exist?(ipa_path)
    size_mb = File.size(ipa_path) / (1024.0 * 1024.0)
    UI.user_error!("IPA size #{size_mb.round(1)}MB exceeds 200MB limit") if size_mb > 200
  end

  UI.success("Pre-submission checks passed!")
end
```

#### EAS Submit Pre-Check Script (Expo)

```typescript
// scripts/pre-submit-check.ts
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  details: string;
}

const results: CheckResult[] = [];

// Check 1: App icon exists
const iconPath = path.resolve('assets/icon.png');
if (fs.existsSync(iconPath)) {
  results.push({ name: 'App Icon', status: 'PASS', details: 'Found at assets/icon.png' });
} else {
  results.push({ name: 'App Icon', status: 'FAIL', details: 'Missing assets/icon.png' });
}

// Check 2: No placeholder content
const srcDir = path.resolve('src');
const placeholders = ['lorem ipsum', 'TODO', 'coming soon', 'placeholder'];
for (const pattern of placeholders) {
  try {
    const output = execFileSync(
      'grep', ['-ri', pattern, srcDir, '--include=*.tsx', '--include=*.ts', '-l'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    if (output) {
      results.push({
        name: `Placeholder: "${pattern}"`,
        status: 'FAIL',
        details: `Found in: ${output.split('\n').join(', ')}`,
      });
    }
  } catch {
    results.push({ name: `Placeholder: "${pattern}"`, status: 'PASS', details: 'Not found' });
  }
}

// Check 3: No console.log outside __DEV__
try {
  const logs = execFileSync(
    'grep', ['-rn', 'console\\.log', srcDir, '--include=*.ts', '--include=*.tsx'],
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
  ).trim();
  const unguarded = logs.split('\n').filter(line => !line.includes('__DEV__'));
  if (unguarded.length > 0) {
    results.push({
      name: 'console.log in production',
      status: 'FAIL',
      details: `${unguarded.length} unguarded console.log statements`,
    });
  }
} catch {
  results.push({ name: 'console.log check', status: 'PASS', details: 'None found' });
}

// Output report
const failures = results.filter(r => r.status === 'FAIL');
console.log(`\nPre-Submit Check: ${failures.length === 0 ? 'READY' : 'NOT READY'}`);
console.log(`${results.length} checks run, ${failures.length} failures\n`);
results.forEach(r => console.log(`[${r.status}] ${r.name}: ${r.details}`));

if (failures.length > 0) process.exit(1);
```

#### Gradle Pre-Submission Task (Android)

```kotlin
// build.gradle.kts -- custom pre-submission task
tasks.register("preSubmitCheck") {
    group = "verification"
    description = "Run store submission pre-flight checks"

    doLast {
        // Check target SDK
        val targetSdk = android.defaultConfig.targetSdk
        require(targetSdk != null && targetSdk >= 34) {
            "Target SDK must be >= 34, found: $targetSdk"
        }
        println("[PASS] Target SDK: $targetSdk")

        // Check 64-bit support
        val abiFilters = android.defaultConfig.ndk.abiFilters
        require(abiFilters.contains("arm64-v8a")) {
            "Must include arm64-v8a ABI filter for 64-bit support"
        }
        println("[PASS] 64-bit native libraries: arm64-v8a included")

        // Check minification enabled for release
        val releaseBuildType = android.buildTypes.findByName("release")
        require(releaseBuildType?.isMinifyEnabled == true) {
            "R8/ProGuard must be enabled for release builds"
        }
        println("[PASS] R8 minification enabled for release")

        println("\nPre-submission checks completed.")
    }
}
```

---

### Regional Compliance Requirements

Additional requirements when targeting specific regions or user demographics.

#### European Union (GDPR + Digital Markets Act)

| Requirement | Details |
|-------------|---------|
| Cookie/tracking consent | Must obtain explicit consent BEFORE any tracking (not just ATT on iOS) |
| Data portability | Users must be able to export their data in a machine-readable format |
| Right to erasure | Data deletion must be comprehensive and verifiable |
| Data Processing Agreement | Required with all third-party data processors (analytics, crash reporting, etc.) |
| DMA compliance (iOS) | Apple allows alternative payment methods in EU; must handle both IAP and external payments if offered |
| Age verification | Enhanced requirements for apps accessible to minors under GDPR-K |

#### United States (COPPA + State Privacy Laws)

| Requirement | Details |
|-------------|---------|
| COPPA (children under 13) | Verifiable parental consent before collecting personal information; no behavioral advertising |
| CCPA (California) | "Do Not Sell" mechanism for California users; privacy notice with data categories |
| VCDPA (Virginia) | Similar to CCPA; right to opt out of targeted advertising and profiling |
| Age-gating | If app is NOT for children but may attract them, implement age-gating at entry |

#### Asia-Pacific

| Region | Requirement |
|--------|-------------|
| China | Requires ICP license; separate App Store (no Google Play); must use Chinese CDN; real-name verification for certain app categories |
| Japan | APPI compliance; Act on Specified Commercial Transactions for e-commerce; specific age rating system (CERO) for games |
| South Korea | Game Rating and Administration Committee rating for games; personal information protection (PIPA); real-name authentication for social features |
| India | Digital Personal Data Protection Act 2023; localized payment options (UPI); compliance with IT Rules for social media intermediaries |
| Australia | Privacy Act compliance; Consumer Data Right (CDR) for financial apps; Children Online Privacy Code of Practice |

#### Accessibility Compliance

| Standard | Requirement | Impact on Submission |
|----------|-------------|---------------------|
| WCAG 2.1 AA | Recommended baseline for all apps | Apple reviews accessibility; VoiceOver support expected |
| iOS Accessibility | VoiceOver labels, Dynamic Type support, sufficient color contrast | Missing VoiceOver labels may trigger App Review feedback |
| Android Accessibility | TalkBack support, content descriptions, touch target sizes (48dp min) | Google Play pre-launch report checks accessibility |
| Section 508 | Required for US government contracts | If targeting government: full compliance mandatory |
| EU Accessibility Act | Mandatory for apps serving EU customers from June 2025 | Must meet EN 301 549 standard (maps to WCAG 2.1 AA) |

---

### Cross-Platform Checks (React Native / Expo / Flutter)

These checks apply to all cross-platform frameworks that produce both iOS and Android builds from a single codebase.

#### Asset Parity

| Check | iOS | Android |
|-------|-----|---------|
| App icon | 1024x1024 no alpha | 512x512 with alpha |
| Screenshots | 6.7", 6.5", 5.5", 12.9" iPad | Phone, 7" tablet, 10" tablet |
| Feature graphic | N/A | 1024x500 required |
| Splash/launch screen | LaunchScreen storyboard | Splash screen API (Android 12+) or `react-native-splash-screen` |

#### Privacy Parity

| Check | Details |
|-------|---------|
| Permission descriptions match | iOS Info.plist descriptions and Android manifest permissions must cover the same APIs |
| Data collection matches | Apple nutrition labels and Google data safety must declare the same data types |
| Privacy policy | Single URL works for both, but must cover platform-specific behaviors |
| Third-party SDK data | Same SDKs used on both platforms; declarations must be consistent |

#### Deep Linking

| Platform | Mechanism | Configuration |
|----------|-----------|---------------|
| iOS | Universal Links | `apple-app-site-association` file on web domain + `Associated Domains` entitlement |
| Android | App Links | `assetlinks.json` on web domain + `<intent-filter>` with `autoVerify="true"` |
| Verification | Both platforms | Host the verification files on your domain; test with `adb shell am start` and `xcrun simctl openurl` |

#### Push Notifications

| Platform | Service | Configuration |
|----------|---------|---------------|
| iOS | APNs | APNs key (.p8) uploaded to push provider (Firebase, Expo, OneSignal) |
| Android | FCM | `google-services.json` in project; FCM server key in push provider |
| Expo | Expo Push | `expo-notifications` config plugin; both APNs + FCM keys in EAS dashboard |
| Flutter | Firebase | `GoogleService-Info.plist` (iOS) + `google-services.json` (Android) |

#### Production Build Hygiene

| Check | How to Verify |
|-------|---------------|
| No `console.log` | Grep for `console.log`, `console.warn`, `console.error` outside `__DEV__` guards |
| No debug flags | Check for `__DEV__`, `DEBUG`, `isDebug`, `debugMode` in production paths |
| No dev server URLs | Grep for `localhost`, `127.0.0.1`, `10.0.2.2` in source files |
| No test credentials | Search for `test@`, `password123`, `demo_key`, hardcoded API keys |
| Source maps excluded | Verify `.map` files not included in production bundle |
| ProGuard/R8 enabled | Android `build.gradle` has `minifyEnabled true` for release |

#### Bundle Size Limits

| Platform | Limit | Reason |
|----------|-------|--------|
| iOS OTA download | < 200MB | Apple cellular download limit; users on cellular cannot download larger apps without WiFi |
| Android AAB | < 150MB | Play Store AAB limit; use Play Asset Delivery for additional assets |
| RN JS bundle | < 5MB | Large JS bundles slow cold start and OTA updates |
| Expo OTA update | < 50MB | expo-updates downloads on app launch; large updates degrade UX |
| Flutter Dart AOT | < 15MB per platform | Typical range; investigate if significantly larger |

#### App ID Registration

| Platform | Identifier | Where |
|----------|-----------|-------|
| iOS | Bundle ID (e.g., `com.company.appname`) | Apple Developer Portal -> Identifiers |
| Android | Application ID (e.g., `com.company.appname`) | `build.gradle` -> `applicationId` |
| Match | Both should use the same reverse-domain identifier | Reduces confusion for users and deep linking |

---

### Output Format

The store submission check produces `audit/STORE-SUBMISSION-REPORT.md`:

```markdown
# Store Submission Report -- [YYYY-MM-DD]

## Overall: READY / NOT READY (N issues found)

### App Store (iOS)
| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | App Icon (1024x1024, no alpha) | PASS | icons/AppIcon.png verified |
| 2 | Screenshots (6.7") | FAIL | Missing -- 0 of 3 minimum found |
| 3 | Privacy descriptions | PASS | 4/4 used APIs have descriptions |
| 4 | No placeholder content | PASS | No matches found |
| 5 | App Review credentials | WARN | Auth detected but no test account in notes |
...

### Play Store (Android)
| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | App Icon (512x512) | PASS | assets/icon.png verified |
| 2 | Feature Graphic (1024x500) | FAIL | Missing |
| 3 | Target SDK API 34+ | PASS | targetSdkVersion = 34 |
| 4 | AAB format | PASS | build output is .aab |
| 5 | Data safety section | WARN | 2 SDKs not declared |
...

### Cross-Platform
| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | Privacy parity | PASS | iOS and Android declarations match |
| 2 | Deep linking | FAIL | Android assetlinks.json not found |
| 3 | Bundle size (iOS) | PASS | 87MB < 200MB limit |
| 4 | Bundle size (Android) | PASS | 62MB < 150MB limit |
| 5 | No debug code | FAIL | 3 console.log found outside __DEV__ |
...

## Fix Instructions
1. **Screenshots (6.7"):** Generate screenshots at 1290x2796px for iPhone 15 Pro Max. Use Xcode Simulator > File > Save Screen or a tool like Fastlane Screengrab.
2. **Feature Graphic:** Create a 1024x500 marketing image. Use the app's primary color with a centered device mockup.
3. **Deep linking (Android):** Add `assetlinks.json` to `/.well-known/` on your domain. See [Android App Links docs].
4. **Debug code:** Remove or guard the following:
   - `src/utils/api.ts:47` -- `console.log("response", data)`
   - `src/screens/Home.tsx:12` -- `console.log("mounted")`
   - `src/services/auth.ts:89` -- `console.log("token", token)`
```

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface`, `text` | App icon and screenshots should reflect the app's DNA color palette |
| `primary`, `accent` | Feature graphic and store listing screenshots use primary brand colors |
| `display-font` | Screenshots with text overlays use the DNA display font for brand consistency |
| `signature-element` | Feature graphic should incorporate the app's signature visual element |

### Archetype Variants

Store submission checks are largely archetype-independent (compliance is compliance), but visual assets benefit from archetype awareness:

| Archetype | Screenshot & Asset Adaptation |
|-----------|-------------------------------|
| Luxury/Fashion | Screenshots emphasize whitespace and premium feel; feature graphic is minimal with generous margins |
| Playful/Startup | Screenshots use vibrant DNA colors; feature graphic is energetic with playful illustrations |
| Dark Academia | Screenshots feature dark mode prominently; feature graphic uses muted, scholarly tones |
| Neon Noir | Screenshots showcase dark theme with glow effects; ensure text remains legible at small sizes |
| Swiss/International | Screenshots are grid-aligned and typographically clean; feature graphic uses structured composition |
| Any archetype | All must pass the same compliance checks -- visual style does not exempt from guidelines |

### Pipeline Stage

- **Input from:** Completed build waves (all sections implemented), finalized assets from `image-asset-pipeline` skill
- **Output to:** `audit/STORE-SUBMISSION-REPORT.md` consumed by the reviewer agent; READY/NOT READY status gates the release
- **Timing:** Runs as final validation step after all build waves complete and before marking project as shippable

### Related Skills

- `mobile-expo` -- Expo-specific EAS Submit integration; this skill validates what EAS Submit will upload
- `mobile-react-native` -- Bare RN builds; this skill checks the final output artifacts
- `mobile-swift` -- iOS-specific patterns; this skill validates the App Store packaging
- `mobile-kotlin` -- Android-specific patterns; this skill validates the Play Store packaging
- `mobile-flutter` -- Flutter builds; this skill validates both platform outputs
- `image-asset-pipeline` -- Generates and optimizes the icons, screenshots, and feature graphics this skill validates
- `accessibility` -- Accessibility compliance overlaps with store requirements (VoiceOver, TalkBack support)
- `mobile-performance` -- Performance issues can cause store rejection (crashes, ANRs, excessive battery drain)

## Layer 4: Anti-Patterns

### Anti-Pattern: Submitting with Placeholder Content

**What goes wrong:** App contains "lorem ipsum", "test", "TODO", "coming soon", or "placeholder" text in user-visible screens. Apple rejects under Guideline 2.1 (App Completeness) and Google rejects under content policy. This is the single most common rejection reason for first-time submissions.
**Instead:** Run `grep -ri "lorem\|TODO\|coming soon\|placeholder\|test data" src/` before every submission. Replace all placeholder text with real content or remove the feature entirely. If a feature is genuinely "coming soon", remove it from the UI and add it in a future update.

### Anti-Pattern: Missing or Generic Privacy Descriptions

**What goes wrong:** Info.plist contains privacy keys with vague descriptions like "This app needs camera access" or worse, missing descriptions entirely. Apple rejects for insufficiently descriptive usage strings, and users deny permissions when descriptions do not explain the benefit.
**Instead:** Write descriptions from the user's perspective explaining the specific benefit: "Take a photo of your receipt to automatically log expenses" rather than "Access your camera." Each description must be unique to your app's actual use case. Test by asking: would a user understand WHY they should grant this permission?

### Anti-Pattern: Wrong Screenshot Dimensions

**What goes wrong:** Screenshots uploaded at incorrect dimensions (e.g., using iPhone 14 Pro dimensions for the 6.7" slot) or using old device sizes that are no longer accepted. App Store Connect silently rejects or misplaces them, and the listing looks broken.
**Instead:** Use the exact pixel dimensions from Apple's current specification. Generate screenshots using Xcode Simulator at the correct device size, or use Fastlane Snapshot with explicit device declarations. Always verify screenshots render correctly in App Store Connect preview before submitting for review.

### Anti-Pattern: Debug Code in Production Builds

**What goes wrong:** `console.log` statements, hardcoded `localhost` URLs, test API keys, or `__DEV__` flags leak into production builds. At best this is a performance issue; at worst it exposes credentials, breaks API calls in production, or causes crashes when dev servers are unreachable.
**Instead:** Add a pre-build script that greps for debug markers: `console.log`, `localhost`, `127.0.0.1`, `10.0.2.2`, `DEBUG`, `test_key`, `demo_password`. Use environment variable injection (`.env.production`) for all API endpoints and keys. Configure Babel plugin (`transform-remove-console`) or ProGuard rules to strip console statements from release builds.

### Anti-Pattern: Privacy Declaration Mismatch

**What goes wrong:** App uses Firebase Analytics, Sentry crash reporting, and Facebook SDK, but privacy nutrition labels (iOS) and data safety section (Android) only declare first-party data collection. Apple and Google increasingly audit these declarations against actual binary contents and reject for discrepancies.
**Instead:** Audit every third-party SDK's data collection documentation. Create a spreadsheet mapping SDK -> data types collected -> linked to identity? -> used for tracking? -> shared with third parties?. Update both Apple nutrition labels and Google data safety from this single source of truth whenever dependencies change.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| iOS app icon width | 1024 | 1024 | px | HARD -- reject if not exact |
| iOS app icon height | 1024 | 1024 | px | HARD -- reject if not exact |
| iOS app icon alpha channel | -- | 0 | boolean | HARD -- reject if alpha present |
| Android app icon width | 512 | 512 | px | HARD -- reject if not exact |
| Android app icon height | 512 | 512 | px | HARD -- reject if not exact |
| Android feature graphic width | 1024 | 1024 | px | HARD -- reject if not exact |
| Android feature graphic height | 500 | 500 | px | HARD -- reject if not exact |
| iOS OTA bundle size | 0 | 200 | MB | HARD -- cellular download blocked above limit |
| Android AAB size | 0 | 150 | MB | HARD -- Play Store rejects above limit |
| RN JS bundle size | 0 | 5 | MB | SOFT -- warn if above; impacts cold start |
| App name length | 1 | 30 | chars | HARD -- store rejects above limit |
| iOS subtitle length | 0 | 30 | chars | HARD -- store rejects above limit |
| iOS keywords length | 0 | 100 | chars | HARD -- store rejects above limit |
| Description length | 0 | 4000 | chars | HARD -- store rejects above limit |
| Android short description length | 0 | 80 | chars | HARD -- store rejects above limit |
| Android target SDK | 34 | -- | API level | HARD -- Play Store rejects below minimum |
| Placeholder content count | 0 | 0 | occurrences | HARD -- reject if any found |
| Debug code markers | 0 | 0 | occurrences | HARD -- reject if any found in production |
| Screenshots per device (iOS) | 3 | 10 | count | HARD -- store rejects outside range |
| Screenshots per device (Android) | 2 | 8 | count | HARD -- store rejects outside range |
