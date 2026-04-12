import { jsx as _jsx } from "react/jsx-runtime";
import { Canvas } from "@react-three/fiber";
export function PersistentCanvas({ intensity, children }) {
    if (intensity === "none")
        return null;
    return (_jsx("div", { "data-intensity": intensity, style: { position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }, children: _jsx(Canvas, { dpr: [1, 2], gl: { powerPreference: "high-performance", antialias: true, alpha: true }, children: children }) }));
}
