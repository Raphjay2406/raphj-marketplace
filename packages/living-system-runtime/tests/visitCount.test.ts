// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { readVisitCount, incrementVisit, subscribeVisitCount } from "../src/signals/visitCount.js";

beforeEach(() => { localStorage.clear(); });

describe("visitCount", () => {
  it("reads 0 on fresh storage", () => {
    expect(readVisitCount()).toBe(0);
  });

  it("increments correctly", () => {
    incrementVisit();
    incrementVisit();
    expect(readVisitCount()).toBe(2);
  });

  it("subscribeVisitCount emits current count and returns unsub", () => {
    incrementVisit();
    const vals: number[] = [];
    const unsub = subscribeVisitCount(v => vals.push(v));
    expect(vals).toEqual([1]);
    unsub();
  });
});
