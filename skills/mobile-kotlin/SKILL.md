---
name: "mobile-kotlin"
description: "Kotlin/Jetpack Compose native Android patterns. Material 3 theming from DNA, Material You dynamic colors, predictive back, MVI architecture, Gradle configuration, Play Store requirements."
tier: "domain"
triggers: "kotlin, jetpack compose, android native, gradle, play store, material design, android app"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a Kotlin/Jetpack Compose native Android specialist. Compose is Google's modern declarative UI toolkit that integrates tightly with Material 3 theming -- DNA tokens translate directly to `ColorScheme`, `Typography`, and `Shapes`. Every pattern here targets API 26+ (Android 8.0) minimum with Compose as the primary UI layer and Material 3 as the design system foundation.

### When to Use

- **Native Android app required:** Client specifically needs a Google Play-distributed Android application
- **Material Design integration:** Project should follow Material 3 guidelines with DNA-driven customization of Material components
- **Material You dynamic colors:** App should adapt to user's wallpaper-derived color palette on Android 12+
- **Android platform features needed:** Predictive back gestures, edge-to-edge display, adaptive icons, App Widgets, notification channels
- **Single-platform Android project:** No iOS requirement, or iOS will be a separate codebase
- **Framework detection matched Kotlin:** `build.gradle.kts` with Compose dependencies found, or project brief specifies Android native

### When NOT to Use

- Project needs iOS AND Android from single codebase -- use `mobile-flutter` or `mobile-react-native` / `mobile-expo`
- Project is iOS-only -- use `mobile-swift` skill
- Project is a web app wrapped in WebView -- use web framework skills
- For cross-platform desktop app -- use `desktop-patterns` skill

### Decision Tree

1. **Android-only or cross-platform?** If Android-only, use Kotlin/Compose. If cross-platform needed, evaluate alternatives
2. **Minimum API level?** API 26 (Android 8.0) is the recommended minimum. API 31+ for Material You dynamic colors. API 34+ for predictive back gesture
3. **Architecture?** Default to MVI with Kotlin Flow for unidirectional data flow. MVVM acceptable for simpler screens
4. **Dependency injection?** Hilt for production apps (compile-time validation). Koin for rapid prototyping
5. **Navigation?** Navigation Compose with type-safe args (Kotlin Serialization-based routes)
6. **Data persistence?** Room for structured local data. DataStore for preferences (NOT SharedPreferences)

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (platform detection), `/gen:execute` (all builder output for Android targets)
- **Depends on:** `design-dna` (token values), `color-system` (palette generation), `typography` (type scale)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Android Project Structure

Standard Compose project structure for a Genorah-generated Android app:

```
app/
  src/
    main/
      java/com/example/myapp/
        MyApplication.kt              # Application class with Hilt
        MainActivity.kt               # Single Activity, setContent with Compose
        core/
          theme/
            DesignDNA.kt              # All DNA token definitions
            Color.kt                  # DNA color tokens for light/dark schemes
            Type.kt                   # DNA typography with GoogleFont loading
            Shape.kt                  # DNA corner radius definitions
            Spacing.kt               # DNA spacing scale
            Motion.kt                # DNA motion/animation tokens
            Theme.kt                 # MaterialTheme wrapper composable
          navigation/
            AppNavHost.kt            # NavHost with route definitions
            Routes.kt               # Sealed interface route definitions
          di/
            AppModule.kt            # Hilt module for app-wide dependencies
        features/
          home/
            HomeScreen.kt           # Screen composable
            HomeViewModel.kt        # ViewModel with StateFlow
            HomeUiState.kt          # Sealed interface for UI state
          settings/
            SettingsScreen.kt
            SettingsViewModel.kt
        components/
          buttons/
            PrimaryButton.kt        # DNA-styled Material 3 button
          cards/
            ContentCard.kt          # DNA-styled card composable
          scaffold/
            AppScaffold.kt          # Shared scaffold with nav bar
      res/
        values/
          themes.xml               # Material 3 theme for splash screen
          strings.xml
        font/                      # Downloaded Google Fonts XML
        drawable/                  # Adaptive icons, vector drawables
      AndroidManifest.xml
  build.gradle.kts                 # Module-level Gradle config
build.gradle.kts                   # Project-level Gradle config
gradle/
  libs.versions.toml               # Version catalog
settings.gradle.kts
```

#### Pattern 2: Design DNA Token Translation

```kotlin
// core/theme/Color.kt
package com.example.myapp.core.theme

import androidx.compose.ui.graphics.Color

// DNA semantic tokens -- light scheme
val dna_light_bg = Color(0xFFFAFAFA)
val dna_light_surface = Color(0xFFFFFFFF)
val dna_light_text = Color(0xFF1A1A1A)
val dna_light_border = Color(0xFFE5E5E5)
val dna_light_primary = Color(0xFF2563EB)
val dna_light_secondary = Color(0xFF7C3AED)
val dna_light_accent = Color(0xFFF59E0B)
val dna_light_muted = Color(0xFF6B7280)

// DNA semantic tokens -- dark scheme
val dna_dark_bg = Color(0xFF0A0A0A)
val dna_dark_surface = Color(0xFF1A1A1A)
val dna_dark_text = Color(0xFFF5F5F5)
val dna_dark_border = Color(0xFF2A2A2A)
val dna_dark_primary = Color(0xFF60A5FA)
val dna_dark_secondary = Color(0xFFA78BFA)
val dna_dark_accent = Color(0xFFFBBF24)
val dna_dark_muted = Color(0xFF9CA3AF)

// DNA expressive tokens
val dna_glow = Color(0xFF60A5FA)
val dna_tension = Color(0xFFEF4444)
val dna_highlight = Color(0xFFFBBF24)
val dna_signature = Color(0xFF2563EB)
```

```kotlin
// core/theme/Type.kt
package com.example.myapp.core.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.Font
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.unit.sp
import com.example.myapp.R

val googleFontProvider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs
)

// DNA font families
val DisplayFontFamily = FontFamily(
    Font(GoogleFont("Instrument Serif"), googleFontProvider, weight = FontWeight.Normal)
)

val BodyFontFamily = FontFamily(
    Font(GoogleFont("Inter"), googleFontProvider, weight = FontWeight.Normal),
    Font(GoogleFont("Inter"), googleFontProvider, weight = FontWeight.Medium),
    Font(GoogleFont("Inter"), googleFontProvider, weight = FontWeight.SemiBold),
    Font(GoogleFont("Inter"), googleFontProvider, weight = FontWeight.Bold)
)

val MonoFontFamily = FontFamily(
    Font(GoogleFont("JetBrains Mono"), googleFontProvider, weight = FontWeight.Normal)
)

// DNA 8-level type scale mapped to Material 3 Typography
val DNATypography = Typography(
    displayLarge = TextStyle(       // hero: 48sp
        fontFamily = DisplayFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 48.sp,
        lineHeight = 56.sp,
        letterSpacing = (-0.25).sp
    ),
    displayMedium = TextStyle(      // display: 36sp
        fontFamily = DisplayFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 36.sp,
        lineHeight = 44.sp
    ),
    displaySmall = TextStyle(       // xxl: 24sp
        fontFamily = DisplayFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 24.sp,
        lineHeight = 32.sp
    ),
    headlineLarge = TextStyle(      // xl: 20sp
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 28.sp
    ),
    headlineMedium = TextStyle(     // lg: 18sp
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 26.sp
    ),
    bodyLarge = TextStyle(          // base: 16sp
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    bodyMedium = TextStyle(         // sm: 14sp
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    bodySmall = TextStyle(          // xs: 12sp
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp
    ),
    labelLarge = TextStyle(
        fontFamily = BodyFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp
    )
)
```

```kotlin
// core/theme/Shape.kt
package com.example.myapp.core.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val DNAShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),
    small = RoundedCornerShape(8.dp),
    medium = RoundedCornerShape(12.dp),
    large = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(24.dp)
)
```

```kotlin
// core/theme/Spacing.kt
package com.example.myapp.core.theme

import androidx.compose.ui.unit.dp

object DNASpacing {
    val xxs = 4.dp
    val xs = 8.dp
    val sm = 12.dp
    val md = 16.dp
    val lg = 24.dp
    val xl = 32.dp
    val xxl = 48.dp
    val hero = 64.dp
}
```

```kotlin
// core/theme/Theme.kt
package com.example.myapp.core.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    background = dna_light_bg,
    surface = dna_light_surface,
    onBackground = dna_light_text,
    onSurface = dna_light_text,
    outline = dna_light_border,
    primary = dna_light_primary,
    secondary = dna_light_secondary,
    tertiary = dna_light_accent,
    onSurfaceVariant = dna_light_muted
)

private val DarkColorScheme = darkColorScheme(
    background = dna_dark_bg,
    surface = dna_dark_surface,
    onBackground = dna_dark_text,
    onSurface = dna_dark_text,
    outline = dna_dark_border,
    primary = dna_dark_primary,
    secondary = dna_dark_secondary,
    tertiary = dna_dark_accent,
    onSurfaceVariant = dna_dark_muted
)

@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        // Material You dynamic colors on Android 12+
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = DNATypography,
        shapes = DNAShapes,
        content = content
    )
}
```

#### Pattern 3: MVI Architecture with StateFlow

```kotlin
// features/home/HomeUiState.kt
sealed interface HomeUiState {
    data object Loading : HomeUiState
    data class Success(
        val featuredItems: List<FeaturedItem>,
        val isRefreshing: Boolean = false
    ) : HomeUiState
    data class Error(val message: String) : HomeUiState
}

sealed interface HomeIntent {
    data object LoadFeatured : HomeIntent
    data object Refresh : HomeIntent
    data class ItemClicked(val id: String) : HomeIntent
}

// features/home/HomeViewModel.kt
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: ItemRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        handleIntent(HomeIntent.LoadFeatured)
    }

    fun handleIntent(intent: HomeIntent) {
        when (intent) {
            is HomeIntent.LoadFeatured -> loadFeatured()
            is HomeIntent.Refresh -> refresh()
            is HomeIntent.ItemClicked -> { /* Navigate via side effect */ }
        }
    }

    private fun loadFeatured() {
        viewModelScope.launch {
            _uiState.value = HomeUiState.Loading
            repository.getFeatured()
                .catch { e -> _uiState.value = HomeUiState.Error(e.message ?: "Unknown error") }
                .collect { items -> _uiState.value = HomeUiState.Success(items) }
        }
    }

    private fun refresh() {
        viewModelScope.launch {
            val current = _uiState.value
            if (current is HomeUiState.Success) {
                _uiState.value = current.copy(isRefreshing = true)
            }
            repository.getFeatured()
                .catch { e -> _uiState.value = HomeUiState.Error(e.message ?: "Unknown error") }
                .collect { items -> _uiState.value = HomeUiState.Success(items) }
        }
    }
}

// features/home/HomeScreen.kt
@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onItemClick: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is HomeUiState.Loading -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        }
        is HomeUiState.Success -> {
            LazyColumn(
                contentPadding = PaddingValues(DNASpacing.lg),
                verticalArrangement = Arrangement.spacedBy(DNASpacing.md)
            ) {
                items(state.featuredItems, key = { it.id }) { item ->
                    ContentCard(
                        item = item,
                        onClick = { onItemClick(item.id) }
                    )
                }
            }
        }
        is HomeUiState.Error -> {
            ErrorState(
                message = state.message,
                onRetry = { viewModel.handleIntent(HomeIntent.LoadFeatured) }
            )
        }
    }
}
```

#### Pattern 4: Navigation Compose with Type-Safe Args

```kotlin
// core/navigation/Routes.kt
import kotlinx.serialization.Serializable

@Serializable sealed interface Route {
    @Serializable data object Home : Route
    @Serializable data class Detail(val id: String) : Route
    @Serializable data object Settings : Route
    @Serializable data class Profile(val userId: String) : Route
}

// core/navigation/AppNavHost.kt
@Composable
fun AppNavHost(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Route.Home
    ) {
        composable<Route.Home> {
            HomeScreen(
                onItemClick = { id -> navController.navigate(Route.Detail(id)) }
            )
        }
        composable<Route.Detail> { backStackEntry ->
            val route = backStackEntry.toRoute<Route.Detail>()
            DetailScreen(itemId = route.id)
        }
        composable<Route.Settings> {
            SettingsScreen()
        }
        composable<Route.Profile> { backStackEntry ->
            val route = backStackEntry.toRoute<Route.Profile>()
            ProfileScreen(userId = route.userId)
        }
    }
}
```

#### Pattern 5: Edge-to-Edge and Predictive Back

```kotlin
// MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable edge-to-edge display
        enableEdgeToEdge()

        setContent {
            MyAppTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    contentWindowInsets = WindowInsets(0) // Handle insets manually
                ) { innerPadding ->
                    AppNavHost(
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

// Handling insets in composables
@Composable
fun HeaderSection(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.statusBars)
            .padding(horizontal = DNASpacing.lg, vertical = DNASpacing.md)
    ) {
        Text(
            text = "Featured",
            style = MaterialTheme.typography.displayMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
    }
}

// Predictive back gesture support (API 34+)
// Compose automatically supports predictive back when using
// Navigation Compose -- back animations are handled natively.
// Custom back handling:
@Composable
fun DetailScreen(itemId: String) {
    val context = LocalContext.current

    BackHandler {
        // Custom back behavior if needed
        // Default: navigates back with predictive animation
    }

    // Screen content...
}
```

#### Pattern 6: Gradle Configuration with Version Catalog

```toml
# gradle/libs.versions.toml
[versions]
agp = "8.7.0"
kotlin = "2.1.0"
compose-bom = "2024.12.01"
compose-compiler = "1.5.15"
hilt = "2.53.1"
navigation = "2.8.5"
room = "2.7.0-alpha12"
lifecycle = "2.8.7"
kotlinx-serialization = "1.7.3"
coroutines = "1.9.0"

[libraries]
# Compose BOM
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "compose-bom" }
compose-material3 = { group = "androidx.compose.material3", name = "material3" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }

# Navigation
navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigation" }

# Lifecycle
lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }

# Hilt
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version = "1.2.0" }

# Room
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }

# Google Fonts for Compose
compose-google-fonts = { group = "androidx.compose.ui", name = "ui-text-google-fonts" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version = "2.1.0-1.0.29" }
```

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.example.myapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        debug {
            isDebuggable = true
            buildConfigField("String", "API_BASE_URL", "\"https://api.staging.example.com\"")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            buildConfigField("String", "API_BASE_URL", "\"https://api.example.com\"")
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.material3)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)

    implementation(libs.navigation.compose)
    implementation(libs.lifecycle.runtime.compose)
    implementation(libs.lifecycle.viewmodel.compose)
    implementation(libs.compose.google.fonts)

    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.hilt.navigation.compose)

    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)
}
```

### Reference Sites

- **Google I/O App** (github.com/google/iosched) -- Study: Material 3 theming, edge-to-edge design, adaptive layouts for phones and tablets, Compose best practices
- **Now in Android** (github.com/android/nowinandroid) -- Study: Canonical Compose architecture, modular feature structure, Material You dynamic colors, version catalog usage
- **Pocket Casts** -- Study: Beautiful Material 3 implementation, dynamic color theming, smooth Compose animations, offline-first architecture

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Compose Equivalent |
|-----------|-------------------|
| `--color-bg` | `colorScheme.background` via `lightColorScheme(background =)` |
| `--color-surface` | `colorScheme.surface` via `lightColorScheme(surface =)` |
| `--color-text` | `colorScheme.onBackground` and `colorScheme.onSurface` |
| `--color-border` | `colorScheme.outline` via `lightColorScheme(outline =)` |
| `--color-primary` | `colorScheme.primary` -- buttons, FABs, active states |
| `--color-secondary` | `colorScheme.secondary` -- supporting interactive elements |
| `--color-accent` | `colorScheme.tertiary` -- accent highlights, badges |
| `--color-muted` | `colorScheme.onSurfaceVariant` -- secondary text |
| `--color-glow` | Custom shadow color applied via `Modifier.shadow()` |
| `--font-display` | `typography.displayLarge/Medium/Small` font families |
| `--font-body` | `typography.bodyLarge/Medium/Small` font families |
| `--spacing-*` | `DNASpacing.*` Dp constants in `Modifier.padding()` and `Arrangement.spacedBy()` |
| `--motion-*` | `spring()` and `tween()` animation specs |
| Signature element | Custom Composable or Modifier implementing the DNA signature |

### Archetype Variants

| Archetype | Android Adaptation |
|-----------|-------------------|
| Brutalist | Disable Material You dynamic colors, sharp corners (`RoundedCornerShape(0.dp)`), no elevation shadows, monochrome icons, heavy weight typography |
| Ethereal | Enable dynamic colors, rounded shapes, surface tonality with `surfaceColorAtElevation()`, gentle spring animations (high damping), translucent system bars |
| Japanese Minimal | Minimal Material components, single accent color, flat surfaces (elevation = 0.dp), generous padding, restrained typography |
| Kinetic | Aggressive spring animations (`stiffness = Spring.StiffnessMedium, dampingRatio = 0.5f`), `AnimatedContent` for screen transitions, bold color contrasts |
| Neon Noir | Dark theme only, glow effects via custom shadow colors, high-contrast primary on dark surface, custom navigation bar colors |
| Neo-Corporate | Standard Material 3 components, clean elevation hierarchy, system font fallbacks, standard spring animations |
| Glassmorphism | `surfaceColorAtElevation()` with alpha, blur effects via `Modifier.blur()` (API 31+), layered cards with transparency |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (platform detection, token values, archetype), `MASTER-PLAN.md` (screen structure)
- **Output to:** Android project scaffold (Wave 0), all subsequent builder output follows Compose patterns
- **Used by:** planner (screen architecture), builder (composable implementation), reviewer (Material 3 compliance)

### Related Skills

- **design-dna** -- DNA hex values map to `Color()` constructors, font names to `GoogleFont()`, spacing to `Dp` constants
- **color-system** -- Light/dark palette variants feed into `lightColorScheme()` and `darkColorScheme()`
- **typography** -- Type scale maps to Material 3 `Typography` text styles
- **dark-light-mode** -- Compose handles dark mode via `isSystemInDarkTheme()` and dynamic color support
- **accessibility** -- Compose semantics API, content descriptions, touch target sizes (48.dp minimum)

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Recomposition Traps

**What goes wrong:** Passing unstable lambda parameters or non-stable types to composables causes unnecessary recompositions. Every recomposition of a parent recreates lambdas, triggering recomposition of children even when data has not changed.
**Instead:** Use `remember` for lambda callbacks: `val onClick = remember { { viewModel.handleIntent(HomeIntent.ItemClicked(id)) } }`. Mark data classes as `@Stable` or `@Immutable`. Use `derivedStateOf` for computed values. Use `key()` in lazy lists.

### Anti-Pattern 2: Blocking Main Thread

**What goes wrong:** Room database queries, network calls, or heavy JSON parsing executed on the main thread. Compose's UI thread freezes, causing ANRs (Application Not Responding) on Android.
**Instead:** All I/O operations in `viewModelScope.launch(Dispatchers.IO) { }`. Room DAOs return `Flow<>` for reactive updates. Use `withContext(Dispatchers.Default)` for CPU-intensive work like sorting or filtering large lists.

### Anti-Pattern 3: Missing LazyColumn for Lists

**What goes wrong:** Using `Column` with `forEach` inside a `ScrollView` for 20+ items. All items compose at once, consuming memory and causing jank on the initial frame.
**Instead:** Use `LazyColumn` with `items(key = { })` for lists of 20+ items. Provide stable keys for efficient diffing. Use `LazyVerticalGrid` for grid layouts. For mixed content (headers + lists), use `LazyColumn` with `item {}` and `items {}` blocks.

### Anti-Pattern 4: Non-Skippable Composables

**What goes wrong:** Composable functions accept parameters of types that Compose cannot determine are stable (lists, maps, custom classes without @Stable). Compose cannot skip recomposition even when the data is unchanged.
**Instead:** Use `@Stable` annotation on classes passed to composables. Use `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) instead of `List` for composable parameters. Check skippability with Compose Compiler metrics.

### Anti-Pattern 5: Ignoring Material You

**What goes wrong:** Hardcoding DNA colors without fallback to dynamic colors on Android 12+. The app ignores the user's personalized wallpaper-derived color palette, feeling out of place on modern Android devices.
**Instead:** Support dynamic colors as default with DNA colors as fallback. In `Theme.kt`, check `Build.VERSION.SDK_INT >= Build.VERSION_CODES.S` and use `dynamicLightColorScheme()` / `dynamicDarkColorScheme()`. Provide a setting to toggle between dynamic and brand (DNA) colors.

### Anti-Pattern 6: SharedPreferences for Structured Data

**What goes wrong:** Using `SharedPreferences` for complex app state, user preferences, or any data beyond simple flags. SharedPreferences has no type safety, no reactive updates, and can cause ANRs on the main thread.
**Instead:** Use Jetpack DataStore (Preferences DataStore for key-value, Proto DataStore for typed schemas) for preferences. Use Room for structured relational data. Both provide Kotlin Flow-based reactive access.

### Anti-Pattern 7: Missing Edge-to-Edge Support

**What goes wrong:** App content is constrained by system bars (status bar, navigation bar) with colored backgrounds. On modern Android (12+), this looks outdated and wastes screen real estate.
**Instead:** Call `enableEdgeToEdge()` in `onCreate`. Handle insets with `Modifier.windowInsetsPadding(WindowInsets.statusBars)` for top content and `WindowInsets.navigationBars` for bottom content. Use `Scaffold` which handles insets for common patterns.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Target SDK | 35 | - | API level | HARD -- Play Store requires latest target SDK |
| Min SDK | 26 | - | API level | SOFT -- Android 8.0 covers 95%+ of devices |
| LazyColumn threshold | - | 20 | items before lazy required | HARD -- use LazyColumn for 20+ items |
| Touch target size | 48 | - | dp | HARD -- Material accessibility minimum |
| R8 minification | - | - | enabled in release | HARD -- release builds must enable R8 |
| Edge-to-edge | - | - | enabled | SOFT -- enableEdgeToEdge() in MainActivity |
| Version catalog | - | - | libs.versions.toml | SOFT -- use Gradle version catalogs over hardcoded versions |
| Dynamic color support | - | - | API 31+ check | SOFT -- support Material You on compatible devices |
| Compose Compiler metrics | - | - | verified | SOFT -- check for non-skippable composables |


---

## v3.3 Addendum: Compose Multiplatform 2.0 + Jetpack Compose 1.7+ (2024-10)

### Compose Multiplatform 2.0

Share Compose UI across Android + iOS + Desktop + Web (Wasm). For Genorah projects targeting multiple mobile platforms, **CMP is now the default recommendation** over native-per-platform.

```kotlin
// commonMain/App.kt
@Composable
fun App() {
    MaterialTheme {
        Greeting()  // renders identically on Android + iOS + Desktop
    }
}
```

### Jetpack Compose 1.7+ features

- **Shared-element transitions** (SharedTransitionScope + sharedElement/sharedBounds) — maps to cross-doc view-transitions idiom
- **Pull-to-refresh** stable in material3
- **Predictive back** (BackHandler + animateContentSize)
- **Composable invalidation lift** — less recomposition noise

### Material You + DNA tokens

```kotlin
val DnaColorScheme = lightColorScheme(
    primary = Color(0xFF6366F1),       // DNA primary
    background = Color(0xFF0A0A0B),    // DNA bg
    surface = Color(0xFF141418),       // DNA surface
)

MaterialTheme(colorScheme = DnaColorScheme) { /* ... */ }
```

**Dynamic color (dynamicLightColorScheme(ctx)) is OPT-IN** for archetype-locked designs — DNA-fixed palette should override user wallpaper.

### Gradle version catalog (2025 standard)

Use `libs.versions.toml` centrally; avoid version-literal sprawl across modules.
