import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { SceneChoreography } from "./schemas/scene-choreography.schema.js";
import { useCameraBookmark } from "./useCameraBookmark.js";

export interface SceneDirectorProps { choreography: SceneChoreography }

export function SceneDirector({ choreography }: SceneDirectorProps) {
  if (choreography.bookmarks.length === 0) return null;

  return (
    <>
      <CameraDriver bookmarks={choreography.bookmarks} />
      {choreography.lights.map((l, i) => {
        if (l.type === "directional")
          return <directionalLight key={i} intensity={l.intensity} position={l.pos ?? [5,5,5]} color={l.color ?? "#ffffff"} />;
        if (l.type === "ambient")
          return <ambientLight key={i} intensity={l.intensity} color={l.color ?? "#ffffff"} />;
        if (l.type === "point")
          return <pointLight key={i} intensity={l.intensity} position={l.pos ?? [0,5,0]} color={l.color ?? "#ffffff"} />;
        if (l.type === "spot")
          return <spotLight key={i} intensity={l.intensity} position={l.pos ?? [0,5,5]} color={l.color ?? "#ffffff"} />;
        return <hemisphereLight key={i} intensity={l.intensity} color={l.color ?? "#ffffff"} />;
      })}
    </>
  );
}

function CameraDriver({ bookmarks }: { bookmarks: SceneChoreography["bookmarks"] }) {
  const target = useCameraBookmark(bookmarks);
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(target.pos[0], target.pos[1], target.pos[2]);
    camera.lookAt(target.look_at[0], target.look_at[1], target.look_at[2]);
  });
  return null;
}
