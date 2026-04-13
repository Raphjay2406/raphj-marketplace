import type { SceneChoreography } from "./schemas/scene-choreography.schema.js";
export interface SceneDirectorProps {
    choreography: SceneChoreography;
}
export declare function SceneDirector({ choreography }: SceneDirectorProps): import("react/jsx-runtime").JSX.Element | null;
