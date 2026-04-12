---
name: battery-aware
description: Battery Status API-driven graceful degradation. < 20% battery disables autoplaying video, pauses GSAP timelines, reduces animation. User-visible indicator when active.
tier: domain
triggers: battery-aware, battery-api, power-save
version: 0.1.0
---

# Battery-Aware Mode

## Layer 1 — Detection

```ts
if ('getBattery' in navigator) {
  const battery = await navigator.getBattery();
  function update() {
    const saver = battery.level < 0.2 && !battery.charging;
    document.documentElement.dataset.battery = saver ? 'low' : 'normal';
  }
  update();
  battery.addEventListener('levelchange', update);
  battery.addEventListener('chargingchange', update);
}
```

Battery API deprecated in Firefox/Safari; gracefully degrades (no Battery = treat as normal).

## Layer 2 — Adjustments in low mode

- Pause autoplaying video
- Stop GSAP timelines
- Reduce canvas/WebGL frame rate (60→30fps)
- Defer AI API calls
- Defer analytics beacons
- Suppress non-critical background fetches

## Layer 3 — Visibility

```tsx
{battery === 'low' && (
  <div role="status" className="bg-amber-100 text-amber-900 p-2 text-sm">
    Power save mode active. Animations paused.
  </div>
)}
```

User can dismiss; preference honored for session.

## Layer 4 — Integration

- Chains with real-time-personalization skill
- Motion-health gate respects — doesn't flag disabled animations as violation
- Ledger: `battery-save-active`

## Layer 5 — Anti-patterns

- ❌ Silent disable — users think animation broken
- ❌ Permanent disable once fires — user may plug in
- ❌ No fallback for browsers without Battery API — still need generic power-save mode
