/**
 * Task 3: GSAP integration adapter.
 *
 * Wraps gsap to:
 * - Provide a DNA-token-aware tween builder (reads CSS custom props if available)
 * - Expose a ScrollTrigger-style scroll-progress hook (without requiring
 *   ScrollTrigger plugin — Lenis owns scroll; GSAP owns tween timing).
 * - Enforce the timescale from CanvasConfig.
 */
import gsap from "gsap";
export { gsap };
// ---------------------------------------------------------------------------
// Motion preset → gsap ease mapping
// ---------------------------------------------------------------------------
const PRESET_TO_EASE = {
    "ease-in-out": "power2.inOut",
    "ease-out": "power2.out",
    "ease-in": "power2.in",
    "linear": "none",
    "spring": "elastic.out(1, 0.5)",
    "overshoot": "back.out(1.7)",
    "anticipate": "back.inOut(1.7)",
};
export function presetToGsapEase(preset) {
    return PRESET_TO_EASE[preset] ?? "power2.out";
}
/**
 * Create a GSAP tween that maps Design DNA motion token values to duration/ease.
 *
 * If `--motion-duration-{label}` or `--motion-easing` CSS custom props are present
 * on the tokenSource element they are used as defaults (overridable via options).
 */
export function dnaTween(target, vars) {
    const { preset, tokenSource, ...rest } = vars;
    // Resolve token values if we have a DOM source (no-op in Node / SSR)
    let resolvedDuration = rest.duration ?? 0.6;
    let resolvedEase = rest.ease ?? "power2.out";
    if (typeof window !== "undefined" && typeof getComputedStyle === "function") {
        const src = tokenSource ?? document.documentElement;
        const styles = getComputedStyle(src);
        const tokenDuration = styles.getPropertyValue("--motion-duration").trim();
        const tokenEasing = styles.getPropertyValue("--motion-easing").trim();
        if (tokenDuration)
            resolvedDuration = parseFloat(tokenDuration);
        if (tokenEasing)
            resolvedEase = tokenEasing;
    }
    if (preset)
        resolvedEase = presetToGsapEase(preset);
    return gsap.to(target, {
        ...rest,
        duration: resolvedDuration,
        ease: resolvedEase,
    });
}
// ---------------------------------------------------------------------------
// Timescale management
// ---------------------------------------------------------------------------
/**
 * Apply a global GSAP timescale — called once from CanvasRuntime init.
 */
export function setGsapTimescale(scale) {
    gsap.globalTimeline.timeScale(scale);
}
/**
 * Create a scroll-progress-driven GSAP animation.
 * Call `update(progress)` from a Lenis scroll callback.
 *
 * @param target - GSAP target
 * @param fromVars - Start state (progress = 0)
 * @param toVars - End state (progress = 1)
 */
export function scrollProgressTween(target, fromVars, toVars) {
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(target, fromVars, { ...toVars, ease: "none" });
    return {
        update(progress) {
            tl.progress(Math.max(0, Math.min(1, progress)));
        },
        kill() {
            tl.kill();
        },
    };
}
