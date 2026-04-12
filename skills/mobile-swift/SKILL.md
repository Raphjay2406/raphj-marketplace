---
name: "mobile-swift"
description: "Swift/SwiftUI native iOS development patterns. DNA token translation, Dynamic Type, SF Symbols, haptics, MVVM architecture, Xcode configuration, and App Store requirements."
tier: "domain"
triggers: "swift, swiftui, ios native, xcode, app store, apple, ios app"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a Swift/SwiftUI native iOS specialist. SwiftUI is Apple's declarative UI framework that maps naturally to Genorah's Design DNA system -- colors become Color assets, typography becomes custom font definitions with Dynamic Type support, spacing becomes layout constants. Every pattern here targets iOS 17+ with SwiftUI as the primary UI layer.

### When to Use

- **Native iOS app required:** Client specifically wants an App Store-distributed iOS application with full platform integration
- **Apple ecosystem features needed:** WidgetKit, Live Activities, SharePlay, App Clips, Apple Watch companion, or deep Siri/Shortcuts integration
- **Performance-critical interactions:** 120fps ProMotion animations, Metal rendering, low-latency haptics, camera/AR pipelines
- **Single-platform iOS project:** No Android requirement, or Android will be a separate codebase
- **Framework detection matched Swift:** `.xcodeproj` or `Package.swift` found, or project brief specifies iOS native

### When NOT to Use

- Project needs Android AND iOS from single codebase -- use `mobile-flutter` or `mobile-react-native` / `mobile-expo` instead
- Project is a web app shown in WKWebView -- use web framework skills instead
- Project is a cross-platform desktop app -- use `desktop-patterns` skill instead
- For Android-specific development -- use `mobile-kotlin` skill

### Decision Tree

1. **iOS-only or cross-platform?** If iOS-only, use Swift/SwiftUI. If cross-platform needed, evaluate Flutter (custom UI), React Native (web team), or Expo (rapid prototyping)
2. **Minimum iOS version?** iOS 17+ unlocks Observable macro, SwiftData, interactive widgets. iOS 16+ requires ObservableObject/ObservedObject patterns
3. **Architecture style?** Default to MVVM with @Observable (iOS 17+). For complex flows, add a Coordinator pattern for navigation
4. **Data persistence?** SwiftData for structured local data (iOS 17+). Core Data if targeting iOS 16. UserDefaults for preferences only
5. **Networking?** async/await with URLSession. Combine only for reactive streams (WebSocket, real-time updates)
6. **Native module complexity?** If heavy native integration (camera, AR, Bluetooth), Swift is the right choice. Cross-platform frameworks add friction for these APIs

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (platform detection), `/gen:execute` (all builder output for iOS targets)
- **Depends on:** `design-dna` (token values), `color-system` (palette generation), `typography` (type scale)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Xcode Project Structure

Standard SwiftUI project structure for a Genorah-generated iOS app:

```
MyApp/
  MyApp/
    App/
      MyAppApp.swift              # @main entry point, WindowGroup
      AppDelegate.swift           # UIKit lifecycle hooks (push notifications, deep links)
    Core/
      Theme/
        DesignDNA.swift           # All DNA tokens: colors, fonts, spacing, motion
        ColorTokens.swift         # Color asset references mapped from DNA hex
        Typography.swift          # Font definitions with Dynamic Type scaling
        Spacing.swift             # Spacing scale constants
        Shadows.swift             # Shadow definitions from DNA depth tokens
        Motion.swift              # Animation curves and durations from DNA
      Navigation/
        AppRouter.swift           # NavigationStack path-based routing
        Route.swift               # Hashable route enum
      DI/
        Dependencies.swift        # Environment-based dependency injection
    Features/
      Home/
        HomeView.swift            # Feature view
        HomeViewModel.swift       # @Observable view model
      Settings/
        SettingsView.swift
        SettingsViewModel.swift
    Components/
      Buttons/
        PrimaryButton.swift       # DNA-styled button components
        SecondaryButton.swift
      Cards/
        ContentCard.swift         # DNA-styled card with shadow and border
      Navigation/
        TabBar.swift              # Custom tab bar (if needed)
    Extensions/
      View+Extensions.swift       # Common view modifiers
      Color+DNA.swift             # Color initializer from hex
    Resources/
      Assets.xcassets/            # Color sets, image sets, app icon
      Fonts/                      # Custom font files (.otf/.ttf)
      Localizable.xcstrings       # String catalog for localization
  MyAppTests/
  MyAppUITests/
  MyApp.xcodeproj
```

Key architectural decisions:
- Feature-based folder structure with View + ViewModel pairs
- Centralized `DesignDNA.swift` as single source of truth for all visual tokens
- NavigationStack with type-safe routing via Hashable route enums
- Environment-based dependency injection (no third-party DI frameworks needed)

#### Pattern 2: Design DNA Token Translation

Translating web DNA tokens to SwiftUI equivalents:

```swift
// Core/Theme/ColorTokens.swift
import SwiftUI

enum DNAColor {
    // Semantic tokens
    static let bg = Color("bg")                   // Asset catalog or hex
    static let surface = Color("surface")
    static let text = Color("text")
    static let border = Color("border")
    static let primary = Color("primary")
    static let secondary = Color("secondary")
    static let accent = Color("accent")
    static let muted = Color("muted")

    // Expressive tokens
    static let glow = Color("glow")
    static let tension = Color("tension")
    static let highlight = Color("highlight")
    static let signature = Color("signature")
}

// Hex initializer for programmatic color creation
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: .alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
```

```swift
// Core/Theme/Typography.swift
import SwiftUI

enum DNAFont {
    static let display = "Instrument Serif"  // From DNA display font
    static let body = "Inter"                // From DNA body font
    static let mono = "JetBrains Mono"       // From DNA mono font
}

enum DNATypeScale {
    // 8-level type scale from DNA
    static let xs: CGFloat = 12
    static let sm: CGFloat = 14
    static let base: CGFloat = 16
    static let lg: CGFloat = 18
    static let xl: CGFloat = 20
    static let xxl: CGFloat = 24
    static let display: CGFloat = 36
    static let hero: CGFloat = 48
}

extension View {
    /// Apply DNA display font with Dynamic Type support
    func dnaDisplayFont(size: CGFloat = DNATypeScale.display) -> some View {
        self.font(.custom(DNAFont.display, size: size, relativeTo: .largeTitle))
    }

    /// Apply DNA body font with Dynamic Type support
    func dnaBodyFont(size: CGFloat = DNATypeScale.base) -> some View {
        self.font(.custom(DNAFont.body, size: size, relativeTo: .body))
    }

    /// Apply DNA mono font with Dynamic Type support
    func dnaMonoFont(size: CGFloat = DNATypeScale.sm) -> some View {
        self.font(.custom(DNAFont.mono, size: size, relativeTo: .caption))
    }
}
```

```swift
// Core/Theme/Spacing.swift
import SwiftUI

enum DNASpacing {
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
    static let hero: CGFloat = 64

    /// Scaled spacing that respects Dynamic Type
    @ScaledMetric static var mdScaled: CGFloat = 16
    @ScaledMetric static var lgScaled: CGFloat = 24
}
```

```swift
// Core/Theme/Shadows.swift
import SwiftUI

enum DNAShadow {
    static let sm = ShadowStyle(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    static let md = ShadowStyle(color: .black.opacity(0.08), radius: 8, x: 0, y: 4)
    static let lg = ShadowStyle(color: .black.opacity(0.12), radius: 16, x: 0, y: 8)
    static let glow = ShadowStyle(color: DNAColor.glow.opacity(0.3), radius: 20, x: 0, y: 0)
}

struct ShadowStyle {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

extension View {
    func dnaShadow(_ style: ShadowStyle) -> some View {
        self.shadow(color: style.color, radius: style.radius, x: style.x, y: style.y)
    }
}
```

```swift
// Core/Theme/Motion.swift
import SwiftUI

enum DNAMotion {
    // Duration tokens
    static let fast: Double = 0.15
    static let normal: Double = 0.3
    static let slow: Double = 0.5
    static let dramatic: Double = 0.8

    // Spring presets from DNA motion tokens
    static let snappy = Animation.spring(response: 0.3, dampingFraction: 0.7)
    static let gentle = Animation.spring(response: 0.5, dampingFraction: 0.8)
    static let bouncy = Animation.spring(response: 0.4, dampingFraction: 0.6)
    static let dramatic_spring = Animation.spring(response: 0.7, dampingFraction: 0.65)

    // Easing curves
    static let easeOut = Animation.easeOut(duration: normal)
    static let easeInOut = Animation.easeInOut(duration: normal)
}
```

#### Pattern 3: MVVM with @Observable (iOS 17+)

```swift
// Features/Home/HomeViewModel.swift
import SwiftUI
import Observation

@Observable
final class HomeViewModel {
    var featuredItems: [FeaturedItem] = []
    var isLoading = false
    var errorMessage: String?

    private let repository: ItemRepository

    init(repository: ItemRepository = .shared) {
        self.repository = repository
    }

    func loadFeatured() async {
        isLoading = true
        defer { isLoading = false }

        do {
            featuredItems = try await repository.fetchFeatured()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

// Features/Home/HomeView.swift
import SwiftUI

struct HomeView: View {
    @State private var viewModel = HomeViewModel()

    var body: some View {
        ScrollView {
            LazyVStack(spacing: DNASpacing.lg) {
                heroSection
                featuredSection
            }
        }
        .background(DNAColor.bg)
        .task {
            await viewModel.loadFeatured()
        }
    }

    private var heroSection: some View {
        VStack(spacing: DNASpacing.md) {
            Text("Welcome")
                .dnaDisplayFont(size: DNATypeScale.hero)
                .foregroundStyle(DNAColor.text)

            Text("Discover amazing content")
                .dnaBodyFont(size: DNATypeScale.lg)
                .foregroundStyle(DNAColor.muted)
        }
        .padding(.horizontal, DNASpacing.lg)
        .padding(.vertical, DNASpacing.xl)
    }

    private var featuredSection: some View {
        ForEach(viewModel.featuredItems) { item in
            ContentCard(item: item)
        }
        .padding(.horizontal, DNASpacing.lg)
    }
}
```

#### Pattern 4: NavigationStack Routing

```swift
// Core/Navigation/Route.swift
import SwiftUI

enum Route: Hashable {
    case home
    case detail(id: String)
    case settings
    case profile(userId: String)
}

// Core/Navigation/AppRouter.swift
import SwiftUI

struct AppRouter: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            HomeView()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .home:
                        HomeView()
                    case .detail(let id):
                        DetailView(itemId: id)
                    case .settings:
                        SettingsView()
                    case .profile(let userId):
                        ProfileView(userId: userId)
                    }
                }
        }
        .environment(\.navigate, NavigateAction { route in
            path.append(route)
        })
    }
}

// Environment-based navigation action
struct NavigateAction {
    let action: (Route) -> Void
    func callAsFunction(_ route: Route) { action(route) }
}

extension EnvironmentValues {
    @Entry var navigate = NavigateAction { _ in }
}
```

#### Pattern 5: Platform Features

```swift
// SF Symbols with hierarchical rendering
Image(systemName: "bell.badge.fill")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(DNAColor.primary)
    .font(.system(size: 24))

// SF Symbols with palette rendering (multi-color)
Image(systemName: "chart.bar.fill")
    .symbolRenderingMode(.palette)
    .foregroundStyle(DNAColor.primary, DNAColor.accent)

// Haptic feedback
func triggerHaptic(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) {
    let generator = UIImpactFeedbackGenerator(style: style)
    generator.prepare()
    generator.impactOccurred()
}

// Selection haptic for toggles and pickers
func triggerSelectionHaptic() {
    let generator = UISelectionFeedbackGenerator()
    generator.prepare()
    generator.selectionChanged()
}

// Notification haptic for success/error/warning
func triggerNotificationHaptic(_ type: UINotificationFeedbackGenerator.FeedbackType) {
    let generator = UINotificationFeedbackGenerator()
    generator.prepare()
    generator.notificationOccurred(type)
}

// Dynamic Type with @ScaledMetric
struct AdaptiveCard: View {
    @ScaledMetric(relativeTo: .body) private var iconSize: CGFloat = 24
    @ScaledMetric(relativeTo: .body) private var padding: CGFloat = 16

    var body: some View {
        HStack(spacing: padding) {
            Image(systemName: "star.fill")
                .frame(width: iconSize, height: iconSize)
                .foregroundStyle(DNAColor.accent)

            Text("Featured Item")
                .dnaBodyFont()
                .foregroundStyle(DNAColor.text)
        }
        .padding(padding)
        .background(DNAColor.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .dnaShadow(DNAShadow.md)
    }
}
```

#### Pattern 6: WidgetKit Integration

```swift
// Widgets/FeaturedWidget.swift
import WidgetKit
import SwiftUI

struct FeaturedEntry: TimelineEntry {
    let date: Date
    let title: String
    let subtitle: String
}

struct FeaturedWidgetView: View {
    let entry: FeaturedEntry

    var body: some View {
        VStack(alignment: .leading, spacing: DNASpacing.xs) {
            Text(entry.title)
                .font(.custom(DNAFont.display, size: 16))
                .foregroundStyle(DNAColor.text)
                .lineLimit(2)

            Text(entry.subtitle)
                .font(.custom(DNAFont.body, size: 12))
                .foregroundStyle(DNAColor.muted)
                .lineLimit(1)
        }
        .padding(DNASpacing.md)
        .containerBackground(for: .widget) {
            DNAColor.surface
        }
    }
}
```

#### Pattern 7: Xcode Configuration

```swift
// Info.plist privacy keys (commonly needed)
// NSCameraUsageDescription        -- Camera access
// NSPhotoLibraryUsageDescription  -- Photo library access
// NSLocationWhenInUseUsageDescription -- Location while app is in use
// NSFaceIDUsageDescription        -- Face ID authentication
// NSUserTrackingUsageDescription  -- App Tracking Transparency

// Register custom fonts in Info.plist:
// Fonts provided by application:
//   - InstrumentSerif-Regular.otf
//   - Inter-Regular.otf
//   - Inter-Medium.otf
//   - Inter-SemiBold.otf
//   - Inter-Bold.otf
//   - JetBrainsMono-Regular.ttf
```

```swift
// Debug vs Release configuration differences
#if DEBUG
let apiBaseURL = "https://api.staging.example.com"
#else
let apiBaseURL = "https://api.example.com"
#endif

// Feature flags via build configuration
// In Build Settings > Swift Compiler - Custom Flags:
// Debug:   -DDEBUG -DFEATURE_BETA
// Release: -DRELEASE
```

### Reference Sites

- **Apple Design Awards Winners** (developer.apple.com/design/awards) -- Study: Consistent use of platform conventions, SF Symbols integration, Dynamic Type support, and motion that feels native to iOS
- **Things 3** -- Study: Custom visual identity that still respects iOS conventions, haptic feedback on every interaction, beautiful dark mode adaptation
- **Flighty** -- Study: Live Activities and Dynamic Island integration, data-dense layouts that scale with Dynamic Type, widget design that carries brand identity
- **Halide** -- Study: Custom camera UI that maintains iOS design principles, gesture-driven interface, accessibility through VoiceOver custom actions

## Layer 3: Integration Context

### DNA Connection

| DNA Token | SwiftUI Equivalent |
|-----------|-------------------|
| `--color-bg` | `Color("bg")` in asset catalog or `Color(hex:)` initializer |
| `--color-surface` | `Color("surface")` with light/dark variants in asset catalog |
| `--color-text` | `Color("text")` -- auto-adapts light/dark via asset catalog |
| `--color-border` | `Color("border")` applied via `.overlay(RoundedRectangle(...).stroke())` |
| `--color-primary` | `Color("primary")` -- used for buttons, links, tint color |
| `--color-secondary` | `Color("secondary")` -- supporting interactive elements |
| `--color-accent` | `Color("accent")` -- also set as app tint in asset catalog |
| `--color-muted` | `Color("muted")` -- secondary text, placeholders |
| `--color-glow` | Applied via `.shadow(color: DNAColor.glow, radius:)` |
| `--font-display` | `.custom(DNAFont.display, size:, relativeTo:)` with Dynamic Type |
| `--font-body` | `.custom(DNAFont.body, size:, relativeTo:)` with Dynamic Type |
| `--spacing-*` | `DNASpacing.*` constants used in `.padding()` and `spacing:` |
| `--motion-*` | `DNAMotion.*` spring and easing animations |
| Signature element | Custom SwiftUI View or ViewModifier implementing the DNA signature |

### Archetype Variants

| Archetype | iOS Adaptation |
|-----------|---------------|
| Brutalist | Minimal SF Symbols (outline only), system fonts or single custom display font, sharp corners (cornerRadius: 0), no springs -- use linear animations, heavy haptics (.heavy impact) |
| Ethereal | Translucent materials (`.ultraThinMaterial`, `.regularMaterial`), gentle spring animations (high damping), light haptics (.light impact), generous spacing |
| Japanese Minimal | Extreme whitespace, single accent color, `.symbolRenderingMode(.monochrome)`, subtle haptics (.soft impact), no shadows |
| Kinetic | Aggressive spring animations (low damping, high response), continuous haptic feedback during gestures, bold SF Symbol use with `.symbolEffect(.bounce)` |
| Neon Noir | Dark-only color scheme, glow shadows on primary elements, `.symbolRenderingMode(.palette)` with neon colors, notification haptics for emphasis |
| Luxury/Fashion | Custom serif display font, refined spacing scale, `.symbolRenderingMode(.hierarchical)`, subtle haptic on navigation only |
| Glassmorphism | Heavy use of `.ultraThinMaterial` backgrounds, blur effects, translucent surfaces with `.opacity()`, layered shadows for depth |
| Neo-Corporate | System-weight SF Symbols, clean type hierarchy, standard spring animations, selection haptics for form interactions |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (platform detection, token values, archetype selection), `MASTER-PLAN.md` (screen structure and navigation flow)
- **Output to:** Xcode project scaffold (Wave 0), all subsequent builder output follows these SwiftUI patterns
- **Used by:** planner (screen structure, navigation design), builder (component implementation), reviewer (platform compliance check)

### Related Skills

- **design-dna** -- Source of all visual tokens. DNA hex values become Color assets, font names become `.custom()` font calls, spacing scale becomes layout constants
- **color-system** -- Color palette generation feeds into light/dark Color asset variants
- **typography** -- Type scale and font selections map to SwiftUI font definitions with Dynamic Type support
- **cinematic-motion** -- Motion tokens translate to SwiftUI spring and easing animations
- **accessibility** -- Dynamic Type, VoiceOver, and reduced motion map directly to SwiftUI accessibility APIs
- **dark-light-mode** -- Color asset catalog variants handle light/dark automatically in SwiftUI

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Massive View Bodies

**What goes wrong:** A single SwiftUI View has 100+ lines in its `body` property. This makes the view hard to read, debug, and causes slow compilation times. The Swift compiler struggles with complex type inference in large view hierarchies.
**Instead:** Extract logical sections into computed properties (`private var heroSection: some View`) or child views. Each view body should be 30-50 lines maximum. Use `@ViewBuilder` for conditional content.

### Anti-Pattern 2: Synchronous Main Thread Work

**What goes wrong:** Network requests, JSON parsing, image processing, or database queries run on the main thread inside view code. This blocks the UI, causes frame drops, and triggers watchdog terminations.
**Instead:** Use `async/await` with `.task {}` modifier for async work. Process data in background with `Task.detached` or actors. Only update `@Observable` properties from the main actor.

### Anti-Pattern 3: Missing Lazy Loading for Lists

**What goes wrong:** Using `VStack` or `ForEach` inside a `ScrollView` to display 50+ items. All items are created at once, consuming memory and causing initial render lag.
**Instead:** Use `LazyVStack` or `LazyVGrid` inside `ScrollView` for large collections. For the most common case (scrollable list of items), prefer `List` with proper `id` for efficient diffing. Use `.onAppear` on the last item for pagination.

### Anti-Pattern 4: Ignoring Dynamic Type

**What goes wrong:** Hardcoded font sizes with `.font(.system(size: 16))` that never scale. Users with accessibility needs see tiny or enormous layouts because spacing and icons do not adapt.
**Instead:** Always use `relativeTo:` parameter in `.custom()` fonts: `.font(.custom("Inter", size: 16, relativeTo: .body))`. Use `@ScaledMetric` for icon sizes and spacing that should scale with Dynamic Type. Test with all Dynamic Type sizes in Xcode previews.

### Anti-Pattern 5: Hardcoded Colors Instead of DNA Assets

**What goes wrong:** Colors defined inline as `Color(red: 0.2, green: 0.4, blue: 0.8)` or `Color.blue` scattered throughout views. No centralized theme, no dark mode support, impossible to update globally.
**Instead:** Define all colors in `DNAColor` enum referencing asset catalog Color Sets (which support light/dark/high-contrast variants automatically) or centralized hex constants. Reference via `DNAColor.primary`, `DNAColor.surface`, etc. everywhere.

### Anti-Pattern 6: Missing Haptic Preparation

**What goes wrong:** Creating and firing haptic generators inline: `UIImpactFeedbackGenerator(style: .medium).impactOccurred()`. The system needs time to spin up the Taptic Engine, causing delayed or missed haptics.
**Instead:** Call `.prepare()` before the haptic is needed (e.g., on button press down, on gesture start). Create generator instances once and reuse them. For lists and scrolling, prepare on appearance.

### Anti-Pattern 7: Overusing @State for Shared Data

**What goes wrong:** Complex data shared between multiple views stored in `@State` and passed down through many levels of init parameters (prop drilling). Changes require updating every intermediate view.
**Instead:** Use `@Observable` view models for feature-level state. Use `@Environment` for app-wide dependencies (auth, settings, theme). Use `@Binding` only for parent-child one-level communication. For cross-feature communication, use a shared service injected via Environment.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| View body line count | - | 50 | lines | SOFT -- extract sections into computed properties |
| Dynamic Type support | 100 | 100 | % of text views | HARD -- all text must use relativeTo: for scaling |
| Color centralization | 100 | 100 | % via DNAColor | HARD -- no inline color literals in views |
| Minimum deployment target | 17.0 | - | iOS version | SOFT -- iOS 17 for @Observable and SwiftData |
| Haptic prepare calls | 1 | - | per generator use | SOFT -- always prepare before impactOccurred |
| LazyVStack threshold | - | 20 | items before lazy required | HARD -- use LazyVStack for 20+ items |
| SF Symbol rendering mode | - | - | explicit | SOFT -- always specify symbolRenderingMode for DNA consistency |
| Privacy usage descriptions | - | - | Info.plist keys | HARD -- every capability must have a usage description |


---

## v3.3 Addendum: SwiftUI 6 + Xcode 16 + iOS 18 (Aug 2024+)

### Observation framework (replaces @ObservableObject)

```swift
@Observable final class ViewModel {
    var count = 0
}

struct CounterView: View {
    @State private var vm = ViewModel()   // not @StateObject
    var body: some View { Text("\(vm.count)") }
}
```

@Observable + @State/@Bindable replaces @ObservableObject/@StateObject/@Published. Tighter view updates — only actual dependencies re-render.

### Scroll API improvements (iOS 17+ / 18)

```swift
ScrollView {
    ForEach(items) { ItemRow(item: $0).id($0.id) }
}
.scrollPosition(id: $selectedId)
.scrollTargetBehavior(.viewAligned)
.defaultScrollAnchor(.center)              // iOS 18
```

Preferred over ScrollViewReader hacks.

### Zoom transition (iOS 18)

```swift
NavigationLink(value: item) {
    Thumbnail(item: item).matchedTransitionSource(id: item.id, in: ns)
}
.navigationTransition(.zoom(sourceID: item.id, in: ns))
```

Same mental model as web cross-document view transitions.

### Deprecated in 2025+

- @ObservableObject / @StateObject / @Published → @Observable
- NavigationView → NavigationStack / NavigationSplitView
- NavigationLink(destination:) → value-based + navigationDestination(for:)

### DNA tokens via Asset Catalog (P3 Display)

```swift
extension Color {
    static let dnaPrimary = Color("dna/primary")  // P3-colorspace asset
    static let dnaBg = Color("dna/bg")
    static let dnaSurface = Color("dna/surface")
}
```

P3 colorspace assets render wide-gamut on iPhone 14 Pro+, iPad Pro M4, Vision Pro; fall back to sRGB automatically.
