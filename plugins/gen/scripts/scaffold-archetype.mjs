#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const archetypes = [
  { slug: "cinematic-3d", name: "Cinematic 3D", mandatory: ["PersistentCanvas", "Theatre.js", "Lenis"], forbidden: ["multiple-canvas","scroll-hijack-for-marketing"], tension: ["scale-violence-hero","material-collision-pivot","temporal-disruption-close"] },
  { slug: "volumetric", name: "Volumetric", mandatory: ["WebGPU fog shader","density grid"], forbidden: ["flat-2d-hero"], tension: ["atmospheric-depth","edge-bleed","fog-reveal"] },
  { slug: "biomorphic-compute", name: "Biomorphic Compute", mandatory: ["WebGPU compute","organic-curves","noise-displacement"], forbidden: ["hard-edges","grid-layout"], tension: ["pulse-breath","tendril-growth","mycelial-join"] },
  { slug: "temporal-glass", name: "Temporal Glass", mandatory: ["backdrop-filter","refraction-shader","time-delay"], forbidden: ["opaque-surfaces"], tension: ["time-delay","lag-reveal","freeze-frame"] },
  { slug: "neo-physical", name: "Neo-Physical", mandatory: ["PBR-materials","HDRI","contact-shadows"], forbidden: ["flat-shaded"], tension: ["physicality-break","gravity-defy","material-flex"] },
  { slug: "signal-noise", name: "Signal Noise", mandatory: ["glitch-shader","scanlines","chromatic-aberration"], forbidden: ["clean-aesthetics"], tension: ["data-storm","signal-drop","reboot-flash"] },
  { slug: "kinetic-industrial", name: "Kinetic Industrial", mandatory: ["mechanical-motion","gears","exposed-structure"], forbidden: ["soft-organic"], tension: ["servo-whip","belt-catch","pneumatic-burst"] },
  { slug: "narrative-cinema", name: "Narrative Cinema", mandatory: ["letterbox","title-cards","score-cues"], forbidden: ["flat-ui-chrome"], tension: ["cut-to-black","slow-push","match-cut"] },
  { slug: "ambient-computing", name: "Ambient Computing", mandatory: ["subtle-idle-motion","breathing-ui","peripheral-glow"], forbidden: ["aggressive-cta"], tension: ["breath-pause","attention-drift","recenter"] },
  { slug: "post-flat", name: "Post-Flat", mandatory: ["layered-depth","parallax","material-stacks"], forbidden: ["pure-flat-design"], tension: ["layer-collapse","z-overlap","depth-reveal"] },
  { slug: "living-data", name: "Living Data", mandatory: ["realtime-charts","pulsing-indicators","animated-sparklines"], forbidden: ["static-numbers"], tension: ["spike-pulse","trend-whip","zero-line-stare"] },
  { slug: "organic-machinery", name: "Organic Machinery", mandatory: ["cellular-structures","mechanical-blend","biology-meets-engineering"], forbidden: ["pure-organic","pure-mechanical"], tension: ["graft-reveal","mitosis-split","synthesis-glow"] },
  { slug: "hyperreal-minimal", name: "Hyperreal Minimal", mandatory: ["photo-real-hero","maximum-whitespace","single-subject"], forbidden: ["clutter","multi-subject"], tension: ["silence","single-beat","whisper-close"] },
  { slug: "liminal-brutalism", name: "Liminal Brutalism", mandatory: ["raw-concrete-textures","stark-type","liminal-space-imagery"], forbidden: ["decorative-flourish"], tension: ["hollow-echo","scale-crush","absence-weight"] },
  { slug: "sonic-visual", name: "Sonic Visual", mandatory: ["audio-reactive","sonic-logo","haptic-hooks"], forbidden: ["silent-experience"], tension: ["beat-sync","bass-drop","silence-beat"] },
  { slug: "quantum-editorial", name: "Quantum Editorial", mandatory: ["editorial-grid","narrative-typography","photographic-imagery"], forbidden: ["pure-grid-break"], tension: ["margin-break","hanging-folio","kerning-drama"] },
  { slug: "archive-futurist", name: "Archive Futurist", mandatory: ["terminal-type","monochrome-accent","retro-future-chrome"], forbidden: ["contemporary-flat"], tension: ["scanline-artifact","phosphor-burn","archive-dust"] }
];

for (const a of archetypes) {
  const dir = join(root, `skills/design-archetypes/archetypes/${a.slug}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "archetype.json"), JSON.stringify({
    slug: a.slug,
    name: a.name,
    tier: "webgpu-native",
    mandatory_techniques: a.mandatory,
    forbidden_patterns: a.forbidden,
    tension_zones: a.tension,
    default_intensity: "cinematic",
    dna_color_palette: { primary: "#0F1117", secondary: "#C7A86B", accent: "#F6F2EC", signature: "#1A73E8" },
    dna_fonts: { display: "Söhne Breit", body: "Söhne", mono: "Berkeley Mono" },
    dna_motion_tokens: { easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", duration_hero_ms: 1600, duration_micro_ms: 160 }
  }, null, 2));
  writeFileSync(join(dir, "reference-sites.md"), `# ${a.name} — Reference Sites\n\n(Curated Awwwards SOTD + indie studios. Updated quarterly.)\n`);
  writeFileSync(join(dir, "tension-zones.md"), `# ${a.name} — Tension Zones\n\n` + a.tension.map(t => `## ${t}\n\nDescribe controlled rule-break pattern here.\n`).join("\n"));
}
console.log(`wrote ${archetypes.length} archetype scaffolds`);
