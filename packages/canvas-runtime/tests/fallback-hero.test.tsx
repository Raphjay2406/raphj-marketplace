// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { FallbackHero } from "../src/FallbackHero.js";

describe("FallbackHero", () => {
  it("renders img element with src + alt", () => {
    const { getByAltText } = render(<FallbackHero src="/hero.jpg" alt="Hero scene" />);
    expect(getByAltText("Hero scene").getAttribute("src")).toBe("/hero.jpg");
  });

  it("wraps with same fixed position as canvas", () => {
    const { container } = render(<FallbackHero src="/x.jpg" alt="x" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.position).toBe("fixed");
    expect(div.style.zIndex).toBe("-1");
  });
});
