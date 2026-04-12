---
name: remotion-section-video
category: domain
description: "Programmatic section-video generation via Remotion. 5 DNA-parameterized templates (kinetic-type, particle-field, shape-morph, color-field, camera-fly), dual-encode AVIF/MP4/WebM output, LCP-safe lazy autoplay. Opt-in via PLAN.md flag or /gen:video command."
triggers: ["section video", "hero video", "background video", "remotion section", "programmatic video background", "kinetic background", "/gen:video"]
used_by: ["builder", "3d-specialist"]
version: "3.0.0"
---

## Layer 1: Decision Guidance

### Why Remotion for Section Backgrounds

Hero HOOK sections with motion-heavy atmosphere often need video rather than pure CSS/WebGL. Remotion gives programmatic, DNA-parameterized video generation: same 5 templates produce infinite brand-specific variants, rendered at build time.

Tradeoff vs WebGL/Spline: video is *baked* — no runtime cost beyond decode, but cannot respond to cursor/scroll live. Use video for atmosphere; use WebGL/Spline for interactivity.

### When to Use

- HOOK or PEAK beat with atmospheric background need.
- Project's mobile performance matters (WebGL is heavy on low-end devices; video decodes via hardware).
- Client wants a signature motion piece without runtime GPU cost.

### When NOT to Use

- Interactive 3D required (use Spline or R3F).
- LCP budget is tight (<1.5s) — video still requires poster + lazy load.
- Content-heavy section — video distracts from reading.

## Layer 2: Template Catalog

### 1. Kinetic Type

Large DNA-display-font words scale/rotate/morph across viewport. 4s loop. Parameters: `text[]`, `font_weight`, `motion_intensity` (1-5).

### 2. Particle Field

N particles with DNA-accent color trails, attract/repel via noise field. 6s loop. Parameters: `particle_count`, `field_type` (flow|swarm|burst), `color_tokens[]`.

### 3. Shape Morph

SVG shapes morph between archetype-relevant forms (circle↔square↔triangle for Brutalist; blob↔ripple for Ethereal). 5s loop. Parameters: `shape_seq[]`, `easing_curve`.

### 4. Color Field

Full-bleed gradient mesh animating across DNA palette. 8s loop (slow, atmospheric). Parameters: `palette_tokens[]`, `gradient_type` (conic|radial|linear).

### 5. Camera Fly

Pseudo-3D camera movement through layered DNA signature elements. 7s loop. Parameters: `layer_depth` (2-6), `motion_path` (straight|curve|spiral).

## Layer 2: Technical Spec

### Render pipeline

```bash
# Build-time
npx remotion render src/HeroVideo.tsx HeroVideo out/hero.mp4 \
  --codec h264 --crf 23 --props '{"tokens":{"primary":"#4b91e3"}}'

# Parallel dual-encode
npx remotion render src/HeroVideo.tsx HeroVideo out/hero.webm \
  --codec vp9 --crf 30 --props '{"tokens":{"primary":"#4b91e3"}}'

# Poster
npx remotion still src/HeroVideo.tsx HeroVideo out/hero-poster.avif --frame 0
```

### Playback wiring

```tsx
<div className="relative w-full aspect-video overflow-hidden" data-section="hero">
  <video
    playsInline autoPlay muted loop
    preload="none"
    poster="/hero-poster.avif"
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/hero.webm" type="video/webm" />
    <source src="/hero.mp4" type="video/mp4" />
  </video>
  <div className="absolute inset-0 bg-[var(--color-bg)]/40" aria-hidden="true" />
  {/* content overlay */}
</div>
```

- `preload="none"` — don't block LCP.
- Poster = AVIF first-frame — paints immediately, LCP-eligible.
- Overlay scrim — text readability vs full-bleed video.
- No autoplay w/ sound — always muted.

### DNA token injection

```tsx
// src/HeroVideo.tsx
export const HeroVideo: React.FC<{tokens: Record<string,string>}> = ({tokens}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: tokens.bg}}>
      <KineticTypeScene primaryColor={tokens.primary} accent={tokens.accent} />
    </AbsoluteFill>
  );
};
```

Token prop passed via `--props` at render time. Re-run render on DNA change.

### Constraint table

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| video_duration_s | 3 | 12 | s | HARD (loops feel natural) |
| mp4_target_size | — | 1.5 | MB | HARD |
| webm_target_size | — | 1.0 | MB | HARD |
| poster_size | — | 80 | KB | HARD AVIF |
| render_concurrency | 1 | 4 | workers | SOFT per build |
| prefers_reduced_motion_fallback | static poster only | — | — | HARD |

### Reduced-motion fallback

```tsx
const reducedMotion = useReducedMotion();
return reducedMotion ? <img src="/hero-poster.avif" /> : <video>...</video>;
```

## Layer 3: Integration Context

- **`/gen:video {section}`** command — generates/regenerates video for a section.
- **Builder** — opt-in via PLAN.md `videoBackground: true` flag; auto-invokes this skill.
- **Image-asset-pipeline skill** — poster generation shares AVIF encoding path.
- **Perf-budgets skill** — hero video counts against hero_img budget; 1.5MB cap leaves no room for bloat.

## Layer 4: Anti-Patterns

- ❌ **Autoplay with sound** — blocked by browser, and hostile UX.
- ❌ **No poster** — LCP regression until video decodes.
- ❌ **Single codec (MP4 only)** — WebM is smaller in 2026, Safari supports it; ship both.
- ❌ **`preload="auto"`** — pre-downloads multi-MB before any interaction.
- ❌ **Skipping reduced-motion fallback** — vestibular trigger; mandatory.
- ❌ **Long loops (>15s)** — re-render cost high, and subtle loops feel infinite; 4-8s is the sweet spot.
- ❌ **Re-encoding on every build** — cache by DNA-token hash; skip if unchanged.
