---
name: css-animations
description: "Pure CSS animations including keyframes, transitions, scroll-driven animations, view transitions, and micro-interactions without JS libraries."
---

Use this skill when the user mentions CSS animation, CSS keyframes, pure CSS effects, CSS transitions, scroll-driven CSS animation, or wants animation without JavaScript libraries.

You are an expert at creating performant, elegant CSS-only animations.

## Keyframe Animations

### Fade In Up
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
```

### Staggered Children (CSS-only)
```tsx
<div className="space-y-4">
  {items.map((item, i) => (
    <div
      key={i}
      className="opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
    >
      {item}
    </div>
  ))}
</div>
```

### Shimmer / Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Floating / Bobbing
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.float { animation: float 3s ease-in-out infinite; }
```

### Rotating Gradient Border
```css
.gradient-border {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate 3s linear infinite;
}
@keyframes rotate { to { transform: rotate(360deg); } }
```

## Transitions

### Smooth Hover Effects
```tsx
// Scale + shadow lift
className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"

// Color shift
className="transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"

// Underline slide
className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
```

### Button Press Effect
```tsx
className="transition-transform duration-100 active:scale-95"
```

### Card Hover Lift
```tsx
className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
```

## Scroll-Driven Animations (CSS-only)

### Progress Bar (scroll-linked)
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: hsl(var(--primary));
  transform-origin: left;
  animation: grow-progress linear;
  animation-timeline: scroll();
}
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Fade In on Scroll (view timeline)
```css
.reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes reveal {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Parallax (CSS-only)
```css
.parallax-bg {
  animation: parallax linear;
  animation-timeline: scroll();
}
@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-20%); }
}
```

## Micro-Interactions

### Toggle Switch Animation
```css
.switch-thumb {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.switch-checked .switch-thumb {
  transform: translateX(20px);
}
```

### Ripple Effect
```tsx
function Ripple({ x, y }: { x: number; y: number }) {
  return (
    <span
      className="absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
      style={{ left: x, top: y, width: 10, height: 10 }}
    />
  )
}
// @keyframes ripple { to { transform: scale(40); opacity: 0; } }
```

## Text Animations

### Typewriter
```css
.typewriter {
  overflow: hidden;
  border-right: 2px solid hsl(var(--foreground));
  white-space: nowrap;
  animation: typing 3s steps(30) forwards, blink 0.75s step-end infinite;
  width: 0;
}
@keyframes typing { to { width: 100%; } }
@keyframes blink { 50% { border-color: transparent; } }
```

### Gradient Text Shift
```css
.gradient-shift {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease-in-out infinite;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## Performance Tips

1. **Only animate `transform` and `opacity`** - they don't trigger layout/paint
2. Use `will-change: transform` sparingly for GPU acceleration
3. Use `animation-fill-mode: forwards` to keep end state
4. Use `prefers-reduced-motion` media query to disable animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Tailwind Integration

Add custom animations to `tailwind.config.ts`:
```js
keyframes: {
  "fade-in-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
  "slide-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
  shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
},
animation: {
  "fade-in-up": "fade-in-up 0.5s ease-out forwards",
  "slide-in-left": "slide-in-left 0.3s ease-out",
  shimmer: "shimmer 1.5s infinite",
}
```

## Best Practices

1. Use CSS animations for decorative/repeating effects, JS for interactive/dynamic
2. Always respect `prefers-reduced-motion`
3. Keep durations short: 100-300ms for interactions, 300-800ms for decorative
4. Use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for loops
5. Use `animation-fill-mode: forwards` to prevent snap-back
6. Stagger with `animation-delay` + inline styles for sequential reveals
7. Test on low-end devices - disable complex animations if needed
