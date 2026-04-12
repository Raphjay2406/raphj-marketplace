---
name: "mobile-flutter"
description: "Flutter/Dart cross-platform patterns. ThemeData from DNA, Material 3 + Cupertino adaptive widgets, Riverpod state, go_router navigation, platform channels."
tier: "domain"
triggers: "flutter, dart, flutter widget, material cupertino, riverpod, flutter app"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are a Flutter/Dart cross-platform specialist. Flutter uses its own rendering engine (Skia/Impeller) to draw every pixel, giving complete control over visual output on iOS, Android, web, macOS, Windows, and Linux from a single Dart codebase. DNA tokens translate directly to `ThemeData` -- `ColorScheme` from DNA hex, `TextTheme` from DNA fonts via `google_fonts`, and spacing/motion constants. Every pattern targets Flutter 3.24+ with Material 3 enabled and Dart 3.5+.

### When to Use

- **True cross-platform from single codebase:** One Dart codebase produces native-quality apps for iOS, Android, web, and desktop
- **Custom visual identity required:** Flutter's rendering engine means pixel-perfect DNA implementation without platform design system constraints
- **Complex UI with custom animations:** Custom painters, shader effects, physics-based animations that would be difficult in native frameworks
- **Non-React team:** Team does not have React experience, or prefers a widget-composition model over JSX
- **Framework detection matched Flutter:** `pubspec.yaml` with Flutter SDK found, or project brief specifies Flutter

### When NOT to Use

- Project is iOS-only with deep Apple ecosystem features (WidgetKit, Live Activities, SharePlay) -- use `mobile-swift` instead
- Project is Android-only with full Material You dynamic color support -- use `mobile-kotlin` instead (Flutter's dynamic color support is limited)
- Team already has strong React/TypeScript skills and wants code sharing with web -- use `mobile-react-native` or `mobile-expo`
- Project requires deep native API access with minimal bridge overhead -- use native Swift/Kotlin
- Project is web-only -- use web framework skills

### Flutter vs Native vs RN/Expo Decision Tree

1. **How many platforms?** 1 platform -> native (Swift/Kotlin). 2+ platforms -> Flutter or RN/Expo
2. **Team expertise?** React team -> RN/Expo. Dart/mobile team -> Flutter. No preference -> Flutter (easier cross-platform parity)
3. **Visual customization level?** Stock Material/Cupertino look -> native or RN. Highly custom UI -> Flutter (full pixel control)
4. **Performance priority?** GPU-intensive animations/games -> Flutter (Impeller). Standard app UI -> any framework works
5. **Native API depth?** Deep (Bluetooth, ARKit, HealthKit) -> native. Standard (camera, location, push) -> Flutter or RN
6. **Desktop support needed?** Yes -> Flutter (best cross-platform desktop support). No -> any framework

### Decision Tree

1. **State management?** Riverpod for all new projects (compile-safe, testable, scalable). BLoC for teams from Angular background. Provider only for very small apps
2. **Navigation?** go_router for declarative routing with redirect guards. auto_route for code-generated type-safe routes
3. **Adaptive UI?** Use Material 3 on Android, Cupertino on iOS. Check `Platform.isIOS` for platform-adaptive widgets, or use `flutter_adaptive_scaffold`
4. **Data persistence?** drift (formerly moor) for SQL, hive for key-value, shared_preferences for simple settings
5. **Networking?** dio for HTTP with interceptors. chopper for generated API clients. web_socket_channel for WebSockets
6. **Code generation?** freezed for immutable data classes, json_serializable for JSON, build_runner to orchestrate

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (platform detection), `/gen:execute` (all builder output for Flutter targets)
- **Depends on:** `design-dna` (token values), `color-system` (palette), `typography` (type scale)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Flutter Project Structure

Standard Flutter project structure for a Genorah-generated app:

```
lib/
  main.dart                        # Entry point, ProviderScope, MaterialApp.router
  app/
    app.dart                       # MaterialApp.router with ThemeData
    router.dart                    # go_router configuration
  core/
    theme/
      design_dna.dart              # All DNA token constants
      color_tokens.dart            # DNA colors with light/dark schemes
      type_tokens.dart             # DNA typography with GoogleFonts
      spacing.dart                 # DNA spacing constants
      shadows.dart                 # DNA shadow definitions
      motion.dart                  # DNA animation curves and durations
      app_theme.dart               # ThemeData builder from DNA tokens
    di/
      providers.dart               # Riverpod provider definitions
    api/
      api_client.dart              # dio HTTP client
      interceptors.dart            # Auth token, error handling interceptors
    extensions/
      context_extensions.dart      # BuildContext convenience extensions
  features/
    home/
      presentation/
        home_screen.dart           # Screen widget
        home_controller.dart       # Riverpod AsyncNotifier
        widgets/
          featured_card.dart       # Feature-specific widgets
      domain/
        featured_item.dart         # Domain model (freezed)
      data/
        featured_repository.dart   # Repository implementation
  shared/
    widgets/
      buttons/
        primary_button.dart        # DNA-styled button
      cards/
        content_card.dart          # DNA-styled card
      typography/
        heading.dart               # DNA display font wrapper
        body_text.dart             # DNA body font wrapper
      adaptive/
        adaptive_scaffold.dart     # Platform-adaptive scaffold
assets/
  fonts/                           # Custom font files
  images/                          # Static images
ios/                               # iOS native project
android/                           # Android native project
pubspec.yaml                       # Dependencies and asset declarations
analysis_options.yaml              # Dart analyzer rules
```

#### Pattern 2: DNA Token Translation to ThemeData

```dart
// core/theme/color_tokens.dart
import 'package:flutter/material.dart';

class DNAColors {
  // Light scheme
  static const lightBg = Color(0xFFFAFAFA);
  static const lightSurface = Color(0xFFFFFFFF);
  static const lightText = Color(0xFF1A1A1A);
  static const lightBorder = Color(0xFFE5E5E5);
  static const lightPrimary = Color(0xFF2563EB);
  static const lightSecondary = Color(0xFF7C3AED);
  static const lightAccent = Color(0xFFF59E0B);
  static const lightMuted = Color(0xFF6B7280);

  // Dark scheme
  static const darkBg = Color(0xFF0A0A0A);
  static const darkSurface = Color(0xFF1A1A1A);
  static const darkText = Color(0xFFF5F5F5);
  static const darkBorder = Color(0xFF2A2A2A);
  static const darkPrimary = Color(0xFF60A5FA);
  static const darkSecondary = Color(0xFFA78BFA);
  static const darkAccent = Color(0xFFFBBF24);
  static const darkMuted = Color(0xFF9CA3AF);

  // Expressive tokens (shared)
  static const glow = Color(0xFF60A5FA);
  static const tension = Color(0xFFEF4444);
  static const highlight = Color(0xFFFBBF24);
  static const signature = Color(0xFF2563EB);

  static ColorScheme lightScheme() => ColorScheme(
    brightness: Brightness.light,
    primary: lightPrimary,
    onPrimary: Colors.white,
    secondary: lightSecondary,
    onSecondary: Colors.white,
    tertiary: lightAccent,
    onTertiary: Colors.white,
    surface: lightSurface,
    onSurface: lightText,
    outline: lightBorder,
    outlineVariant: lightBorder.withValues(alpha: 0.5),
    error: const Color(0xFFDC2626),
    onError: Colors.white,
    surfaceContainerHighest: lightBg,
    onSurfaceVariant: lightMuted,
  );

  static ColorScheme darkScheme() => ColorScheme(
    brightness: Brightness.dark,
    primary: darkPrimary,
    onPrimary: Colors.black,
    secondary: darkSecondary,
    onSecondary: Colors.black,
    tertiary: darkAccent,
    onTertiary: Colors.black,
    surface: darkSurface,
    onSurface: darkText,
    outline: darkBorder,
    outlineVariant: darkBorder.withValues(alpha: 0.5),
    error: const Color(0xFFF87171),
    onError: Colors.black,
    surfaceContainerHighest: darkBg,
    onSurfaceVariant: darkMuted,
  );
}
```

```dart
// core/theme/type_tokens.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DNATypography {
  static TextTheme textTheme() {
    final displayFont = GoogleFonts.instrumentSerifTextTheme();
    final bodyFont = GoogleFonts.interTextTheme();

    return TextTheme(
      // Display: DNA display font
      displayLarge: displayFont.displayLarge!.copyWith(
        fontSize: 48,
        height: 1.17,
        letterSpacing: -0.25,
      ),
      displayMedium: displayFont.displayMedium!.copyWith(
        fontSize: 36,
        height: 1.22,
      ),
      displaySmall: displayFont.displaySmall!.copyWith(
        fontSize: 24,
        height: 1.33,
      ),
      // Headlines: DNA body font, semibold
      headlineLarge: bodyFont.headlineLarge!.copyWith(
        fontSize: 20,
        height: 1.4,
        fontWeight: FontWeight.w600,
      ),
      headlineMedium: bodyFont.headlineMedium!.copyWith(
        fontSize: 18,
        height: 1.44,
        fontWeight: FontWeight.w600,
      ),
      // Body: DNA body font
      bodyLarge: bodyFont.bodyLarge!.copyWith(
        fontSize: 16,
        height: 1.5,
      ),
      bodyMedium: bodyFont.bodyMedium!.copyWith(
        fontSize: 14,
        height: 1.43,
      ),
      bodySmall: bodyFont.bodySmall!.copyWith(
        fontSize: 12,
        height: 1.33,
      ),
      // Labels: DNA body font, medium weight
      labelLarge: bodyFont.labelLarge!.copyWith(
        fontSize: 14,
        height: 1.43,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
      ),
      labelMedium: bodyFont.labelMedium!.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w500,
      ),
      labelSmall: bodyFont.labelSmall!.copyWith(
        fontSize: 11,
        fontWeight: FontWeight.w500,
      ),
    );
  }
}
```

```dart
// core/theme/spacing.dart
class DNASpacing {
  static const double xxs = 4;
  static const double xs = 8;
  static const double sm = 12;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
  static const double hero = 64;
}
```

```dart
// core/theme/shadows.dart
import 'package:flutter/material.dart';
import 'color_tokens.dart';

class DNAShadows {
  static List<BoxShadow> sm = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.05),
      blurRadius: 2,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> md = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.08),
      blurRadius: 8,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> lg = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.12),
      blurRadius: 16,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> glow = [
    BoxShadow(
      color: DNAColors.glow.withValues(alpha: 0.3),
      blurRadius: 20,
      offset: Offset.zero,
    ),
  ];
}
```

```dart
// core/theme/motion.dart
import 'package:flutter/material.dart';

class DNAMotion {
  // Duration tokens
  static const fast = Duration(milliseconds: 150);
  static const normal = Duration(milliseconds: 300);
  static const slow = Duration(milliseconds: 500);
  static const dramatic = Duration(milliseconds: 800);

  // Curve tokens
  static const easeOut = Curves.easeOut;
  static const easeInOut = Curves.easeInOut;
  static const spring = Curves.elasticOut;
  static const bounce = Curves.bounceOut;

  // Spring simulations for physics-based animation
  static SpringDescription snappySpring = const SpringDescription(
    mass: 1,
    stiffness: 300,
    damping: 20,
  );

  static SpringDescription gentleSpring = const SpringDescription(
    mass: 1,
    stiffness: 150,
    damping: 25,
  );
}
```

```dart
// core/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'color_tokens.dart';
import 'type_tokens.dart';

class AppTheme {
  static ThemeData light() => ThemeData(
    useMaterial3: true,
    colorScheme: DNAColors.lightScheme(),
    textTheme: DNATypography.textTheme(),
    scaffoldBackgroundColor: DNAColors.lightBg,
    appBarTheme: AppBarTheme(
      backgroundColor: DNAColors.lightSurface,
      foregroundColor: DNAColors.lightText,
      elevation: 0,
      scrolledUnderElevation: 1,
    ),
    cardTheme: CardTheme(
      color: DNAColors.lightSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: DNAColors.lightBorder),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: DNAColors.lightBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: DNAColors.lightPrimary, width: 2),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: DNAColors.lightPrimary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    ),
  );

  static ThemeData dark() => ThemeData(
    useMaterial3: true,
    colorScheme: DNAColors.darkScheme(),
    textTheme: DNATypography.textTheme(),
    scaffoldBackgroundColor: DNAColors.darkBg,
    appBarTheme: AppBarTheme(
      backgroundColor: DNAColors.darkSurface,
      foregroundColor: DNAColors.darkText,
      elevation: 0,
      scrolledUnderElevation: 1,
    ),
    cardTheme: CardTheme(
      color: DNAColors.darkSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: DNAColors.darkBorder),
      ),
    ),
  );
}
```

#### Pattern 3: Riverpod State Management

```dart
// features/home/presentation/home_controller.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../domain/featured_item.dart';
import '../data/featured_repository.dart';

part 'home_controller.g.dart';

@riverpod
class HomeController extends _$HomeController {
  @override
  Future<List<FeaturedItem>> build() async {
    return ref.read(featuredRepositoryProvider).getFeatured();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(featuredRepositoryProvider).getFeatured(),
    );
  }
}

// features/home/domain/featured_item.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'featured_item.freezed.dart';
part 'featured_item.g.dart';

@freezed
class FeaturedItem with _$FeaturedItem {
  const factory FeaturedItem({
    required String id,
    required String title,
    required String subtitle,
    required String imageUrl,
  }) = _FeaturedItem;

  factory FeaturedItem.fromJson(Map<String, dynamic> json) =>
      _$FeaturedItemFromJson(json);
}

// features/home/data/featured_repository.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/api/api_client.dart';
import '../domain/featured_item.dart';

part 'featured_repository.g.dart';

@riverpod
FeaturedRepository featuredRepository(FeaturedRepositoryRef ref) {
  return FeaturedRepository(ref.read(apiClientProvider));
}

class FeaturedRepository {
  final ApiClient _client;

  FeaturedRepository(this._client);

  Future<List<FeaturedItem>> getFeatured() async {
    final response = await _client.get('/featured');
    return (response.data as List)
        .map((json) => FeaturedItem.fromJson(json))
        .toList();
  }
}
```

```dart
// features/home/presentation/home_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/spacing.dart';
import '../../../shared/widgets/cards/content_card.dart';
import '../../../shared/widgets/typography/heading.dart';
import 'home_controller.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncItems = ref.watch(homeControllerProvider);
    final theme = Theme.of(context);

    return Scaffold(
      body: asyncItems.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Something went wrong', style: theme.textTheme.bodyLarge),
              const SizedBox(height: DNASpacing.md),
              ElevatedButton(
                onPressed: () => ref.read(homeControllerProvider.notifier).refresh(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (items) => RefreshIndicator(
          onRefresh: () => ref.read(homeControllerProvider.notifier).refresh(),
          child: ListView.builder(
            padding: const EdgeInsets.all(DNASpacing.lg),
            itemCount: items.length + 1, // +1 for header
            itemBuilder: (context, index) {
              if (index == 0) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: DNASpacing.lg),
                  child: DNAHeading(text: 'Featured'),
                );
              }
              final item = items[index - 1];
              return Padding(
                padding: const EdgeInsets.only(bottom: DNASpacing.md),
                child: ContentCard(
                  item: item,
                  onTap: () => context.go('/detail/${item.id}'),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
```

#### Pattern 4: go_router Navigation

```dart
// app/router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/detail/presentation/detail_screen.dart';
import '../features/settings/presentation/settings_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../core/di/providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isLoginRoute = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoginRoute) return '/login';
      if (isLoggedIn && isLoginRoute) return '/';
      return null;
    },
    routes: [
      ShellRoute(
        builder: (context, state, child) => AppScaffold(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/detail/:id',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return DetailScreen(itemId: id);
            },
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
    ],
  );
});

// app/app.dart
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'My App',
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      routerConfig: router,
    );
  }
}

// main.dart
void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}
```

#### Pattern 5: Adaptive Platform Widgets

```dart
// shared/widgets/adaptive/adaptive_scaffold.dart
import 'dart:io' show Platform;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../core/theme/spacing.dart';

class AdaptiveScaffold extends StatelessWidget {
  final Widget child;

  const AdaptiveScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: Platform.isIOS
          ? CupertinoTabBar(
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(CupertinoIcons.house),
                  label: 'Home',
                ),
                BottomNavigationBarItem(
                  icon: Icon(CupertinoIcons.search),
                  label: 'Search',
                ),
                BottomNavigationBarItem(
                  icon: Icon(CupertinoIcons.heart),
                  label: 'Favorites',
                ),
                BottomNavigationBarItem(
                  icon: Icon(CupertinoIcons.person),
                  label: 'Account',
                ),
              ],
              onTap: (index) => _onTabTap(context, index),
            )
          : NavigationBar(
              destinations: const [
                NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Home'),
                NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
                NavigationDestination(icon: Icon(Icons.favorite_outline), label: 'Favorites'),
                NavigationDestination(icon: Icon(Icons.person_outline), label: 'Account'),
              ],
              onDestinationSelected: (index) => _onTabTap(context, index),
            ),
    );
  }

  void _onTabTap(BuildContext context, int index) {
    final routes = ['/', '/search', '/favorites', '/account'];
    context.go(routes[index]);
  }
}

// Adaptive dialog
Future<bool?> showAdaptiveConfirmDialog(BuildContext context, {
  required String title,
  required String content,
}) {
  if (Platform.isIOS) {
    return showCupertinoDialog<bool>(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          CupertinoDialogAction(
            isDestructiveAction: true,
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          CupertinoDialogAction(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  return showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: Text(content),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Confirm'),
        ),
      ],
    ),
  );
}
```

#### Pattern 6: Platform Channels

```dart
// Native bridge for platform-specific functionality
// Using MethodChannel for one-off calls

import 'package:flutter/services.dart';

class NativeHaptics {
  static const _channel = MethodChannel('com.example.myapp/haptics');

  static Future<void> impact({String style = 'medium'}) async {
    await _channel.invokeMethod('impact', {'style': style});
  }

  static Future<void> notification({String type = 'success'}) async {
    await _channel.invokeMethod('notification', {'type': type});
  }

  static Future<void> selection() async {
    await _channel.invokeMethod('selection');
  }
}

// For type-safe generated bridges, use Pigeon:
// 1. Define API in pigeons/haptics.dart
// 2. Run: dart run pigeon --input pigeons/haptics.dart
// 3. Implement generated protocol in Swift (iOS) and Kotlin (Android)
```

#### Pattern 7: Build Configuration

```yaml
# pubspec.yaml
name: my_app
description: A Genorah-generated Flutter app
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.5.0 <4.0.0'
  flutter: '>=3.24.0'

dependencies:
  flutter:
    sdk: flutter

  # UI
  google_fonts: ^6.2.1
  cached_network_image: ^3.4.1
  flutter_svg: ^2.0.14

  # State & DI
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1

  # Navigation
  go_router: ^14.6.2

  # Networking
  dio: ^5.7.0

  # Data
  freezed_annotation: ^2.4.4
  json_annotation: ^4.9.0
  shared_preferences: ^2.3.4

  # Utils
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

  # Code generation
  build_runner: ^2.4.13
  riverpod_generator: ^2.6.2
  freezed: ^2.5.7
  json_serializable: ^6.8.0

flutter:
  uses-material-design: true

  assets:
    - assets/images/
    - assets/fonts/

  fonts:
    - family: InstrumentSerif
      fonts:
        - asset: assets/fonts/InstrumentSerif-Regular.otf
    - family: JetBrainsMono
      fonts:
        - asset: assets/fonts/JetBrainsMono-Regular.ttf
```

```dart
// Build flavors via --dart-define
// Run: flutter run --dart-define=ENV=staging
// Run: flutter build apk --dart-define=ENV=production

class AppConfig {
  static const env = String.fromEnvironment('ENV', defaultValue: 'development');

  static String get apiBaseUrl {
    switch (env) {
      case 'production':
        return 'https://api.example.com';
      case 'staging':
        return 'https://api.staging.example.com';
      default:
        return 'http://localhost:3000';
    }
  }
}

// Platform-specific native config:
// iOS: ios/Runner/Info.plist (permissions, capabilities)
// Android: android/app/build.gradle (minSdk, targetSdk, signing)
// Android: android/app/src/main/AndroidManifest.xml (permissions)
```

### Reference Sites

- **Flutter Gallery** (gallery.flutter.dev) -- Study: Material 3 components showcase, adaptive layouts, animation patterns, accessibility implementation
- **Google Pay** -- Study: Production Flutter app with smooth animations, adaptive platform design, complex financial UI
- **BMW App** -- Study: Luxury brand identity in Flutter, custom animations, platform-native feel despite cross-platform implementation
- **Nubank** -- Study: Financial app at massive scale (80M+ users) built with Flutter, performance optimization patterns

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Flutter Equivalent |
|-----------|-------------------|
| `--color-bg` | `theme.scaffoldBackgroundColor` or `colorScheme.surfaceContainerHighest` |
| `--color-surface` | `colorScheme.surface` via `CardTheme`, container colors |
| `--color-text` | `colorScheme.onSurface` / `colorScheme.onBackground` |
| `--color-border` | `colorScheme.outline` via `BorderSide` and `Divider` |
| `--color-primary` | `colorScheme.primary` -- buttons, FABs, active states |
| `--color-secondary` | `colorScheme.secondary` -- supporting elements |
| `--color-accent` | `colorScheme.tertiary` -- highlights, badges |
| `--color-muted` | `colorScheme.onSurfaceVariant` -- secondary text |
| `--color-glow` | Custom `BoxShadow` with DNA glow color |
| `--font-display` | `textTheme.displayLarge/Medium/Small` via `GoogleFonts` |
| `--font-body` | `textTheme.bodyLarge/Medium/Small` via `GoogleFonts` |
| `--font-mono` | Custom `TextStyle` with `GoogleFonts.jetBrainsMono()` |
| `--spacing-*` | `DNASpacing.*` constants in `EdgeInsets` and `SizedBox` |
| `--motion-*` | `DNAMotion.*` Duration and Curve constants |
| Signature element | Custom `Widget` or `CustomPainter` implementing the DNA signature |

### Archetype Variants (Dual-Platform)

| Archetype | Flutter Adaptation |
|-----------|-------------------|
| Brutalist | `ShapeBorder` with zero radius, no elevation, minimal Material components, custom `Container` styling, linear animations only |
| Ethereal | `BackdropFilter` for blur effects, gentle `SpringSimulation` physics, `DecoratedBox` with gradient overlays, rounded shapes, generous `EdgeInsets` |
| Japanese Minimal | Extreme `EdgeInsets`, single accent color in `ColorScheme`, flat cards (elevation 0), minimal widget tree depth, restrained `TextTheme` |
| Kinetic | `AnimationController` with custom curves, `Hero` transitions between routes, `Transform` widgets for 3D effects, aggressive springs |
| Neon Noir | `ThemeMode.dark` forced, `BoxShadow` glow effects, high-contrast text, `ShaderMask` for gradient text, dark `AppBarTheme` |
| Luxury/Fashion | Custom serif `GoogleFonts`, refined letter spacing in `TextTheme`, subtle `BoxShadow`, `ImageFilter.blur` for background elements |
| Glassmorphism | Heavy `BackdropFilter` usage, `Container` with transparent `BoxDecoration`, layered `Stack` with blur, frosted glass effect |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (platform detection, token values, archetype), `MASTER-PLAN.md` (screen structure)
- **Output to:** Flutter project scaffold (Wave 0), all builder output follows widget patterns
- **Used by:** planner (screen/widget architecture), builder (widget implementation), reviewer (platform compliance)

### Related Skills

- **design-dna** -- DNA hex values map to `Color()` constructors, font names to `GoogleFonts`, spacing to `const double` values
- **color-system** -- Light/dark palettes feed `ColorScheme.light()` and `ColorScheme.dark()`
- **typography** -- Type scale maps to `TextTheme` with `GoogleFonts` package
- **cinematic-motion** -- Motion tokens translate to `AnimationController` durations, `Curve` selections, and `SpringSimulation` parameters
- **accessibility** -- Semantics widget tree, `MediaQuery.textScaler` for Dynamic Type, `MediaQuery.highContrast` detection

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Missing const Constructors

**What goes wrong:** Widgets without `const` constructors are rebuilt every time the parent rebuilds, even when their parameters have not changed. This cascades through deep widget trees, causing unnecessary layout/paint operations and degraded performance.
**Instead:** Add `const` keyword to every widget constructor that accepts only compile-time constant parameters: `const MyWidget({super.key})`. Use `const` on widget instantiations: `const SizedBox(height: 16)`. The Dart analyzer (`prefer_const_constructors` lint) flags missing opportunities.

### Anti-Pattern 2: setState on Large Widget Trees

**What goes wrong:** Calling `setState()` in a `StatefulWidget` high in the widget tree rebuilds the entire subtree. If the root screen calls `setState()`, every child widget rebuilds, regardless of which state actually changed.
**Instead:** Use Riverpod providers scoped to the data they manage. `ref.watch()` rebuilds only the `ConsumerWidget` that watches the changed provider. For local widget state, keep `StatefulWidget` as small as possible -- extract the stateful part into a focused child widget.

### Anti-Pattern 3: Missing ListView.builder for Long Lists

**What goes wrong:** Using `Column` with `children: items.map((item) => Widget(item)).toList()` for 20+ items. All widgets are created at once, even those far off-screen. Memory consumption grows linearly with list length.
**Instead:** Use `ListView.builder` (or `ListView.separated`) with `itemCount` and `itemBuilder`. The builder pattern creates only visible items plus a small buffer. For grids, use `GridView.builder`. For complex mixed layouts, use `CustomScrollView` with `SliverList` and `SliverGrid`.

### Anti-Pattern 4: No cached_network_image

**What goes wrong:** Using `Image.network()` for remote images. Every time the widget rebuilds or the user navigates back, the image is re-fetched from the network. No placeholder, no fade-in transition, no disk caching.
**Instead:** Use `cached_network_image` package with `CachedNetworkImage` widget. It provides: disk caching (images load instantly on revisit), memory caching, placeholder widgets, error widgets, and fade-in transitions. Combined with DNA tokens for placeholder styling.

### Anti-Pattern 5: Blocking Main Isolate

**What goes wrong:** CPU-intensive operations (JSON parsing of large payloads, image processing, complex sorting/filtering) run on the main isolate. Flutter's UI thread is blocked, causing frame drops and UI freezes (jank).
**Instead:** Use `Isolate.run()` for one-off heavy computations. Use `compute()` for simple function-based isolation. For ongoing background work, create long-running isolates. Keep the main isolate free for UI rendering and light logic only.

### Anti-Pattern 6: Overusing StatefulWidget

**What goes wrong:** Every screen is a `StatefulWidget` with multiple `setState()` calls managing different pieces of state. State logic mixes with UI code, making screens hard to test and maintain. No separation of concerns.
**Instead:** Use `StatelessWidget` (or `ConsumerWidget` with Riverpod) for screens. Extract state logic to Riverpod providers (AsyncNotifier for async operations, Notifier for synchronous state). Reserve `StatefulWidget` for truly local widget state (animation controllers, text editing controllers, focus nodes).

### Anti-Pattern 7: Not Using Material 3

**What goes wrong:** Creating a `ThemeData` without `useMaterial3: true`. The app uses deprecated Material 2 components and styling, which looks outdated and will eventually lose support.
**Instead:** Always set `useMaterial3: true` in `ThemeData`. Build `ColorScheme` from DNA tokens (not individual color properties). Use Material 3 components (`NavigationBar` not `BottomNavigationBar`, `FilledButton` not `RaisedButton`). Material 3 provides better adaptive behavior and accessibility.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Flutter version | 3.24 | - | semver | SOFT -- needed for latest Material 3 and Impeller |
| Dart version | 3.5 | - | semver | SOFT -- needed for latest language features |
| useMaterial3 | - | - | true in ThemeData | HARD -- all projects must use Material 3 |
| const constructors | 90 | 100 | % of eligible widgets | SOFT -- const wherever parameters allow |
| ListView.builder threshold | - | 20 | items before builder required | HARD -- never Column.children for 20+ items |
| cached_network_image | 100 | 100 | % of remote images | HARD -- never Image.network for cached images |
| Riverpod for state | - | - | required | SOFT -- no setState for cross-widget state |
| Main isolate blocking | 0 | 16 | ms of synchronous work | HARD -- offload heavy computation to isolates |
| Platform adaptive widgets | - | - | checked | SOFT -- use Cupertino widgets on iOS where appropriate |


---

## v3.3 Addendum: Flutter 3.24 + Dart 3.5 (Aug 2024+)

### Flutter 3.24

- **Impeller default on iOS + Android** — eliminates "jank on first run" (shader pre-compilation). Metal on iOS, Vulkan on Android.
- **Multi-window desktop** (stable macOS/Linux, preview Windows)
- **WidgetInspector V3** — AI-completion friendly
- **CanvasKit Chromium (Wasm)** for Flutter Web — smaller bundle, faster startup

### Dart 3.5

- **Sealed classes** for exhaustive pattern matching
- **Extension types** (zero-cost primitive wrappers)
- **Digit separators** in literals: `1_000_000`

### State management consolidation

**flutter_riverpod 2.5+** is the 2025 default. BLoC fine for teams with existing investment. Provider deprecated for new work.

### DNA token pipeline

```dart
class DnaColors {
  static const primary = Color(0xFF6366F1);
  static const bg = Color(0xFF0A0A0B);
  static const surface = Color(0xFF141418);
}

final dnaTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.dark(
    primary: DnaColors.primary,
    surface: DnaColors.surface,
    background: DnaColors.bg,
  ),
  fontFamily: 'Inter',
);
```

### View Transitions on Flutter Web

Flutter Web (Canvas renderer) does NOT benefit from browser's View Transitions API. Use go_router's built-in animated transitions instead.

### Deprecated in 3.24+

- Skia backend on Android → Impeller
- useMaterial3: false → M3 default; M2 only for migration
