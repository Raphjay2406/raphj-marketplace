export interface Capabilities {
    webgl2: boolean;
    webgpu: boolean;
    battery: number;
    connection_kbps: number;
    device_memory_gb: number;
}
export declare function probeCapabilities(): Promise<Capabilities>;
export declare function shouldLoadCinematicBundle(c: Capabilities): boolean;
