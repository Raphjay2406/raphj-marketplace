import { BookmarkSchema } from "./schemas/scene-choreography.schema.js";
import { z } from "zod";
type Bookmark = z.infer<typeof BookmarkSchema>;
export declare function interpolateBookmarks(a: Bookmark, b: Bookmark, t: number): {
    pos: [number, number, number];
    look_at: [number, number, number];
    fov: number;
};
export declare function useCameraBookmark(bookmarks: Bookmark[]): {
    pos: [number, number, number];
    look_at: [number, number, number];
    fov: number;
};
export {};
