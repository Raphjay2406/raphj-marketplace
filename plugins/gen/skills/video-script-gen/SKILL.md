---
name: video-script-gen
description: DNA-voiced video scripts for Remotion compositions. Timed scenes, typographic animations via DNA display font, archetype color-grade, audio cue timing markers, auto-captions for a11y.
tier: domain
triggers: video-script, remotion, motion-graphics, typographic-animation, captions
version: 0.1.0
---

# Video Script Gen

Chains into existing `remotion-section-video` skill. Produces TSX composition + script + caption file.

## Layer 1 — When to use

- Section video (hero background, brand intro)
- Social video (ad, promo, announcement)
- Product walkthrough
- Animated explainer

## Layer 2 — Input brief

```yaml
beat: HOOK  # or PEAK, CLOSE
duration_s: 15
intent: "introduce new seasonal blend — warm, nostalgic"
archetype: warm-artisan
target_aspect: 16:9  # or 9:16 for vertical
music_cue: "60 BPM warm acoustic"
```

## Layer 3 — Output

### `compositions/VideoHook.tsx`

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export function VideoHook({ brand }: { brand: { name: string; primary: string; display: string } }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 0-30f: text fades in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  // 30-60f: gentle scale pulse
  const scale = interpolate(frame, [30, 60], [1, 1.03], { extrapolateRight: 'clamp' });
  // 60-120f: hold
  // 120-150f: fade out
  const opacity = interpolate(frame, [120, 150], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.primary, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        fontFamily: brand.display,
        fontSize: 180,
        color: '#fff',
        opacity: titleOpacity * opacity,
        transform: `scale(${scale})`,
      }}>
        {brand.name}
      </div>
    </AbsoluteFill>
  );
}

export const videoHookConfig = {
  durationInFrames: 150,  // 5s @ 30fps
  fps: 30,
  width: 1920,
  height: 1080,
};
```

### `captions/video-hook.vtt`

```
WEBVTT

00:00.000 --> 00:03.500
{first-line}

00:03.500 --> 00:06.000
{second-line}
```

### `public/audio/video-hook.mp3`

Optional: AI-generated score via ElevenLabs Sound Effects or Suno (provider TBD).

## Layer 4 — Archetype-specific timing

| Archetype | Scene cadence | Motion intensity |
|---|---|---|
| Brutalist | Sharp cuts, hard entrances | Zero easing, step(1) |
| Ethereal | Long dissolves (15-30f) | Soft ease-out |
| Kinetic | Micro-cuts (4-8f) | ScrollTrigger-like timing |
| Luxury | Slow (60f+ per beat) | Breath-paced ease-in-out |
| Playful | Snappy (10f cuts) | Bounce ease |
| Dark Academia | Slow fades | Fade-to-black transitions |

## Layer 5 — Captions (a11y mandatory)

Every video ships:
1. WebVTT caption file (auto-generated from script via LLM, human-reviewed for accuracy)
2. Audio description track for visual-only content (screen-reader narration)
3. Silent-friendly design — can follow without audio

## Layer 6 — Render pipeline

1. `npx remotion render --props='{"brand": {...}}' compositions/VideoHook.tsx out/hero.mp4`
2. Multiple encodes: MP4 (H.264) + WebM (VP9) + AVIF sequence fallback
3. Thumbnail poster frame extraction
4. Manifest entry with cache_key (sha256 prompt+seed+brand)

## Layer 7 — Integration

- Chains with `remotion-section-video` skill for embedding in pages
- Manifest: `raster/video` kind; license: `genorah-procedural`
- Perf budget: hero video ≤ 4MB at 1080p; social vertical ≤ 8MB at 1080×1920
- Asset-forge-dna-compliance A2 DNA coverage applies to video frames (sampled)

## Layer 8 — Anti-patterns

- ❌ Video without captions — a11y failure + reject in some regions
- ❌ Autoplay with sound — browser blocks + user hostile
- ❌ Generic motion (fade in + fade out) across archetypes — defeats archetype specificity
- ❌ > 30s hero loop — file size + cognitive load
- ❌ Missing WebM encode — Safari 16+ supports, but legacy Firefox needs VP9
