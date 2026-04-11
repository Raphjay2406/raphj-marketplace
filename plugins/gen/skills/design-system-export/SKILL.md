---
name: "design-system-export"
description: "Export generated design systems as Storybook 10 stories and W3C DTCG design tokens for team handoff"
tier: "domain"
triggers: "export, storybook, design tokens, handoff, design system, token package, component documentation"
version: "2.0.0"
---

## Layer 1: Decision Guidance

### When to Use

- After a complete build, user wants handoff artifacts for their design/development team
- User requests design system export (post-build action)
- Team needs to maintain the design system in Storybook for component documentation
- Other tools or platforms need design tokens (Figma sync-back, React Native, other codebases)
- Design team wants a living style guide with interaction testing

### When NOT to Use

- During the build itself -- export happens post-build only
- For a single-page site with no reusable components -- the code IS the deliverable
- User only needs the built code with no external handoff requirements
- For design token generation during build -- see `design-dna` and `tailwind-system` skills instead

### Export Curation Decision Tree

Not everything gets exported. Claude curates based on value to the receiving team.

**Export if:**
- Component is used in 2+ sections (reusable across the project)
- Component has 3+ variants or states (complex enough to document)
- Component handles user interaction (needs testing documentation)
- Component is a layout primitive (SectionWrapper, Grid, Container)
- Component wraps DNA tokens into a consumable API (Button, Typography, Card)

**Skip export for:**
- One-off decorative elements (a section's unique background SVG pattern)
- Simple text blocks with no interactivity or variants
- Components that are pure Tailwind utility compositions with no logic
- Internal implementation details (helper functions, context providers without UI)
- Animation wrappers used in a single location

### Story Depth Decision Tree

Each exported component gets the appropriate level of story coverage:

- **Visual-only stories:** Static component with no interactivity -- args + visual documentation only
- **Interaction stories:** Component with hover, click, or keyboard behavior -- add play functions
- **Responsive stories:** Component with container query or media query breakpoints -- viewport parameter stories
- **State stories:** Component with loading, error, empty, or disabled states -- one story per meaningful state

### Token Export Scope

All tokens come from DESIGN-DNA.md. The export produces a portable representation:

- **Always export:** Colors (all 12 DNA tokens), spacing (5-level scale), typography (8-level scale with font families), motion (durations and easings)
- **Export if present:** Shadows, border radii, gradients, blur values
- **Never export:** Component-level decisions (which color a button uses) -- those belong in stories, not tokens

### Pipeline Connection

- **Referenced by:** quality-reviewer during export completeness verification
- **Consumed at:** Post-build export workflow (user-triggered)
- **Input from:** Built components + DESIGN-DNA.md (token source) + DESIGN-SYSTEM.md (component registry)

---

## Layer 2: Award-Winning Examples

### Code Patterns

#### Pattern 1: Storybook 10 Project Setup

Initialize Storybook 10 with CSF Factories support in an existing project:

```bash
# Initialize Storybook 10 in the project
npx storybook@latest init

# Verify installation
npx storybook --version  # Should show 10.x
```

Configure `.storybook/preview.ts` with DNA theme integration:

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import project styles (includes DNA @theme tokens)

const preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'var(--color-bg-primary)' },
        { name: 'light', value: 'var(--color-bg-secondary)' },
        { name: 'surface', value: 'var(--color-bg-tertiary)' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
} satisfies Preview;

export default preview;
```

Configure `.storybook/main.ts`:

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
} satisfies StorybookConfig;

export default config;
```

#### Pattern 2: CSF Factories Stories -- Button Component

The CSF Factories format uses `preview.meta()` and `meta.story()` instead of the old CSF3 `export default` pattern.

```typescript
// src/components/ui/Button.stories.ts
import preview from '../../.storybook/preview';
import { userEvent, within, expect } from '@storybook/test';
import { Button } from './Button';

const meta = preview.meta({
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
});

// -- Visual Documentation Stories --

export const Primary = meta.story({
  args: { variant: 'primary', children: 'Get Started' },
});

export const Secondary = meta.story({
  args: { variant: 'secondary', children: 'Learn More' },
});

export const Ghost = meta.story({
  args: { variant: 'ghost', children: 'Cancel' },
});

export const Outline = meta.story({
  args: { variant: 'outline', children: 'View Details' },
});

export const AllSizes = meta.story({
  args: { variant: 'primary', children: 'Button' },
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
});

// -- Interaction Testing Stories --

export const HoverState = meta.story({
  args: { variant: 'primary', children: 'Hover Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.hover(button);
    await expect(button).toBeVisible();
  },
});

export const ClickInteraction = meta.story({
  args: { variant: 'primary', children: 'Click Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
});

export const KeyboardNavigation = meta.story({
  args: { variant: 'primary', children: 'Tab to Me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
});

export const DisabledState = meta.story({
  args: { variant: 'primary', children: 'Disabled', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
  },
});
```

#### Pattern 3: CSF Factories Stories -- Card Component

Demonstrates responsive viewport stories and visual documentation for a non-interactive component.

```typescript
// src/components/ui/Card.stories.ts
import preview from '../../.storybook/preview';
import { Card } from './Card';

const meta = preview.meta({
  component: Card,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'glass'],
    },
  },
});

export const Default = meta.story({
  args: {
    variant: 'default',
    children: (
      <>
        <Card.Image src="/placeholder.jpg" alt="Feature" />
        <Card.Title>Feature Title</Card.Title>
        <Card.Description>
          A concise description that demonstrates DNA typography tokens.
        </Card.Description>
      </>
    ),
  },
});

export const Elevated = meta.story({
  args: { variant: 'elevated', children: 'Elevated card with shadow system' },
});

export const Glass = meta.story({
  args: { variant: 'glass', children: 'Glassmorphism variant' },
  parameters: {
    backgrounds: { default: 'dark' },
  },
});

// -- Responsive Stories --

export const Mobile = meta.story({
  args: { variant: 'default', children: 'Mobile layout' },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
});

export const Tablet = meta.story({
  args: { variant: 'default', children: 'Tablet layout' },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
});

export const Desktop = meta.story({
  args: { variant: 'default', children: 'Desktop layout' },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
});
```

#### Pattern 4: CSF Factories Stories -- SectionWrapper Component

Demonstrates DNA spacing integration and beat type parameter documentation.

```typescript
// src/components/layout/SectionWrapper.stories.ts
import preview from '../../.storybook/preview';
import { SectionWrapper } from './SectionWrapper';

const meta = preview.meta({
  component: SectionWrapper,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    beat: {
      control: 'select',
      options: ['HOOK', 'BUILD', 'PEAK', 'BREATHE', 'PROOF', 'CLOSE'],
      description: 'Emotional arc beat type -- affects spacing and intensity',
    },
    background: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'accent'],
      description: 'Background token from DNA palette',
    },
    spacing: {
      control: 'select',
      options: ['section', 'block', 'element'],
      description: 'Vertical padding from DNA spacing scale',
    },
  },
});

export const HookBeat = meta.story({
  args: {
    beat: 'HOOK',
    background: 'primary',
    spacing: 'section',
    children: <div style={{ height: '100vh' }}>Hero section content</div>,
  },
});

export const BuildBeat = meta.story({
  args: {
    beat: 'BUILD',
    background: 'secondary',
    spacing: 'block',
    children: <div style={{ minHeight: '60vh' }}>Build section content</div>,
  },
});

export const BreatheBeat = meta.story({
  args: {
    beat: 'BREATHE',
    background: 'tertiary',
    spacing: 'section',
    children: <div style={{ minHeight: '40vh' }}>Breathe section content</div>,
  },
});
```

#### Pattern 5: CSF Factories Stories -- Navigation Component

Demonstrates mobile/desktop stories with interaction testing for a complex interactive component.

```typescript
// src/components/layout/Navigation.stories.ts
import preview from '../../.storybook/preview';
import { userEvent, within, expect } from '@storybook/test';
import { Navigation } from './Navigation';

const meta = preview.meta({
  component: Navigation,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['transparent', 'solid', 'glass'],
    },
  },
});

export const DesktopDefault = meta.story({
  args: { variant: 'solid' },
  parameters: { viewport: { defaultViewport: 'desktop' } },
});

export const MobileDefault = meta.story({
  args: { variant: 'solid' },
  parameters: { viewport: { defaultViewport: 'mobile' } },
});

// -- Interaction Testing: Mobile Menu --

export const MobileMenuOpen = meta.story({
  args: { variant: 'solid' },
  parameters: { viewport: { defaultViewport: 'mobile' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button', { name: /menu/i });
    await userEvent.click(menuButton);
    const nav = canvas.getByRole('navigation');
    await expect(nav).toBeVisible();
  },
});

export const MobileMenuClose = meta.story({
  args: { variant: 'solid' },
  parameters: { viewport: { defaultViewport: 'mobile' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button', { name: /menu/i });
    await userEvent.click(menuButton); // Open
    const closeButton = canvas.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton); // Close
  },
});

// -- Interaction Testing: Keyboard Navigation --

export const KeyboardNavigation = meta.story({
  args: { variant: 'solid' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstLink = canvas.getAllByRole('link')[0];
    await userEvent.tab();
    await expect(firstLink).toHaveFocus();
    await userEvent.tab();
    // Second link should now have focus
    const secondLink = canvas.getAllByRole('link')[1];
    await expect(secondLink).toHaveFocus();
  },
});

// -- Scroll Behavior --

export const GlassOnScroll = meta.story({
  args: { variant: 'glass' },
  parameters: {
    backgrounds: { default: 'dark' },
    viewport: { defaultViewport: 'desktop' },
  },
});
```

#### Pattern 6: W3C DTCG Token Source Files

All token source files use the W3C Design Token Community Group format with `$value`, `$type`, and `$description` fields.

```json
// tokens/color.json -- All 12 DNA color tokens
{
  "color": {
    "$type": "color",
    "bg": {
      "primary": {
        "$value": "#0a0a0a",
        "$description": "Primary background (DNA bg-primary)"
      },
      "secondary": {
        "$value": "#141414",
        "$description": "Secondary background (DNA bg-secondary)"
      },
      "tertiary": {
        "$value": "#1a1a2e",
        "$description": "Tertiary background (DNA bg-tertiary)"
      }
    },
    "text": {
      "primary": {
        "$value": "#f5f5f5",
        "$description": "Primary text color (DNA text-primary)"
      },
      "secondary": {
        "$value": "#a3a3a3",
        "$description": "Secondary text color (DNA text-secondary)"
      },
      "tertiary": {
        "$value": "#6b6b6b",
        "$description": "Tertiary text color (DNA text-tertiary)"
      }
    },
    "accent": {
      "1": {
        "$value": "#ff4d00",
        "$description": "Primary accent (DNA accent-1)"
      },
      "2": {
        "$value": "#00d4ff",
        "$description": "Secondary accent (DNA accent-2)"
      },
      "3": {
        "$value": "#a855f7",
        "$description": "Tertiary accent (DNA accent-3)"
      }
    },
    "border": {
      "$value": "#262626",
      "$description": "Default border color (DNA border)"
    },
    "muted": {
      "$value": "#404040",
      "$description": "Muted/disabled color (DNA muted)"
    },
    "glow": {
      "$value": "rgba(255, 77, 0, 0.4)",
      "$description": "Glow effect color (DNA glow)"
    }
  }
}
```

```json
// tokens/spacing.json -- DNA 5-level spacing scale
{
  "spacing": {
    "$type": "dimension",
    "section": {
      "$value": "6rem",
      "$description": "Section-level vertical padding (DNA spacing-section)"
    },
    "block": {
      "$value": "3rem",
      "$description": "Block-level spacing between groups (DNA spacing-block)"
    },
    "element": {
      "$value": "1.5rem",
      "$description": "Element-level spacing within groups (DNA spacing-element)"
    },
    "inline": {
      "$value": "0.75rem",
      "$description": "Inline spacing for adjacent elements (DNA spacing-inline)"
    },
    "micro": {
      "$value": "0.25rem",
      "$description": "Micro spacing for tight groupings (DNA spacing-micro)"
    }
  }
}
```

```json
// tokens/typography.json -- DNA 8-level type scale with font families
{
  "typography": {
    "fontFamily": {
      "$type": "fontFamily",
      "display": {
        "$value": ["Space Grotesk", "sans-serif"],
        "$description": "Display/heading font (DNA font-display)"
      },
      "body": {
        "$value": ["Inter", "sans-serif"],
        "$description": "Body text font (DNA font-body)"
      },
      "mono": {
        "$value": ["JetBrains Mono", "monospace"],
        "$description": "Monospace font (DNA font-mono)"
      }
    },
    "scale": {
      "$type": "dimension",
      "hero": { "$value": "4.5rem", "$description": "Hero headlines (DNA type-hero)" },
      "display": { "$value": "3.5rem", "$description": "Display text (DNA type-display)" },
      "title": { "$value": "2.25rem", "$description": "Section titles (DNA type-title)" },
      "heading": { "$value": "1.75rem", "$description": "Subsection headings (DNA type-heading)" },
      "subheading": { "$value": "1.25rem", "$description": "Subheadings (DNA type-subheading)" },
      "body": { "$value": "1rem", "$description": "Body text (DNA type-body)" },
      "small": { "$value": "0.875rem", "$description": "Small text (DNA type-small)" },
      "micro": { "$value": "0.75rem", "$description": "Micro text, labels (DNA type-micro)" }
    }
  }
}
```

```json
// tokens/motion.json -- DNA motion tokens
{
  "motion": {
    "duration": {
      "$type": "duration",
      "fast": { "$value": "150ms", "$description": "Micro-interactions (DNA duration-fast)" },
      "default": { "$value": "300ms", "$description": "Standard transitions (DNA duration-default)" },
      "slow": { "$value": "500ms", "$description": "Deliberate reveals (DNA duration-slow)" },
      "dramatic": { "$value": "800ms", "$description": "Dramatic entrances (DNA duration-dramatic)" }
    },
    "easing": {
      "$type": "cubicBezier",
      "default": { "$value": [0.25, 0.1, 0.25, 1.0], "$description": "Standard easing (DNA ease-default)" },
      "dramatic": { "$value": [0.16, 1, 0.3, 1], "$description": "Dramatic easing (DNA ease-dramatic)" },
      "bounce": { "$value": [0.34, 1.56, 0.64, 1], "$description": "Bounce overshoot (DNA ease-bounce)" }
    }
  }
}
```

#### Pattern 7: Style Dictionary 5 Multi-Platform Configuration

```javascript
// style-dictionary.config.mjs (ESM -- Style Dictionary 5)
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    // Platform 1: CSS Custom Properties
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: ':root',
        },
      }],
    },

    // Platform 2: JSON for JS consumers
    json: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.json',
        format: 'json/nested',
      }],
    },

    // Platform 3: Figma-compatible flat format
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/figma/',
      files: [{
        destination: 'figma-tokens.json',
        format: 'json/flat',
      }],
    },
  },
};
```

Build and verify:

```bash
# Install Style Dictionary 5
npm install --save-dev style-dictionary@latest

# Build all platforms
npx style-dictionary build --config style-dictionary.config.mjs

# Output structure:
# dist/
#   css/tokens.css        -> :root { --color-bg-primary: #0a0a0a; ... }
#   tokens.json           -> { "color": { "bg": { "primary": "#0a0a0a" } } }
#   figma/figma-tokens.json -> { "color-bg-primary": "#0a0a0a", ... }
```

#### Pattern 8: DNA-to-Token Extraction

Script to read DESIGN-DNA.md and generate DTCG token files:

```typescript
// scripts/extract-tokens.ts
// Reads DESIGN-DNA.md and produces W3C DTCG token files
// Run: npx tsx scripts/extract-tokens.ts

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const dna = readFileSync('.planning/genorah/DESIGN-DNA.md', 'utf-8');

// Extract color tokens from DNA @theme block
function extractColors(dnaContent: string): Record<string, any> {
  const colorTokens: Record<string, any> = {
    color: { '$type': 'color' } as Record<string, any>,
  };

  // Map DNA color token names to DTCG structure
  const colorMap: Record<string, { group: string; key: string; desc: string }> = {
    'bg-primary':   { group: 'bg', key: 'primary', desc: 'Primary background' },
    'bg-secondary': { group: 'bg', key: 'secondary', desc: 'Secondary background' },
    'bg-tertiary':  { group: 'bg', key: 'tertiary', desc: 'Tertiary background' },
    'text-primary':   { group: 'text', key: 'primary', desc: 'Primary text' },
    'text-secondary': { group: 'text', key: 'secondary', desc: 'Secondary text' },
    'text-tertiary':  { group: 'text', key: 'tertiary', desc: 'Tertiary text' },
    'accent-1': { group: 'accent', key: '1', desc: 'Primary accent' },
    'accent-2': { group: 'accent', key: '2', desc: 'Secondary accent' },
    'accent-3': { group: 'accent', key: '3', desc: 'Tertiary accent' },
    'border':   { group: 'border', key: '$value', desc: 'Default border' },
    'muted':    { group: 'muted', key: '$value', desc: 'Muted/disabled' },
    'glow':     { group: 'glow', key: '$value', desc: 'Glow effect' },
  };

  for (const [dnaName, mapping] of Object.entries(colorMap)) {
    // Extract value from DNA: --color-{name}: {value};
    const regex = new RegExp(`--color-${dnaName}:\\s*([^;]+);`);
    const match = dnaContent.match(regex);
    if (match) {
      const value = match[1].trim();
      if (mapping.key === '$value') {
        // Top-level token (border, muted, glow)
        colorTokens.color[mapping.group] = {
          '$value': value,
          '$description': `${mapping.desc} (DNA ${dnaName})`,
        };
      } else {
        // Grouped token (bg.primary, text.secondary, etc.)
        if (!colorTokens.color[mapping.group]) {
          colorTokens.color[mapping.group] = {};
        }
        colorTokens.color[mapping.group][mapping.key] = {
          '$value': value,
          '$description': `${mapping.desc} (DNA ${dnaName})`,
        };
      }
    }
  }

  return colorTokens;
}

// Generate and write token files
mkdirSync('tokens', { recursive: true });

const colors = extractColors(dna);
writeFileSync('tokens/color.json', JSON.stringify(colors, null, 2));

// Similar extraction functions for spacing, typography, motion...
console.log('Token extraction complete. Run style-dictionary build to generate outputs.');
```

---

## Layer 3: Integration Context

### DNA Connection

DESIGN-DNA.md is the single source of truth for all exported token values. The Tailwind `@theme` block is the runtime representation; DTCG tokens are the portable representation. Both contain the same values in different formats.

| DNA Token Category | DTCG Output | Storybook Usage |
|--------------------|-------------|-----------------|
| 12 color tokens (8 semantic + 4 expressive) | `tokens/color.json` | Background presets, component variant args |
| 5-level spacing scale | `tokens/spacing.json` | SectionWrapper beat/spacing stories |
| 8-level type scale + 3 font families | `tokens/typography.json` | Typography component stories |
| Duration + easing motion tokens | `tokens/motion.json` | Animation documentation in story descriptions |
| Shadow system | `tokens/shadow.json` | Card/elevation variant stories |
| Border radius tokens | `tokens/radius.json` | Component shape documentation |

### Archetype Variants

Export content and complexity vary by archetype:

| Archetype Group | Export Notes |
|-----------------|-------------|
| Glassmorphism, Neon Noir | More complex shadow/glow tokens, additional blur values in token package |
| Brutalist, Swiss/International | Fewer shadow tokens, emphasis on typography scale stories |
| Kinetic, Ethereal | More motion tokens (spring, physics easings), motion-focused story documentation |
| Luxury/Fashion, Editorial | Typography stories are critical -- full type scale with specimen pages |
| Data-Dense, Dashboard | More component variants (table states, chart themes), larger story count |
| Playful/Startup, Warm Artisan | Illustration/icon token stories, color palette exploration stories |

### Pipeline Stage

- **Input from:** Complete built project (components in `src/`), DESIGN-DNA.md (token values), DESIGN-SYSTEM.md (component registry with reusable_components proposals from builder SUMMARYs)
- **Output to:** `stories/` directory (Storybook stories), `tokens/` directory (DTCG source files), `dist/` directory (built token outputs: CSS, JSON, Figma)

### Related Skills

- **design-dna** -- Source of all token values; DTCG tokens are a portable format of DNA values
- **tailwind-system** -- `@theme` block is the runtime token format; DTCG is the handoff format. Same values, different consumers
- **design-system-scaffold** -- Typed utilities that become the exported components; scaffold patterns inform which components to prioritize for export
- **accessibility-standards** -- Exported stories should demonstrate accessible interaction patterns; a11y addon verifies in Storybook

### Export Workflow

```
1. Read DESIGN-DNA.md
   |
2. Extract tokens into DTCG format (tokens/*.json)
   |
3. Configure Style Dictionary 5 (style-dictionary.config.mjs)
   |
4. Build token outputs: npx style-dictionary build
   |                    -> dist/css/tokens.css
   |                    -> dist/tokens.json
   |                    -> dist/figma/figma-tokens.json
   |
5. Identify exportable components (curation decision tree)
   |
6. Generate CSF Factories stories for each component
   |  -> Visual documentation stories (all components)
   |  -> Interaction play functions (interactive components)
   |  -> Responsive viewport stories (responsive components)
   |
7. Verify: npx storybook build (static export)
```

---

### Figma Design Token Sync

Export DESIGN-DNA tokens to Figma Variables for bidirectional design↔code sync.

**Option A: Figma Variables via Tokens Studio Plugin**

```json
// tokens.json — Tokens Studio format (generated from DESIGN-DNA.md)
{
  "color": {
    "primary": { "value": "{DNA --color-primary hex}", "type": "color" },
    "secondary": { "value": "{DNA --color-secondary hex}", "type": "color" },
    "accent": { "value": "{DNA --color-accent hex}", "type": "color" },
    "bg": { "value": "{DNA --color-bg hex}", "type": "color" },
    "surface": { "value": "{DNA --color-surface hex}", "type": "color" },
    "text": { "value": "{DNA --color-text hex}", "type": "color" },
    "border": { "value": "{DNA --color-border hex}", "type": "color" },
    "muted": { "value": "{DNA --color-muted hex}", "type": "color" },
    "glow": { "value": "{DNA --color-glow hex}", "type": "color" },
    "tension": { "value": "{DNA --color-tension hex}", "type": "color" },
    "highlight": { "value": "{DNA --color-highlight hex}", "type": "color" },
    "signature": { "value": "{DNA --color-signature hex}", "type": "color" }
  },
  "spacing": {
    "xs": { "value": "8", "type": "spacing" },
    "sm": { "value": "16", "type": "spacing" },
    "md": { "value": "32", "type": "spacing" },
    "lg": { "value": "64", "type": "spacing" },
    "xl": { "value": "96", "type": "spacing" }
  },
  "fontFamilies": {
    "display": { "value": "{DNA display font}", "type": "fontFamilies" },
    "body": { "value": "{DNA body font}", "type": "fontFamilies" },
    "mono": { "value": "{DNA mono font}", "type": "fontFamilies" }
  },
  "borderRadius": {
    "sm": { "value": "4", "type": "borderRadius" },
    "md": { "value": "8", "type": "borderRadius" },
    "lg": { "value": "12", "type": "borderRadius" },
    "full": { "value": "9999", "type": "borderRadius" }
  }
}
```

**Export workflow:**
```bash
# 1. Generate tokens.json from DESIGN-DNA.md
# (done by the design-system-export command or manually)

# 2. Push to Figma via Tokens Studio CLI
npx token-transformer tokens.json figma-tokens.json

# 3. In Figma: Tokens Studio plugin → Import → Select figma-tokens.json
# 4. Apply tokens to Figma components → Design matches code exactly
```

**Option B: Figma REST API (Programmatic)**

```ts
// scripts/sync-figma-tokens.ts
async function pushTokensToFigma(fileKey: string, tokens: Record<string, any>) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variableCollections: [{
        name: 'Design DNA',
        modes: [{ name: 'Default' }],
        variables: Object.entries(tokens.color).map(([name, value]) => ({
          name: `color/${name}`,
          resolvedType: 'COLOR',
          valuesByMode: { Default: hexToFigmaColor(value) },
        })),
      }],
    }),
  });
  return response.json();
}
```

**Bidirectional sync rules:**
- **Code → Figma:** DESIGN-DNA.md is source of truth. Export tokens to Figma after DNA changes.
- **Figma → Code:** Designers can propose token changes in Figma. Export via Tokens Studio, review diff against DESIGN-DNA.md, apply approved changes.
- **Conflict resolution:** Code wins on locked tokens (from parent DNA). Figma wins on experimental tokens during design exploration. Final approval via `/gen:discuss`.

---

## Layer 4: Anti-Patterns

### Anti-Pattern 1: Using CSF3 Instead of CSF Factories

**What goes wrong:** Generating stories with the Storybook 8 CSF3 pattern -- `const meta = { component: Button } satisfies Meta<typeof Button>; export default meta;` and `type Story = StoryObj<typeof meta>`.

**Why it is wrong:** Storybook 10 uses CSF Factories (`preview.meta()` / `meta.story()`) as the recommended format. CSF3 still works but is the legacy pattern. CSF Factories provide better type inference, less boilerplate, and will become the default in Storybook 11.

**Instead:** Always use CSF Factories:
```typescript
// CORRECT: CSF Factories (Storybook 10)
import preview from '../.storybook/preview';
const meta = preview.meta({ component: Button });
export const Primary = meta.story({ args: { variant: 'primary' } });
```

### Anti-Pattern 2: Style Dictionary v3 Patterns

**What goes wrong:** Using `require('style-dictionary')` for CommonJS config, or using `value`/`type` fields instead of `$value`/`$type` in token files.

**Why it is wrong:** Style Dictionary 5 is ESM-only with first-class W3C DTCG support. The v3 `value`/`type` format is not DTCG-compliant and requires migration. CommonJS configs will not work with Style Dictionary 5.

**Instead:** Use ESM config and DTCG format:
```javascript
// CORRECT: Style Dictionary 5 ESM
export default { source: ['tokens/**/*.json'], platforms: { /* ... */ } };
```
```json
// CORRECT: DTCG format
{ "color": { "$type": "color", "primary": { "$value": "#ff4d00" } } }
```

### Anti-Pattern 3: Exporting Everything

**What goes wrong:** Creating stories for every component in the project including one-off decorative elements, simple wrappers, and utility compositions.

**Why it is wrong:** Over-documentation creates noise. A Storybook with 50 stories where only 12 are meaningful makes the design system harder to navigate and maintain. The team wastes time scrolling past irrelevant entries.

**Instead:** Curate exports using the decision tree in Layer 1. Only export components that are reusable (2+ sections), complex (3+ variants), or interactive (needs testing). A focused 12-story Storybook is more valuable than a sprawling 50-story one.

### Anti-Pattern 4: Custom Token Format

**What goes wrong:** Inventing a bespoke JSON schema for design tokens instead of using the W3C DTCG standard.

**Why it is wrong:** The DTCG spec reached stable v2025.10 and is supported by Figma, Adobe, Google, and Microsoft. Custom formats require custom tooling, are not interoperable with industry tools, and create maintenance burden.

**Instead:** Use DTCG format (`$value`, `$type`, `$description`) for all token source files. Style Dictionary 5 consumes DTCG natively.

### Anti-Pattern 5: Missing Play Functions on Interactive Components

**What goes wrong:** Stories that only show static renders of buttons, menus, modals, and other interactive components without testing their behavior.

**Why it is wrong:** The primary value of Storybook for interactive components is proving that interactions work -- hover states trigger, keyboard navigation flows correctly, focus management behaves. Static-only stories miss this entirely.

**Instead:** Add play functions using `@storybook/test` for every component with hover, click, keyboard, or focus behavior. Visual-only stories are appropriate only for genuinely static components (typography specimens, color palettes, spacing demonstrations).

### Anti-Pattern 6: Hardcoded Token Values

**What goes wrong:** Manually typing literal hex values, pixel sizes, and font names into token JSON files instead of generating them from DESIGN-DNA.md.

**Why it is wrong:** If DNA is updated (color refinement, spacing adjustment, font change), hardcoded tokens drift out of sync. The token package becomes a snapshot of a past state rather than a reflection of current DNA.

**Instead:** Generate token files programmatically from DESIGN-DNA.md (see Pattern 8 in Layer 2). The extraction script ensures tokens always match current DNA values.

### Anti-Pattern 7: Storybook Without DNA Theme

**What goes wrong:** Running Storybook with default white background and system fonts instead of loading the project's DNA theme.

**Why it is wrong:** Components look wrong outside their intended design context. A dark-theme Glassmorphism card on a white Storybook background gives a misleading impression. The team cannot evaluate component quality accurately.

**Instead:** Import the project's global CSS (which includes DNA `@theme` tokens) in `.storybook/preview.ts`. Configure background presets to match DNA palette values. Components render in their actual design context.

---

## Machine-Readable Constraints

| Parameter | Required | Value | Enforcement |
|-----------|----------|-------|-------------|
| Story format | Yes | CSF Factories (`preview.meta` / `meta.story`) | HARD -- no CSF3 pattern |
| Token format | Yes | W3C DTCG (`$value`, `$type`, `$description`) | HARD -- no custom schemas |
| Style Dictionary version | Yes | 5.x ESM config (`export default`) | HARD -- no v3 CommonJS `require()` |
| Play functions | Yes | At least hover or click for interactive components | SOFT -- visual-only OK for static components |
| Multi-format output | Yes | CSS + JSON + Figma platforms | HARD -- all three required |
| DNA theme in Storybook | Yes | Global CSS imported in preview.ts | HARD -- no default Storybook theme |
| Token source | Yes | Generated from DESIGN-DNA.md | SOFT -- manual OK if verified against DNA |
| Export curation | Yes | 2+ sections reused OR 3+ variants OR interactive | SOFT -- Claude's discretion on edge cases |
