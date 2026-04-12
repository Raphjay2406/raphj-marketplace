/**
 * Task 4: Lenis smooth-scroll adapter.
 *
 * Wraps lenis@1.x to:
 * - Create a singleton Lenis instance with DNA-token-aware defaults
 * - Expose a subscription API for scroll-progress consumers (R3F, GSAP)
 * - Provide a RAF loop integration helper
 */
import Lenis from "lenis";

export type { Lenis };

// ---------------------------------------------------------------------------
// Singleton management
// ---------------------------------------------------------------------------
let lenisInstance: Lenis | null = null;
const scrollListeners = new Set<(progress: number, rawY: number) => void>();

export interface LenisOptions {
  /** Scroll dampening factor 0–1 (lower = more damping). Default: 0.1 */
  damping?: number;
  /** Whether the target is the window (true) or a custom wrapper (false) */
  smoothWheel?: boolean;
}

/**
 * Create (or return existing) the Lenis singleton.
 * Safe to call multiple times — only creates one instance.
 */
export function createLenis(options: LenisOptions = {}): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: options.smoothWheel ?? true,
    // Lenis 1.x uses `lerp` for damping (0 = instant, 1 = no movement)
    // `damping` option maps to lerp
    lerp: options.damping ?? 0.1,
  } as ConstructorParameters<typeof Lenis>[0]);

  // Internal: forward each scroll tick to registered listeners
  lenisInstance.on("scroll", ({ progress, scroll }: { progress: number; scroll: number }) => {
    for (const listener of scrollListeners) {
      listener(progress, scroll);
    }
  });

  return lenisInstance;
}

/**
 * Return the current singleton (null if not yet created).
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Subscribe to scroll progress updates.
 * The callback receives `progress` (0–1) and raw Y scroll position in px.
 * Returns an unsubscribe function.
 */
export function onScroll(callback: (progress: number, rawY: number) => void): () => void {
  scrollListeners.add(callback);
  return () => scrollListeners.delete(callback);
}

/**
 * Tick Lenis — call this inside your RAF loop or R3F's `useFrame`.
 * @param time - DOMHighResTimeStamp (from requestAnimationFrame callback)
 */
export function tickLenis(time: number): void {
  lenisInstance?.raf(time);
}

/**
 * Programmatically scroll to a target.
 * @param target - CSS selector, element, or Y offset in px
 * @param immediate - Skip animation and jump instantly
 */
export function scrollTo(target: string | HTMLElement | number, immediate = false): void {
  lenisInstance?.scrollTo(target as never, { immediate });
}

/**
 * Destroy the Lenis instance and clear listeners.
 * Called on unmount / HMR.
 */
export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
  scrollListeners.clear();
}
