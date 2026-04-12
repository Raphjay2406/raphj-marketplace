import React, { useEffect, useState } from "react";
import { probeCapabilities } from "../CapabilityProbe.js";

export interface ComputeShaderHostProps {
  wgsl: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export function ComputeShaderHost({ wgsl, fallback, children }: ComputeShaderHostProps) {
  const [mode, setMode] = useState<"probing" | "webgpu" | "fallback">("probing");
  useEffect(() => { probeCapabilities().then(c => setMode(c.webgpu ? "webgpu" : "fallback")); }, []);
  if (mode === "probing") return null;
  if (mode === "fallback") return <>{fallback}</>;
  // WebGPU path — compile wgsl module, dispatch as compute pass
  return <WebGpuActive wgsl={wgsl}>{children}</WebGpuActive>;
}

function WebGpuActive({ wgsl, children }: { wgsl: string; children: React.ReactNode }) {
  // Minimal placeholder — real impl dispatches compute pipeline.
  // Production bodies in skills/webgpu-compute-shaders.
  useEffect(() => {
    async function run() {
      const gpu = (navigator as any).gpu;
      if (!gpu) return;
      const adapter = await gpu.requestAdapter();
      if (!adapter) return;
      const device = await adapter.requestDevice();
      device.createShaderModule({ code: wgsl });
    }
    run().catch(() => { /* log via AG-UI in production */ });
  }, [wgsl]);
  return <>{children}</>;
}
