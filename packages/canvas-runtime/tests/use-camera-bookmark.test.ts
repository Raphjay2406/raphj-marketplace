import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { interpolateBookmarks, useCameraBookmark } from "../src/useCameraBookmark.js";

describe("interpolateBookmarks", () => {
  const a = { id: "a", scroll_anchor: "#a", camera: { pos: [0,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} };
  const b = { id: "b", scroll_anchor: "#b", camera: { pos: [2,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} };

  it("returns A when progress=0", () => {
    expect(interpolateBookmarks(a, b, 0).pos).toEqual([0,0,5]);
  });

  it("returns B when progress=1", () => {
    expect(interpolateBookmarks(a, b, 1).pos).toEqual([2,0,5]);
  });

  it("lerps at progress=0.5", () => {
    expect(interpolateBookmarks(a, b, 0.5).pos).toEqual([1,0,5]);
  });
});

describe("useCameraBookmark hook", () => {
  it("mounts without error and returns initial camera state", () => {
    const bookmarks = [
      { id: "a", scroll_anchor: "#a", camera: { pos: [0,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} },
      { id: "b", scroll_anchor: "#b", camera: { pos: [2,0,5] as [number,number,number], look_at: [0,0,0] as [number,number,number], fov: 50 }, morphs: {} },
    ];
    const { result, unmount } = renderHook(() => useCameraBookmark(bookmarks));
    expect(result.current).toHaveProperty("pos");
    expect(result.current).toHaveProperty("fov");
    unmount();
  });
});
