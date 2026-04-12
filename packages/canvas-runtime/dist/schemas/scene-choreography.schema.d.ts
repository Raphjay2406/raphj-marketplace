import { z } from "zod";
export declare const IntensitySchema: z.ZodEnum<["none", "accent", "section", "cinematic", "immersive"]>;
export type Intensity = z.infer<typeof IntensitySchema>;
export declare const CameraSchema: z.ZodObject<{
    pos: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    look_at: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    fov: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    pos: [number, number, number];
    look_at: [number, number, number];
    fov: number;
}, {
    pos: [number, number, number];
    look_at: [number, number, number];
    fov?: number | undefined;
}>;
export declare const BookmarkSchema: z.ZodObject<{
    id: z.ZodString;
    scroll_anchor: z.ZodString;
    camera: z.ZodObject<{
        pos: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        look_at: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        fov: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        pos: [number, number, number];
        look_at: [number, number, number];
        fov: number;
    }, {
        pos: [number, number, number];
        look_at: [number, number, number];
        fov?: number | undefined;
    }>;
    morphs: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    camera: {
        pos: [number, number, number];
        look_at: [number, number, number];
        fov: number;
    };
    id: string;
    scroll_anchor: string;
    morphs: Record<string, number>;
}, {
    camera: {
        pos: [number, number, number];
        look_at: [number, number, number];
        fov?: number | undefined;
    };
    id: string;
    scroll_anchor: string;
    morphs: Record<string, number>;
}>;
export type Bookmark = z.infer<typeof BookmarkSchema>;
export declare const MeshRefSchema: z.ZodObject<{
    id: z.ZodString;
    gltf_path: z.ZodString;
    lods: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    gltf_path: string;
    lods?: number[] | undefined;
}, {
    id: string;
    gltf_path: string;
    lods?: number[] | undefined;
}>;
export declare const LightSchema: z.ZodObject<{
    type: z.ZodEnum<["directional", "ambient", "point", "spot", "hemi"]>;
    intensity: z.ZodNumber;
    pos: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "directional" | "ambient" | "point" | "spot" | "hemi";
    intensity: number;
    color?: string | undefined;
    pos?: [number, number, number] | undefined;
}, {
    type: "directional" | "ambient" | "point" | "spot" | "hemi";
    intensity: number;
    color?: string | undefined;
    pos?: [number, number, number] | undefined;
}>;
export declare const SceneChoreographySchema: z.ZodEffects<z.ZodObject<{
    schema_version: z.ZodLiteral<"4.0.0">;
    project_id: z.ZodString;
    intensity: z.ZodEnum<["none", "accent", "section", "cinematic", "immersive"]>;
    bookmarks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scroll_anchor: z.ZodString;
        camera: z.ZodObject<{
            pos: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            look_at: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            fov: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov: number;
        }, {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov?: number | undefined;
        }>;
        morphs: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov: number;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }, {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov?: number | undefined;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }>, "many">;
    meshes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        gltf_path: z.ZodString;
        lods: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }, {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }>, "many">;
    lights: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["directional", "ambient", "point", "spot", "hemi"]>;
        intensity: z.ZodNumber;
        pos: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }, {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    intensity: "section" | "none" | "accent" | "cinematic" | "immersive";
    schema_version: "4.0.0";
    project_id: string;
    bookmarks: {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov: number;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }[];
    meshes: {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }[];
    lights: {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }[];
}, {
    intensity: "section" | "none" | "accent" | "cinematic" | "immersive";
    schema_version: "4.0.0";
    project_id: string;
    bookmarks: {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov?: number | undefined;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }[];
    meshes: {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }[];
    lights: {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }[];
}>, {
    intensity: "section" | "none" | "accent" | "cinematic" | "immersive";
    schema_version: "4.0.0";
    project_id: string;
    bookmarks: {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov: number;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }[];
    meshes: {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }[];
    lights: {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }[];
}, {
    intensity: "section" | "none" | "accent" | "cinematic" | "immersive";
    schema_version: "4.0.0";
    project_id: string;
    bookmarks: {
        camera: {
            pos: [number, number, number];
            look_at: [number, number, number];
            fov?: number | undefined;
        };
        id: string;
        scroll_anchor: string;
        morphs: Record<string, number>;
    }[];
    meshes: {
        id: string;
        gltf_path: string;
        lods?: number[] | undefined;
    }[];
    lights: {
        type: "directional" | "ambient" | "point" | "spot" | "hemi";
        intensity: number;
        color?: string | undefined;
        pos?: [number, number, number] | undefined;
    }[];
}>;
export type SceneChoreography = z.infer<typeof SceneChoreographySchema>;
