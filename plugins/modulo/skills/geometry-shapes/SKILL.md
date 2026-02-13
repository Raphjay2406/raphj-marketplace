---
name: geometry-shapes
description: "Advanced geometry and abstract shapes using SVG, CSS clip-path, generative patterns, blob shapes, and decorative geometric elements."
---

Use this skill when the user mentions geometric shapes, abstract design, SVG shapes, blobs, clip-path, generative art, decorative geometry, polygons, mesh gradients, or organic shapes.

You are an expert at creating advanced geometric and abstract visual elements for web interfaces.

## CSS Clip-Path Shapes

### Basic Shapes
```tsx
// Triangle
className="[clip-path:polygon(50%_0%,0%_100%,100%_100%)]"

// Hexagon
className="[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]"

// Diamond
className="[clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]"

// Arrow right
className="[clip-path:polygon(0%_0%,75%_0%,100%_50%,75%_100%,0%_100%)]"

// Star
className="[clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]"
```

### Angled Section Divider
```tsx
<section className="relative bg-primary text-primary-foreground py-20">
  <div className="container mx-auto px-4">{/* Content */}</div>
  <div className="absolute bottom-0 left-0 right-0 h-16">
    <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0 0L1440 64H0V0Z" fill="hsl(var(--background))" />
    </svg>
  </div>
</section>
```

### Curved Section Divider
```tsx
<div className="absolute bottom-0 left-0 right-0">
  <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-24 md:h-32">
    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z" fill="hsl(var(--background))" />
  </svg>
</div>
```

## SVG Blob Shapes

### Blob Component
```tsx
function Blob({ size = 200, color = "hsl(var(--primary))", className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
      <path
        d="M45.3,-51.2C58.3,-40.9,68.2,-25.7,71.1,-9.1C74,7.5,69.9,25.5,59.5,38.5C49.1,51.5,32.4,59.5,15.1,63.2C-2.2,66.9,-20.1,66.3,-34.7,59.1C-49.3,51.9,-60.6,38.1,-66.1,22.1C-71.6,6.1,-71.3,-12.1,-63.5,-25.8C-55.7,-39.5,-40.4,-48.7,-25.5,-58.3C-10.6,-67.9,4,-77.9,18.4,-75.8C32.8,-73.7,32.3,-61.5,45.3,-51.2Z"
        transform="translate(100 100)"
        fill={color}
      />
    </svg>
  )
}
```

### Animated Morphing Blob
```tsx
<svg viewBox="0 0 200 200" className="w-64 h-64">
  <path fill="hsl(var(--primary) / 0.3)">
    <animate
      attributeName="d"
      dur="8s"
      repeatCount="indefinite"
      values="
        M45.3,-51.2C58.3,-40.9,68.2,-25.7,71.1,-9.1C74,7.5,69.9,25.5,59.5,38.5C49.1,51.5,32.4,59.5,15.1,63.2C-2.2,66.9,-20.1,66.3,-34.7,59.1C-49.3,51.9,-60.6,38.1,-66.1,22.1C-71.6,6.1,-71.3,-12.1,-63.5,-25.8C-55.7,-39.5,-40.4,-48.7,-25.5,-58.3C-10.6,-67.9,4,-77.9,18.4,-75.8C32.8,-73.7,32.3,-61.5,45.3,-51.2Z;
        M39.5,-46.7C52.9,-35.6,66.8,-24.1,70.3,-9.6C73.8,4.9,66.9,22.4,55.8,35.7C44.7,49,29.4,58.1,13.1,62.1C-3.2,66.1,-20.5,65,-35.2,57.3C-49.9,49.6,-62,35.3,-67.3,18.7C-72.6,2.1,-71.1,-16.8,-62.1,-30.3C-53.1,-43.8,-36.6,-51.9,-21.1,-62.3C-5.6,-72.7,8.9,-85.4,22.1,-82.5C35.3,-79.6,26.1,-57.8,39.5,-46.7Z;
        M45.3,-51.2C58.3,-40.9,68.2,-25.7,71.1,-9.1C74,7.5,69.9,25.5,59.5,38.5C49.1,51.5,32.4,59.5,15.1,63.2C-2.2,66.9,-20.1,66.3,-34.7,59.1C-49.3,51.9,-60.6,38.1,-66.1,22.1C-71.6,6.1,-71.3,-12.1,-63.5,-25.8C-55.7,-39.5,-40.4,-48.7,-25.5,-58.3C-10.6,-67.9,4,-77.9,18.4,-75.8C32.8,-73.7,32.3,-61.5,45.3,-51.2Z
      "
    />
  </path>
</svg>
```

## Geometric Background Patterns

### Dot Grid
```tsx
<div
  className="absolute inset-0 opacity-20"
  style={{
    backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  }}
/>
```

### Grid Lines
```tsx
<div
  className="absolute inset-0 opacity-10"
  style={{
    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                       linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  }}
/>
```

### Diagonal Stripes
```tsx
<div
  className="absolute inset-0 opacity-5"
  style={{
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      hsl(var(--foreground)) 10px,
      hsl(var(--foreground)) 11px
    )`,
  }}
/>
```

### Noise Texture Overlay
```tsx
<svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" />
</svg>
```

## Abstract Decorative Elements

### Floating Circles
```tsx
function FloatingCircles() {
  const circles = [
    { size: 300, x: '10%', y: '20%', color: 'hsl(var(--primary) / 0.1)', delay: 0 },
    { size: 200, x: '70%', y: '60%', color: 'hsl(var(--primary) / 0.08)', delay: 1 },
    { size: 150, x: '80%', y: '10%', color: 'hsl(var(--accent) / 0.1)', delay: 2 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {circles.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"
          style={{
            width: c.size, height: c.size,
            left: c.x, top: c.y,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
```

### Geometric Grid Decoration
```tsx
function GeometricGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
      <defs>
        <pattern id="geo-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="30" cy="30" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo-grid)" />
    </svg>
  )
}
```

### Gradient Mesh Background
```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
  <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl" />
  <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
</div>
```

## Generative Shapes with React

### Random Polygon
```tsx
function RandomPolygon({ sides = 6, size = 100, fill = "hsl(var(--primary) / 0.2)" }) {
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const jitter = 0.8 + Math.random() * 0.4
    const x = 50 + Math.cos(angle) * 40 * jitter
    const y = 50 + Math.sin(angle) * 40 * jitter
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <polygon points={points} fill={fill} />
    </svg>
  )
}
```

### Concentric Rings
```tsx
function ConcentricRings({ count = 5, maxSize = 300 }) {
  return (
    <div className="relative" style={{ width: maxSize, height: maxSize }}>
      {Array.from({ length: count }, (_, i) => {
        const ringSize = maxSize - (i * maxSize) / count
        return (
          <div
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: ringSize, height: ringSize,
              top: (maxSize - ringSize) / 2,
              left: (maxSize - ringSize) / 2,
            }}
          />
        )
      })}
    </div>
  )
}
```

## 3D CSS Transforms

### Isometric Card
```tsx
<div className="[perspective:1000px]">
  <div className="transition-transform [transform:rotateX(5deg)_rotateY(-5deg)] hover:[transform:rotateX(0)_rotateY(0)]">
    <Card>{/* Content */}</Card>
  </div>
</div>
```

### 3D Flip Card
```tsx
<div className="group [perspective:1000px] w-64 h-80">
  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
    <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl bg-card p-6">Front</div>
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-primary text-primary-foreground p-6">Back</div>
  </div>
</div>
```

## Best Practices

1. Use `pointer-events-none` on decorative background elements
2. Keep SVG shapes in components for reusability
3. Use CSS `clip-path` for simple shapes, SVG for complex ones
4. Layer decorative elements with `absolute inset-0 overflow-hidden`
5. Apply `blur-3xl` to gradient blobs for soft, organic backgrounds
6. Use `opacity-5` to `opacity-20` for subtle background patterns
7. Generate random shapes with deterministic seeds for consistency
8. Always use `hsl(var(--color) / opacity)` for theme-aware decorative elements
9. Test decorative elements on both light and dark themes
