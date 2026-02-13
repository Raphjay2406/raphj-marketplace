# v0-ahh-skill

A Claude Code plugin providing a v0-inspired frontend design skill for building polished React/Next.js UI components.

## What it does

This skill guides Claude to generate production-grade frontend components using:

- **React** with Next.js App Router
- **shadcn/ui** component library
- **Tailwind CSS** with variable-based theming
- **Lucide React** icons
- Accessibility best practices baked in

## Installation

```bash
claude plugin add C:\Users\raphj\v0-ahh-skill
```

## Usage

The skill activates when you ask Claude to build frontend components, pages, or UI/UX designs. Examples:

- "Build me a dashboard page"
- "Create a pricing card component"
- "Design a navigation bar with shadcn"
- "Implement a responsive landing page"

Or invoke it directly:

```
/v0-ahh
```

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `v0-ahh` | Skill | Frontend design and UI implementation guidance |

## Tech Stack Defaults

- shadcn/ui components from `@/components/ui`
- Tailwind CSS variable colors (`bg-primary`, `text-muted-foreground`, etc.)
- Lucide React for all icons (no raw SVGs)
- Responsive, mobile-first designs
- Complete, deployable code (no TODOs or placeholders)
