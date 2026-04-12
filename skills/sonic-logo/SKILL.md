---
name: "sonic-logo"
description: "Audio brand signature — 200-800ms sonic mark triggered on hero reveal, CTA success, or brand-moment transitions. Tone.js synthesis + mastered WAV fallback. User-consent gated."
tier: "domain"
triggers: "sonic logo, audio logo, sound mark, brand audio, sonic signature, audio identity"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- Brand has defined sonic identity (often archetype: luxury, ai-native, cyberpunk-hud, vaporwave).
- Hero reveal moment or CTA success confirmation.
- Voice/video product where audio presence is expected.

### When NOT to Use

- First page load without interaction — browser autoplay policies block.
- `prefers-reduced-motion` user — treat as implicit "no audio", also respect.
- Enterprise/medical/civic archetypes — unexpected audio erodes trust.

## Layer 2: Example

```ts
// lib/sonic/mark.ts
const AUDIO_CONSENT_KEY = 'genorah-sonic-consent';

export async function playSonicMark(variant: 'reveal' | 'success' | 'transition') {
  if (localStorage.getItem(AUDIO_CONSENT_KEY) !== 'granted') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const audio = new Audio(`/sonic/${variant}.webm`);
  audio.volume = 0.3;
  try { await audio.play(); } catch { /* autoplay blocked — ignore */ }
}
```

Consent UI via `<AudioBadge onOptIn={() => localStorage.setItem(AUDIO_CONSENT_KEY, 'granted')} />`.

## Layer 3: Integration Context

- Assets in `public/sonic/`, tracked by `asset-forge-manifest`.
- Dual-encode: WebM Opus (primary) + MP3 (Safari fallback).
- Mastered to -14 LUFS, peak -1 dBFS, max 800ms.
- Link to `brand-motion-sigils` — sonic mark fires on sigil loop completion.

## Layer 4: Anti-Patterns

- Playing on every page load — aggressive; opt-in only.
- Loud default volume — always 0.3 or below; offer user slider.
- No user-controlled mute — must expose persistent toggle.
