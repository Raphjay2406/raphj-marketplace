import type { MineReport } from "./referenceMiner.js";
export interface SynthInput {
    slug: string;
    mine: MineReport;
    seed_templates: string[];
    blend_weights: number[];
}
export interface GeneratedArchetype {
    slug: string;
    name: string;
    tier: "generative";
    seed_templates: string[];
    blend_weights: number[];
    dna_color_palette: {
        primary: string;
        secondary: string;
        accent: string;
        signature: string;
    };
    dna_fonts: {
        display: string;
        body: string;
        mono: string;
    };
    dna_motion_tokens: {
        easing: string;
        duration_hero_ms: number;
        duration_micro_ms: number;
    };
    mandatory_techniques: string[];
    forbidden_patterns: string[];
    tension_zones: string[];
}
export declare function synthesizeArchetype(inp: SynthInput): GeneratedArchetype;
//# sourceMappingURL=archetypeSynthesizer.d.ts.map