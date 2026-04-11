---
name: intro-preloader
description: "Branded page-load sequences: logo reveals, counter intros, progress bars with personality, content curtain lifts. Per-archetype preloader choreography. Performance budget (max 3s). Skip-on-revisit via sessionStorage."
tier: domain
triggers: "preloader, loading screen, intro animation, page load, splash screen, loading sequence, reveal animation, page entrance"
version: "2.3.0"
---

## Layer 1: Decision Guidance

### When to Use

- **Hero-level first impressions** -- When the site's opening moment should set the archetype tone before content appears
- **Heavy initial load** -- When the page loads 3D scenes, large images, or complex animations that need time
- **Brand identity reinforcement** -- Logo reveals, wordmark animations, brand color washes
- **Portfolio and agency sites** -- Where the loading sequence IS part of the creative portfolio

### When NOT to Use

- **Fast-loading static sites** -- If LCP is under 1.5s, a preloader adds unnecessary delay
- **Content-first sites** (blogs, docs, dashboards) -- Users want content, not animations
- **Repeat visits** -- Always skip on revisit (sessionStorage flag)
- **Reduced motion** -- Show static branded screen, skip animation

### Decision Tree

```
Is LCP naturally > 2s (3D, heavy assets)?
  YES → Preloader masks real loading time (functional + branded)
  NO → Is this a portfolio/agency/luxury brand?
    YES → Preloader as creative statement (max 2s artificial delay)
    NO → Skip preloader entirely. Fast loading IS the best UX.
```

### Pipeline Connection

- **Referenced by:** builder agent during Wave 1 (shared UI)
- **Consumed at:** `/gen:build` Wave 1 scaffold alongside nav and footer
- **Input from:** DESIGN-DNA.md (colors, fonts, signature element, archetype), CONTENT.md (brand name/tagline)

---

## Layer 2: Implementation Reference

### Pattern 1: Counter Reveal (Universal)

```tsx
'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

function CounterPreloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Skip on revisit
    if (sessionStorage.getItem('genorah-visited')) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sessionStorage.setItem('genorah-visited', 'true');
            setIsVisible(false);
            onComplete();
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--color-bg))]"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-display text-[clamp(4rem,15vw,12rem)] tabular-nums text-[hsl(var(--color-text))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.min(count, 100)}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Pattern 2: Logo Reveal (Brand-Focused)

```tsx
function LogoRevealPreloader({ logo, onComplete }: { logo: React.ReactNode; onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'expand' | 'done'>('logo');

  useEffect(() => {
    if (sessionStorage.getItem('genorah-visited')) { onComplete(); return; }
    const t1 = setTimeout(() => setPhase('expand'), 1500);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('genorah-visited', 'true');
      onComplete();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--color-bg))]"
      animate={phase === 'expand' ? { clipPath: 'inset(0 0 100% 0)' } : {}}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {logo}
      </motion.div>
    </motion.div>
  );
}
```

### Pattern 3: Word-by-Word Reveal (Editorial/Luxury)

```tsx
function WordRevealPreloader({ words, onComplete }: { words: string[]; onComplete: () => void }) {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('genorah-visited')) { onComplete(); return; }
    const interval = setInterval(() => {
      setCurrentWord(prev => {
        if (prev >= words.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            sessionStorage.setItem('genorah-visited', 'true');
            onComplete();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [words, onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--color-bg))]"
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.span key={currentWord}
          className="font-display text-[clamp(2rem,6vw,5rem)] text-[hsl(var(--color-text))]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {words[currentWord]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
```

### Pattern 4: Progress Bar (Functional)

```tsx
function ProgressPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('genorah-visited')) { onComplete(); return; }
    // Track actual resource loading
    const resources = performance.getEntriesByType('resource');
    const total = document.querySelectorAll('img, video, link[rel="stylesheet"]').length || 10;

    const interval = setInterval(() => {
      const loaded = performance.getEntriesByType('resource').length;
      const pct = Math.min((loaded / total) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('genorah-visited', 'true');
          onComplete();
        }, 300);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[9999] flex flex-col items-center justify-end pb-16 bg-[hsl(var(--color-bg))]"
      exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
    >
      <div className="w-48 h-px bg-[hsl(var(--color-border))]">
        <motion.div className="h-full bg-[hsl(var(--color-primary))]"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
```

### Per-Archetype Preloader Recommendations

| Archetype | Pattern | Exit Animation | Timing | Notes |
|-----------|---------|---------------|--------|-------|
| Brutalist | Counter (raw, monospace) | Hard cut (no transition) | 1.5s | No easing. Steps function. |
| Ethereal | Logo (soft glow fade) | Slow dissolve (1.2s) | 2.5s | Gentle, dreamlike |
| Kinetic | Counter (fast, bouncy numbers) | Slide up with overshoot | 1.5s | Spring physics on counter |
| Editorial | Word reveal (brand values) | Curtain lift | 2.0s | 3-4 editorial words |
| Neo-Corporate | Progress bar (minimal) | Fade out | 1.0s | Fastest. Professional. |
| Luxury/Fashion | Logo + word (brand name letter-by-letter) | Vertical wipe | 2.5s | Slow, deliberate |
| Japanese Minimal | Single character (kanji or logo mark) | Fade to nothing | 2.0s | Maximum restraint |
| Neon Noir | Counter (glowing digits, scan-line) | Glitch dissolve | 2.0s | CRT/scan effect on exit |
| Playful/Startup | Bouncing logo/mascot | Scale + bounce out | 1.5s | Fun, energetic |
| Dark Academia | Word reveal (literary quote) | Page-turn wipe | 2.5s | Atmospheric |

### Integration with Next.js/Astro

```tsx
// Next.js App Router: app/layout.tsx
'use client';
import { useState } from 'react';
import { CounterPreloader } from '@/components/preloader';

export default function RootLayout({ children }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <html>
      <body>
        <CounterPreloader onComplete={() => setLoaded(true)} />
        <main className={loaded ? 'opacity-100' : 'opacity-0'}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

---

## Layer 3: Integration Context

### DNA Connection

| DNA Token | Preloader Usage |
|-----------|----------------|
| `--color-bg` | Preloader background (must match page background for seamless exit) |
| `--color-text` | Counter digits, brand text |
| `--color-primary` | Progress bar fill, accent elements |
| `--font-display` | Counter font, brand text font |
| Archetype personality | Determines pattern choice, timing, exit animation |
| Signature element | Can appear as preloader motif (subtle watermark or animated element) |

### Related Skills

- **cinematic-motion** -- Exit animations use archetype easing profiles
- **page-transitions** -- Preloader exit coordinates with first-page entrance
- **performance-animation** -- Preloader duration counts toward perceived load time

---

## Layer 4: Anti-Patterns

### Anti-Pattern: Preloader on Fast Sites
**What goes wrong:** Site loads in 800ms but preloader forces 2.5s wait. Users perceive the site as SLOWER than it actually is.
**Instead:** Only use preloaders when real load time exceeds 2s, or when the preloader IS the creative content (portfolio/agency sites). Always skip on revisit.

### Anti-Pattern: No Skip Mechanism
**What goes wrong:** Preloader blocks content on every visit. Returning users forced to watch the same animation repeatedly.
**Instead:** Always use `sessionStorage.getItem('genorah-visited')` to skip on revisit. Consider adding a "Skip" button after 1.5s for first visits.

### Anti-Pattern: Preloader Doesn't Match Page
**What goes wrong:** Preloader uses different background color than the page. Exit animation reveals a color flash.
**Instead:** Preloader background MUST use `--color-bg`. Exit animation should transition seamlessly into the page hero.

### Anti-Pattern: Blocking Content for Animation
**What goes wrong:** Content is ready but preloader keeps playing its full 3s sequence.
**Instead:** Tie preloader to ACTUAL load state. If content loads in 1s, preloader should end at 1s (+ 300ms exit animation).

## Machine-Readable Constraints

| Parameter | Min | Max | Unit | Enforcement |
|-----------|-----|-----|------|-------------|
| Preloader duration | 0.8 | 3.0 | seconds | HARD -- never exceed 3s |
| Exit animation duration | 0.3 | 1.2 | seconds | HARD -- included in total duration |
| Skip on revisit | 1 | 1 | boolean | HARD -- must use sessionStorage |
| Background color | -- | -- | -- | HARD -- must match DNA --color-bg |
| Reduced motion | -- | -- | -- | HARD -- show static branded screen, no animation |
