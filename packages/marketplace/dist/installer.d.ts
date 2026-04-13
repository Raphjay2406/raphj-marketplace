export interface InstallInput {
    registry: string;
    idWithVersion: string;
    installDir: string;
    apiToken?: string;
}
export declare function installAgent(inp: InstallInput): Promise<{
    path: string;
}>;
//# sourceMappingURL=installer.d.ts.map