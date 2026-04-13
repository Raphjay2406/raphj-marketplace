import React from "react";
import { HeroSection, TextSection, GridSection, Section, Page, PageSchema } from "./schema.js";

// ── Section renderers ────────────────────────────────────────────────────────

function HeroRenderer({ section }: { section: HeroSection }) {
  return (
    <section
      data-sdui="hero"
      style={section.backgroundImage ? { backgroundImage: `url(${section.backgroundImage})` } : undefined}
    >
      <h1>{section.heading}</h1>
      {section.subheading && <p>{section.subheading}</p>}
      {section.cta && (
        <a href={section.cta.href} data-sdui-cta>
          {section.cta.label}
        </a>
      )}
    </section>
  );
}

function TextRenderer({ section }: { section: TextSection }) {
  return (
    <section data-sdui="text" style={{ textAlign: section.align }}>
      <p>{section.body}</p>
    </section>
  );
}

function GridRenderer({ section }: { section: GridSection }) {
  return (
    <section
      data-sdui="grid"
      data-columns={section.columns}
      style={{ display: "grid", gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
    >
      {section.items.map((item, i) => (
        <div key={i} data-sdui-grid-item>
          {item.image && <img src={item.image} alt={item.title} />}
          <h3>{item.title}</h3>
          {item.description && <p>{item.description}</p>}
        </div>
      ))}
    </section>
  );
}

// ── Section dispatcher ───────────────────────────────────────────────────────

export function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <HeroRenderer section={section} />;
    case "text":
      return <TextRenderer section={section} />;
    case "grid":
      return <GridRenderer section={section} />;
  }
}

// ── Page renderer ────────────────────────────────────────────────────────────

export interface PageRendererProps {
  /** Raw page spec — validated against PageSchema before rendering */
  spec: unknown;
}

export function PageRenderer({ spec }: PageRendererProps) {
  const page = PageSchema.parse(spec) as Page;
  return (
    <main data-sdui-page={page.slug}>
      {page.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </main>
  );
}
