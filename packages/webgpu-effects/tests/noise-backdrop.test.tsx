// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { NoiseBackdrop } from "../src/NoiseBackdrop.js";
import { DitherOverlay } from "../src/DitherOverlay.js";
import { ColorGradeLUT } from "../src/ColorGradeLUT.js";

// happy-dom does not implement navigator.gpu — all components should use CSS fallback

describe("NoiseBackdrop (CSS fallback when WebGPU unavailable)", () => {
  it("renders CSS fallback with backdrop-filter", () => {
    const { container } = render(
      <NoiseBackdrop intensity={0.5} blurPx={8}>
        <span>content</span>
      </NoiseBackdrop>
    );
    const el = container.querySelector("[data-webgpu-effect='noise-backdrop']");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("data-fallback")).toBe("css");
    expect((el as HTMLElement).style.backdropFilter).toContain("blur(8px)");
    expect(container.querySelector("span")?.textContent).toBe("content");
  });

  it("renders at default intensity when no props given", () => {
    const { container } = render(<NoiseBackdrop><div/></NoiseBackdrop>);
    const el = container.querySelector("[data-webgpu-effect='noise-backdrop']");
    expect(el).toBeTruthy();
  });
});

describe("DitherOverlay (CSS fallback when WebGPU unavailable)", () => {
  it("renders CSS mix-blend-mode fallback", () => {
    const { container } = render(
      <DitherOverlay opacity={0.3} color="#ff0000">
        <span>dither child</span>
      </DitherOverlay>
    );
    const el = container.querySelector("[data-webgpu-effect='dither-overlay']");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("data-fallback")).toBe("css");
  });
});

describe("ColorGradeLUT (CSS fallback when WebGPU unavailable)", () => {
  it("renders CSS filter fallback", () => {
    const { container } = render(
      <ColorGradeLUT cssFallback="saturate(1.3)">
        <span>graded</span>
      </ColorGradeLUT>
    );
    const el = container.querySelector("[data-webgpu-effect='color-grade-lut']");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("data-fallback")).toBe("css");
    expect((el as HTMLElement).style.filter).toContain("saturate");
  });
});
