export interface SandboxInput {
    entry_source: string;
    payload: unknown;
    timeout_ms: number;
    allow_net?: string[];
}
export interface SandboxResult {
    stdout: string;
    parsed: any;
    duration_ms: number;
}
export declare function runInSandbox(input: SandboxInput): Promise<SandboxResult>;
//# sourceMappingURL=sandbox.d.ts.map