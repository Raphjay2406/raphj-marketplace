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
export declare function presetToGsapEase(preset: string): string;
export interface DnaTweenOptions extends gsap.TweenVars {
    /** Motion preset to use for easing (overrides ease in TweenVars) */
    preset?: string;
    /** Element to read CSS custom props from (defaults to :root) */
    tokenSource?: Element;
}
/**
 * Create a GSAP tween that maps Design DNA motion token values to duration/ease.
 *
 * If `--motion-duration-{label}` or `--motion-easing` CSS custom props are present
 * on the tokenSource element they are used as defaults (overridable via options).
 */
export declare function dnaTween(target: gsap.TweenTarget, vars: DnaTweenOptions): gsap.core.Tween;
/**
 * Apply a global GSAP timescale — called once from CanvasRuntime init.
 */
export declare function setGsapTimescale(scale: number): void;
export interface ScrollProgressTween {
    /** Update with progress 0–1 as Lenis scrolls */
    update(progress: number): void;
    /** Kill the underlying tween and free resources */
    kill(): void;
}
/**
 * Create a scroll-progress-driven GSAP animation.
 * Call `update(progress)` from a Lenis scroll callback.
 *
 * @param target - GSAP target
 * @param fromVars - Start state (progress = 0)
 * @param toVars - End state (progress = 1)
 */
export declare function scrollProgressTween(target: gsap.TweenTarget, fromVars: gsap.TweenVars, toVars: gsap.TweenVars): ScrollProgressTween;
