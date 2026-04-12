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
export declare function createLenis(options?: LenisOptions): Lenis;
/**
 * Return the current singleton (null if not yet created).
 */
export declare function getLenis(): Lenis | null;
/**
 * Subscribe to scroll progress updates.
 * The callback receives `progress` (0–1) and raw Y scroll position in px.
 * Returns an unsubscribe function.
 */
export declare function onScroll(callback: (progress: number, rawY: number) => void): () => void;
/**
 * Tick Lenis — call this inside your RAF loop or R3F's `useFrame`.
 * @param time - DOMHighResTimeStamp (from requestAnimationFrame callback)
 */
export declare function tickLenis(time: number): void;
/**
 * Programmatically scroll to a target.
 * @param target - CSS selector, element, or Y offset in px
 * @param immediate - Skip animation and jump instantly
 */
export declare function scrollTo(target: string | HTMLElement | number, immediate?: boolean): void;
/**
 * Destroy the Lenis instance and clear listeners.
 * Called on unmount / HMR.
 */
export declare function destroyLenis(): void;
