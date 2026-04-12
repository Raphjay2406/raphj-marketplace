import { describe, it, expect } from "vitest";
import { SceneChoreographySchema } from "../src/schemas/scene-choreography.schema.js";

describe("SceneChoreography", () => {
  it("accepts a minimal graph with 1 bookmark", () => {
    const g = {
      schema_version: "4.0.0",
      project_id: "demo",
      intensity: "cinematic",
      bookmarks: [
        { id: "hero", scroll_anchor: "#hero", camera: { pos: [0,0,5], look_at: [0,0,0] }, morphs: {} }
      ],
      meshes: [],
      lights: [{ type: "directional", intensity: 1, pos: [3,3,3] }]
    };
    expect(() => SceneChoreographySchema.parse(g)).not.toThrow();
  });

  it("rejects intensity outside 5-tier enum", () => {
    const bad = { schema_version: "4.0.0", project_id: "x", intensity: "max", bookmarks: [], meshes: [], lights: [] };
    expect(() => SceneChoreographySchema.parse(bad)).toThrow();
  });

  it("requires at least 1 bookmark when intensity is cinematic or immersive", () => {
    const g = { schema_version: "4.0.0", project_id: "x", intensity: "cinematic", bookmarks: [], meshes: [], lights: [] };
    expect(() => SceneChoreographySchema.parse(g)).toThrow(/bookmarks/);
  });
});
