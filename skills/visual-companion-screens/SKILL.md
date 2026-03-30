---
name: "visual-companion-screens"
description: "HTML fragment templates for visual companion screens at each pipeline stage. Archetype picker, palette explorer, score dashboard, breakpoint preview, before/after diff."
tier: "utility"
triggers: "companion screen, visual companion, push screen, companion template"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- **During `/modulo:start-project`** -- Archetype Picker, Palette Explorer, Font Pairing Preview
- **During `/modulo:lets-discuss`** -- Creative Directions, Emotional Arc Map, Layout Preview, Motion Preview
- **During `/modulo:execute`** -- Build Progress tracker updated per wave
- **During `/modulo:iterate`** -- Score Dashboard, Before/After Diff, Consistency Matrix, Diagnostic View
- **During any review** -- Breakpoint Preview for responsive audit

### When NOT to Use

- For static documentation -- these are interactive pipeline artifacts, not docs
- For final deliverables -- these are internal design tools, not shipped UI

### Decision Tree

- If agent needs user to choose between options -> Archetype Picker or Creative Directions
- If agent needs to present visual identity -> Palette Explorer or Font Pairing Preview
- If agent needs to show plan structure -> Emotional Arc Map, Layout Preview, or Motion Preview
- If agent needs to report progress -> Build Progress
- If agent needs to present review results -> Score Dashboard, Consistency Matrix, or Breakpoint Preview
- If agent needs to show changes -> Before/After Diff
- If agent needs to diagnose issues -> Diagnostic View

### Pipeline Connection

- **Referenced by:** all agents at their respective pipeline stages
- **Consumed at:** every `/modulo:` command that presents visual output to the user

---

## Layer 2: Templates

Each template below is a self-contained HTML fragment. Agents fill in the data attributes and content, then push the fragment as a companion screen.

### CSS Foundation

All companion screens share these base styles. Agents MUST include this block (or a superset) when rendering any template:

```html
<style>
  .companion { font-family: system-ui, -apple-system, sans-serif; color: #e4e4e7; background: #18181b; padding: 2rem; border-radius: 1rem; max-width: 960px; margin: 0 auto; }
  .companion h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #fafafa; }
  .companion h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #d4d4d8; }
  .companion .subtitle { font-size: 0.875rem; color: #71717a; margin-bottom: 1.5rem; }
  .companion .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
  .companion .badge--pass { background: #166534; color: #4ade80; }
  .companion .badge--warn { background: #854d0e; color: #facc15; }
  .companion .badge--fail { background: #991b1b; color: #fca5a5; }
  .companion .badge--info { background: #1e3a5f; color: #7dd3fc; }
</style>
```

---

### 1. Archetype Picker

19 cards displaying archetype name, description, and palette swatches. The user clicks to select.

**CSS classes:** `.cards`, `.card`, `.card[data-choice]`, `.card.selected`, `.swatches`, `.swatch`

```html
<div class="companion">
  <h2>Choose Your Design Archetype</h2>
  <p class="subtitle">Each archetype defines colors, typography, motion, and forbidden patterns. Pick the one that matches your brand.</p>

  <div class="cards" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem;">

    <!-- Repeat for each archetype (19 total) -->
    <div class="card" data-choice="brutalist" style="background:#27272a; border:1px solid #3f3f46; border-radius:0.75rem; padding:1.25rem; cursor:pointer; transition:border-color 0.2s;">
      <h3 style="margin:0 0 0.5rem;">Brutalist</h3>
      <p style="font-size:0.8125rem; color:#a1a1aa; margin:0 0 0.75rem;">Raw, exposed structure. Monospaced type, high contrast, intentional roughness.</p>
      <div class="swatches" style="display:flex; gap:0.375rem;">
        <!-- Fill with archetype palette colors -->
        <span class="swatch" style="width:24px; height:24px; border-radius:4px; background:#fafafa;"></span>
        <span class="swatch" style="width:24px; height:24px; border-radius:4px; background:#18181b;"></span>
        <span class="swatch" style="width:24px; height:24px; border-radius:4px; background:#ef4444;"></span>
        <span class="swatch" style="width:24px; height:24px; border-radius:4px; background:#a3a3a3;"></span>
      </div>
    </div>

    <!-- ... 18 more cards, one per archetype ... -->
    <!-- Archetypes: Ethereal, Kinetic, Editorial, Neo-Corporate, Organic, Retro-Future,
         Luxury/Fashion, Playful/Startup, Data-Dense, Japanese Minimal, Glassmorphism,
         Neon Noir, Warm Artisan, Swiss/International, Vaporwave, Neubrutalism,
         Dark Academia, AI-Native -->

  </div>
</div>

<script>
  document.querySelectorAll('.card[data-choice]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.card').forEach(c => { c.style.borderColor = '#3f3f46'; c.classList.remove('selected'); });
      card.style.borderColor = '#a78bfa';
      card.classList.add('selected');
    });
  });
</script>
```

**Data population:** Agent fills `data-choice` with archetype slug, `<h3>` with name, `<p>` with one-line description, and `.swatch` backgrounds with the archetype's 4 primary palette colors.

---

### 2. Palette Explorer

Side-by-side comparison of 2-3 palette options. Each palette shows all 12 DNA color tokens.

**CSS classes:** `.split`, `.palette`, `.palette__header`, `.swatch`, `.swatch__label`

```html
<div class="companion">
  <h2>Palette Explorer</h2>
  <p class="subtitle">Compare color palettes side by side. Each shows the 12 DNA tokens.</p>

  <div class="split" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1.5rem;">

    <!-- Palette option A -->
    <div class="palette" style="background:#27272a; border-radius:0.75rem; padding:1.25rem;">
      <div class="palette__header" style="font-weight:600; margin-bottom:1rem;">Option A: Midnight Luxe</div>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem;">
        <!-- 12 DNA tokens: bg, surface, text, border, primary, secondary, accent, muted, glow, tension, highlight, signature -->
        <div style="text-align:center;">
          <span class="swatch" style="display:block; width:100%; aspect-ratio:1; border-radius:6px; background:#0a0a0f;"></span>
          <span class="swatch__label" style="font-size:0.6875rem; color:#71717a; margin-top:0.25rem; display:block;">bg</span>
        </div>
        <div style="text-align:center;">
          <span class="swatch" style="display:block; width:100%; aspect-ratio:1; border-radius:6px; background:#1a1a2e;"></span>
          <span class="swatch__label" style="font-size:0.6875rem; color:#71717a; margin-top:0.25rem; display:block;">surface</span>
        </div>
        <!-- ... 10 more tokens ... -->
      </div>
    </div>

    <!-- Palette option B -->
    <div class="palette" style="background:#27272a; border-radius:0.75rem; padding:1.25rem;">
      <div class="palette__header" style="font-weight:600; margin-bottom:1rem;">Option B: Warm Sunrise</div>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem;">
        <!-- Same 12-token grid with different colors -->
      </div>
    </div>

  </div>
</div>
```

**Data population:** Agent fills `.palette__header` with option name and each `.swatch` background with the hex value for that DNA token. Label each with the token name.

---

### 3. Font Pairing Preview

Live typography samples showing display + body fonts at multiple sizes.

**CSS classes:** `.font-pair`, `.font-sample`, `.font-sample__heading`, `.font-sample__body`, `.type-scale`

```html
<div class="companion">
  <h2>Font Pairing Preview</h2>
  <p class="subtitle">Preview how display and body fonts work together across the type scale.</p>

  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:2rem;">

    <!-- Pairing option -->
    <div class="font-pair" style="background:#27272a; border-radius:0.75rem; padding:1.5rem;">
      <div style="font-size:0.75rem; color:#a78bfa; font-weight:600; margin-bottom:1rem;">OPTION A</div>

      <div class="font-sample__heading" style="font-family:'Playfair Display',serif;">
        <div style="font-size:2.5rem; font-weight:700; line-height:1.1; margin-bottom:0.25rem;">Display Heading</div>
        <div style="font-size:1.5rem; font-weight:600; line-height:1.2; margin-bottom:0.25rem;">Section Title</div>
        <div style="font-size:1.125rem; font-weight:600; line-height:1.3; margin-bottom:1rem;">Subsection</div>
      </div>

      <div class="font-sample__body" style="font-family:'Inter',sans-serif;">
        <div style="font-size:1rem; line-height:1.6; color:#a1a1aa; margin-bottom:0.75rem;">Body text at 16px. The quick brown fox jumps over the lazy dog. This previews readability at normal paragraph size.</div>
        <div style="font-size:0.875rem; line-height:1.5; color:#71717a;">Small text at 14px. Captions, metadata, and secondary information.</div>
      </div>

      <div class="type-scale" style="margin-top:1rem; padding-top:1rem; border-top:1px solid #3f3f46; font-size:0.75rem; color:#52525b;">
        Display: Playfair Display / Body: Inter / Mono: JetBrains Mono
      </div>
    </div>

    <!-- Additional pairing options follow the same structure -->

  </div>
</div>
```

**Data population:** Agent sets `font-family` on heading and body containers, fills sample text, and updates the type-scale summary line with font names.

---

### 4. Creative Directions

2-3 concept boards, each with a title, description, mood keywords, and visual references.

**CSS classes:** `.direction`, `.direction__title`, `.direction__desc`, `.direction__keywords`, `.keyword-tag`

```html
<div class="companion">
  <h2>Creative Directions</h2>
  <p class="subtitle">Each direction represents a distinct visual and emotional path for the project.</p>

  <div style="display:grid; gap:1.5rem;">

    <!-- Direction A -->
    <div class="direction" style="background:#27272a; border-radius:0.75rem; padding:1.5rem; border-left:4px solid #a78bfa;">
      <div class="direction__title" style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">A: Celestial Minimalism</div>
      <div class="direction__desc" style="color:#a1a1aa; line-height:1.6; margin-bottom:1rem;">Vast white space punctuated by precise typographic moments. Ethereal gradients as the only color, creating a sense of floating. The brand feels timeless and elevated.</div>
      <div class="direction__keywords" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">ethereal</span>
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">minimal</span>
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">luminous</span>
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">precise</span>
      </div>
    </div>

    <!-- Direction B -->
    <div class="direction" style="background:#27272a; border-radius:0.75rem; padding:1.5rem; border-left:4px solid #f59e0b;">
      <div class="direction__title" style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">B: Bold Editorial</div>
      <div class="direction__desc" style="color:#a1a1aa; line-height:1.6; margin-bottom:1rem;">Magazine-inspired layouts with dramatic type scale contrasts. Black and white foundation with a single accent color. Content-first with strong editorial hierarchy.</div>
      <div class="direction__keywords" style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">editorial</span>
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">bold</span>
        <span class="keyword-tag" style="background:#3f3f46; color:#d4d4d8; padding:0.25rem 0.75rem; border-radius:9999px; font-size:0.75rem;">high-contrast</span>
      </div>
    </div>

    <!-- Direction C (optional third) -->

  </div>
</div>
```

**Data population:** Agent fills title, description, keywords. Border-left color should match the direction's primary accent.

---

### 5. Emotional Arc Map

Beat timeline showing beat type, section name, and intensity for the page's emotional arc.

**CSS classes:** `.arc-timeline`, `.arc-beat`, `.arc-beat__bar`, `.arc-beat__label`, `.arc-beat__type`

```html
<div class="companion">
  <h2>Emotional Arc Map</h2>
  <p class="subtitle">Each section maps to a beat type with controlled intensity. The arc shapes the user's emotional journey.</p>

  <div class="arc-timeline" style="display:flex; align-items:flex-end; gap:0.5rem; height:240px; padding:1rem 0; border-bottom:1px solid #3f3f46;">

    <!-- One bar per beat -->
    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#7c3aed,#a78bfa); border-radius:6px 6px 0 0; height:85%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#a78bfa; font-weight:600; margin-top:0.5rem;">Hook</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">Hero</div>
    </div>

    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#7c3aed,#a78bfa); border-radius:6px 6px 0 0; height:45%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#a78bfa; font-weight:600; margin-top:0.5rem;">Tease</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">Intro</div>
    </div>

    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#7c3aed,#a78bfa); border-radius:6px 6px 0 0; height:70%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#a78bfa; font-weight:600; margin-top:0.5rem;">Build</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">Features</div>
    </div>

    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#dc2626,#f87171); border-radius:6px 6px 0 0; height:100%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#f87171; font-weight:600; margin-top:0.5rem;">Peak</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">Showcase</div>
    </div>

    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#059669,#34d399); border-radius:6px 6px 0 0; height:30%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#34d399; font-weight:600; margin-top:0.5rem;">Breathe</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">Testimonials</div>
    </div>

    <div class="arc-beat" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
      <div class="arc-beat__bar" style="width:100%; background:linear-gradient(to top,#7c3aed,#a78bfa); border-radius:6px 6px 0 0; height:75%;"></div>
      <div class="arc-beat__type" style="font-size:0.6875rem; color:#a78bfa; font-weight:600; margin-top:0.5rem;">Close</div>
      <div class="arc-beat__label" style="font-size:0.625rem; color:#71717a; margin-top:0.125rem;">CTA</div>
    </div>

  </div>

  <div style="display:flex; gap:1rem; margin-top:0.75rem; font-size:0.6875rem; color:#52525b;">
    <span>Bar height = intensity (0-100%)</span>
    <span>Purple = standard beats</span>
    <span>Red = peak</span>
    <span>Green = breathe</span>
  </div>
</div>
```

**Data population:** Agent sets bar `height` as percentage of intensity (0-100%), beat type label, section name, and gradient color based on beat type (purple for standard, red for peak/tension, green for breathe).

---

### 6. Layout Preview

Section layout assignments shown as wireframe blocks with layout type labels.

**CSS classes:** `.layout-stack`, `.layout-block`, `.layout-block__name`, `.layout-block__type`

```html
<div class="companion">
  <h2>Layout Preview</h2>
  <p class="subtitle">Wireframe view of section layouts in page order. Each block represents a section with its assigned layout type.</p>

  <div class="layout-stack" style="display:flex; flex-direction:column; gap:0.75rem; max-width:640px; margin:0 auto;">

    <!-- Full-width hero -->
    <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:2rem 1.25rem; text-align:center;">
      <div class="layout-block__name" style="font-weight:600; font-size:0.875rem;">Hero</div>
      <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa; margin-top:0.25rem;">full-bleed / center-stack</div>
    </div>

    <!-- Two-column split -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
      <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.5rem 1rem; text-align:center;">
        <div class="layout-block__name" style="font-weight:600; font-size:0.875rem;">Features</div>
        <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa; margin-top:0.25rem;">split-left (text)</div>
      </div>
      <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.5rem 1rem; text-align:center;">
        <div class="layout-block__name" style="font-weight:600; font-size:0.875rem;">&nbsp;</div>
        <div class="layout-block__type" style="font-size:0.75rem; color:#71717a; margin-top:0.25rem;">split-right (visual)</div>
      </div>
    </div>

    <!-- Three-column grid -->
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem;">
      <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.25rem 0.75rem; text-align:center;">
        <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa;">card</div>
      </div>
      <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.25rem 0.75rem; text-align:center;">
        <div class="layout-block__name" style="font-weight:600; font-size:0.8125rem;">Pricing</div>
        <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa;">card-grid</div>
      </div>
      <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.25rem 0.75rem; text-align:center;">
        <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa;">card</div>
      </div>
    </div>

    <!-- Full-width CTA -->
    <div class="layout-block" style="background:#27272a; border:1px dashed #3f3f46; border-radius:0.5rem; padding:1.5rem 1.25rem; text-align:center;">
      <div class="layout-block__name" style="font-weight:600; font-size:0.875rem;">CTA</div>
      <div class="layout-block__type" style="font-size:0.75rem; color:#a78bfa; margin-top:0.25rem;">full-bleed / center-stack</div>
    </div>

  </div>
</div>
```

**Data population:** Agent arranges blocks in page order. Full-width sections get a single block row. Split layouts use a 2-column grid. Card grids use 3-column. Fill section name and layout type.

---

### 7. Motion Preview

Beat-to-motion cards showing what entrance and interaction animations apply to each section.

**CSS classes:** `.motion-cards`, `.motion-card`, `.motion-card__section`, `.motion-card__entrance`, `.motion-card__interaction`

```html
<div class="companion">
  <h2>Motion Preview</h2>
  <p class="subtitle">Planned entrance and interaction animations per section, mapped to emotional arc beats.</p>

  <div class="motion-cards" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem;">

    <div class="motion-card" style="background:#27272a; border-radius:0.75rem; padding:1.25rem;">
      <div class="motion-card__section" style="font-weight:600; margin-bottom:0.75rem;">Hero <span class="badge badge--info">Hook</span></div>
      <div style="font-size:0.8125rem; color:#a1a1aa; margin-bottom:0.5rem;">
        <strong style="color:#d4d4d8;">Entrance:</strong> Fade-up with staggered children (0.1s delay each). Headline typewriter reveal.
      </div>
      <div style="font-size:0.8125rem; color:#a1a1aa;">
        <strong style="color:#d4d4d8;">Interaction:</strong> Parallax on scroll. CTA button magnetic hover.
      </div>
    </div>

    <div class="motion-card" style="background:#27272a; border-radius:0.75rem; padding:1.25rem;">
      <div class="motion-card__section" style="font-weight:600; margin-bottom:0.75rem;">Features <span class="badge badge--info">Build</span></div>
      <div style="font-size:0.8125rem; color:#a1a1aa; margin-bottom:0.5rem;">
        <strong style="color:#d4d4d8;">Entrance:</strong> Slide-in-left for text, scale-up for images. Intersection Observer triggered.
      </div>
      <div style="font-size:0.8125rem; color:#a1a1aa;">
        <strong style="color:#d4d4d8;">Interaction:</strong> Card hover lift with shadow expansion.
      </div>
    </div>

    <!-- Additional motion cards per section -->

  </div>
</div>
```

**Data population:** Agent fills section name, beat type badge, entrance animation description, and interaction animation description for each section.

---

### 8. Build Progress

Wave/section status grid showing real-time build state with color coding.

**CSS classes:** `.wave-group`, `.wave-header`, `.section-row`, `.status-dot`

```html
<div class="companion">
  <h2>Build Progress</h2>
  <p class="subtitle">Live status of each wave and section. Updated after each build step.</p>

  <div style="display:flex; flex-direction:column; gap:1.5rem;">

    <!-- Wave 0 -->
    <div class="wave-group">
      <div class="wave-header" style="font-weight:600; font-size:0.875rem; margin-bottom:0.75rem; color:#a78bfa;">Wave 0: Foundation</div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;">
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#4ade80;"></span>
          <span style="font-size:0.8125rem; flex:1;">Design tokens + Tailwind theme</span>
          <span class="badge badge--pass">built</span>
        </div>
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#4ade80;"></span>
          <span style="font-size:0.8125rem; flex:1;">Global CSS + font loading</span>
          <span class="badge badge--pass">built</span>
        </div>
      </div>
    </div>

    <!-- Wave 1 -->
    <div class="wave-group">
      <div class="wave-header" style="font-weight:600; font-size:0.875rem; margin-bottom:0.75rem; color:#a78bfa;">Wave 1: Shared UI</div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;">
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#facc15;"></span>
          <span style="font-size:0.8125rem; flex:1;">Navigation</span>
          <span class="badge badge--warn">building</span>
        </div>
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#3f3f46;"></span>
          <span style="font-size:0.8125rem; flex:1;">Footer</span>
          <span style="font-size:0.75rem; color:#52525b;">pending</span>
        </div>
      </div>
    </div>

    <!-- Wave 2+ -->
    <div class="wave-group">
      <div class="wave-header" style="font-weight:600; font-size:0.875rem; margin-bottom:0.75rem; color:#a78bfa;">Wave 2: Content Sections</div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;">
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#3f3f46;"></span>
          <span style="font-size:0.8125rem; flex:1;">Hero</span>
          <span style="font-size:0.75rem; color:#52525b;">pending</span>
        </div>
        <div class="section-row" style="display:flex; align-items:center; gap:0.75rem; padding:0.5rem 0.75rem; background:#27272a; border-radius:0.375rem;">
          <span class="status-dot" style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></span>
          <span style="font-size:0.8125rem; flex:1;">Features</span>
          <span class="badge badge--fail">failed</span>
        </div>
      </div>
    </div>

  </div>

  <div style="display:flex; gap:1rem; margin-top:1.25rem; font-size:0.6875rem; color:#52525b;">
    <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:8px; height:8px; border-radius:50%; background:#3f3f46; display:inline-block;"></span> pending</span>
    <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:8px; height:8px; border-radius:50%; background:#facc15; display:inline-block;"></span> building</span>
    <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:8px; height:8px; border-radius:50%; background:#4ade80; display:inline-block;"></span> built</span>
    <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:8px; height:8px; border-radius:50%; background:#ef4444; display:inline-block;"></span> failed</span>
  </div>
</div>
```

**Data population:** Agent creates one `.wave-group` per wave. Each `.section-row` gets the section name, status dot color (#3f3f46=pending, #facc15=building, #4ade80=built, #ef4444=failed), and matching badge.

---

### 9. Score Dashboard

Anti-slop gate scores displayed as horizontal bars with tier badge and total.

**CSS classes:** `.score-grid`, `.score-row`, `.score-bar`, `.score-bar__fill`, `.score-value`, `.tier-badge`

```html
<div class="companion">
  <h2>Quality Score Dashboard</h2>
  <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
    <div style="font-size:2.5rem; font-weight:800; color:#fafafa;">31</div>
    <div style="font-size:1rem; color:#71717a;">/35</div>
    <span class="badge" style="background:#166534; color:#4ade80; font-size:0.875rem; padding:0.375rem 1rem;">SOTD-Ready</span>
  </div>
  <p class="subtitle">Tier thresholds: Pass (25+) | Strong (28+) | SOTD-Ready (30+) | Honoree (33+)</p>

  <div class="score-grid" style="display:flex; flex-direction:column; gap:0.625rem;">

    <!-- One row per scoring category -->
    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Colors</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:90%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4.5/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Typography</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:100%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">5/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Layout</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:80%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Depth & Polish</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:90%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4.5/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Motion</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:80%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">Creative Courage</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:90%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4.5/5</span>
    </div>

    <div class="score-row" style="display:grid; grid-template-columns:140px 1fr 40px; align-items:center; gap:0.75rem;">
      <span style="font-size:0.8125rem; color:#a1a1aa;">UX Intelligence</span>
      <div class="score-bar" style="height:12px; background:#27272a; border-radius:6px; overflow:hidden;">
        <div class="score-bar__fill" style="height:100%; width:90%; background:linear-gradient(to right,#7c3aed,#a78bfa); border-radius:6px;"></div>
      </div>
      <span class="score-value" style="font-size:0.8125rem; font-weight:600; text-align:right;">4.5/5</span>
    </div>

  </div>

  <!-- Penalties section -->
  <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid #3f3f46;">
    <h3>Penalties</h3>
    <div style="font-size:0.8125rem; color:#71717a;">No penalties applied.</div>
    <!-- If penalties exist:
    <div style="font-size:0.8125rem; color:#fca5a5;">-3: Missing signature element</div>
    <div style="font-size:0.8125rem; color:#fca5a5;">-5: No creative tension detected</div>
    -->
  </div>
</div>
```

**Data population:** Agent fills the total score, tier badge (Pass/Strong/SOTD-Ready/Honoree), each category score, bar fill width as percentage (score/max * 100), and any penalty lines.

---

### 10. Breakpoint Preview

4-viewport grid showing how the page responds at each breakpoint. Agents fill with screenshot references or descriptions.

**CSS classes:** `.breakpoint-grid`, `.viewport`, `.viewport__label`, `.viewport__frame`

```html
<div class="companion">
  <h2>Breakpoint Preview</h2>
  <p class="subtitle">Responsive check across 4 standard viewports. Agents fill frames with screenshot references.</p>

  <div class="breakpoint-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; align-items:start;">

    <!-- Mobile -->
    <div class="viewport" style="text-align:center;">
      <div class="viewport__label" style="font-size:0.75rem; font-weight:600; color:#a78bfa; margin-bottom:0.5rem;">Mobile (375px)</div>
      <div class="viewport__frame" style="background:#27272a; border:1px solid #3f3f46; border-radius:0.5rem; aspect-ratio:9/16; display:flex; align-items:center; justify-content:center;">
        <span style="font-size:0.6875rem; color:#52525b;">screenshot ref</span>
      </div>
    </div>

    <!-- Tablet -->
    <div class="viewport" style="text-align:center;">
      <div class="viewport__label" style="font-size:0.75rem; font-weight:600; color:#a78bfa; margin-bottom:0.5rem;">Tablet (768px)</div>
      <div class="viewport__frame" style="background:#27272a; border:1px solid #3f3f46; border-radius:0.5rem; aspect-ratio:3/4; display:flex; align-items:center; justify-content:center;">
        <span style="font-size:0.6875rem; color:#52525b;">screenshot ref</span>
      </div>
    </div>

    <!-- Laptop -->
    <div class="viewport" style="text-align:center;">
      <div class="viewport__label" style="font-size:0.75rem; font-weight:600; color:#a78bfa; margin-bottom:0.5rem;">Laptop (1280px)</div>
      <div class="viewport__frame" style="background:#27272a; border:1px solid #3f3f46; border-radius:0.5rem; aspect-ratio:16/10; display:flex; align-items:center; justify-content:center;">
        <span style="font-size:0.6875rem; color:#52525b;">screenshot ref</span>
      </div>
    </div>

    <!-- Desktop -->
    <div class="viewport" style="text-align:center;">
      <div class="viewport__label" style="font-size:0.75rem; font-weight:600; color:#a78bfa; margin-bottom:0.5rem;">Desktop (1920px)</div>
      <div class="viewport__frame" style="background:#27272a; border:1px solid #3f3f46; border-radius:0.5rem; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center;">
        <span style="font-size:0.6875rem; color:#52525b;">screenshot ref</span>
      </div>
    </div>

  </div>
</div>
```

**Data population:** Agents replace the placeholder text in each `.viewport__frame` with either an `<img>` tag referencing a screenshot, or descriptive text noting layout adaptations at that breakpoint.

---

### 11. Consistency Matrix

Component type vs section grid showing design consistency pass/fail across the project.

**CSS classes:** `.matrix`, `.matrix__header`, `.matrix__cell`, `.matrix__cell--pass`, `.matrix__cell--fail`

```html
<div class="companion">
  <h2>Consistency Matrix</h2>
  <p class="subtitle">Checks that shared components (buttons, cards, spacing, typography) remain consistent across all sections.</p>

  <div style="overflow-x:auto;">
    <table class="matrix" style="width:100%; border-collapse:collapse; font-size:0.8125rem;">
      <thead>
        <tr>
          <th class="matrix__header" style="text-align:left; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">Component</th>
          <th class="matrix__header" style="text-align:center; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">Hero</th>
          <th class="matrix__header" style="text-align:center; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">Features</th>
          <th class="matrix__header" style="text-align:center; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">Pricing</th>
          <th class="matrix__header" style="text-align:center; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">CTA</th>
          <th class="matrix__header" style="text-align:center; padding:0.625rem; border-bottom:1px solid #3f3f46; color:#71717a;">Footer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:0.625rem; border-bottom:1px solid #27272a;">Button style</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--fail" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#fca5a5;">Fail</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#52525b;">N/A</td>
        </tr>
        <tr>
          <td style="padding:0.625rem; border-bottom:1px solid #27272a;">Typography scale</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
        </tr>
        <tr>
          <td style="padding:0.625rem; border-bottom:1px solid #27272a;">Spacing tokens</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--fail" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#fca5a5;">Fail</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
        </tr>
        <tr>
          <td style="padding:0.625rem; border-bottom:1px solid #27272a;">Color tokens</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; border-bottom:1px solid #27272a; color:#4ade80;">Pass</td>
        </tr>
        <tr>
          <td style="padding:0.625rem;">Border radius</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; color:#4ade80;">Pass</td>
          <td class="matrix__cell--pass" style="text-align:center; padding:0.625rem; color:#4ade80;">Pass</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Data population:** Agent fills column headers with section names, row labels with component types, and each cell with Pass (green), Fail (red), or N/A (gray). Failed cells should link to the specific inconsistency.

---

### 12. Before/After Diff

Split comparison showing two versions of a section side by side with labels.

**CSS classes:** `.diff-split`, `.diff-panel`, `.diff-panel__label`, `.diff-panel__content`

```html
<div class="companion">
  <h2>Before / After</h2>
  <p class="subtitle">Visual comparison of changes applied during iteration.</p>

  <div class="diff-split" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">

    <!-- Before -->
    <div class="diff-panel" style="background:#27272a; border-radius:0.75rem; overflow:hidden;">
      <div class="diff-panel__label" style="background:#991b1b; color:#fca5a5; padding:0.5rem 1rem; font-size:0.75rem; font-weight:600;">BEFORE</div>
      <div class="diff-panel__content" style="padding:1.25rem;">
        <!-- Agent fills with screenshot <img> or descriptive HTML showing the previous state -->
        <div style="color:#71717a; font-size:0.8125rem; text-align:center; padding:3rem 1rem;">
          Previous version screenshot or description goes here.
        </div>
      </div>
    </div>

    <!-- After -->
    <div class="diff-panel" style="background:#27272a; border-radius:0.75rem; overflow:hidden;">
      <div class="diff-panel__label" style="background:#166534; color:#4ade80; padding:0.5rem 1rem; font-size:0.75rem; font-weight:600;">AFTER</div>
      <div class="diff-panel__content" style="padding:1.25rem;">
        <!-- Agent fills with screenshot <img> or descriptive HTML showing the updated state -->
        <div style="color:#71717a; font-size:0.8125rem; text-align:center; padding:3rem 1rem;">
          Updated version screenshot or description goes here.
        </div>
      </div>
    </div>

  </div>

  <!-- Change summary -->
  <div style="margin-top:1rem; padding:1rem; background:#27272a; border-radius:0.5rem; font-size:0.8125rem; color:#a1a1aa;">
    <strong style="color:#d4d4d8;">Changes:</strong>
    <ul style="margin:0.5rem 0 0 1.25rem; padding:0;">
      <li>Updated button border-radius from 4px to 12px</li>
      <li>Increased section padding from 64px to 96px</li>
      <li>Changed heading font-weight from 600 to 700</li>
    </ul>
  </div>
</div>
```

**Data population:** Agent fills each `.diff-panel__content` with either a screenshot image or a rendered HTML preview of the section. The change summary list describes what was modified.

---

### 13. Diagnostic View

Bug description with hypothesis list and checkboxes for the `/modulo:bug-fix` command.

**CSS classes:** `.diagnostic`, `.diagnostic__bug`, `.diagnostic__hypothesis`, `.hypothesis-item`

```html
<div class="companion">
  <h2>Diagnostic View</h2>
  <p class="subtitle">Root cause analysis for the reported issue.</p>

  <!-- Bug description -->
  <div class="diagnostic__bug" style="background:#991b1b22; border:1px solid #991b1b; border-radius:0.75rem; padding:1.25rem; margin-bottom:1.5rem;">
    <div style="font-weight:600; color:#fca5a5; margin-bottom:0.5rem;">Reported Issue</div>
    <div style="font-size:0.875rem; color:#e4e4e7; line-height:1.6;">
      <!-- Agent fills with bug description -->
      Navigation menu overlaps hero section content on tablet viewport (768px). Menu items are clipped and CTA button is hidden behind the nav.
    </div>
  </div>

  <!-- Hypotheses -->
  <div class="diagnostic__hypothesis">
    <h3>Hypotheses</h3>
    <div style="display:flex; flex-direction:column; gap:0.5rem;">

      <label class="hypothesis-item" style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 1rem; background:#27272a; border-radius:0.5rem; cursor:pointer;">
        <input type="checkbox" style="margin-top:0.25rem; accent-color:#a78bfa;" />
        <div>
          <div style="font-size:0.875rem; font-weight:500; color:#d4d4d8;">Fixed positioning without z-index hierarchy</div>
          <div style="font-size:0.75rem; color:#71717a; margin-top:0.125rem;">Nav uses position:fixed but hero has isolation:isolate creating a competing stacking context.</div>
        </div>
      </label>

      <label class="hypothesis-item" style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 1rem; background:#27272a; border-radius:0.5rem; cursor:pointer;">
        <input type="checkbox" style="margin-top:0.25rem; accent-color:#a78bfa;" />
        <div>
          <div style="font-size:0.875rem; font-weight:500; color:#d4d4d8;">Missing responsive padding on nav container</div>
          <div style="font-size:0.75rem; color:#71717a; margin-top:0.125rem;">Nav padding only defined for mobile and desktop, no md: breakpoint rule.</div>
        </div>
      </label>

      <label class="hypothesis-item" style="display:flex; align-items:flex-start; gap:0.75rem; padding:0.75rem 1rem; background:#27272a; border-radius:0.5rem; cursor:pointer;">
        <input type="checkbox" style="margin-top:0.25rem; accent-color:#a78bfa;" />
        <div>
          <div style="font-size:0.875rem; font-weight:500; color:#d4d4d8;">Hero section negative margin pulling content under nav</div>
          <div style="font-size:0.75rem; color:#71717a; margin-top:0.125rem;">Hero uses -mt-20 to overlap nav area but nav height changes at tablet breakpoint.</div>
        </div>
      </label>

    </div>
  </div>

  <!-- Proposed fix (agent fills after diagnosis) -->
  <div style="margin-top:1.5rem; padding:1rem; background:#1e3a5f33; border:1px solid #1e3a5f; border-radius:0.5rem;">
    <div style="font-weight:600; color:#7dd3fc; margin-bottom:0.5rem;">Proposed Fix</div>
    <div style="font-size:0.8125rem; color:#a1a1aa; line-height:1.6;">
      <!-- Agent fills with the recommended fix after checking hypotheses -->
      Agent will describe the fix here after investigating each hypothesis.
    </div>
  </div>
</div>
```

**Data population:** Agent fills the bug description from the user's report, creates hypothesis items with title and explanation for each suspected root cause, and updates the proposed fix section after investigation.

---

## Layer 3: Integration Context

### Pipeline Stage

- **Input from:** Each agent's current pipeline state (archetype, DNA, arc, section data)
- **Output to:** Rendered HTML companion screen pushed to user for visual feedback

### Related Skills

- **design-archetypes** -- Archetype Picker template consumes archetype definitions
- **design-dna** -- Palette Explorer and Font Pairing consume DNA token values
- **emotional-arc** -- Arc Map template maps beats from the emotional arc
- **anti-slop-gate** -- Score Dashboard template displays gate scoring results

## Layer 4: Anti-Patterns

### Anti-Pattern: Overloading a Single Screen

**What goes wrong:** Combining multiple template types into one giant companion screen. The user gets overwhelmed and cannot parse the information.
**Instead:** One screen per decision point. If you need to show palette AND fonts, use two sequential companion screens.

### Anti-Pattern: Empty Placeholder Screens

**What goes wrong:** Pushing a template with placeholder text still in it ("screenshot ref", "description goes here").
**Instead:** Every field must be populated with real project data before pushing. If data is unavailable, skip that screen.

### Anti-Pattern: Static Screenshots Without Context

**What goes wrong:** Showing a breakpoint screenshot without labeling what changed or what to look for.
**Instead:** Always annotate visual previews with change descriptions, responsive notes, or highlighted differences.
