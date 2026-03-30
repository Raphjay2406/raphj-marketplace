---
name: "desktop-patterns"
description: "Tauri v2 and Electron desktop-aware design: custom titlebars, drag regions, window chrome, system tray, multi-window, platform-specific patterns"
tier: "domain"
triggers: "tauri, electron, desktop app, titlebar, window chrome, drag region, system tray, native menu, multi-window"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### Core Philosophy

A desktop app is NOT a website in a window. Desktop applications have their own design language: custom titlebars that ARE the brand, drag regions for window movement, native system integration (tray, menus, shortcuts), multi-window workflows, and platform-specific controls. When a desktop app ignores these, it feels like a browser tab that escaped -- cheap, unfinished, and out of place on the user's machine.

Genorah treats the desktop shell as a first-class design surface. The titlebar uses DNA tokens. Window controls match the archetype. Platform differences (macOS traffic lights vs Windows controls) are handled with care, not ignored. The result is an app that feels native to the operating system while maintaining the project's unique visual identity.

### Framework Detection

| Signal | Framework | Confidence |
|--------|-----------|------------|
| `tauri.conf.json` in project root | Tauri v2 | HIGH |
| `src-tauri/` directory exists | Tauri v2 | HIGH |
| `src-tauri/tauri.conf.json` | Tauri v2 | HIGH |
| `electron-builder.json` or `electron-builder.yml` | Electron | HIGH |
| `main.js` or `main.ts` with `import { app } from 'electron'` | Electron | HIGH |
| `forge.config.ts` (Electron Forge) | Electron | HIGH |
| `package.json` has `@tauri-apps/api` | Tauri v2 | MEDIUM |
| `package.json` has `electron` in devDependencies | Electron | MEDIUM |

**Important:** Desktop apps typically use React/Vite as the web layer. When a desktop framework is detected, load BOTH this skill AND the `react-vite-patterns` skill. The web layer patterns (routing, CSS, components) come from React/Vite; the desktop shell patterns (titlebar, drag, tray) come from this skill.

Store in `DESIGN-DNA.md`:
```yaml
framework: tauri  # or electron
web-layer: react-vite
```

### When to Use

- Any project using Tauri v2 -- this skill is mandatory for correct desktop-aware design
- Any project using Electron -- this skill is mandatory for correct desktop-aware design
- During `/gen:start-project` -- detect framework, generate desktop-specific DNA extensions
- During `/gen:plan-dev` -- section planner accounts for titlebar offset, platform variants, keyboard shortcuts
- During `/gen:execute` -- builders generate platform-aware components

### When NOT to Use

- Web-only projects (Next.js, Astro, React/Vite without desktop shell) -- none of these patterns apply
- Progressive Web Apps (PWAs) -- different pattern set; PWAs have limited window control
- Mobile apps (React Native, Capacitor) -- different platform patterns entirely

### Tauri vs Electron

Genorah does not choose the framework -- the project already has one. Both are valid targets with different trade-offs:

| Aspect | Tauri v2 | Electron |
|--------|----------|----------|
| Backend | Rust | Node.js |
| Bundle size | 5-15 MB | 80-200+ MB |
| WebView | System (WebView2, WebKit) | Bundled Chromium |
| Maturity | Newer (v2 stable 2024) | Mature (10+ years) |
| Titlebar API | `data-tauri-drag-region` attribute | `app-region: drag` CSS property |
| Window controls | `@tauri-apps/api/window` | `titleBarOverlay` or custom buttons |
| System tray | `@tauri-apps/plugin-tray` | `Tray` class |
| IPC | `@tauri-apps/api/core.invoke()` | `ipcRenderer` / `contextBridge` |

### Desktop Design Concerns

Nine concerns that web-only skills do not address:

1. **Titlebar area** -- App must account for custom or native titlebar space. Content cannot be hidden behind it.
2. **Drag regions** -- User needs to move the window by clicking and dragging. Some area must be designated as draggable.
3. **Window controls** -- Minimize, maximize, close buttons. Platform-specific position and style.
4. **Platform differences** -- macOS traffic lights (top-left, colored circles) vs Windows controls (top-right, icon buttons).
5. **Content offset** -- Main content must NOT overlap with the titlebar. Body padding or CSS offset required.
6. **System tray** -- Background functionality, notifications, quick actions. Icon and menu design.
7. **Multi-window** -- Settings, preferences, floating panels. Each window gets consistent DNA theming.
8. **Native menus** -- macOS menu bar, context menus. Menu structure and keyboard shortcut mapping.
9. **Keyboard shortcuts** -- Cmd (macOS) vs Ctrl (Windows/Linux) awareness. Standard OS shortcuts respected.

### Decision Tree: Titlebar Strategy

- **Custom titlebar desired** (most award-winning approach) -> Hide native titlebar, build HTML/CSS titlebar with DNA tokens and drag region
- **Native titlebar sufficient** (simpler apps) -> Keep native titlebar, account for its height in layout
- **Hybrid approach** (macOS) -> `titleBarStyle: 'hiddenInset'` preserves traffic lights, hides title text, custom content fills remaining space
- **Electron overlay** -> `titleBarOverlay` adds native controls over custom titlebar content, avoids reimplementing buttons

### Decision Tree: Window Type

- **Main window** -> Full titlebar + navigation + content area + optional sidebar
- **Settings/preferences** -> Secondary window, typically 500-700px width, sidebar + content panel layout
- **Floating panel** -> Small window (300-400px width), no sidebar, compact controls, always-on-top option
- **Dialog** -> Modal overlay within main window (not a separate OS window), standard Radix/headless UI dialog pattern
- **Onboarding** -> Fixed-size window, step-based layout, no resize, branded custom titlebar

### Pipeline Connection

- **Referenced by:** section-builder, build-orchestrator during `/gen:execute`
- **Consumed at:** plan-dev (desktop-aware planning), execute (code generation), verify (platform-specific checks)
- **Loaded alongside:** react-vite-patterns (web layer), tailwind-system (CSS tokens)

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Tauri v2 Custom Titlebar

```tsx
// components/TitleBar.tsx
'use client'
import { getCurrentWindow } from '@tauri-apps/api/window'

const appWindow = getCurrentWindow()

interface TitleBarProps {
  title?: string
}

export function TitleBar({ title = 'App Name' }: TitleBarProps) {
  const isMacOS = navigator.platform.includes('Mac')

  return (
    <header
      data-tauri-drag-region
      className="fixed top-0 inset-x-0 h-10 flex items-center bg-surface/80 backdrop-blur-md border-b border-border select-none z-50"
      role="banner"
      aria-label="Application titlebar"
    >
      {/* macOS: traffic lights are left, pad to avoid overlap */}
      {isMacOS && <div className="w-20 shrink-0" aria-hidden="true" />}

      {/* Center: app title or breadcrumb */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xs font-medium text-muted tracking-wide uppercase">
          {title}
        </span>
      </div>

      {/* Windows/Linux: custom controls on right */}
      {!isMacOS && (
        <div className="flex items-center shrink-0" role="group" aria-label="Window controls">
          <button
            onClick={() => appWindow.minimize()}
            className="h-10 w-12 flex items-center justify-center text-muted hover:bg-border/50 hover:text-text transition-colors"
            aria-label="Minimize window"
          >
            <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
              <rect width="10" height="1" />
            </svg>
          </button>
          <button
            onClick={() => appWindow.toggleMaximize()}
            className="h-10 w-12 flex items-center justify-center text-muted hover:bg-border/50 hover:text-text transition-colors"
            aria-label="Maximize window"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="0.5" y="0.5" width="9" height="9" />
            </svg>
          </button>
          <button
            onClick={() => appWindow.close()}
            className="h-10 w-12 flex items-center justify-center text-muted hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Close window"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.2">
              <line x1="0" y1="0" x2="10" y2="10" />
              <line x1="10" y1="0" x2="0" y2="10" />
            </svg>
          </button>
        </div>
      )}
    </header>
  )
}
```

Tauri v2 configuration for hidden titlebar:

```json
{
  "app": {
    "windows": [
      {
        "title": "App Name",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "decorations": false,
        "transparent": false
      }
    ]
  }
}
```

Key points:
- `data-tauri-drag-region` on the header element makes it draggable
- Buttons inside do NOT inherit drag behavior -- they remain clickable
- macOS padding (w-20) avoids overlap with native traffic lights when using `decorations: false` with traffic lights preserved
- Window control SVGs are inline for instant rendering (no icon library load)

#### Pattern 2: Electron Custom Titlebar

```javascript
// main.js (Electron main process)
const { BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      // DNA tokens mapped to Electron overlay
      color: '#0a0a0f',       // --color-surface or --color-bg
      symbolColor: '#f0ece6', // --color-text
      height: 40,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadURL('http://localhost:5173') // Vite dev server
}
```

```css
/* Electron titlebar CSS */
.titlebar {
  app-region: drag;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  user-select: none;
}

/* Interactive elements MUST opt out of drag */
.titlebar button,
.titlebar a,
.titlebar input,
.titlebar select {
  app-region: no-drag;
}
```

With `titleBarOverlay`, Electron renders native window controls (min/max/close) over the custom titlebar. This is the recommended approach for Windows -- native controls match OS expectations, custom content fills the remaining space.

For macOS with Electron, `titleBarStyle: 'hiddenInset'` preserves native traffic lights with inset positioning:

```javascript
const win = new BrowserWindow({
  titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
  titleBarOverlay: process.platform !== 'darwin' ? {
    color: '#0a0a0f',
    symbolColor: '#f0ece6',
    height: 40,
  } : undefined,
})
```

#### Pattern 3: Content Offset for Titlebar

Every desktop app must account for the titlebar height in page layout. Content hidden behind a fixed titlebar is one of the most common desktop design mistakes.

```tsx
// App.tsx -- Root layout with titlebar offset
import { TitleBar } from './components/TitleBar'
import { Outlet } from 'react-router'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <TitleBar />
      {/* pt-10 matches TitleBar h-10 */}
      <div className="pt-10">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

For Electron with `titleBarOverlay`, use the CSS environment variable:

```css
/* Electron provides env(titlebar-area-height) when using titleBarOverlay */
.app-content {
  padding-top: env(titlebar-area-height, 40px);
}

/* Or in Tailwind */
.app-content {
  padding-top: var(--titlebar-height, 2.5rem);
}
```

For dynamic titlebar heights (e.g., breadcrumb bar below titlebar):

```tsx
const TITLEBAR_HEIGHT = 40  // px, matches TitleBar component
const BREADCRUMB_HEIGHT = 36 // px, optional secondary bar

function AppLayout({ showBreadcrumb }: { showBreadcrumb?: boolean }) {
  const offset = TITLEBAR_HEIGHT + (showBreadcrumb ? BREADCRUMB_HEIGHT : 0)
  return (
    <div style={{ paddingTop: offset }}>
      {/* Content safely below all fixed bars */}
    </div>
  )
}
```

#### Pattern 4: Platform Detection

```typescript
// lib/platform.ts

export type Platform = 'macos' | 'windows' | 'linux'

export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('mac')) return 'macos'
  if (userAgent.includes('win')) return 'windows'
  return 'linux'
}

// For Tauri apps, prefer the Tauri API for reliable detection
export async function detectPlatformTauri(): Promise<Platform> {
  const { platform } = await import('@tauri-apps/plugin-os')
  const os = await platform()
  if (os === 'macos') return 'macos'
  if (os === 'windows') return 'windows'
  return 'linux'
}

// Platform-specific constants
export const PLATFORM_CONFIG: Record<Platform, {
  controlsPosition: 'left' | 'right'
  titlebarPadding: { left: number; right: number }
  modifierKey: 'Cmd' | 'Ctrl'
  modifierSymbol: string
}> = {
  macos: {
    controlsPosition: 'left',
    titlebarPadding: { left: 80, right: 16 },  // Room for traffic lights
    modifierKey: 'Cmd',
    modifierSymbol: '\u2318', // Command symbol
  },
  windows: {
    controlsPosition: 'right',
    titlebarPadding: { left: 16, right: 144 },  // Room for 3 control buttons
    modifierKey: 'Ctrl',
    modifierSymbol: 'Ctrl',
  },
  linux: {
    controlsPosition: 'right',
    titlebarPadding: { left: 16, right: 144 },
    modifierKey: 'Ctrl',
    modifierSymbol: 'Ctrl',
  },
}
```

Usage in components:

```tsx
import { detectPlatform, PLATFORM_CONFIG } from '../lib/platform'

function KeyboardShortcut({ action, keys }: { action: string; keys: string }) {
  const platform = detectPlatform()
  const config = PLATFORM_CONFIG[platform]

  // Replace "Mod" with platform-specific key
  const displayKeys = keys.replace('Mod', config.modifierSymbol)

  return (
    <kbd className="text-xs text-muted font-mono bg-surface border border-border rounded px-1.5 py-0.5">
      {displayKeys}
    </kbd>
  )
}

// Usage: <KeyboardShortcut action="Save" keys="Mod+S" />
// macOS renders: Cmd+S   Windows renders: Ctrl+S
```

#### Pattern 5: Multi-Window Patterns

```typescript
// lib/windows.ts (Tauri v2)
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

export async function openSettingsWindow() {
  const settings = new WebviewWindow('settings', {
    url: '/settings',
    title: 'Settings',
    width: 600,
    height: 500,
    minWidth: 500,
    minHeight: 400,
    resizable: true,
    decorations: false,   // Custom titlebar in settings too
    center: true,
  })

  settings.once('tauri://error', (e) => {
    console.error('Failed to open settings window:', e)
  })
}

export async function openQuickPanel() {
  const panel = new WebviewWindow('quick-panel', {
    url: '/quick-panel',
    title: 'Quick Panel',
    width: 380,
    height: 480,
    resizable: false,
    decorations: false,
    alwaysOnTop: true,
    skipTaskbar: true,   // Floating panel, not in taskbar
  })
}
```

```tsx
// routes/Settings.tsx -- Settings window layout
import { TitleBar } from '../components/TitleBar'

const SETTINGS_SECTIONS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
  { id: 'shortcuts', label: 'Shortcuts', icon: KeyboardIcon },
  { id: 'about', label: 'About', icon: InfoIcon },
] as const

export default function Settings() {
  const [active, setActive] = useState<string>('general')

  return (
    <div className="h-screen flex flex-col bg-bg text-text">
      <TitleBar title="Settings" />
      <div className="flex-1 flex pt-10 overflow-hidden">
        {/* Sidebar navigation */}
        <nav
          className="w-48 shrink-0 border-r border-border p-2 space-y-0.5"
          role="tablist"
          aria-label="Settings sections"
        >
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              role="tab"
              aria-selected={active === section.id}
              onClick={() => setActive(section.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                active === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:bg-surface hover:text-text',
              )}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <main className="flex-1 overflow-y-auto p-6" role="tabpanel">
          {/* Render active section */}
        </main>
      </div>
    </div>
  )
}
```

Key multi-window principles:
- Every window gets the same TitleBar component (consistent DNA)
- Every window gets the same CSS tokens (load `index.css` in every window entry)
- Settings use a sidebar layout pattern at constrained width
- Floating panels use compact layouts with no sidebar

#### Pattern 6: System Tray Integration

```rust
// src-tauri/src/lib.rs (Tauri v2 Rust backend)
use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("App Name")
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```javascript
// Electron main process tray setup
const { Tray, Menu, nativeImage } = require('electron')

function createTray(mainWindow) {
  const icon = nativeImage.createFromPath('assets/tray-icon.png')
  const tray = new Tray(icon.resize({ width: 16, height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: 'Settings', click: () => openSettingsWindow() },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' },
  ])

  tray.setToolTip('App Name')
  tray.setContextMenu(contextMenu)

  // Click to show main window
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}
```

#### Pattern 7: Desktop-Specific Responsive

Desktop apps have fundamentally different responsive needs than web apps:

```css
/* Desktop responsive: no mobile breakpoints needed */
/* Minimum window size is typically 800x600 */

/* Narrow window state (sidebar collapses) */
@media (max-width: 900px) {
  .sidebar {
    width: 48px;         /* Icon-only mode */
    overflow: hidden;
  }
  .sidebar-label {
    display: none;       /* Hide text labels */
  }
}

/* Standard desktop (sidebar visible) */
@media (min-width: 901px) {
  .sidebar {
    width: 240px;
  }
}

/* Wide desktop (optional secondary panel) */
@media (min-width: 1400px) {
  .detail-panel {
    display: block;      /* Show side detail panel */
    width: 320px;
  }
}
```

```tsx
// Resizable sidebar with drag handle
import { useState, useCallback } from 'react'

function ResizableSidebar({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(240)
  const MIN_WIDTH = 180
  const MAX_WIDTH = 400

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width

    function handleMouseMove(e: MouseEvent) {
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + (e.clientX - startX)))
      setWidth(newWidth)
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [width])

  return (
    <aside className="relative shrink-0 border-r border-border" style={{ width }}>
      {children}
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors"
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={width}
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-label="Resize sidebar"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setWidth(Math.max(MIN_WIDTH, width - 20))
          if (e.key === 'ArrowRight') setWidth(Math.min(MAX_WIDTH, width + 20))
        }}
      />
    </aside>
  )
}
```

Key desktop responsive principles:
- Minimum window size prevents extreme squishing (800x600 typical minimum)
- No 375px mobile breakpoints -- desktop users never see phone-width layouts
- Sidebar collapse at narrow widths instead of hamburger menu
- Resizable panels with drag handles are desktop-native interaction patterns
- Keyboard shortcuts replace touch gestures

### Reference Sites

- **Linear** (linear.app) -- Desktop-class app design. Custom titlebar with integrated navigation, keyboard-first workflows, consistent DNA across main and settings windows. The benchmark for desktop app design quality.
- **Figma Desktop** (figma.com) -- Custom titlebar with tabs integrated into drag region. Multi-window support (inspector panels). Platform-aware controls. Shows how complex tools handle window chrome.
- **Notion Desktop** (notion.so) -- Clean custom titlebar with breadcrumb navigation in the drag region. Sidebar resize with drag handle. Consistent theme across multiple windows. macOS and Windows variants both feel native.
- **Raycast** (raycast.com) -- Floating panel design. Compact window with no traditional titlebar. Shows how floating panels can be a primary interaction mode. Keyboard-first with beautiful DNA integration.
- **Arc Browser** (arc.net) -- Radically custom window chrome. Sidebar-first navigation that replaces traditional tabs and titlebar. Shows how far custom chrome can go while still feeling native. macOS-native aesthetic.

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Desktop Usage |
|-----------|--------------|
| `bg` | Main window background, secondary window background |
| `surface` | Titlebar background (often with `backdrop-blur` and opacity), sidebar, panels |
| `text` | Titlebar text, window control icons, content |
| `border` | Titlebar bottom border, sidebar border, panel separators |
| `primary` | Active tab indicator, selected sidebar item, focus rings |
| `muted` | Titlebar text, inactive controls, shortcut text |
| `glow` | Electron `titleBarOverlay` can use glow for dark-mode depth |
| All 12 tokens | Every window, panel, and dialog uses the full DNA palette |

The titlebar is a design surface. It is NOT a generic gray bar. DNA tokens make the titlebar part of the visual identity. The titlebar should be as designed as any section of the page.

Electron `titleBarOverlay` mapping:
```javascript
titleBarOverlay: {
  color: dna.colors.surface,      // --color-surface value
  symbolColor: dna.colors.text,   // --color-text value
  height: 40,
}
```

### Archetype Variants

The titlebar style should match the project's archetype:

| Archetype | Titlebar Treatment |
|-----------|-------------------|
| Brutalist | Thick 3px bottom border, uppercase title, stark contrast, no blur |
| Ethereal | Translucent (bg-surface/60 backdrop-blur-xl), subtle separator, soft text |
| Neon Noir | Dark bg with subtle glow on border, muted text, hover glow on controls |
| Swiss/International | Clean, precise alignment, 1px border, small caps title, no decoration |
| Glassmorphism | Heavy blur (backdrop-blur-2xl), semi-transparent, glass border effect |
| Editorial | Serif title text, refined thin border, generous padding |
| Kinetic | Standard bar, but micro-animation on window control hover |
| Dark Academia | Warm surface tone, serif title, subtle texture |
| Japanese Minimal | Maximum restraint, hairline border, minimal elements |
| Neo-Corporate | Professional clean bar, system font option, corporate precision |

For archetypes not listed: use the archetype's core aesthetic applied to a 40px horizontal bar. The titlebar should feel like a natural extension of the archetype's design language.

### Pipeline Stage

- **Input from:** Design DNA (tokens + archetype), section-planner (desktop-aware plans)
- **Output to:** Desktop-aware components with platform detection, titlebar, drag regions

### Related Skills

- **react-vite-patterns** -- Desktop apps use React/Vite as the web layer. Load both skills together. React/Vite handles routing, components, styling; this skill handles desktop shell integration.
- **tailwind-system** -- Same `@theme` tokens in `index.css`. Tailwind works identically in desktop and web contexts.
- **dark-light-mode** -- Titlebar must update with theme toggle. Dark mode titlebar uses different surface/text tokens. Electron `titleBarOverlay` must be updated programmatically on theme change.
- **accessibility** -- Window controls need `aria-label`. Drag handle needs `role="separator"` with `aria-orientation`. Keyboard shortcuts need platform-aware display (Cmd vs Ctrl). Focus management spans windows.
- **cinematic-motion** -- Desktop apps can use the same motion libraries. Window transitions (opening settings window) should use motion patterns appropriate to the archetype.

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Web-Only Design in Desktop Shell

**What goes wrong:** Builder generates a standard web layout with navbar, hero section, footer -- ignoring that this is a desktop app. The result feels like a browser tab, not an application. No titlebar integration, no drag regions, no keyboard shortcuts, no system tray.
**Instead:** Treat the desktop shell as a first-class design surface. Build a custom titlebar with DNA tokens. Add drag regions. Implement keyboard shortcuts. Use desktop layout patterns (sidebar + content, not hero + sections).

### Anti-Pattern 2: One-Size-Fits-All Titlebar

**What goes wrong:** Same titlebar code deployed to macOS and Windows. On macOS, custom controls overlap with native traffic lights. On Windows, the missing native feel looks jarring.
**Instead:** Detect platform at runtime. macOS: preserve traffic lights with left padding (w-20), custom content fills center and right. Windows: use `titleBarOverlay` for native controls, or build custom controls on the right side. Test both platforms.

### Anti-Pattern 3: Forgetting Content Offset

**What goes wrong:** Fixed titlebar at top of viewport, but main content starts at top of viewport too. First 40px of content is hidden behind the titlebar. User cannot see or interact with top content.
**Instead:** Add `padding-top` to the content container matching the titlebar height. If titlebar is `h-10` (40px), content needs `pt-10`. For Electron `titleBarOverlay`, use `env(titlebar-area-height, 40px)`.

### Anti-Pattern 4: Mobile Breakpoints in Desktop

**What goes wrong:** Builder includes 375px, 640px, 768px responsive breakpoints in a desktop app. These viewport widths never occur (minimum window size is 800px+). The CSS is dead code.
**Instead:** Desktop responsive starts at the minimum window size (typically 800px). Use breakpoints for narrow window (< 900px: sidebar collapses), standard (900-1400px), and wide (> 1400px: secondary panels appear). Mobile-first breakpoints waste CSS and confuse the responsive model.

### Anti-Pattern 5: Drag Region on Interactive Elements

**What goes wrong:** Entire titlebar has `data-tauri-drag-region` or `app-region: drag`, including buttons, links, and inputs within it. Users click a button but the window drags instead.
**Instead:** Apply drag region to the container element. Interactive children automatically exclude themselves in Tauri (`data-tauri-drag-region` does not propagate to child buttons). For Electron, explicitly set `app-region: no-drag` on all interactive elements within the drag region.

### Anti-Pattern 6: Ignoring Keyboard Shortcuts

**What goes wrong:** Desktop app only supports mouse interaction. No keyboard shortcuts for common actions (save, undo, search, settings). Users expect desktop apps to be keyboard-operable.
**Instead:** Map common actions to platform-aware shortcuts: Cmd+S / Ctrl+S (save), Cmd+Z / Ctrl+Z (undo), Cmd+K / Ctrl+K (command palette), Cmd+, / Ctrl+, (settings). Display shortcuts in menus and tooltips with platform-correct modifier keys.

### Anti-Pattern 7: Separate Theme Per Window

**What goes wrong:** Settings window opens in light mode while main window is in dark mode. Each window manages its own theme state independently.
**Instead:** Share theme state across windows. In Tauri, use the event system (`emit`/`listen`) to broadcast theme changes. In Electron, use IPC to sync theme across all windows. When any window toggles theme, ALL windows update immediately.

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| titlebar-height | 32 | 48 | px | HARD -- below 32 is too small to click, above 48 wastes space |
| macos-traffic-light-padding | 70 | 80 | px | HARD -- must not overlap native traffic lights |
| min-window-width | 600 | 1000 | px | SOFT -- depends on app complexity, 800 is typical default |
| min-window-height | 400 | 800 | px | SOFT -- depends on app complexity, 600 is typical default |
| control-button-width | 40 | 56 | px | HARD -- must be clickable, Windows convention is ~46px |
| control-button-height | 32 | 48 | px | HARD -- matches titlebar height |
| sidebar-min-width | 48 | 200 | px | SOFT -- 48 for icon-only collapsed state |
| sidebar-max-width | 240 | 400 | px | SOFT -- wider than 400 wastes content area |
| drag-region-min-height | 32 | 48 | px | HARD -- must have sufficient drag target area |
| keyboard-shortcut-modifier | -- | -- | -- | HARD -- must use Cmd on macOS, Ctrl on Windows/Linux |
