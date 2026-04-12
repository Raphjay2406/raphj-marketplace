/**
 * Task 4: Lenis smooth-scroll adapter.
 *
 * Wraps lenis@1.x to:
 * - Create a singleton Lenis instance with DNA-token-aware defaults
 * - Expose a subscription API for scroll-progress consumers (R3F, GSAP)
 * - Provide a RAF loop integration helper
 */
import Lenis from "lenis";
// ---------------------------------------------------------------------------
// Singleton management
// ---------------------------------------------------------------------------
let lenisInstance = null;
const scrollListeners = new Set();
/**
 * Create (or return existing) the Lenis singleton.
 * Safe to call multiple times — only creates one instance.
 */
export function createLenis(options = {}) {
    if (lenisInstance)
        return lenisInstance;
    lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: options.smoothWheel ?? true,
        // Lenis 1.x uses `lerp` for damping (0 = instant, 1 = no movement)
        // `damping` option maps to lerp
        lerp: options.damping ?? 0.1,
    });
    // Internal: forward each scroll tick to registered listeners
    lenisInstance.on("scroll", ({ progress, scroll }) => {
        for (const listener of scrollListeners) {
            listener(progress, scroll);
        }
    });
    return lenisInstance;
}
/**
 * Return the current singleton (null if not yet created).
 */
export function getLenis() {
    return lenisInstance;
}
/**
 * Subscribe to scroll progress updates.
 * The callback receives `progress` (0–1) and raw Y scroll position in px.
 * Returns an unsubscribe function.
 */
export function onScroll(callback) {
    scrollListeners.add(callback);
    return () => scrollListeners.delete(callback);
}
/**
 * Tick Lenis — call this inside your RAF loop or R3F's `useFrame`.
 * @param time - DOMHighResTimeStamp (from requestAnimationFrame callback)
 */
export function tickLenis(time) {
    lenisInstance?.raf(time);
}
/**
 * Programmatically scroll to a target.
 * @param target - CSS selector, element, or Y offset in px
 * @param immediate - Skip animation and jump instantly
 */
export function scrollTo(target, immediate = false) {
    lenisInstance?.scrollTo(target, { immediate });
}
/**
 * Destroy the Lenis instance and clear listeners.
 * Called on unmount / HMR.
 */
export function destroyLenis() {
    lenisInstance?.destroy();
    lenisInstance = null;
    scrollListeners.clear();
}
