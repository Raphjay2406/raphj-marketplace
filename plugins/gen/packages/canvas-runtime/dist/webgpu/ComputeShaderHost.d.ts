import React from "react";
export interface ComputeShaderHostProps {
    wgsl: string;
    fallback: React.ReactNode;
    children: React.ReactNode;
}
export declare function ComputeShaderHost({ wgsl, fallback, children }: ComputeShaderHostProps): import("react/jsx-runtime").JSX.Element | null;
