---
name: preloader-animation
tier: domain
description: "Archetype-specific preloader patterns with duration budgets, performance compliance (LCP-safe via post-paint mount), sessionStorage skip-on-revisit, prefers-reduced-motion fallback to static poster. 25 archetype variants (19 original + 6 v3.1). Max 2.5s hero delay, 0.8s skip button, requestIdleCallback for heavy content."
triggers: ["preloader", "intro animation", "loading screen", "page entrance", "splash screen", "branded loader", "intro reveal"]
used_by: ["builder", "planner", "start-project"]
version: "3.1.0"
---

## Layer 1: Decision Guidance

### Why Preloader

A preloader is a signature moment — 2 seconds that anchor brand identity before the user sees anything else. Done well: memorable, on-brand, gives heavy assets time to prep. Done poorly: blocks LCP, ignores reduced-motion, annoys returning users.

This skill defines the contract: archetype-driven variant, duration budget, skip affordance, revisit skip, a11y compliance.

### When to Use

- User opted into preloader in `/gen:start-project` discovery.
- Hero beat has expensive setup (3D, video, complex animations) that benefits from pre-warming.
- Brand archetype explicitly uses preloader as signature (Ethereal, Cinematic, Editorial).

### When NOT to Use

- Simple landing with no heavy assets (adds delay without value).
- `prefers-reduced-motion: reduce` — replace with static poster.
- Returning visitors (`sessionStorage.genorah-visited === "true"`) — skip immediately.
- SaaS dashboards / app routes (only for marketing/landing routes).

### Decision Tree

```
User opted into preloader?
├─ no → skip, route directly to hero
└─ yes → check sessionStorage.genorah-visited
    ├─ yes → skip, set flag
    └─ no → check prefers-reduced-motion
        ├─ reduce → show static poster for 400ms max
        └─ default → run archetype variant with max 2.5s duration
            → show skip button after 800ms
            → on exit: set sessionStorage, fade to content
```

## Layer 2: Archetype Variants

Each variant declares: duration_max_ms, skip_after_ms, exit_style. All 25 archetypes get a default variant. Four representative examples here; full variant table lives in this skill's `variants/` data.

### Brutalist — Violent Type Reveal (`duration_max_ms: 1500, skip_after_ms: 500, exit: hard-cut`)

```tsx
function BrutalistPreloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('genorah-visited')) { onComplete(); return; }
    const steps = [0, 10, 25, 50, 75, 90, 100];
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(timer);
        setDone(true);
        sessionStorage.setItem('genorah-visited', 'true');
        onComplete();
        return;
      }
      setCount(steps[idx++]);
    }, 200);
    return () => clearInterval(timer);
  }, [onComplete]);

  if (done) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <span className="font-mono text-7xl text-white">{count}</span>
    </div>
  );
}
```

### Ethereal — Gradient Wash (`duration_max_ms: 2500, skip_after_ms: 800, exit: 700ms-dissolve`)

Logo center, slow gradient wash from top, opacity dissolve on exit. Uses motion/react.

### Kinetic — Spring Counter (`duration_max_ms: 1800, skip_after_ms: 600, exit: spring-slide-up`)

Rapid-increment counter with spring-physics overshoot on exit.

### Cyberpunk-HUD (v3.1 archetype) — CRT Scanline (`duration_max_ms: 2000, skip_after_ms: 700, exit: glitch-blur`)

CRT scan-line animation with corner-bracket "BOOT SEQUENCE" text. Exits with digital glitch.

### Remaining 21 archetype variants — pattern-based generation

The four variants above (Brutalist, Ethereal, Kinetic, Cyberpunk-HUD) are **representative templates** covering the main preloader-style clusters. Remaining 21 archetypes follow the same pattern: pick an archetype-aligned technique, fit the duration budget, apply the exit style, add skip button + RM fallback + sessionStorage gating.

Builders generate these on-demand during `/gen:build` using:
- The 4 reference variants as structural templates
- Archetype's signature element + tension zones as visual vocabulary
- Archetype easing curve from `animation-orchestration` skill
- Duration budget from the table above

**Archetype → variant-cluster mapping (builders consult this to pick the closest reference):**

| Archetype | Closest reference cluster | Key adaptation |
|---|---|---|
| Swiss/International, Japanese Minimal, Neo-Corporate, Editorial | Brutalist cluster (hard-cut, minimal) | Soften timing (1.8-2.0s), use DNA display font in neutral |
| Ethereal, Glassmorphism, Spatial/VisionOS, Luxury/Fashion, Warm Artisan | Ethereal cluster (gradient wash, dissolve) | Swap gradient to archetype palette, keep soft exit |
| Kinetic, Playful/Startup, Claymorphism, Organic | Kinetic cluster (spring physics, overshoot) | Adjust spring stiffness per archetype energy |
| Neon Noir, Cyberpunk-HUD, Vaporwave, AI-Native, Y2K | Cyberpunk-HUD cluster (scan-line, glitch) | Palette + glow intensity per archetype |
| Brutalist, Neubrutalism, Retro-Future, Dark Academia, Pixel-Art, Data-Dense | Brutalist cluster (hard-cut, typographic) | Font + spacing per archetype |

Each variant is a ~30-line TSX file generated at build time, not pre-written. This keeps the skill tight and guarantees variants stay DNA-synchronized.

## Layer 2: Performance Rules (Hard)

### Max duration budget by archetype energy

| Archetype group | Max duration | Skip button at |
|-----------------|--------------|----------------|
| Minimal (Brutalist, Swiss, Japanese) | 1.5s | 500ms |
| Default (most archetypes) | 2.0s | 800ms |
| Dramatic (Ethereal, Cinematic, Editorial) | 2.5s | 800ms |

**Hard gate:** Preloader total time (including exit) must be ≤ `duration_max_ms + 500ms`. Exceeding = `-2` penalty in `/gen:audit`.

### LCP-safe mount

```tsx
// Root layout: defer page render until preloader exits, but DON'T block initial paint
export default function RootLayout({ children }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <html>
      <body>
        {!preloaderDone && <PreloaderAnimation onComplete={() => setPreloaderDone(true)} />}
        <main style={{ visibility: preloaderDone ? 'visible' : 'hidden' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

Notes:
- Render page content with `visibility: hidden` (not `display: none`) — this lets LCP candidate paint in the background.
- Preloader sits on top with `position: fixed` + high z-index.
- On complete, swap visibility → no layout shift.

### Skip button — mandatory after `skip_after_ms`

Accessibility requirement: user must be able to bypass the preloader. Add a "Skip" button (bottom-right) that appears at `skip_after_ms`:

```tsx
{elapsedMs > skip_after_ms && (
  <button
    onClick={() => { setDone(true); onComplete(); }}
    className="fixed bottom-4 right-4 text-xs text-white/60 underline"
  >
    Skip
  </button>
)}
```

### Reduced-motion fallback (required)

```tsx
const reducedMotion = useReducedMotion(); // from motion/react
if (reducedMotion) {
  return <img src="/preloader-poster.avif" className="fixed inset-0" alt="" />;
}
```

Static poster shows for 400ms max, then transparent → page content.

### Skip on revisit (required)

`sessionStorage.getItem('genorah-visited')` — skip entirely. Works in incognito (session-scoped).

## Layer 3: Integration Context

- **`/gen:start-project`** discovery: 1 question — `preloader: { enabled: y/n/later, style: short|medium|dramatic }` (named key, not ordinal).
- **Builder Wave 0**: when `preloader: enabled`, generates `<Preloader>` component + wires into root layout.
- **Motion-health skill**: counts preloader as a concurrent animation against HOOK budget (≤3 concurrent at HOOK). Preloader exits before hero animations start — no conflict in practice.
- **Perf-budgets skill**: preloader JS adds 8–15KB gzipped. Gracefully fits HOOK beat JS budget (40KB). Tracked in `METRICS.md`.

## Layer 4: Anti-Patterns

- ❌ **Long preloaders (>3s)** — users bounce. 2.5s hard max regardless of archetype.
- ❌ **No skip button** — accessibility violation. Required after `skip_after_ms`.
- ❌ **Preloader without reduced-motion fallback** — WCAG 2.3.3. Always poster-fallback.
- ❌ **Preloader runs on every route** — landing only; not `/dashboard`, `/app`, `/settings`.
- ❌ **sessionStorage skip logic buggy** — test in Safari (strict cookie/storage mode). Graceful fallback: "preloader runs every visit" is better than "preloader crashes".
- ❌ **Preloader blocks LCP** — render page content with `visibility: hidden`, not `display: none` or conditional unmount.
- ❌ **Preloader pulls attention from hero** — exit transition must hand off visually to hero. Don't just cut to black then show content.
