import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { probeCapabilities } from "../CapabilityProbe.js";
export function ComputeShaderHost({ wgsl, fallback, children }) {
    const [mode, setMode] = useState("probing");
    useEffect(() => { probeCapabilities().then(c => setMode(c.webgpu ? "webgpu" : "fallback")); }, []);
    if (mode === "probing")
        return null;
    if (mode === "fallback")
        return _jsx(_Fragment, { children: fallback });
    // WebGPU path — compile wgsl module, dispatch as compute pass
    return _jsx(WebGpuActive, { wgsl: wgsl, children: children });
}
function WebGpuActive({ wgsl, children }) {
    // Minimal placeholder — real impl dispatches compute pipeline.
    // Production bodies in skills/webgpu-compute-shaders.
    useEffect(() => {
        async function run() {
            const gpu = navigator.gpu;
            if (!gpu)
                return;
            const adapter = await gpu.requestAdapter();
            if (!adapter)
                return;
            const device = await adapter.requestDevice();
            device.createShaderModule({ code: wgsl });
        }
        run().catch(() => { });
    }, [wgsl]);
    return _jsx(_Fragment, { children: children });
}
