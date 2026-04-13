import { Section } from "./schema.js";
export declare function SectionRenderer({ section }: {
    section: Section;
}): import("react/jsx-runtime").JSX.Element;
export interface PageRendererProps {
    /** Raw page spec — validated against PageSchema before rendering */
    spec: unknown;
}
export declare function PageRenderer({ spec }: PageRendererProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=renderer.d.ts.map