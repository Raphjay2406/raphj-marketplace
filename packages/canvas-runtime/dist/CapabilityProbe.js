import { detectWebGpu } from "./webgpu/feature-detect.js";
export async function probeCapabilities() {
    const webgl2 = typeof document !== "undefined"
        ? !!document.createElement("canvas").getContext("webgl2")
        : false;
    // Delegate WebGPU detection to the canonical feature-detect module (memoized).
    const gpuCaps = await detectWebGpu();
    const webgpu = gpuCaps.adapterAvailable;
    let battery = 1;
    try {
        const bat = await navigator?.getBattery?.();
        if (bat)
            battery = bat.level ?? 1;
    }
    catch { /* unsupported */ }
    const conn = navigator?.connection;
    const connection_kbps = conn?.downlink ? conn.downlink * 1000 : 10000;
    const device_memory_gb = navigator?.deviceMemory ?? 8;
    return { webgl2, webgpu, battery, connection_kbps, device_memory_gb };
}
export function shouldLoadCinematicBundle(c) {
    return c.webgl2 && c.battery > 0.2 && c.connection_kbps >= 4000 && c.device_memory_gb >= 4;
}
