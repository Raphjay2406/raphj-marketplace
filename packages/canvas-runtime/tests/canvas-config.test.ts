import { describe, it, expect } from "vitest";
import {
  parseCanvasConfig,
  CanvasConfigSchema,
  ScenePropsSchema,
  PerfBudgetSchema,
  MotionPresetSchema,
} from "../src/schemas/canvas-config.js";

// ---------------------------------------------------------------------------
// MotionPreset
// ---------------------------------------------------------------------------
describe("MotionPresetSchema", () => {
  it("accepts all 7 presets", () => {
    const presets = ["ease-in-out", "ease-out", "ease-in", "linear", "spring", "overshoot", "anticipate"];
    for (const p of presets) {
      expect(() => MotionPresetSchema.parse(p)).not.toThrow();
    }
  });

  it("rejects unknown preset", () => {
    expect(() => MotionPresetSchema.parse("bounce")).toThrow();
  });
});

// ---------------------------------------------------------------------------
// PerfBudget
// ---------------------------------------------------------------------------
describe("PerfBudgetSchema", () => {
  it("parses empty object using defaults", () => {
    const b = PerfBudgetSchema.parse({});
    expect(b.maxDrawCalls).toBe(150);
    expect(b.maxTriangles).toBe(500_000);
    expect(b.maxTextureBytes).toBe(64 * 1024 * 1024);
    expect(b.targetFps).toBe(60);
  });

  it("accepts targetFps 120", () => {
    const b = PerfBudgetSchema.parse({ targetFps: 120 });
    expect(b.targetFps).toBe(120);
  });

  it("rejects targetFps 90 (not in literal union)", () => {
    expect(() => PerfBudgetSchema.parse({ targetFps: 90 })).toThrow();
  });

  it("rejects zero maxDrawCalls", () => {
    expect(() => PerfBudgetSchema.parse({ maxDrawCalls: 0 })).toThrow();
  });
});

// ---------------------------------------------------------------------------
// SceneProps
// ---------------------------------------------------------------------------
describe("ScenePropsSchema", () => {
  const minimal = {
    sectionId: "hero",
    theatreProjectId: "my-proj",
    theatreSheetId: "hero-sheet",
  };

  it("parses minimal scene props with defaults", () => {
    const s = ScenePropsSchema.parse(minimal);
    expect(s.preferWebGpu).toBe(false);
    expect(s.lenisDamping).toBe(0.1);
    expect(s.gsapTimescale).toBe(1);
    expect(s.motionPreset).toBe("ease-out");
  });

  it("rejects empty sectionId", () => {
    expect(() => ScenePropsSchema.parse({ ...minimal, sectionId: "" })).toThrow();
  });

  it("rejects lenisDamping > 1", () => {
    expect(() => ScenePropsSchema.parse({ ...minimal, lenisDamping: 1.5 })).toThrow();
  });

  it("accepts lenisDamping at boundary values 0 and 1", () => {
    expect(() => ScenePropsSchema.parse({ ...minimal, lenisDamping: 0 })).not.toThrow();
    expect(() => ScenePropsSchema.parse({ ...minimal, lenisDamping: 1 })).not.toThrow();
  });

  it("rejects negative gsapTimescale", () => {
    expect(() => ScenePropsSchema.parse({ ...minimal, gsapTimescale: -1 })).toThrow();
  });
});

// ---------------------------------------------------------------------------
// CanvasConfig
// ---------------------------------------------------------------------------
describe("parseCanvasConfig", () => {
  it("parses empty object using all defaults", () => {
    const c = parseCanvasConfig({});
    expect(c.schemaVersion).toBe("4.0.0");
    expect(c.theatreProjectId).toBe("genorah-canvas");
    expect(c.debug).toBe(false);
    expect(c.scenes).toEqual({});
  });

  it("accepts partial scene overrides", () => {
    const c = parseCanvasConfig({
      scenes: {
        hero: { preferWebGpu: true, lenisDamping: 0.05 },
      },
    });
    expect(c.scenes["hero"]?.preferWebGpu).toBe(true);
    expect(c.scenes["hero"]?.lenisDamping).toBe(0.05);
  });

  it("rejects schemaVersion mismatch (literal check)", () => {
    expect(() =>
      CanvasConfigSchema.parse({ schemaVersion: "3.0.0" })
    ).toThrow();
  });

  it("round-trips through parse", () => {
    const input = {
      theatreProjectId: "test-canvas",
      debug: true,
      defaultMotionPreset: "spring",
      scenes: {},
    };
    const c = parseCanvasConfig(input);
    expect(c.theatreProjectId).toBe("test-canvas");
    expect(c.debug).toBe(true);
    expect(c.defaultMotionPreset).toBe("spring");
  });
});
