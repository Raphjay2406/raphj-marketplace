import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useFrame, useThree } from "@react-three/fiber";
import { useCameraBookmark } from "./useCameraBookmark.js";
export function SceneDirector({ choreography }) {
    if (choreography.bookmarks.length === 0)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(CameraDriver, { bookmarks: choreography.bookmarks }), choreography.lights.map((l, i) => {
                if (l.type === "directional")
                    return _jsx("directionalLight", { intensity: l.intensity, position: l.pos ?? [5, 5, 5], color: l.color ?? "#ffffff" }, i);
                if (l.type === "ambient")
                    return _jsx("ambientLight", { intensity: l.intensity, color: l.color ?? "#ffffff" }, i);
                if (l.type === "point")
                    return _jsx("pointLight", { intensity: l.intensity, position: l.pos ?? [0, 5, 0], color: l.color ?? "#ffffff" }, i);
                if (l.type === "spot")
                    return _jsx("spotLight", { intensity: l.intensity, position: l.pos ?? [0, 5, 5], color: l.color ?? "#ffffff" }, i);
                return _jsx("hemisphereLight", { intensity: l.intensity, color: l.color ?? "#ffffff" }, i);
            })] }));
}
function CameraDriver({ bookmarks }) {
    const target = useCameraBookmark(bookmarks);
    const { camera } = useThree();
    useFrame(() => {
        camera.position.set(target.pos[0], target.pos[1], target.pos[2]);
        camera.lookAt(target.look_at[0], target.look_at[1], target.look_at[2]);
    });
    return null;
}
