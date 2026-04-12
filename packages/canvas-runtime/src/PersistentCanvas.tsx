import React from "react";
import { Canvas } from "@react-three/fiber";
import type { Intensity } from "./schemas/scene-choreography.schema.js";

export interface PersistentCanvasProps {
  intensity: Intensity;
  children?: React.ReactNode;
}

export function PersistentCanvas({ intensity, children }: PersistentCanvasProps) {
  if (intensity === "none") return null;
  return (
    <div
      data-intensity={intensity}
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <Canvas dpr={[1, 2]} gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}>
        {children}
      </Canvas>
    </div>
  );
}
