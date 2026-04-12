// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { SceneDirector } from "../src/SceneDirector.js";

vi.mock("@react-three/fiber", () => ({ useFrame: vi.fn(), useThree: () => ({ camera: { position: { set: vi.fn() }, lookAt: vi.fn() } }) }));

describe("SceneDirector", () => {
  it("renders null when no bookmarks", () => {
    const { container } = render(<SceneDirector choreography={{ schema_version: "4.0.0", project_id: "x", intensity: "section", bookmarks: [], meshes: [], lights: [] }} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders lights from choreography", () => {
    const c = {
      schema_version: "4.0.0" as const, project_id: "x", intensity: "cinematic" as const,
      bookmarks: [{ id: "h", scroll_anchor: "#h", camera: { pos: [0,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} }],
      meshes: [],
      lights: [{ type: "directional" as const, intensity: 1 }]
    };
    const { container } = render(<SceneDirector choreography={c} />);
    expect(container.querySelector("directionalLight, [data-light='directional']")).toBeTruthy();
  });
});
