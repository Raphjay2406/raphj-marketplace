---
name: "mobile-expo"
description: "Expo managed workflow patterns. Expo Router file-based routing, EAS Build/Submit, expo-font/expo-image, config plugins, OTA updates, and managed-to-bare migration."
tier: "domain"
triggers: "expo, expo router, eas build, eas submit, managed workflow, expo app"
version: "2.0.0"
---

## Layer 1: Decision Guidance

You are an Expo managed workflow specialist. Expo provides a batteries-included React Native development experience -- file-based routing (like Next.js App Router), managed native builds via EAS, OTA updates, and a curated SDK of pre-built native modules. DNA tokens integrate through the same ThemeProvider pattern as bare React Native, plus Expo-specific APIs like expo-font for custom font loading and expo-splash-screen for branded launch experiences. Every pattern targets Expo SDK 52+ with Expo Router v4.

### When to Use

- **Rapid mobile development:** Team wants the fastest path from idea to App Store / Play Store without managing native build toolchains
- **File-based routing desired:** Team is familiar with Next.js App Router and wants the same mental model for mobile navigation
- **No custom native modules needed:** All required native features are covered by Expo SDK packages (camera, notifications, location, etc.)
- **OTA updates important:** App content or logic needs to update without a full App Store review cycle
- **EAS Build pipeline desired:** Cloud-based builds without local Xcode/Android Studio setup
- **Framework detection matched Expo:** `expo` in `package.json` dependencies, or `app.json`/`app.config.ts` present

### When NOT to Use

- Project requires custom native modules not available in Expo SDK and config plugins cannot bridge the gap -- use `mobile-react-native` (bare workflow) instead
- Project is iOS-only with deep Apple ecosystem integration -- use `mobile-swift` instead
- Project is Android-only with Material Design focus -- use `mobile-kotlin` instead
- Team prefers non-React paradigms -- use `mobile-flutter` instead
- Project has extreme performance requirements needing direct native optimization -- consider bare RN or native

### Managed vs Bare Decision Tree

1. **Can all native features be provided by Expo SDK or config plugins?** Yes -> Managed. No -> Bare RN or eject
2. **Do you need custom native build steps?** Yes -> Bare RN. No -> Managed with EAS
3. **Is OTA update capability important?** Yes -> Managed (expo-updates built-in). No -> Either
4. **Does the team have native iOS/Android expertise?** No -> Managed is safer. Yes -> Either
5. **Is cloud-based CI/CD preferred?** Yes -> EAS Build. No -> Bare RN with Fastlane
6. **Need to migrate to bare later?** Expo supports `npx expo prebuild` for ejection at any time

### Config Plugins for Native Customization

Before ejecting to bare workflow, check if a config plugin can solve the need:
- `expo-build-properties` -- Customize iOS deployment target, Android SDK versions, ProGuard rules
- `expo-notifications` -- Push notification entitlements and Android channels
- `expo-camera` -- Camera permissions and configuration
- Custom config plugins -- Write `withInfoPlist()`, `withAndroidManifest()`, `withXcodeProject()` plugins for targeted native changes

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (platform detection), `/gen:execute` (all builder output for Expo targets)
- **Depends on:** `design-dna` (token values), `color-system` (palette), `typography` (type scale)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Expo Project Structure

Standard Expo Router project structure for a Genorah-generated app:

```
app/
  _layout.tsx                      # Root layout: providers, fonts, splash screen
  (tabs)/
    _layout.tsx                    # Tab navigator layout
    index.tsx                      # Home tab (default route)
    search.tsx                     # Search tab
    favorites.tsx                  # Favorites tab
    account.tsx                    # Account tab
  (auth)/
    _layout.tsx                    # Auth group layout (no tabs)
    login.tsx                      # Login screen
    register.tsx                   # Register screen
  [id].tsx                         # Dynamic route for item detail
  settings.tsx                     # Settings screen
  +not-found.tsx                   # 404 fallback
  +html.tsx                        # Custom HTML wrapper (web)
src/
  core/
    theme/
      designDNA.ts                 # All DNA token constants
      colors.ts                    # Color tokens with light/dark
      typography.ts                # Font families and type scale
      spacing.ts                   # Spacing constants
      shadows.ts                   # Shadow definitions
      ThemeProvider.tsx             # Context-based theme provider
      useTheme.ts                  # Theme hook
    api/
      client.ts                    # API client
      queryClient.ts               # TanStack Query config
    store/
      useAuthStore.ts              # Zustand stores
  features/
    home/
      components/
        FeaturedCard.tsx
      hooks/
        useFeaturedItems.ts
  components/
    buttons/
      PrimaryButton.tsx
    cards/
      ContentCard.tsx
    typography/
      Heading.tsx
      Body.tsx
assets/
  fonts/
    InstrumentSerif-Regular.otf    # DNA display font
    Inter-Regular.ttf              # DNA body font
    Inter-Medium.ttf
    Inter-SemiBold.ttf
    Inter-Bold.ttf
    JetBrainsMono-Regular.ttf      # DNA mono font
  images/
    splash.png                     # Splash screen image
    icon.png                       # App icon (1024x1024)
    adaptive-icon.png              # Android adaptive icon
    favicon.png                    # Web favicon
app.config.ts                      # Dynamic Expo config
eas.json                           # EAS Build profiles
package.json
tsconfig.json
```

Key differences from bare RN:
- `app/` directory uses file-based routing (like Next.js App Router)
- Route groups `(tabs)`, `(auth)` organize navigation without affecting URLs
- `_layout.tsx` files define navigation structure at each level
- `app.config.ts` replaces native Info.plist/AndroidManifest for most settings
- `eas.json` defines build profiles for development, preview, and production

#### Pattern 2: Root Layout with Font Loading and Splash Screen

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/core/theme/ThemeProvider';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = Font.useFonts({
    'InstrumentSerif-Regular': require('../assets/fonts/InstrumentSerif-Regular.otf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
            <Stack.Screen name="[id]" options={{ headerShown: true }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

#### Pattern 3: Tab Navigator with Expo Router

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/core/theme/useTheme';

export default function TabLayout() {
  const { colors, fonts } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: fonts.bodySemiBold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

```typescript
// app/(tabs)/index.tsx -- Home screen
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/core/theme/useTheme';
import { useFeaturedItems } from '../../src/features/home/hooks/useFeaturedItems';
import { ContentCard } from '../../src/components/cards/ContentCard';
import { Heading } from '../../src/components/typography/Heading';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { data: items, isLoading, refetch } = useFeaturedItems();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <FlashList
        data={items ?? []}
        renderItem={({ item }) => (
          <ContentCard
            item={item}
            onPress={() => router.push(`/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={120}
        contentContainerStyle={{ padding: spacing.lg }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <Heading style={{ marginBottom: spacing.lg }}>Featured</Heading>
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

#### Pattern 4: Dynamic Routes and Modals

```typescript
// app/[id].tsx -- Dynamic route for item detail
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '../src/core/theme/useTheme';
import { Heading } from '../src/components/typography/Heading';
import { Body } from '../src/components/typography/Body';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();

  // Fetch item by id...

  return (
    <>
      <Stack.Screen options={{ title: 'Detail', headerShown: true }} />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        contentContainerStyle={{ padding: spacing.lg }}
      >
        <Image
          source={{ uri: `https://example.com/images/${id}.jpg` }}
          style={styles.heroImage}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          transition={300}
        />
        <Heading style={{ marginTop: spacing.lg }}>Item Title</Heading>
        <Body style={{ marginTop: spacing.md, color: colors.muted }}>
          Item description goes here...
        </Body>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: '100%', height: 250, borderRadius: 12 },
});
```

#### Pattern 5: App Configuration

```typescript
// app.config.ts -- Dynamic Expo configuration
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My App',
  slug: 'my-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',

  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FAFAFA', // DNA bg color
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.myapp',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses the camera to scan items.',
      NSPhotoLibraryUsageDescription: 'This app accesses photos for your profile.',
    },
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FAFAFA', // DNA bg color
    },
    package: 'com.example.myapp',
    permissions: ['CAMERA'],
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },

  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow access to select photos for your profile.',
        cameraPermission: 'Allow access to take photos.',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: { deploymentTarget: '16.0' },
        android: { minSdkVersion: 26, compileSdkVersion: 35, targetSdkVersion: 35 },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
});
```

```json
// eas.json -- EAS Build profiles
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "env": {
        "API_BASE_URL": "https://api.staging.example.com"
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "env": {
        "API_BASE_URL": "https://api.staging.example.com"
      }
    },
    "production": {
      "channel": "production",
      "autoIncrement": true,
      "env": {
        "API_BASE_URL": "https://api.example.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "production"
      }
    }
  }
}
```

#### Pattern 6: Expo SDK Key Packages

```typescript
// expo-image -- High-performance image component (replaces RN Image)
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  transition={200}
  cachePolicy="memory-disk"
/>

// expo-linear-gradient -- DNA gradient backgrounds
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[colors.primary, colors.secondary]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ flex: 1, padding: spacing.xl }}
>
  {children}
</LinearGradient>

// expo-haptics -- Cross-platform haptic feedback
import * as Haptics from 'expo-haptics';

// Impact feedback
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Notification feedback
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Selection feedback (for toggles, pickers)
await Haptics.selectionAsync();

// expo-notifications -- Push notifications
import * as Notifications from 'expo-notifications';

// Register for push notifications
const { status } = await Notifications.requestPermissionsAsync();
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-project-id',
});
```

#### Pattern 7: OTA Updates with expo-updates

```typescript
// Checking for updates at app launch
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Alert } from 'react-native';

function useOTAUpdates() {
  useEffect(() => {
    async function checkForUpdates() {
      if (__DEV__) return; // Skip in development

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Update Available',
            'A new version is ready. Restart to apply.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Restart', onPress: () => Updates.reloadAsync() },
            ]
          );
        }
      } catch (error) {
        // Silently fail -- user can continue with current version
        console.warn('OTA update check failed:', error);
      }
    }

    checkForUpdates();
  }, []);
}
```

### Reference Sites

- **Expo Documentation App** -- Study: Expo Router file-based routing in production, deep linking, tab navigation patterns
- **Bsky (Bluesky Social)** -- Study: Full Expo Router app with complex navigation, real-time feeds, custom transitions, production-scale OTA updates
- **Notion Mobile** -- Study: Rich content editing in React Native, offline-first with sync, gesture interactions

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Expo Equivalent |
|-----------|----------------|
| `--color-bg` | `theme.colors.bg` via ThemeProvider + `splash.backgroundColor` in app.config.ts |
| `--color-surface` | `theme.colors.surface` -- card/modal backgrounds |
| `--color-text` | `theme.colors.text` -- primary text color |
| `--color-primary` | `theme.colors.primary` -- tab bar active tint, buttons |
| `--font-display` | Loaded via `expo-font` useFonts hook, referenced by family name |
| `--font-body` | Loaded via `expo-font`, used as default body typography |
| `--spacing-*` | Same ThemeProvider constants as bare RN |
| `--motion-*` | Reanimated springs for animations, expo-haptics for tactile feedback |
| DNA gradients | `expo-linear-gradient` with DNA color tokens |
| Signature element | Custom component, potentially using `expo-gl` for advanced rendering |

### Expo-Specific Adaptations

| Web DNA Feature | Expo Equivalent |
|-----------------|----------------|
| CSS `@font-face` | `expo-font` with `useFonts` hook |
| CSS gradients | `expo-linear-gradient` component |
| `<img>` with lazy loading | `expo-image` with `cachePolicy` and `placeholder` |
| CSS blur/backdrop-filter | `expo-blur` BlurView component |
| Web push notifications | `expo-notifications` with Expo Push Service |
| `localStorage` | `expo-secure-store` (sensitive) or `@react-native-async-storage/async-storage` |

### Archetype Variants

| Archetype | Expo Adaptation |
|-----------|----------------|
| Brutalist | Minimal Expo SDK usage, no gradients or blur, sharp styling, direct color application |
| Ethereal | `expo-blur` for translucent backgrounds, `expo-linear-gradient` for soft gradients, gentle haptics |
| Kinetic | Reanimated gesture animations, aggressive haptic feedback, `expo-av` for sound effects |
| Glassmorphism | Heavy `expo-blur` usage with intensity prop, layered gradients via `expo-linear-gradient` |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (platform detection, tokens), `MASTER-PLAN.md` (screen flow)
- **Output to:** Expo project scaffold (Wave 0), all builder output follows Expo Router patterns
- **Used by:** planner (file-based route structure), builder (screen implementation), reviewer (SDK usage check)

### Related Skills

- **mobile-react-native** -- Expo builds on React Native. Component patterns, StyleSheet usage, and state management are shared. The key differences are routing (Expo Router vs React Navigation), build system (EAS vs native), and native module access
- **design-dna** -- Token values become ThemeProvider constants, splash screen colors, and tab bar styling
- **color-system** -- Light/dark variants feed theme context and `userInterfaceStyle` config
- **typography** -- Font files loaded via `expo-font`, type scale constants shared with bare RN

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using Bare-Only Native Modules

**What goes wrong:** Installing native modules that require manual linking (`react-native link`) or direct Xcode/Gradle modification. These break the managed workflow -- EAS Build cannot process them, and `expo prebuild` may produce conflicts.
**Instead:** Check Expo SDK for equivalent packages first (e.g., `expo-camera` instead of `react-native-camera`). If no Expo equivalent exists, check if a config plugin can bridge the gap. Only eject to bare workflow as a last resort.

### Anti-Pattern 2: Oversized OTA Updates

**What goes wrong:** OTA updates via `expo-updates` include large assets (images, videos, fonts) that push the update bundle over 50MB. Users on slow connections experience failed or very slow updates, and the app may appear frozen.
**Instead:** Keep OTA updates focused on JS bundle and small assets. Host large media on a CDN and load via URL. Use `expo-asset` for essential bundled assets only. Move large binary assets to native builds (updated via App Store/Play Store) rather than OTA.

### Anti-Pattern 3: Missing app.config.ts Validation

**What goes wrong:** Using `app.json` with hardcoded values instead of `app.config.ts` with dynamic configuration. Environment-specific values (API URLs, bundle IDs) are wrong for different build profiles. Secrets accidentally committed to source control.
**Instead:** Use `app.config.ts` for dynamic configuration. Read environment variables from `process.env` (set in `eas.json` per build profile). Never hardcode secrets -- use EAS Secrets for sensitive values. Validate required env vars at config evaluation time.

### Anti-Pattern 4: Not Using expo-image

**What goes wrong:** Using React Native's built-in `<Image>` component for remote images. It lacks caching, blurhash placeholders, progressive loading, and modern format support. Images flash on re-render and consume excessive memory.
**Instead:** Use `expo-image` for all image rendering. It provides: disk+memory caching, blurhash/thumbhash placeholders, smooth transitions, WebP/AVIF support, and `contentFit` (replaces `resizeMode`). Set `cachePolicy="memory-disk"` for optimal performance.

### Anti-Pattern 5: Ignoring EAS Build Profiles

**What goes wrong:** Single build configuration for all environments. Development builds include production API keys. Preview builds use production credentials. No internal distribution for testing.
**Instead:** Define three EAS build profiles in `eas.json`: `development` (dev client, simulator builds, staging API), `preview` (internal distribution for QA, staging API), `production` (store distribution, production API, auto-increment version). Use `channel` for OTA update targeting per profile.

### Anti-Pattern 6: Missing Typed Routes

**What goes wrong:** Navigation uses string-based routes (`router.push('/detail/123')`) without type checking. Typos in route paths cause runtime crashes. Refactoring routes requires find-and-replace across the codebase.
**Instead:** Enable `experiments.typedRoutes: true` in `app.config.ts`. This generates TypeScript types from the `app/` file structure. `router.push()` and `<Link href="">` get autocomplete and compile-time route validation. Use `useLocalSearchParams<{ id: string }>()` for typed params.

### Anti-Pattern 7: Splash Screen Flash

**What goes wrong:** The splash screen hides before fonts are loaded, custom theme is applied, or initial data is fetched. Users see a flash of unstyled content (default system fonts, wrong colors) before the app fully renders.
**Instead:** Call `SplashScreen.preventAutoHideAsync()` at module scope (before component renders). In the root layout, only call `SplashScreen.hideAsync()` after fonts are loaded AND initial theme is ready. Use the splash screen as a loading state, not just a launch image.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Expo SDK version | 52 | - | SDK version | SOFT -- SDK 52+ for latest Expo Router and APIs |
| expo-image usage | 100 | 100 | % of remote images | HARD -- never use RN Image for remote images |
| OTA update size | - | 50 | MB | SOFT -- keep OTA bundles small |
| EAS build profiles | 3 | - | profiles (dev/preview/prod) | SOFT -- separate builds per environment |
| Typed routes | - | - | enabled | SOFT -- experiments.typedRoutes: true |
| SplashScreen.preventAutoHideAsync | 1 | 1 | call at module scope | HARD -- prevent splash flash |
| expo-font loading | - | - | before splash hide | HARD -- fonts must load before UI renders |
| app.config.ts over app.json | - | - | required | SOFT -- use dynamic config for environment vars |


---

## v3.3 Addendum: Expo SDK 52 + Expo Router v4 (2024-11)

### Expo Router v4 (stable in SDK 52)

- **Typed routes** — `expo-router/types` generates route types; compile-time path safety
- **Stack.Protected** — declarative auth gating
- **Server APIs** — full Node server routes in `app/api/*+api.ts`, deployable to EAS Hosting

```tsx
// app/api/hello+api.ts
export async function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

### Expo SDK 52

- **Precompiled React Native** — 3-10× faster clean builds (release mode too)
- **New Architecture (Fabric + TurboModules) ON BY DEFAULT** for new projects
- **React 18.3 + Hermes** default
- **expo-video stable** — replaces expo-av (PiP, AirPlay, subtitles, DRM)

### EAS Hosting

```bash
eas init
eas deploy   # app/api/* + static assets
```

Managed serverless for Expo Router server functions — no separate Vercel/Cloudflare setup needed.

### DNA tokens (NativeWind 4.x + vars)

```tsx
import { vars } from 'nativewind';
const dnaTokens = vars({ '--dna-primary': '#6366f1', '--dna-bg': '#0a0a0b' });
<Stack style={dnaTokens}>…</Stack>
```

### Deprecated

- Classic Updates → EAS Update only
- expo-av for video → expo-video
- Default Bridge → deprecated SDK 54+
