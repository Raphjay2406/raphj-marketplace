import React from "react";
import type { Intensity } from "./schemas/scene-choreography.schema.js";
export interface PersistentCanvasProps {
    intensity: Intensity;
    children?: React.ReactNode;
}
export declare function PersistentCanvas({ intensity, children }: PersistentCanvasProps): import("react/jsx-runtime").JSX.Element | null;
