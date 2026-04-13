export function synthesizeArchetype(inp) {
    if (inp.seed_templates.length !== inp.blend_weights.length) {
        throw new Error("seed_templates / blend_weights length mismatch");
    }
    const [p, s, a, sig] = inp.mine.palette.concat(["#0f0e12", "#f5b85c", "#e6e1d6", "#1A73E8"]).slice(0, 4);
    return {
        slug: inp.slug,
        name: inp.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        tier: "generative",
        seed_templates: inp.seed_templates,
        blend_weights: inp.blend_weights,
        dna_color_palette: { primary: p, secondary: s, accent: a, signature: sig },
        dna_fonts: { display: "Söhne Breit", body: "Söhne", mono: "Berkeley Mono" },
        dna_motion_tokens: { easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", duration_hero_ms: 1600, duration_micro_ms: 160 },
        mandatory_techniques: [`blend:${inp.seed_templates.join("+")}`],
        forbidden_patterns: ["generic-saas-hero"],
        tension_zones: ["synthesis-glow", "palette-push", "motif-echo"]
    };
}
