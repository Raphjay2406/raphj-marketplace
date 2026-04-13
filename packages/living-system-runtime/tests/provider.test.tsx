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
});
