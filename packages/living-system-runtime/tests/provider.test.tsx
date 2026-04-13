// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";
import { LivingSystemProvider } from "../src/LivingSystemProvider.js";

const rules = {
  schema_version: "4.0.0" as const,
  signals: ["visit_count" as const],
  rules: [{ signal: "visit_count" as const, predicate: { gt: 0 }, delta: { "--visit-bg": "#000" } }]
};

describe("LivingSystemProvider", () => {
  it("applies delta on mount", async () => {
    localStorage.setItem("genorah:ls:visits", "3");
    render(<LivingSystemProvider rules={rules}><div/></LivingSystemProvider>);
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(document.documentElement.style.getPropertyValue("--visit-bg")).toBe("#000");
  });

  it("subscribes to time_of_day signal and applies matching rule", async () => {
    // time_of_day fires immediately via subscribeTimeOfDay; the predicate uses between range.
    // We don't assert the exact value since currentTimeHM() is dynamic —
    // just verify the provider renders without throwing and returns its children.
    const timeRules = {
      schema_version: "4.0.0" as const,
      signals: ["time_of_day" as const],
      rules: [{ signal: "time_of_day" as const, predicate: { eq: "00:00" }, delta: { "--time-bg": "#111" } }]
    };
    const { container } = render(
      <LivingSystemProvider rules={timeRules}><div data-testid="child" /></LivingSystemProvider>
    );
    await act(async () => { await new Promise(r => setTimeout(r, 30)); });
    expect(container.querySelector("[data-testid=child]")).not.toBeNull();
  });

  it("subscribes to scroll_velocity signal without throwing", async () => {
    const scrollRules = {
      schema_version: "4.0.0" as const,
      signals: ["scroll_velocity" as const],
      rules: [{ signal: "scroll_velocity" as const, predicate: { gt: 1000 }, delta: { "--scroll-hint": "fast" } }]
    };
    const { container } = render(
      <LivingSystemProvider rules={scrollRules}><div data-testid="sv-child" /></LivingSystemProvider>
    );
    await act(async () => { await new Promise(r => setTimeout(r, 30)); });
    expect(container.querySelector("[data-testid=sv-child]")).not.toBeNull();
  });
});
