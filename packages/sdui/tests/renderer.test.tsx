// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PageRenderer } from "../src/renderer.js";

describe("PageRenderer", () => {
  it("renders a hero section with CTA", () => {
    const spec = {
      slug: "home",
      title: "Home",
      sections: [
        {
          type: "hero",
          heading: "Award-Caliber Design",
          subheading: "Built by Genorah",
          cta: { label: "Get Started", href: "/start" },
        },
      ],
    };
    const { container } = render(<PageRenderer spec={spec} />);
    const main = container.querySelector("[data-sdui-page='home']");
    expect(main).toBeTruthy();
    const hero = container.querySelector("[data-sdui='hero']");
    expect(hero).toBeTruthy();
    expect(container.querySelector("h1")?.textContent).toBe("Award-Caliber Design");
    const cta = container.querySelector("[data-sdui-cta]");
    expect(cta).toBeTruthy();
    expect((cta as HTMLAnchorElement).href).toContain("/start");
    expect(cta?.textContent).toBe("Get Started");
  });

  it("renders a grid section with N columns", () => {
    const spec = {
      slug: "features",
      title: "Features",
      sections: [
        {
          type: "grid",
          columns: 4,
          items: [
            { title: "Speed", description: "Blazing fast" },
            { title: "Quality", description: "Award-caliber" },
            { title: "Scale", description: "Handles millions" },
            { title: "DX", description: "Developer joy" },
          ],
        },
      ],
    };
    const { container } = render(<PageRenderer spec={spec} />);
    const grid = container.querySelector("[data-sdui='grid']");
    expect(grid).toBeTruthy();
    expect(grid?.getAttribute("data-columns")).toBe("4");
    const items = container.querySelectorAll("[data-sdui-grid-item]");
    expect(items.length).toBe(4);
    expect(items[0].querySelector("h3")?.textContent).toBe("Speed");
    expect(items[2].querySelector("h3")?.textContent).toBe("Scale");
  });

  it("throws on invalid spec", () => {
    expect(() => render(<PageRenderer spec={{ slug: "bad" }} />)).toThrow();
  });
});
