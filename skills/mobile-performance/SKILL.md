---
name: "mobile-performance"
description: "Mobile app performance suite. Build-time analysis, per-framework anti-pattern detection, runtime profiling guidance, and automated audit checks."
tier: "domain"
triggers: "mobile performance, app performance, app size, frame rate, launch time, mobile optimization, jank"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a mobile performance specialist. Mobile apps live under harsher constraints than web -- limited memory, battery budgets, thermal throttling, variable network conditions, and users who uninstall after a single janky scroll. This skill enforces performance budgets at build time, detects per-framework anti-patterns through static analysis, provides runtime profiling guidance with tool configurations, and integrates automated checks into the audit pipeline. Every pattern is framework-aware: what causes jank in SwiftUI is different from what causes jank in Jetpack Compose, React Native, or Flutter.

### When to Use

- **Every mobile project** -- Performance budgets should be established at project start and enforced throughout development
- **Before store submission** -- Performance issues (crashes, ANRs, excessive battery drain) are top rejection reasons
- **When users report "the app feels slow"** -- This skill provides systematic diagnosis rather than guesswork
- **During code review** -- Static anti-pattern detection catches performance regressions before they reach users
- **After adding new dependencies** -- Each dependency adds to bundle size and potentially to startup time
- **When targeting low-end devices** -- Budget constraints become critical on devices with 2-3GB RAM and older processors

### When NOT to Use

- Web-only projects -- use `performance-patterns` and `performance-guardian` instead
- Desktop apps (Electron/Tauri) -- different performance characteristics; use `desktop-patterns` instead
- Early prototyping phase where iteration speed matters more than optimization -- but DO set budgets early
- Performance issues that are actually server-side (slow API responses) -- diagnose backend first

### Performance Budget Philosophy

Set budgets early, enforce continuously, and tighten over time. A budget violation in CI is cheaper than a 1-star review.

**Budget tiers by project stage:**

| Stage | App Launch | Frame Rate | Memory (idle) | Bundle Size | Tolerance |
|-------|-----------|------------|---------------|-------------|-----------|
| MVP / Prototype | < 2s | 30fps | < 200MB | < 100MB | Lenient |
| Beta / TestFlight | < 1s | 60fps | < 150MB | < 80MB | Moderate |
| Production | < 500ms | 60fps (90fps on ProMotion/120Hz) | < 100MB | Framework-specific | Strict |
| Post-launch | < 400ms | Sustained 60fps under load | < 80MB | Shrinking trend | Zero tolerance |

### Decision Tree

- If bundle size exceeds budget -> analyze dependencies, remove unused code, enable tree-shaking
- If cold start exceeds budget -> defer non-critical initialization, lazy-load screens, reduce main-thread work
- If frame rate drops below 60fps -> profile with platform tools, check for main-thread blocking, optimize render paths
- If memory exceeds budget -> check for leaks (Instruments/Profiler), reduce image cache sizes, release unused resources
- If battery drain reported -> profile energy usage, reduce background activity, batch network requests
- If jank during scrolling -> check list virtualization, image loading strategy, reduce layout complexity

### Pipeline Connection

- **Referenced by:** builder during implementation waves, reviewer during `/modulo:iterate`
- **Consumed at:** `/modulo:execute` (performance checks run per wave), audit phase (automated checks)
- **Quality gate:** Performance violations incur -2 (SOFT budget) or -3 (HARD budget) penalties in Anti-Slop Gate scoring

## Layer 2: Performance Analysis Layers

### Build-Time Analysis

Static checks that run against built artifacts without executing the app. These catch size and dependency issues before runtime.

#### Bundle Size Budgets

| Check | Budget | Framework | How to Measure |
|-------|--------|-----------|----------------|
| iOS binary size | < 200MB | Swift, RN, Expo, Flutter | `xcodebuild -archivePath` then check `.ipa` size; or `du -sh` on `.app` bundle |
| Android AAB size | < 150MB | Kotlin, RN, Expo, Flutter | `bundletool get-size total --apks=app.apks` for download size estimate |
| RN JS bundle | < 5MB | React Native, Expo | `npx react-native bundle --dev false` then `du -sh` on output; or `expo export` |
| Flutter Dart AOT | < 15MB per platform | Flutter | `flutter build apk --analyze-size` or `flutter build ios --analyze-size` |
| Asset total | < 50MB | All | `du -sh assets/` or equivalent; sum all images, fonts, videos, JSON data |
| Unused dependencies | 0 | All | `depcheck` (RN), `pub outdated` (Flutter), Xcode build warnings, Gradle lint |

#### Dependency Audit Commands

```bash
# React Native / Expo
npx depcheck                          # Find unused dependencies
npm audit --production                # Security + bloat check
npx react-native-bundle-visualizer   # Treemap of JS bundle contents

# Flutter
flutter pub outdated                  # Outdated packages
dart pub deps --no-dev                # Dependency tree without dev deps
flutter build apk --analyze-size     # Size breakdown by package

# iOS (Swift)
xcodebuild -showBuildSettings | grep PRODUCT_BUNDLE_IDENTIFIER
# Use Xcode Organizer > App Size for download/install size estimates

# Android (Kotlin)
./gradlew app:dependencies --configuration releaseRuntimeClasspath
./gradlew lint                        # Lint includes unused resource detection
```

#### Asset Size Audit

| Asset Type | Warning Threshold | Action |
|------------|------------------|--------|
| Individual image | > 500KB | Compress with TinyPNG, convert to WebP, or use vector (SVG/PDF) |
| Individual video | > 5MB | Compress, reduce resolution, or stream from CDN instead of bundling |
| Font file | > 200KB | Subset to used glyphs only; use variable fonts to replace multiple weights |
| JSON data | > 1MB | Paginate, compress, or load from API instead of bundling |
| Unused assets | Any size | Remove entirely; grep for references before deleting |
| Total assets | > 50MB | Audit each category above; consider on-demand download for non-essential assets |

---

### Code Pattern Enforcement

Per-framework static analysis patterns. Each anti-pattern includes what to grep for, why it matters, and the correct alternative.

#### Swift Anti-Patterns

| # | Anti-Pattern | Detection | Impact | Fix |
|---|-------------|-----------|--------|-----|
| 1 | View body > 50 lines | Count lines in `var body: some View` blocks | Excessive recomputation on state changes; slow previews | Extract subviews into separate `struct`s with focused `body` implementations |
| 2 | Synchronous I/O on main thread | Grep for `URLSession.shared.data` or `FileManager` reads outside `Task {}` | UI freezes during network/file operations; watchdog kills after 10s | Use `async/await` with `Task { }` or `Task.detached` for all I/O |
| 3 | Missing `@ViewBuilder` for conditional content | `if/else` chains in `body` without `@ViewBuilder` attribute | SwiftUI cannot optimize conditional view identity; causes unnecessary rebuilds | Add `@ViewBuilder` to computed properties and functions returning conditional views |
| 4 | `ScrollView` for 20+ items | `ScrollView { VStack { ForEach(items)` where items.count > 20 | All items rendered upfront; O(n) memory regardless of visibility | Use `LazyVStack` / `LazyHStack` inside `ScrollView`, or `List` for standard layouts |
| 5 | Excessive `@State` | More than 5 `@State` properties in a single view | Each `@State` change triggers full body re-evaluation | Prefer `@Observable` class (iOS 17+) or `@StateObject` with `ObservableObject` to group related state |
| 6 | Hardcoded colors | `Color.red`, `Color(hex: "#...")` instead of asset catalog colors | Cannot adapt to dark mode, DNA tokens, or accessibility settings | Use `Color("dna-primary")` from asset catalog or DNA-generated color extensions |
| 7 | No `withAnimation` wrapping | State changes that affect layout without animation blocks | Jarring jumps instead of smooth transitions; feels unpolished | Wrap state mutations in `withAnimation(.easeInOut(duration: 0.3)) { }` |
| 8 | Image loading without caching | `AsyncImage(url:)` without cache policy or placeholder | Re-downloads images on every appear; wastes bandwidth and causes flicker | Use `AsyncImage` with custom `URLCache` or third-party caching (Kingfisher, SDWebImage) |

#### Kotlin (Jetpack Compose) Anti-Patterns

| # | Anti-Pattern | Detection | Impact | Fix |
|---|-------------|-----------|--------|-----|
| 1 | Unstable lambda parameters | Inline lambdas in composable parameters (e.g., `onClick = { viewModel.doThing() }`) | Composable never skips recomposition because lambda identity changes every call | Use `remember { { viewModel.doThing() } }` or extract to a stable `val` |
| 2 | I/O on main thread | `Room`/`Retrofit` calls without `withContext(Dispatchers.IO)` | ANR if operation takes > 5s; janky UI for shorter operations | Wrap in `viewModelScope.launch { withContext(Dispatchers.IO) { ... } }` |
| 3 | Missing `remember` / `derivedStateOf` | Computed values recalculated every recomposition | Unnecessary CPU work on every frame; particularly bad in scrolling lists | Use `remember { derivedStateOf { ... } }` for values derived from state |
| 4 | `Column`/`Row` for 20+ items | `Column { items.forEach { Item(it) } }` with large collections | All items composed upfront; O(n) memory and composition time | Use `LazyColumn` / `LazyRow` with `items()` DSL |
| 5 | Non-skippable composables | Composable parameters include mutable types (`List`, `Map`, data classes with `var`) | Compose compiler cannot skip recomposition even when inputs unchanged | Use `@Immutable` or `@Stable` annotations; prefer `ImmutableList` from kotlinx-collections |
| 6 | Hardcoded dimensions | `Modifier.padding(16.dp)` instead of theme values | Cannot adapt to DNA spacing tokens or different screen densities | Use `MaterialTheme.spacing.md` or DNA-generated dimension tokens |
| 7 | Missing `key()` in `LazyColumn` | `items(list) { }` without stable keys | Item identity lost on list changes; causes unnecessary recomposition and animation glitches | Use `items(list, key = { it.id }) { }` with stable unique identifiers |
| 8 | Unoptimized image loading | `Image(painter = rememberAsyncImagePainter(url))` without size constraints | Full-resolution image decoded into memory; OOM on large images | Use Coil's `AsyncImage` with `contentScale` and explicit `size()` modifier |

#### React Native Anti-Patterns

| # | Anti-Pattern | Detection | Impact | Fix |
|---|-------------|-----------|--------|-----|
| 1 | Inline styles | `style={{ marginTop: 10, padding: 20 }}` in JSX | New object created every render; bypasses style deduplication | Use `StyleSheet.create()` at module scope; reference by `styles.container` |
| 2 | `ScrollView` for long lists | `<ScrollView>{items.map(item => <Item />)}</ScrollView>` with > 20 items | All items rendered upfront; O(n) memory; no virtualization | Use `FlatList` or `FlashList` (Shopify) with `keyExtractor` and `getItemLayout` |
| 3 | Missing memoization | Components re-render on every parent render without `React.memo` | Unnecessary JS thread work; cascading re-renders in deep trees | Wrap with `React.memo()`, use `useMemo` for expensive computations, `useCallback` for stable callbacks |
| 4 | Excessive bridge calls | > 50 bridge calls per second (legacy architecture) | Bridge serialization overhead causes frame drops | Batch operations; migrate to TurboModules (New Architecture) for synchronous native access |
| 5 | Large unoptimized images | `<Image source={{ uri }}` without resize mode or caching | Full-resolution decode; memory spikes on large images; re-downloads without cache | Use `expo-image` or `react-native-fast-image` with `cacheControl`, `resize`, and `priority` props |
| 6 | `console.log` in production | `console.log(...)` without `__DEV__` guard | Serialization overhead on every log; leaks data to system logs | Remove all console statements or wrap in `if (__DEV__)` guards; use `babel-plugin-transform-remove-console` |
| 7 | Uncontrolled re-renders | Context value changes causing full subtree re-render | State update in context provider triggers render of ALL consumers | Split contexts by update frequency; use `useSyncExternalStore` or state management (Zustand, Jotai) |
| 8 | Heavy computation on JS thread | Sorting/filtering large arrays synchronously in render path | JS thread blocked; frame drops and unresponsive touch handling | Move to `InteractionManager.runAfterInteractions()`, `requestAnimationFrame`, or native module |
| 9 | Missing `getItemLayout` | `FlatList` without `getItemLayout` prop | Cannot calculate scroll position without rendering; scroll-to-index fails | Provide `getItemLayout` for fixed-height items; dramatically improves scroll performance |

#### Expo-Specific Anti-Patterns

All React Native anti-patterns apply, plus:

| # | Anti-Pattern | Detection | Impact | Fix |
|---|-------------|-----------|--------|-----|
| 1 | Bare-only native modules | Native module without config plugin in managed workflow | Build failure on EAS Build; forces eject to bare workflow | Check Expo SDK compatibility; use config plugins (`withInfoPlist`, `withAndroidManifest`) or `expo-dev-client` |
| 2 | OTA updates > 50MB | `expo-updates` payload exceeds 50MB | Slow app launch while downloading update; users experience long splash screen | Code-split with lazy routes; load large assets from CDN via `expo-asset`; use `expo-updates` channels for gradual rollout |
| 3 | Missing `app.config.ts` types | `app.json` without TypeScript config or type checking | Configuration errors caught at build time instead of authoring time | Migrate to `app.config.ts` with `ExpoConfig` type import; enables autocomplete and compile-time validation |
| 4 | Synchronous font loading | Fonts loaded without `expo-splash-screen` keepalive | Flash of unstyled text (FOUT) on app launch; text renders in system font then jumps | Use `SplashScreen.preventAutoHideAsync()` + `useFonts()` hook + `SplashScreen.hideAsync()` after loaded |
| 5 | Unbounded asset preloading | `Asset.loadAsync()` for all assets at startup | Blocks app launch with large asset downloads; splash screen visible for seconds | Preload only critical above-the-fold assets; lazy-load remainder on demand |

#### Flutter Anti-Patterns

| # | Anti-Pattern | Detection | Impact | Fix |
|---|-------------|-----------|--------|-----|
| 1 | Missing `const` constructors | Widget instantiation without `const` keyword where possible | Widget not eligible for rebuild skipping; unnecessary rebuilds every frame | Add `const` to all stateless widget constructors and static widget trees; Dart analyzer warns |
| 2 | `setState` on large trees | `setState(() { })` in widget with deep subtree | Entire subtree rebuilt on every state change; O(n) rebuild cost | Use Riverpod `Consumer`/`ref.watch` with selectors; or `ValueNotifier` + `ValueListenableBuilder` for local state |
| 3 | `ListView` without builder | `ListView(children: items.map(...).toList())` with 20+ items | All children built upfront; no virtualization; O(n) memory | Use `ListView.builder(itemBuilder: ...)` for lazy construction; only visible items are built |
| 4 | No `CachedNetworkImage` | `Image.network(url)` for remote images | Re-downloads on every widget rebuild; no disk cache; placeholder flicker | Use `cached_network_image` package with `CachedNetworkImage(imageUrl: ...)` |
| 5 | Heavy computation on main isolate | Synchronous JSON parsing, sorting, or image processing in build/event handlers | Jank and frame drops; Dart is single-threaded by default | Use `Isolate.run()` (Dart 2.19+) or `compute()` for CPU-intensive work |
| 6 | Unbounded `RepaintBoundary` absence | Custom painting or animation without `RepaintBoundary` | Entire widget tree repaints when only custom-painted area changed | Wrap animated or custom-painted widgets in `RepaintBoundary` to isolate repaints |
| 7 | Shader compilation jank | First frame of animation stutters on release builds | Shader compilation happens on first use; causes visible jank ("shader warmup" issue) | Use `ShaderWarmUp` subclass in `main()` or pre-cache shaders with `FragmentProgram` |
| 8 | Excessive `MediaQuery` usage | `MediaQuery.of(context)` called in deeply nested widgets | Every `MediaQuery` listener rebuilds when keyboard appears/disappears or orientation changes | Use `MediaQuery.sizeOf(context)` or `MediaQuery.paddingOf(context)` for specific properties; reduces rebuild scope |

---

### Runtime Profiling Guidance

Framework-specific profiling tool setup and key metrics to monitor.

#### iOS (Xcode Instruments)

**Key Instruments profiles:**

| Profile | What It Measures | When to Use |
|---------|-----------------|-------------|
| Time Profiler | CPU usage by function, call stacks, thread distribution | App feels slow; high CPU usage; identifying hot functions |
| Allocations | Memory allocations, heap size, object lifetime | Memory warnings; growing memory over time; leak suspicion |
| Leaks | Retain cycles and leaked objects | Memory grows continuously; objects not deallocated |
| Energy Log | CPU, network, location, GPU energy impact | Battery drain reports; background energy usage |
| Core Animation | FPS, GPU utilization, offscreen rendering | Scrolling jank; animation stutter; dropped frames |
| Network | Request/response timing, payload sizes, concurrent connections | Slow data loading; excessive API calls |

**Performance budgets (iOS):**

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Cold launch to interactive | < 400ms | Time Profiler from `main()` to first `viewDidAppear` |
| Frame rate (sustained) | 60fps (120fps on ProMotion if opted in) | Core Animation instrument; green = 60fps |
| Memory (idle) | < 100MB | Allocations instrument; "All Heap & Anonymous VM" |
| Memory (peak) | < 250MB | Allocations instrument during heavy usage |
| CPU (idle) | < 5% | Time Profiler while app is idle on screen |
| CPU (scrolling) | < 30% | Time Profiler during continuous scroll |
| Disk writes | < 1MB/min idle | File Activity instrument |
| Network payload per session | < 10MB first launch; < 2MB subsequent | Network instrument |

#### Android (Android Studio Profiler)

**Profiler tabs:**

| Tab | What It Measures | When to Use |
|-----|-----------------|-------------|
| CPU | Method traces, flame charts, thread activity | ANRs; slow operations; identifying blocked threads |
| Memory | Heap dump, allocation tracking, GC events | Memory leaks; OOM crashes; GC pauses causing jank |
| Energy | CPU + network + location combined energy estimate | Battery drain; excessive wake locks; background work |
| Network | Request timeline, payload inspection | Slow loading; redundant API calls |

**Performance budgets (Android):**

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Cold start | < 500ms | `adb shell am start -W` reports `TotalTime` |
| Warm start | < 200ms | `adb shell am start -W` with app in recents |
| Frame rate | 90fps on 120Hz devices; 60fps on 60Hz | `adb shell dumpsys gfxinfo` or Profiler |
| Janky frames | < 5% of total frames | `adb shell dumpsys gfxinfo` "Janky frames" percentage |
| Memory (idle) | < 100MB RSS | Profiler memory tab; or `adb shell dumpsys meminfo <package>` |
| ANR rate | < 5 per 1,000 sessions | Play Console vitals |
| Crash rate | < 1% of sessions | Play Console vitals |
| Battery (background) | < 0.5% per hour | Energy profiler; or user-reported Settings > Battery |

#### React Native (Flipper + Hermes Profiler)

**Tools:**

| Tool | Purpose | Setup |
|------|---------|-------|
| Flipper | All-in-one debugger: network, layout, databases, logs | `npx react-native start` with Flipper installed; or use built-in Dev Menu |
| React DevTools | Component tree, props, re-render highlighting | `npx react-devtools` in separate terminal |
| Hermes Profiler | JS execution profiling with flame charts | Dev Menu > Start/Stop Profiling; opens Chrome DevTools format |
| Performance Monitor | Real-time FPS, JS thread, UI thread frame rates | Dev Menu > Show Performance Monitor |

**Performance budgets (React Native):**

| Metric | Budget | Measurement |
|--------|--------|-------------|
| JS thread FPS | 60fps | Performance Monitor overlay |
| UI thread FPS | 60fps | Performance Monitor overlay |
| JS frame time | < 16ms | Hermes profiler flame chart |
| Bridge calls/s | < 50 (legacy arch) | Flipper bridge spy; New Architecture eliminates this |
| TTI (Time to Interactive) | < 1.5s | Custom timestamp from `AppRegistry.registerComponent` to first meaningful render |
| JS bundle parse | < 500ms | Hermes bytecode compilation eliminates parse; verify Hermes is enabled |
| RAM bundle | If > 30 screens | Use RAM bundles or Metro `lazy` requires for large apps |

#### Flutter (DevTools)

**Tools:**

| Tool | Purpose | Setup |
|------|---------|-------|
| Performance Overlay | Real-time UI/Raster thread frame times | `MaterialApp(showPerformanceOverlay: true)` or DevTools toggle |
| Timeline View | Frame-by-frame build/layout/paint breakdown | Flutter DevTools > Performance tab |
| Memory View | Dart heap, external allocations, GC events | Flutter DevTools > Memory tab |
| CPU Profiler | Function-level CPU time attribution | Flutter DevTools > CPU Profiler tab |
| Widget Inspector | Rebuild counts, widget tree depth, render object boundaries | Flutter DevTools > Inspector tab |

**Performance budgets (Flutter):**

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Frame build time | < 16ms (8ms for 120Hz) | Performance overlay; blue bar (UI thread) |
| Frame raster time | < 16ms (8ms for 120Hz) | Performance overlay; green bar (Raster thread) |
| App startup | < 500ms | `flutter run --trace-startup`; reports timeline JSON |
| Dart heap (idle) | < 50MB | Memory view in DevTools |
| Dart heap (peak) | < 150MB | Memory view during heavy usage |
| Shader compilation frames | 0 after warmup | Timeline view; look for "ShaderCompilation" events |
| Widget rebuild count | Minimize; use Inspector | Widget Inspector rebuild counts column |

---

### Automated Audit Checks

These checks run during `/modulo:iterate` audit phase without manual profiling. They catch the most common performance issues through static analysis and build artifact inspection.

#### Bundle Size Measurement

```bash
# React Native / Expo -- measure JS bundle
npx react-native bundle \
  --platform ios --dev false --entry-file index.js \
  --bundle-output /tmp/bundle.js --assets-dest /tmp/assets
du -sh /tmp/bundle.js  # Should be < 5MB

# Expo -- measure export size
npx expo export --platform ios
du -sh dist/  # Total output size

# Flutter -- size analysis
flutter build apk --analyze-size  # Generates size breakdown JSON
flutter build ios --analyze-size   # iOS equivalent

# Android -- AAB download size estimate
bundletool get-size total --apks=app.apks

# iOS -- archive and estimate
xcodebuild -exportArchive -archivePath build/App.xcarchive \
  -exportOptionsPlist ExportOptions.plist -exportPath build/export
du -sh build/export/*.ipa
```

#### Anti-Pattern Grep Commands

```bash
# React Native -- inline styles
grep -rn "style={{" src/ --include="*.tsx" --include="*.jsx" | wc -l

# React Native -- ScrollView misuse (potential, needs item count context)
grep -rn "ScrollView" src/ --include="*.tsx" --include="*.jsx"

# React Native -- console.log in production
grep -rn "console\.\(log\|warn\|error\|debug\|info\)" src/ \
  --include="*.ts" --include="*.tsx" | grep -v "__DEV__" | grep -v "test" | grep -v "spec"

# React Native -- dev server URLs
grep -rn "localhost\|127\.0\.0\.1\|10\.0\.2\.2" src/ \
  --include="*.ts" --include="*.tsx" --include="*.js"

# Flutter -- missing const
grep -rn "new [A-Z]" lib/ --include="*.dart"  # Dart 2+ doesn't need 'new', but missing const is separate

# Flutter -- ListView without builder
grep -rn "ListView(" lib/ --include="*.dart" | grep -v "ListView.builder\|ListView.separated\|ListView.custom"

# Swift -- ScrollView for lists
grep -rn "ScrollView" Sources/ --include="*.swift" | grep -v "Lazy"

# Kotlin -- Column/Row with forEach
grep -rn "Column\|Row" app/src/ --include="*.kt" | grep "forEach"

# All platforms -- unused large assets
find assets/ -size +500k -type f 2>/dev/null
find public/ -size +500k -type f 2>/dev/null
```

#### Dependency Audit

```bash
# React Native / Expo
npm audit --production --audit-level=moderate
npx depcheck --ignores="@types/*"

# Flutter
flutter pub outdated
dart pub deps --no-dev | head -50

# iOS (CocoaPods)
pod outdated 2>/dev/null || echo "No Podfile found"

# Android (Gradle)
./gradlew app:dependencies --configuration releaseRuntimeClasspath 2>/dev/null | head -50
```

---

### Baseline Profiles and Startup Optimization

Framework-specific techniques to optimize cold start and eliminate first-frame jank.

#### Android Baseline Profiles

Baseline Profiles pre-compile critical user paths (startup, main navigation) ahead of time, eliminating JIT compilation jank on first launch. Google reports 20-40% faster startup with proper baseline profiles.

```kotlin
// baselineprofile/src/main/java/StartupProfile.kt
@RunWith(AndroidJUnit4::class)
@LargeTest
class StartupProfile {
    @get:Rule
    val rule = BaselineProfileRule()

    @Test
    fun generateStartupProfile() {
        rule.collect(
            packageName = "com.company.app",
            maxIterations = 5,
            stableIterations = 3,
        ) {
            // Cold start
            pressHome()
            startActivityAndWait()

            // Critical user journey: main tabs
            device.findObject(By.text("Home")).click()
            device.waitForIdle()
            device.findObject(By.text("Search")).click()
            device.waitForIdle()
            device.findObject(By.text("Profile")).click()
            device.waitForIdle()
        }
    }
}
```

**Setup steps:**
1. Add `androidx.benchmark:benchmark-macro-junit4` to dependencies
2. Create `baselineprofile` module with profile generator tests
3. Run generator on a physical device or emulator (API 33+)
4. Output profile included in release AAB automatically
5. Verify with `adb shell dumpsys package dexopt | grep -A 2 <package>`

#### iOS Pre-Warming and Launch Optimization

```swift
// AppDelegate.swift -- optimized launch sequence
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // PHASE 1: Critical path only (< 100ms)
        // - Configure crash reporting (must be first)
        // - Set up core data stack (migration check)
        // - Initialize authentication state

        // PHASE 2: Deferred (after first frame)
        DispatchQueue.main.async {
            // - Analytics initialization
            // - Remote config fetch
            // - Push notification registration
            // - Non-critical SDK initialization
        }

        // PHASE 3: Background (after user interaction)
        DispatchQueue.global(qos: .utility).async {
            // - Prefetch data for secondary tabs
            // - Cache warming
            // - Database maintenance
        }

        return true
    }
}
```

#### React Native / Expo Startup Optimization

| Technique | Impact | Implementation |
|-----------|--------|----------------|
| Hermes bytecode | 30-50% faster startup | Enabled by default in Expo SDK 49+; verify `"hermes"` in `jsEngine` config |
| Inline requires | 20-30% faster TTI | `metro.config.js`: `transformer: { getTransformOptions: () => ({ inlineRequires: true }) }` |
| Lazy screen loading | Variable | Use `React.lazy()` + `Suspense` for non-initial screens |
| Splash screen hold | Perceived perf | Hold splash until first meaningful data loaded; `expo-splash-screen` |
| RAM bundles | Large apps only | For apps > 30 screens; splits JS bundle into loadable segments |

#### Flutter Startup Optimization

| Technique | Impact | Implementation |
|-----------|--------|----------------|
| Deferred components | 10-30% smaller initial | `flutter build appbundle --deferred-components`; load features on demand |
| Shader warmup | Eliminates first-frame jank | Custom `ShaderWarmUp` subclass; pre-compile critical animation shaders |
| Isolate pre-spawn | Faster background work | `Isolate.spawn()` during splash; ready when needed |
| Tree shake icons | 50-100KB saved | `flutter build --tree-shake-icons`; removes unused Material Icons |
| Profile-guided optimization | 5-15% faster | Generate profile on physical device; feed to AOT compiler |

---

### Device Testing Matrix

Performance characteristics vary dramatically across devices. Test on a representative set spanning the performance spectrum.

#### Recommended Test Devices

| Tier | iOS | Android | Why |
|------|-----|---------|-----|
| Flagship (ceiling) | iPhone 15 Pro Max | Samsung Galaxy S24 Ultra / Pixel 8 Pro | Verify 120Hz ProMotion/LTPO; test peak performance |
| Mid-range (target) | iPhone 13 / SE 3rd gen | Samsung Galaxy A54 / Pixel 7a | Most users are here; this is your real performance target |
| Low-end (floor) | iPhone SE 2nd gen / iPad 9th gen | Samsung Galaxy A14 / Redmi Note 12 | If it works here, it works everywhere; 2-3GB RAM stress test |
| Tablet | iPad Air 5th gen | Samsung Galaxy Tab S9 | Verify layout and performance on larger screens |

#### Key Device Characteristics to Test

| Characteristic | What It Reveals | Test Approach |
|---------------|----------------|---------------|
| RAM (2GB vs 8GB) | Memory pressure behavior; background kill threshold | Monitor memory with Instruments/Profiler on lowest-RAM device |
| CPU cores (4 vs 8) | Multithreading effectiveness; background task scheduling | Run CPU Profiler during complex operations on 4-core device |
| GPU (Adreno 610 vs Apple A17 Pro) | Shader compilation jank; animation smoothness; blur/transparency cost | Profile GPU rendering with Instruments Core Animation or Android GPU Profiler |
| Storage (eMMC vs UFS 3.1) | Cold start time; database query speed; asset loading | Measure cold start on eMMC-based budget device |
| Network (5G vs 3G simulation) | Data loading UX; timeout handling; offline graceful degradation | Use Network Link Conditioner (iOS) or Charles Proxy throttling |
| Thermal state | Sustained performance under thermal throttling | Run stress test for 5 minutes; observe frame rate degradation |
| Battery level | Low-power mode behavior; background task restrictions | Test at < 20% battery; verify no battery drain complaints |

#### Firebase Test Lab / AWS Device Farm Integration

```bash
# Firebase Test Lab -- run on real devices
gcloud firebase test android run \
  --type instrumentation \
  --app app-release.aab \
  --test app-perftest.apk \
  --device model=redfin,version=30,locale=en,orientation=portrait \
  --device model=a]14,version=33,locale=en,orientation=portrait \
  --timeout 10m \
  --results-bucket gs://my-perf-results

# Firebase Test Lab -- Robo test for crash detection
gcloud firebase test android run \
  --type robo \
  --app app-release.aab \
  --device model=redfin,version=30 \
  --timeout 5m
```

---

### CI/CD Performance Gate Integration

Automated performance checks that run in CI pipelines to prevent regressions.

#### GitHub Actions Performance Gate

```yaml
# .github/workflows/performance.yml
name: Performance Gate
on: [pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Build production bundle
        run: npx react-native bundle --platform ios --dev false \
             --entry-file index.js --bundle-output /tmp/bundle.js

      - name: Check JS bundle size
        run: |
          SIZE=$(wc -c < /tmp/bundle.js)
          SIZE_MB=$(echo "scale=2; $SIZE / 1048576" | bc)
          echo "JS Bundle: ${SIZE_MB}MB"
          if (( $(echo "$SIZE_MB > 5" | bc -l) )); then
            echo "FAIL: JS bundle ${SIZE_MB}MB exceeds 5MB budget"
            exit 1
          fi

  anti-pattern-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check inline styles
        run: |
          COUNT=$(grep -rn "style={{" src/ --include="*.tsx" --include="*.jsx" | wc -l)
          echo "Inline styles: $COUNT"
          if [ "$COUNT" -gt 10 ]; then
            echo "WARN: $COUNT inline styles found (budget: 10)"
          fi

      - name: Check console.log in production
        run: |
          MATCHES=$(grep -rn "console\.\(log\|warn\|error\)" src/ \
            --include="*.ts" --include="*.tsx" | grep -v "__DEV__" | grep -v "test" || true)
          if [ -n "$MATCHES" ]; then
            echo "FAIL: Unguarded console statements found:"
            echo "$MATCHES"
            exit 1
          fi

      - name: Check for dev server URLs
        run: |
          MATCHES=$(grep -rn "localhost\|127\.0\.0\.1\|10\.0\.2\.2" src/ \
            --include="*.ts" --include="*.tsx" --include="*.js" || true)
          if [ -n "$MATCHES" ]; then
            echo "FAIL: Dev server URLs in source:"
            echo "$MATCHES"
            exit 1
          fi
```

#### Performance Regression Detection

Track key metrics over time to catch gradual regressions before they become noticeable.

| Metric | Tracking Method | Alert Threshold |
|--------|----------------|-----------------|
| JS bundle size | CI artifact comparison (current vs main branch) | > 5% increase triggers warning; > 10% blocks merge |
| iOS binary size | Archive size comparison in CI | > 2MB increase triggers warning |
| Android AAB size | `bundletool get-size` comparison | > 2MB increase triggers warning |
| Cold start time | Automated instrumentation test on CI device | > 50ms regression triggers warning |
| Dependency count | `package.json` / `pubspec.yaml` diff | Any new dependency requires justification comment |
| Image assets total | `du -sh assets/` comparison | > 1MB increase triggers audit |

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Usage in This Skill |
|-----------|-------------------|
| `bg`, `surface` | Background colors must use DNA tokens, not hardcoded values -- enforced in anti-pattern checks |
| `display-font`, `body-font` | Font files contribute to bundle size; subset to used glyphs via DNA font configuration |
| `spacing-*` (5-level) | Layout dimensions use DNA spacing tokens, not hardcoded pixel values -- improves consistency and reduces recomposition |
| `motion-*` (8 tokens) | Animation durations from DNA tokens; excessively long animations waste frame budget |
| `signature-element` | Signature elements (3D, particles, complex shaders) are highest performance risk; profile these first |

### Archetype Variants

Performance budgets are universal, but certain archetypes carry higher performance risk:

| Archetype | Performance Risk | Specific Concern |
|-----------|-----------------|-----------------|
| Kinetic | HIGH | Heavy animation; every motion must hit 60fps budget; pre-test on lowest-end target device |
| 3D WebGL / Glassmorphism | HIGH | GPU-intensive effects; blur and transparency cause offscreen rendering passes; test on thermal-throttled devices |
| Neon Noir | MEDIUM | Glow/shadow effects; `shadow` and `blur` are expensive on mobile GPUs; limit layered effects |
| AI-Native | MEDIUM | Real-time AI inference (on-device models); watch memory and thermal throttling |
| Data-Dense | MEDIUM | Large datasets in lists/grids; virtualization is mandatory; test with 1000+ items |
| Ethereal | MEDIUM | Particle effects and gradient animations; GPU memory pressure on complex scenes |
| Japanese Minimal | LOW | Minimal elements; performance risk is low but animation timing precision matters |
| Swiss/International | LOW | Grid layouts and typography focus; naturally performant patterns |
| Brutalist | LOW | Simple layouts; minimal animation; naturally performant |
| Editorial | LOW | Text-heavy; main risk is font loading and large image assets |

### Pipeline Stage

- **Input from:** Built sections from each wave; framework detection from project setup; DNA tokens and archetype from creative direction
- **Output to:** Performance audit results consumed by reviewer agent; build-time violations block wave completion; runtime guidance informs builder decisions
- **Quality gate integration:**
  - HARD budget violation (e.g., bundle > 200MB iOS) -> -3 Anti-Slop Gate penalty, blocks submission
  - SOFT budget violation (e.g., JS bundle 6MB) -> -2 Anti-Slop Gate penalty, warning in report
  - Anti-pattern detection (e.g., 20+ inline styles) -> -1 per category, listed in audit output

### Related Skills

- `store-submission` -- Store rejection for performance (crashes, ANRs) is caught here before submission checks run
- `mobile-expo` -- Expo-specific performance patterns (OTA size, Hermes, EAS build optimization)
- `mobile-react-native` -- Bare RN performance patterns (native module optimization, New Architecture migration)
- `mobile-swift` -- iOS-specific profiling with Xcode Instruments
- `mobile-kotlin` -- Android-specific profiling with Android Studio and Baseline Profiles
- `mobile-flutter` -- Flutter-specific DevTools and Dart isolate patterns
- `performance-guardian` -- Web performance counterpart; shared concepts (bundle size, lazy loading) but different tools
- `image-asset-pipeline` -- Image optimization directly impacts bundle size and memory budgets

## Layer 4: Anti-Patterns

### Anti-Pattern: Premature Optimization Without Measurement

**What goes wrong:** Developer optimizes code based on intuition ("this looks expensive") without profiling. Time is spent optimizing cold paths while actual bottlenecks remain untouched. Worse, premature optimization introduces complexity that makes the real bottleneck harder to find later.
**Instead:** Always profile first. Use the framework-specific profiling tools from Layer 2. Identify the actual bottleneck (is it JS thread? UI thread? Network? Memory?), then apply targeted optimization. A 10x improvement on a function that takes 1ms is worthless; a 2x improvement on a function that takes 500ms is transformative.

### Anti-Pattern: Rendering All List Items at Once

**What goes wrong:** Using `ScrollView` + `map` (RN), `Column` + `forEach` (Compose), `ListView(children:)` (Flutter), or `ScrollView { ForEach }` without Lazy (SwiftUI) for datasets with 20+ items. Every item is instantiated, measured, and rendered upfront regardless of visibility. Memory usage scales linearly with dataset size; 1000 items can cause OOM on lower-end devices.
**Instead:** Use virtualized list components that only render visible items plus a small buffer: `FlatList`/`FlashList` (RN), `LazyColumn`/`LazyRow` (Compose), `ListView.builder` (Flutter), `LazyVStack`/`LazyHStack` (SwiftUI). Always provide stable keys for efficient diffing.

### Anti-Pattern: Unoptimized Image Loading

**What goes wrong:** Loading full-resolution remote images without caching, resizing, or progressive display. A 4000x3000 photo decoded at full resolution consumes ~48MB of memory per image. Without caching, the same image re-downloads on every screen visit. Without placeholders, users see blank space then a jarring pop-in.
**Instead:** Use framework-specific optimized image libraries: `expo-image` or `react-native-fast-image` (RN), `AsyncImage` with cache configuration (SwiftUI), Coil `AsyncImage` with size constraints (Compose), `CachedNetworkImage` (Flutter). Always specify display dimensions so the decoder can downsample. Use blur hash or low-quality placeholders during loading.

### Anti-Pattern: Blocking the Main Thread

**What goes wrong:** CPU-intensive work (JSON parsing, sorting large arrays, image processing, cryptographic operations) runs synchronously on the main/UI thread. This blocks rendering, causing frame drops (jank) and potentially ANR dialogs (Android) or watchdog kills (iOS) if the operation exceeds 5-10 seconds.
**Instead:** Move heavy work off the main thread. Swift: `Task.detached { }` or `actor`. Kotlin: `withContext(Dispatchers.IO)` or `Dispatchers.Default`. React Native: `InteractionManager.runAfterInteractions()` or native modules. Flutter: `Isolate.run()` or `compute()`. The main thread should only handle UI updates and touch event processing.

### Anti-Pattern: Ignoring Platform-Specific Performance Tools

**What goes wrong:** Developer relies solely on `console.log` timing or wall-clock estimates to diagnose performance issues. These methods miss GPU bottlenecks, memory leaks, energy impact, thread contention, and layout thrashing. The actual cause remains hidden while symptoms are patched with workarounds.
**Instead:** Use the dedicated profiling tools: Xcode Instruments (iOS), Android Studio Profiler (Android), Flipper + Hermes Profiler (RN), Flutter DevTools (Flutter). Each tool provides thread-level visibility, allocation tracking, and frame-by-frame analysis that `console.log` cannot replicate. Invest 30 minutes learning each tool's basics -- it saves hours of guesswork.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| iOS binary size | 0 | 200 | MB | HARD -- exceeds OTA download limit |
| Android AAB size | 0 | 150 | MB | HARD -- Play Store rejects |
| RN JS bundle size | 0 | 5 | MB | SOFT -- warn; impacts cold start |
| Flutter Dart AOT size | 0 | 15 | MB per platform | SOFT -- warn; investigate if exceeded |
| Total asset size | 0 | 50 | MB | SOFT -- warn; audit individual assets |
| iOS cold launch | 0 | 400 | ms | HARD -- reject if exceeded in production |
| Android cold start | 0 | 500 | ms | HARD -- reject if exceeded in production |
| Frame rate (sustained) | 60 | -- | fps | HARD -- below 60fps is janky |
| JS frame time | 0 | 16 | ms | HARD -- exceeding causes frame drops |
| Memory idle (iOS) | 0 | 100 | MB | SOFT -- warn; investigate growth |
| Memory idle (Android) | 0 | 100 | MB | SOFT -- warn; investigate growth |
| ANR rate | 0 | 5 | per 1000 sessions | HARD -- Play Store flags above threshold |
| Crash rate | 0 | 1 | % sessions | HARD -- impacts store ranking |
| Inline styles count (RN) | 0 | 10 | occurrences | SOFT -- refactor above threshold |
| console.log in production | 0 | 0 | occurrences | HARD -- must remove or guard |
| Unused dependencies | 0 | 0 | count | SOFT -- remove to reduce bundle size |
| Images > 500KB | 0 | 0 | count | SOFT -- compress or convert format |
| View body lines (Swift) | 0 | 50 | lines | SOFT -- extract subviews above limit |
| List items without virtualization | 0 | 20 | items | HARD -- must use lazy/virtualized list |
