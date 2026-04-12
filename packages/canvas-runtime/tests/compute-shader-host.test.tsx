// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render, findByTestId } from "@testing-library/react";
import React from "react";
import { ComputeShaderHost } from "../src/webgpu/ComputeShaderHost.js";

describe("ComputeShaderHost", () => {
  it("renders fallback slot when WebGPU unavailable", async () => {
    const { container } = render(
      <ComputeShaderHost wgsl="/* compute */" fallback={<div data-testid="fb">webgl2</div>}>
        {null}
      </ComputeShaderHost>
    );
    // ComputeShaderHost starts as "probing" (returns null) then resolves to
    // "fallback" after probeCapabilities() settles. Use findByTestId to wait.
    const fb = await findByTestId(container, "fb");
    expect(fb).toBeTruthy();
  });
});
