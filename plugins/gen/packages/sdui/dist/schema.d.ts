import { z } from "zod";
export declare const HeroSchema: z.ZodObject<{
    type: z.ZodLiteral<"hero">;
    heading: z.ZodString;
    subheading: z.ZodOptional<z.ZodString>;
    cta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
    }, {
        label: string;
        href: string;
    }>>;
    backgroundImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "hero";
    heading: string;
    subheading?: string | undefined;
    cta?: {
        label: string;
        href: string;
    } | undefined;
    backgroundImage?: string | undefined;
}, {
    type: "hero";
    heading: string;
    subheading?: string | undefined;
    cta?: {
        label: string;
        href: string;
    } | undefined;
    backgroundImage?: string | undefined;
}>;
export declare const TextSchema: z.ZodObject<{
    type: z.ZodLiteral<"text">;
    body: z.ZodString;
    align: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
}, "strip", z.ZodTypeAny, {
    type: "text";
    body: string;
    align: "left" | "center" | "right";
}, {
    type: "text";
    body: string;
    align?: "left" | "center" | "right" | undefined;
}>;
export declare const GridSchema: z.ZodObject<{
    type: z.ZodLiteral<"grid">;
    columns: z.ZodDefault<z.ZodNumber>;
    items: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "grid";
    columns: number;
    items: {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }[];
}, {
    type: "grid";
    items: {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }[];
    columns?: number | undefined;
}>;
export declare const SectionSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"hero">;
    heading: z.ZodString;
    subheading: z.ZodOptional<z.ZodString>;
    cta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
    }, {
        label: string;
        href: string;
    }>>;
    backgroundImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "hero";
    heading: string;
    subheading?: string | undefined;
    cta?: {
        label: string;
        href: string;
    } | undefined;
    backgroundImage?: string | undefined;
}, {
    type: "hero";
    heading: string;
    subheading?: string | undefined;
    cta?: {
        label: string;
        href: string;
    } | undefined;
    backgroundImage?: string | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"text">;
    body: z.ZodString;
    align: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
}, "strip", z.ZodTypeAny, {
    type: "text";
    body: string;
    align: "left" | "center" | "right";
}, {
    type: "text";
    body: string;
    align?: "left" | "center" | "right" | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"grid">;
    columns: z.ZodDefault<z.ZodNumber>;
    items: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "grid";
    columns: number;
    items: {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }[];
}, {
    type: "grid";
    items: {
        title: string;
        description?: string | undefined;
        image?: string | undefined;
    }[];
    columns?: number | undefined;
}>]>;
export declare const PageSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    sections: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"hero">;
        heading: z.ZodString;
        subheading: z.ZodOptional<z.ZodString>;
        cta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            href: string;
        }, {
            label: string;
            href: string;
        }>>;
        backgroundImage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "hero";
        heading: string;
        subheading?: string | undefined;
        cta?: {
            label: string;
            href: string;
        } | undefined;
        backgroundImage?: string | undefined;
    }, {
        type: "hero";
        heading: string;
        subheading?: string | undefined;
        cta?: {
            label: string;
            href: string;
        } | undefined;
        backgroundImage?: string | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
        body: z.ZodString;
        align: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "text";
        body: string;
        align: "left" | "center" | "right";
    }, {
        type: "text";
        body: string;
        align?: "left" | "center" | "right" | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"grid">;
        columns: z.ZodDefault<z.ZodNumber>;
        items: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }, {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "grid";
        columns: number;
        items: {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }[];
    }, {
        type: "grid";
        items: {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }[];
        columns?: number | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    sections: ({
        type: "hero";
        heading: string;
        subheading?: string | undefined;
        cta?: {
            label: string;
            href: string;
        } | undefined;
        backgroundImage?: string | undefined;
    } | {
        type: "text";
        body: string;
        align: "left" | "center" | "right";
    } | {
        type: "grid";
        columns: number;
        items: {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }[];
    })[];
}, {
    title: string;
    slug: string;
    sections: ({
        type: "hero";
        heading: string;
        subheading?: string | undefined;
        cta?: {
            label: string;
            href: string;
        } | undefined;
        backgroundImage?: string | undefined;
    } | {
        type: "text";
        body: string;
        align?: "left" | "center" | "right" | undefined;
    } | {
        type: "grid";
        items: {
            title: string;
            description?: string | undefined;
            image?: string | undefined;
        }[];
        columns?: number | undefined;
    })[];
}>;
export type HeroSection = z.infer<typeof HeroSchema>;
export type TextSection = z.infer<typeof TextSchema>;
export type GridSection = z.infer<typeof GridSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
//# sourceMappingURL=schema.d.ts.map