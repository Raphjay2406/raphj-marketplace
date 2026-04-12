import { z } from "zod";
export const IntensitySchema = z.enum(["none", "accent", "section", "cinematic", "immersive"]);
const Vec3 = z.tuple([z.number(), z.number(), z.number()]);
export const CameraSchema = z.object({
    pos: Vec3, look_at: Vec3, fov: z.number().min(10).max(120).default(50)
});
export const BookmarkSchema = z.object({
    id: z.string().min(1),
    scroll_anchor: z.string().regex(/^#.+/),
    camera: CameraSchema,
    morphs: z.record(z.number().min(0).max(1))
});
export const MeshRefSchema = z.object({
    id: z.string().min(1), gltf_path: z.string(), lods: z.array(z.number()).optional()
});
export const LightSchema = z.object({
    type: z.enum(["directional", "ambient", "point", "spot", "hemi"]),
    intensity: z.number().nonnegative(),
    pos: Vec3.optional(),
    color: z.string().optional()
});
export const SceneChoreographySchema = z.object({
    schema_version: z.literal("4.0.0"),
    project_id: z.string(),
    intensity: IntensitySchema,
    bookmarks: z.array(BookmarkSchema),
    meshes: z.array(MeshRefSchema),
    lights: z.array(LightSchema)
}).refine(g => {
    if (g.intensity === "cinematic" || g.intensity === "immersive") {
        return g.bookmarks.length >= 1;
    }
    return true;
}, { message: "cinematic/immersive requires at least 1 bookmark", path: ["bookmarks"] });
