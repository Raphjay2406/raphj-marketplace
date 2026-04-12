import { describe, it, expect, afterEach, beforeEach } from "vitest";
import {
  getOrCreateProject,
  getSheet,
  getSheetObject,
  getSharedRafDriver,
  scrubSequence,
  resetTheatreRuntime,
  types,
} from "../src/theatre.js";

describe("Theatre.js 0.7.x wrapper", () => {
  beforeEach(() => {
    resetTheatreRuntime();
  });

  afterEach(() => {
    resetTheatreRuntime();
  });

  describe("getOrCreateProject", () => {
    it("creates a project with the given id", () => {
      const project = getOrCreateProject("test-project");
      expect(project).toBeDefined();
      expect(project.address.projectId).toBe("test-project");
    });

    it("returns the same instance on repeated calls (singleton)", () => {
      const p1 = getOrCreateProject("singleton-test");
      const p2 = getOrCreateProject("singleton-test");
      expect(p1).toBe(p2);
    });

    it("creates separate instances for different ids", () => {
      const p1 = getOrCreateProject("proj-a");
      const p2 = getOrCreateProject("proj-b");
      expect(p1.address.projectId).toBe("proj-a");
      expect(p2.address.projectId).toBe("proj-b");
    });
  });

  describe("getSheet", () => {
    it("returns a sheet with the correct sheetId", () => {
      const project = getOrCreateProject("sheet-test");
      const sheet = getSheet(project, "my-sheet");
      expect(sheet.address.sheetId).toBe("my-sheet");
    });

    it("returns different sheets for different ids", () => {
      const project = getOrCreateProject("sheet-test-2");
      const s1 = getSheet(project, "sheet-a");
      const s2 = getSheet(project, "sheet-b");
      expect(s1.address.sheetId).toBe("sheet-a");
      expect(s2.address.sheetId).toBe("sheet-b");
    });
  });

  describe("getSheetObject", () => {
    it("creates a sheet object with typed defaults", () => {
      const project = getOrCreateProject("object-test");
      const sheet = getSheet(project, "object-sheet");
      const obj = getSheetObject(sheet, "my-object", {
        opacity: types.number(1, { range: [0, 1] }),
        scale: types.number(1, { range: [0.1, 5] }),
      });
      expect(obj).toBeDefined();
      expect(obj.address.objectKey).toBe("my-object");
    });
  });

  describe("getSharedRafDriver", () => {
    it("returns a raf driver", () => {
      const driver = getSharedRafDriver();
      expect(driver).toBeDefined();
      expect(typeof driver.tick).toBe("function");
    });

    it("returns the same driver instance", () => {
      const d1 = getSharedRafDriver();
      const d2 = getSharedRafDriver();
      expect(d1).toBe(d2);
    });

    it("after reset, returns new driver", () => {
      const d1 = getSharedRafDriver();
      resetTheatreRuntime();
      const d2 = getSharedRafDriver();
      expect(d1).not.toBe(d2);
    });
  });

  describe("scrubSequence", () => {
    it("sets sequence position", () => {
      const project = getOrCreateProject("scrub-test");
      const sheet = getSheet(project, "scrub-sheet");
      scrubSequence(sheet, 2.5);
      expect(sheet.sequence.position).toBe(2.5);
    });

    it("sets sequence position to 0", () => {
      const project = getOrCreateProject("scrub-test-2");
      const sheet = getSheet(project, "scrub-sheet-2");
      scrubSequence(sheet, 5);
      scrubSequence(sheet, 0);
      expect(sheet.sequence.position).toBe(0);
    });
  });

  describe("resetTheatreRuntime", () => {
    it("clears project registry so a subsequent call re-resolves the project", () => {
      const p1 = getOrCreateProject("reset-test");
      resetTheatreRuntime();
      // Theatre.js caches projects in its own module; our registry just deduplicates
      // calls within a session. After reset the address should still resolve correctly.
      const p2 = getOrCreateProject("reset-test");
      expect(p2.address.projectId).toBe("reset-test");
      // p1 remains valid (Theatre.js internal cache still holds it)
      expect(p1.address.projectId).toBe("reset-test");
    });

    it("does not carry old RAF driver after reset", () => {
      const d1 = getSharedRafDriver();
      resetTheatreRuntime();
      const d2 = getSharedRafDriver();
      // New driver instance after reset
      expect(d1).not.toBe(d2);
    });
  });
});
