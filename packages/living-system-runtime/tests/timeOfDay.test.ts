import { describe, it, expect } from "vitest";
import { currentTimeHM } from "../src/signals/timeOfDay.js";

describe("timeOfDay", () => {
  it("formats as HH:MM", () => {
    expect(currentTimeHM(new Date("2026-04-13T06:07:00"))).toBe("06:07");
  });

  it("pads single-digit hour and minute", () => {
    expect(currentTimeHM(new Date("2026-04-13T01:03:00"))).toBe("01:03");
  });
});
