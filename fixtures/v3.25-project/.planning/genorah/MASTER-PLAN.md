---
version: "3.25.0"
total_sections: 4
total_waves: 3
framework: nextjs
rendering: app-router
---
# Master Plan — Roh Studio

## Project Overview
**Goal:** Portfolio site for Roh Studio, a design-led engineering consultancy.
**Archetype:** Brutalist
**Framework:** Next.js 15 / App Router / Tailwind v4
**Sections:** hero, about, work, contact

## Wave Map

### Wave 0 — Scaffold + Tokens (DONE)
- app/globals.css — @theme block with all DNA tokens
- components/ui/ — base primitives
- tailwind.config.ts — extended theme

### Wave 1 — Shared UI (DONE)
- components/nav/Nav.tsx — brutalist navigation, text-only links, raw
- components/footer/Footer.tsx — minimal, mono type

### Wave 2 — Primary Content (IN_PROGRESS)
- app/sections/hero/ — DONE
- app/sections/about/ — IN_PROGRESS

Dependencies: Wave 1 must be complete.

### Wave 3 — Secondary Content (TODO)
- app/sections/work/ — depends on about layout
- app/sections/contact/ — standalone

## Layout Assignments
hero: full-viewport, single-column raw typographic
about: two-column asymmetric, text + raw image
work: grid, 3-column responsive
contact: centered, brutalist form

## Reference Targets
hero: Virgil Abloh Portfolio, Pentagram.com HOOK sections
about: Bureau Borsche editorial approach
work: Séquence Studio grid
contact: Sagmeister & Walsh stripped-down CTA
