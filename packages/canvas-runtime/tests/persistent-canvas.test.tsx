// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import { PersistentCanvas } from "../src/PersistentCanvas.js";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => <div data-testid="r3f-canvas" {...props}>{children}</div>
}));

afterEach(() => cleanup());

describe("PersistentCanvas", () => {
  it("renders as position:fixed behind content", () => {
    const { getByTestId } = render(<PersistentCanvas intensity="cinematic">x</PersistentCanvas>);
    const canvas = getByTestId("r3f-canvas");
    const wrapper = canvas.parentElement!;
    expect(wrapper.style.position).toBe("fixed");
    expect(wrapper.style.zIndex).toBe("-1");
  });

  it("renders nothing for intensity=none", () => {
    const { container } = render(<PersistentCanvas intensity="none">x</PersistentCanvas>);
    expect(container.innerHTML).toBe("");
  });

  it("sets data-intensity attribute", () => {
    const { getByTestId } = render(<PersistentCanvas intensity="immersive">x</PersistentCanvas>);
    expect(getByTestId("r3f-canvas").parentElement!.getAttribute("data-intensity")).toBe("immersive");
  });
});
