import { detectWebGpu } from "./webgpu/feature-detect.js";

export interface Capabilities {
  webgl2: boolean;
  webgpu: boolean;
  battery: number; // 0..1 or 1 if unknown
  connection_kbps: number; // effective downlink
  device_memory_gb: number;
}

export async function probeCapabilities(): Promise<Capabilities> {
  const webgl2 = typeof document !== "undefined"
    ? !!document.createElement("canvas").getContext("webgl2")
    : false;
  // Delegate WebGPU detection to the canonical feature-detect module (memoized).
  const gpuCaps = await detectWebGpu();
  const webgpu = gpuCaps.adapterAvailable;
  let battery = 1;
  try {
    const bat = await (navigator as any)?.getBattery?.();
    if (bat) battery = bat.level ?? 1;
  } catch { /* unsupported */ }
  const conn: any = (navigator as any)?.connection;
  const connection_kbps = conn?.downlink ? conn.downlink * 1000 : 10000;
  const device_memory_gb = (navigator as any)?.deviceMemory ?? 8;
  return { webgl2, webgpu, battery, connection_kbps, device_memory_gb };
}

export function shouldLoadCinematicBundle(c: Capabilities): boolean {
  return c.webgl2 && c.battery > 0.2 && c.connection_kbps >= 4000 && c.device_memory_gb >= 4;
}
