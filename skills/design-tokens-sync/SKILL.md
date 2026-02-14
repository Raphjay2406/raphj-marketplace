---
name: design-tokens-sync
description: "Design token pipeline patterns: Figma-to-code token sync, Style Dictionary configuration, token transformation, CSS custom properties generation, Tailwind theme mapping, automated theme generation."
---

Use this skill when the user mentions design tokens, Figma tokens, Style Dictionary, token sync, theme generation, or design system tokens. Triggers on: design tokens, Figma tokens, Style Dictionary, token sync, theme, token pipeline, design system tokens.

You are an expert at design token pipelines and theme synchronization.

## Style Dictionary Setup

```bash
npm install style-dictionary
```

```js
// style-dictionary.config.js
const StyleDictionary = require('style-dictionary')

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: { outputReferences: true },
      }],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'javascript/es6',
      }],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.ts',
        format: 'javascript/es6',
      }],
    },
  },
}
```

## Token JSON Structure (Figma Tokens format)

```json
// tokens/base/color.json
{
  "color": {
    "primary": {
      "50": { "value": "#eff6ff", "type": "color" },
      "100": { "value": "#dbeafe", "type": "color" },
      "500": { "value": "#3b82f6", "type": "color" },
      "600": { "value": "#2563eb", "type": "color" },
      "900": { "value": "#1e3a5f", "type": "color" }
    },
    "neutral": {
      "50": { "value": "#fafafa", "type": "color" },
      "900": { "value": "#0a0a0a", "type": "color" }
    }
  }
}

// tokens/base/spacing.json
{
  "spacing": {
    "xs": { "value": "4px", "type": "dimension" },
    "sm": { "value": "8px", "type": "dimension" },
    "md": { "value": "16px", "type": "dimension" },
    "lg": { "value": "24px", "type": "dimension" },
    "xl": { "value": "32px", "type": "dimension" },
    "2xl": { "value": "48px", "type": "dimension" }
  }
}

// tokens/base/typography.json
{
  "fontFamily": {
    "sans": { "value": "Inter, system-ui, sans-serif", "type": "fontFamily" },
    "mono": { "value": "JetBrains Mono, monospace", "type": "fontFamily" }
  },
  "fontSize": {
    "xs": { "value": "0.75rem", "type": "dimension" },
    "sm": { "value": "0.875rem", "type": "dimension" },
    "base": { "value": "1rem", "type": "dimension" },
    "lg": { "value": "1.125rem", "type": "dimension" },
    "xl": { "value": "1.25rem", "type": "dimension" },
    "2xl": { "value": "1.5rem", "type": "dimension" },
    "3xl": { "value": "1.875rem", "type": "dimension" },
    "4xl": { "value": "2.25rem", "type": "dimension" }
  },
  "fontWeight": {
    "normal": { "value": "400", "type": "fontWeight" },
    "medium": { "value": "500", "type": "fontWeight" },
    "semibold": { "value": "600", "type": "fontWeight" },
    "bold": { "value": "700", "type": "fontWeight" }
  }
}

// tokens/semantic/light.json
{
  "semantic": {
    "background": { "value": "{color.neutral.50}", "type": "color" },
    "foreground": { "value": "{color.neutral.900}", "type": "color" },
    "primary": { "value": "{color.primary.600}", "type": "color" },
    "primary-foreground": { "value": "#ffffff", "type": "color" },
    "muted": { "value": "{color.neutral.100}", "type": "color" },
    "border": { "value": "{color.neutral.200}", "type": "color" }
  }
}
```

## Generated CSS Output

```css
/* src/styles/tokens.css (auto-generated) */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --font-family-sans: Inter, system-ui, sans-serif;
  --font-size-base: 1rem;
  --semantic-background: var(--color-neutral-50);
  --semantic-foreground: var(--color-neutral-900);
  --semantic-primary: var(--color-primary-600);
}
```

## Tailwind Config from Tokens

```ts
// tailwind.config.ts
import tokens from './src/styles/tailwind-tokens'

export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: tokens.ColorPrimary50,
          500: tokens.ColorPrimary500,
          600: tokens.ColorPrimary600,
          DEFAULT: tokens.ColorPrimary600,
        },
      },
      spacing: {
        xs: tokens.SpacingXs,
        sm: tokens.SpacingSm,
        md: tokens.SpacingMd,
      },
      fontFamily: {
        sans: [tokens.FontFamilySans],
      },
    },
  },
}
```

## Figma Token Sync Script

```ts
// scripts/sync-tokens.ts
// Pulls tokens from Figma Variables API and writes JSON files

async function syncFigmaTokens() {
  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  )
  const data = await res.json()

  // Transform Figma variables to Style Dictionary format
  const tokens: Record<string, any> = {}

  for (const collection of Object.values(data.meta.variableCollections) as any[]) {
    for (const varId of collection.variableIds) {
      const variable = data.meta.variables[varId]
      const path = variable.name.split('/')
      let current = tokens
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] ??= {}
        current = current[path[i]]
      }
      const value = variable.valuesByMode[collection.defaultModeId]
      current[path[path.length - 1]] = {
        value: formatValue(variable.resolvedType, value),
        type: variable.resolvedType.toLowerCase(),
      }
    }
  }

  writeFileSync('tokens/figma-sync.json', JSON.stringify(tokens, null, 2))
  console.log('Tokens synced from Figma')
}
```

## Multi-Theme Token Sets

```json
// tokens/themes/dark.json
{
  "semantic": {
    "background": { "value": "{color.neutral.900}", "type": "color" },
    "foreground": { "value": "{color.neutral.50}", "type": "color" },
    "primary": { "value": "{color.primary.500}", "type": "color" },
    "muted": { "value": "{color.neutral.800}", "type": "color" },
    "border": { "value": "{color.neutral.700}", "type": "color" }
  }
}
```

```js
// Style Dictionary config for multi-theme
module.exports = {
  source: ['tokens/base/**/*.json', 'tokens/semantic/light.json'],
  platforms: {
    'css-light': {
      buildPath: 'src/styles/',
      files: [{ destination: 'theme-light.css', format: 'css/variables', options: { selector: ':root, [data-theme="light"]' } }],
    },
    'css-dark': {
      source: ['tokens/base/**/*.json', 'tokens/themes/dark.json'],
      buildPath: 'src/styles/',
      files: [{ destination: 'theme-dark.css', format: 'css/variables', options: { selector: '[data-theme="dark"]' } }],
    },
  },
}
```

## Best Practices

1. Token structure: base (raw values) -> semantic (usage-based aliases) -> component (specific)
2. Use Style Dictionary for transform: JSON tokens -> CSS vars + Tailwind config + TypeScript
3. Figma sync: pull from Figma Variables API, transform to Style Dictionary format
4. Multi-theme: separate token sets for light/dark, same semantic names, different base references
5. Reference syntax `{color.primary.500}` creates CSS `var()` chains with `outputReferences: true`
6. Run `npx style-dictionary build` in CI/CD after token changes
7. Commit generated files (tokens.css, tailwind-tokens.js) for reproducibility
8. Map semantic tokens to shadcn CSS variable naming: `--background`, `--foreground`, `--primary`
9. Version token files alongside code — they are part of the design system contract
10. For Astro: same CSS custom properties work, import `tokens.css` in layout
