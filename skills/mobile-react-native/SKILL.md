---
name: "mobile-react-native"
description: "React Native bare workflow patterns. DNA token translation, React Navigation, Zustand state, New Architecture (Fabric+TurboModules), Hermes engine, and cross-platform performance."
tier: "domain"
triggers: "react native, rn, bare react native, metro bundler, hermes, react native app"
version: "2.0.0"
metadata:
  pathPatterns:
    - "**/*.tsx"
    - "**/*.jsx"
    - "**/App.tsx"
---

## Layer 1: Decision Guidance

You are a React Native bare workflow specialist. React Native bridges web React knowledge to native mobile platforms -- JSX components compile to native views, StyleSheet maps to native layout, and the New Architecture (Fabric + TurboModules) provides near-native performance. DNA tokens translate to StyleSheet constants or NativeWind (Tailwind for RN) utility classes. Every pattern targets React Native 0.76+ with the New Architecture enabled by default.

### When to Use

- **Cross-platform mobile from a React/web team:** Team already knows React and TypeScript, wants to share knowledge across web and mobile
- **Bare workflow needed:** Project requires custom native modules, non-standard linking, or native build customization beyond what Expo managed supports
- **Performance-critical native integration:** Direct access to native APIs through TurboModules without managed-workflow restrictions
- **Existing React Native codebase:** Maintaining or extending a bare React Native project
- **Framework detection matched RN:** `react-native` in `package.json` dependencies without `expo` as a dependency

### When NOT to Use

- Team is comfortable with Expo managed workflow and does not need custom native modules -- use `mobile-expo` instead (simpler toolchain)
- Project is iOS-only with deep Apple ecosystem integration -- use `mobile-swift` instead
- Project is Android-only with Material Design focus -- use `mobile-kotlin` instead
- Team prefers non-React paradigms -- use `mobile-flutter` for Dart/widget-based approach
- Project has no mobile requirement -- use web framework skills

### Bare RN vs Expo Decision Tree

1. **Do you need custom native modules not in Expo SDK?** Yes -> Bare RN. No -> Consider Expo
2. **Do you need full control over native builds?** Yes -> Bare RN. No -> Expo managed
3. **Is rapid prototyping the priority?** Yes -> Expo. No -> Either
4. **Does team maintain native iOS/Android expertise?** Yes -> Bare RN is viable. No -> Expo is safer
5. **Do you need Expo's EAS Build/Submit pipeline?** Yes -> Expo. No -> Bare RN with Fastlane or manual builds
6. **Existing bare RN codebase?** Yes -> Stay bare. Migrating to Expo adds risk

### Decision Tree

1. **New Architecture?** Always enable for new projects (default in RN 0.76+). Fabric for UI, TurboModules for native APIs
2. **Styling approach?** NativeWind (Tailwind for RN) for DNA consistency with web, or StyleSheet.create for maximum performance
3. **Navigation?** React Navigation with native stack navigator. createNativeStackNavigator for iOS/Android native transitions
4. **State management?** Zustand for client state (simple, performant). TanStack Query for server state (caching, background refresh)
5. **Lists?** FlashList (Shopify) for high-performance lists. FlatList for standard lists. Never ScrollView with map for 20+ items
6. **Animations?** Reanimated 3 for gesture-driven and layout animations. Runs on UI thread, no bridge bottleneck

### Pipeline Connection

- **Referenced by:** planner, builder during build waves
- **Consumed at:** `/gen:start-project` (platform detection), `/gen:execute` (all builder output for RN targets)
- **Depends on:** `design-dna` (token values), `color-system` (palette), `typography` (type scale)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: React Native Project Structure

Standard bare RN project structure for a Genorah-generated app:

```
src/
  app/
    App.tsx                        # Root component, providers, navigation
    Providers.tsx                  # Theme, query client, gesture handler providers
  core/
    theme/
      designDNA.ts                 # All DNA token constants
      colors.ts                    # Color tokens with light/dark variants
      typography.ts                # Font families and type scale
      spacing.ts                   # Spacing constants
      shadows.ts                   # Platform-specific shadow definitions
      motion.ts                    # Animation presets for Reanimated
      ThemeProvider.tsx             # Context-based theme provider
      useTheme.ts                  # Theme hook
    navigation/
      RootNavigator.tsx            # Root navigation container
      MainTabNavigator.tsx         # Bottom tab navigator
      types.ts                     # Navigation type definitions
    api/
      client.ts                    # API client (fetch or axios)
      queryClient.ts               # TanStack Query client config
    store/
      useAuthStore.ts              # Zustand auth store
      useSettingsStore.ts          # Zustand settings store
  features/
    home/
      screens/
        HomeScreen.tsx             # Screen component
      components/
        FeaturedCard.tsx            # Feature-specific components
      hooks/
        useFeaturedItems.ts        # TanStack Query hook
    settings/
      screens/
        SettingsScreen.tsx
  components/
    buttons/
      PrimaryButton.tsx            # DNA-styled button
    cards/
      ContentCard.tsx              # DNA-styled card
    typography/
      Heading.tsx                  # DNA display font wrapper
      Body.tsx                     # DNA body font wrapper
  utils/
    platform.ts                    # Platform.select helpers
    haptics.ts                     # Haptic feedback wrappers
ios/                               # Native iOS project (Xcode)
android/                           # Native Android project (Gradle)
index.js                           # RN entry point
metro.config.js                    # Metro bundler configuration
babel.config.js                    # Babel with Reanimated plugin
package.json
tsconfig.json
```

#### Pattern 2: DNA Token Translation

```typescript
// core/theme/colors.ts
export const dnaColors = {
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    border: '#E5E5E5',
    primary: '#2563EB',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    muted: '#6B7280',
    // Expressive
    glow: '#60A5FA',
    tension: '#EF4444',
    highlight: '#FBB024',
    signature: '#2563EB',
  },
  dark: {
    bg: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#F5F5F5',
    border: '#2A2A2A',
    primary: '#60A5FA',
    secondary: '#A78BFA',
    accent: '#FBB024',
    muted: '#9CA3AF',
    glow: '#60A5FA',
    tension: '#F87171',
    highlight: '#FDE68A',
    signature: '#60A5FA',
  },
} as const;

export type DNAColorToken = keyof typeof dnaColors.light;
```

```typescript
// core/theme/typography.ts
import { Platform, TextStyle } from 'react-native';

export const dnaFonts = {
  display: Platform.select({
    ios: 'InstrumentSerif-Regular',
    android: 'InstrumentSerif-Regular',
  })!,
  body: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
  })!,
  bodyMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
  })!,
  bodySemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
  })!,
  bodyBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
  })!,
  mono: Platform.select({
    ios: 'JetBrainsMono-Regular',
    android: 'JetBrainsMono-Regular',
  })!,
} as const;

// 8-level type scale from DNA
export const dnaTypeScale = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 26 },
  xl: { fontSize: 20, lineHeight: 28 },
  xxl: { fontSize: 24, lineHeight: 32 },
  display: { fontSize: 36, lineHeight: 44 },
  hero: { fontSize: 48, lineHeight: 56 },
} as const;

export type DNATypeScaleKey = keyof typeof dnaTypeScale;
```

```typescript
// core/theme/spacing.ts
export const dnaSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  hero: 64,
} as const;

export type DNASpacingKey = keyof typeof dnaSpacing;
```

```typescript
// core/theme/shadows.ts
import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

export const dnaShadows = {
  sm: Platform.select<ShadowStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    android: { elevation: 2 },
  })!,
  md: Platform.select<ShadowStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
    android: { elevation: 4 },
  })!,
  lg: Platform.select<ShadowStyle>({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 },
    android: { elevation: 8 },
  })!,
} as const;
```

```typescript
// core/theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { dnaColors, DNAColorToken } from './colors';
import { dnaFonts } from './typography';
import { dnaTypeScale, DNATypeScaleKey } from './typography';
import { dnaSpacing, DNASpacingKey } from './spacing';
import { dnaShadows } from './shadows';

interface ThemeContextValue {
  colors: typeof dnaColors.light;
  fonts: typeof dnaFonts;
  typeScale: typeof dnaTypeScale;
  spacing: typeof dnaSpacing;
  shadows: typeof dnaShadows;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = useMemo<ThemeContextValue>(() => ({
    colors: isDark ? dnaColors.dark : dnaColors.light,
    fonts: dnaFonts,
    typeScale: dnaTypeScale,
    spacing: dnaSpacing,
    shadows: dnaShadows,
    isDark,
  }), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

#### Pattern 3: React Navigation Setup

```typescript
// core/navigation/types.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Detail: { id: string };
  Settings: undefined;
  Profile: { userId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Account: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Enable type-safe navigation globally
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

```typescript
// core/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { DetailScreen } from '../../features/detail/screens/DetailScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { useTheme } from '../theme/useTheme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, fonts } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: colors.bg,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bodySemiBold },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### Pattern 4: Zustand + TanStack Query State Management

```typescript
// core/store/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

```typescript
// features/home/hooks/useFeaturedItems.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../core/api/client';

interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

async function fetchFeaturedItems(): Promise<FeaturedItem[]> {
  const response = await apiClient.get('/featured');
  return response.data;
}

export function useFeaturedItems() {
  return useQuery({
    queryKey: ['featured'],
    queryFn: fetchFeaturedItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### Pattern 5: Performance Patterns

```typescript
// High-performance list with FlashList
import { FlashList } from '@shopify/flash-list';

function FeaturedList({ items }: { items: FeaturedItem[] }) {
  const { spacing } = useTheme();

  const renderItem = useCallback(({ item }: { item: FeaturedItem }) => (
    <ContentCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: FeaturedItem) => item.id, []);

  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={120}
      contentContainerStyle={{ padding: spacing.lg }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
    />
  );
}

// Reanimated 3 animation (runs on UI thread)
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// Platform-specific file convention
// components/Header.tsx          -- shared (default)
// components/Header.ios.tsx      -- iOS-specific override
// components/Header.android.tsx  -- Android-specific override
// Metro bundler auto-resolves the correct file per platform
```

#### Pattern 6: New Architecture Bridge

```typescript
// For custom native modules with TurboModules:
// 1. Define spec in JS/TS
// 2. Generate native code with codegen
// 3. Implement in Swift (iOS) and Kotlin (Android)

// NativeHaptics.ts -- TurboModule spec
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  impact(style: string): void;
  notification(type: string): void;
  selection(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeHaptics');
```

#### Pattern 7: Metro and Build Configuration

```javascript
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

### Reference Sites

- **Shopify Mobile App** -- Study: FlashList performance in production, complex navigation patterns, offline-first with React Query
- **Discord Mobile** -- Study: Real-time messaging with React Native, gesture-driven navigation, Reanimated animations for chat interactions
- **Bloomberg Mobile** -- Study: Data-dense layouts in React Native, cross-platform parity, custom native modules for financial data streams

## Layer 3: Integration Context

### DNA Connection

| DNA Token | React Native Equivalent |
|-----------|------------------------|
| `--color-bg` | `theme.colors.bg` via ThemeProvider context |
| `--color-surface` | `theme.colors.surface` -- card/modal backgrounds |
| `--color-text` | `theme.colors.text` -- primary text color |
| `--color-border` | `theme.colors.border` via `borderColor` style property |
| `--color-primary` | `theme.colors.primary` -- buttons, links, active states |
| `--font-display` | `theme.fonts.display` font family string |
| `--font-body` | `theme.fonts.body` font family string |
| `--spacing-*` | `theme.spacing.*` numeric constants in `padding`/`margin` styles |
| `--motion-*` | Reanimated spring configs: `withSpring(value, { damping, stiffness })` |
| Signature element | Custom React Native component with Reanimated animations |

### Platform Differences

| Property | iOS | Android |
|----------|-----|---------|
| Shadows | `shadowColor/Offset/Opacity/Radius` | `elevation` (no color control) |
| Fonts | Loaded via Info.plist `UIAppFonts` | Placed in `android/app/src/main/assets/fonts/` |
| Status bar | `barStyle: 'light-content'` or `'dark-content'` | `backgroundColor` + `barStyle` |
| Safe areas | Dynamic Island, home indicator | Navigation bar, status bar |
| Haptics | UIImpactFeedbackGenerator via native module | Android HapticFeedbackConstants |
| Navigation gestures | Swipe from left edge (native) | Predictive back (native, API 34+) |

### Archetype Variants

| Archetype | RN Adaptation |
|-----------|--------------|
| Brutalist | Minimal shadows (elevation: 0), sharp borderRadius: 0, system fonts if possible, immediate animations (duration: 0) |
| Ethereal | iOS blur via `@react-native-community/blur`, gentle springs (high damping), generous padding values |
| Kinetic | Reanimated gesture-driven animations, spring configs with low damping, bold color contrasts |
| Neon Noir | Dark theme forced, glow via iOS shadow with DNA glow color, high contrast text |
| Glassmorphism | BlurView backgrounds, semi-transparent surfaces, layered shadow depth |

### Pipeline Stage

- **Input from:** `DESIGN-DNA.md` (platform detection, tokens), `MASTER-PLAN.md` (screen flow)
- **Output to:** RN project scaffold (Wave 0), all builder output follows these patterns
- **Used by:** planner (screen architecture), builder (component implementation), reviewer (cross-platform consistency)

### Related Skills

- **design-dna** -- Token values become ThemeProvider constants
- **color-system** -- Light/dark variants feed theme context
- **typography** -- Font names and scales map to RN font family strings and sizes
- **cinematic-motion** -- Reanimated spring/timing configs from DNA motion tokens
- **mobile-expo** -- If project needs managed workflow, hand off to Expo skill

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Inline Styles Instead of StyleSheet.create

**What goes wrong:** Styles defined as inline objects `style={{ padding: 16, backgroundColor: '#fff' }}` on every render. React Native creates a new style object each render, preventing style deduplication and causing unnecessary layout recalculations.
**Instead:** Use `StyleSheet.create()` at module scope. StyleSheet validates styles at creation time and enables native-side optimizations. For dynamic styles, combine static StyleSheet with minimal inline overrides: `style={[styles.card, { opacity: animatedValue }]}`.

### Anti-Pattern 2: ScrollView for Long Lists

**What goes wrong:** Rendering 50+ items inside a `ScrollView` with `.map()`. All items render at once, consuming memory proportional to list length. On low-end Android devices, this causes visible jank and potential OOM crashes.
**Instead:** Use `FlashList` from `@shopify/flash-list` for high-performance lists (better recycling than FlatList). Use `FlatList` for standard lists. Always provide `keyExtractor`. Use `estimatedItemSize` with FlashList for optimal recycling.

### Anti-Pattern 3: Unnecessary Re-renders

**What goes wrong:** Components re-render when parent state changes, even if their props are unchanged. Heavy render functions (data transformations, complex layouts) execute repeatedly for no visual change.
**Instead:** Wrap components in `React.memo()` for shallow prop comparison. Use `useCallback` for event handlers passed as props. Use `useMemo` for expensive computations. Profile with React DevTools to identify unnecessary renders.

### Anti-Pattern 4: Excessive Bridge Calls

**What goes wrong:** In the old architecture, frequent JS-to-native communication (e.g., animated values, scroll position reads) saturates the bridge, causing frame drops. Even with New Architecture, excessive synchronous native calls impact performance.
**Instead:** Use Reanimated 3 for animations (runs on UI thread, no bridge). Use `onScroll` with `scrollEventThrottle={16}` (not 1). Batch native module calls. Use Fabric's synchronous rendering for interactive gestures.

### Anti-Pattern 5: console.log in Production

**What goes wrong:** `console.log` statements left in production code. React Native's console implementation serializes objects across the bridge, causing significant performance degradation -- especially in list renders or animation callbacks.
**Instead:** Use `babel-plugin-transform-remove-console` in production builds. Or wrap in `__DEV__` checks: `if (__DEV__) console.log(...)`. Use Flipper or React Native Debugger for development debugging.

### Anti-Pattern 6: Missing Hermes Engine

**What goes wrong:** App uses JSC (JavaScriptCore) instead of Hermes. JSC has slower startup (no bytecode precompilation), higher memory usage, and no bytecode caching.
**Instead:** Hermes is enabled by default in React Native 0.70+. Verify in `android/app/build.gradle`: `hermesEnabled = true`. For iOS, verify in `ios/Podfile`: `hermes_enabled => true`. Hermes provides faster startup, lower memory, and smaller bundle size.

### Anti-Pattern 7: Not Using Platform-Specific Files

**What goes wrong:** Massive `Platform.select()` or `Platform.OS === 'ios'` conditionals scattered throughout components, making code hard to read and maintain.
**Instead:** Use React Native's platform-specific file resolution. Create `Component.ios.tsx` and `Component.android.tsx` when platform differences are significant. Metro bundler automatically resolves the correct file. Keep shared logic in a `.tsx` file and only split when platform-specific UI diverges meaningfully.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| React Native version | 0.76 | - | semver | SOFT -- New Architecture default |
| Hermes engine | - | - | enabled | HARD -- must use Hermes for production |
| FlashList/FlatList threshold | - | 20 | items before list required | HARD -- never ScrollView.map() for 20+ items |
| StyleSheet usage | 90 | 100 | % of styles | SOFT -- prefer StyleSheet.create over inline |
| Reanimated for animations | - | - | required | SOFT -- do not use Animated API for complex animations |
| React.memo on list items | - | - | required | HARD -- list item components must be memoized |
| console.log in production | 0 | 0 | occurrences | HARD -- strip or guard all console statements |
| scrollEventThrottle | 16 | - | ms | SOFT -- do not set to 1 unless absolutely needed |
