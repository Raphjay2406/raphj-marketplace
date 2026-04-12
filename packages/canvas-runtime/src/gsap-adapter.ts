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
const PRESET_TO_EASE: Record<string, string> = {
  "ease-in-out": "power2.inOut",
  "ease-out": "power2.out",
  "ease-in": "power2.in",
  "linear": "none",
  "spring": "elastic.out(1, 0.5)",
  "overshoot": "back.out(1.7)",
  "anticipate": "back.inOut(1.7)",
};

export function presetToGsapEase(preset: string): string {
  return PRESET_TO_EASE[preset] ?? "power2.out";
}

// ---------------------------------------------------------------------------
// DNA-token tween builder
// ---------------------------------------------------------------------------

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
export function dnaTween(
  target: gsap.TweenTarget,
  vars: DnaTweenOptions
): gsap.core.Tween {
  const { preset, tokenSource, ...rest } = vars;

  // Resolve token values if we have a DOM source (no-op in Node / SSR)
  let resolvedDuration = rest.duration ?? 0.6;
  let resolvedEase = rest.ease ?? "power2.out";

  if (typeof window !== "undefined" && typeof getComputedStyle === "function") {
    const src = tokenSource ?? document.documentElement;
    const styles = getComputedStyle(src);
    const tokenDuration = styles.getPropertyValue("--motion-duration").trim();
    const tokenEasing = styles.getPropertyValue("--motion-easing").trim();
    if (tokenDuration) resolvedDuration = parseFloat(tokenDuration);
    if (tokenEasing) resolvedEase = tokenEasing;
  }

  if (preset) resolvedEase = presetToGsapEase(preset);

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
export function setGsapTimescale(scale: number): void {
  gsap.globalTimeline.timeScale(scale);
}

// ---------------------------------------------------------------------------
// Scroll-progress driven animation
// ---------------------------------------------------------------------------

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
export function scrollProgressTween(
  target: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars
): ScrollProgressTween {
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(target, fromVars, { ...toVars, ease: "none" });

  return {
    update(progress: number): void {
      tl.progress(Math.max(0, Math.min(1, progress)));
    },
    kill(): void {
      tl.kill();
    },
  };
}
