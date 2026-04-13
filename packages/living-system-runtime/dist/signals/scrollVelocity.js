export function subscribeScrollVelocity(cb) {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastT = performance.now();
    let rafId = 0;
    const tick = () => {
        const now = performance.now();
        const y = window.scrollY;
        const dt = (now - lastT) / 1000;
        if (dt > 0.05) {
            const v = Math.abs(y - lastY) / dt;
            cb(v);
            lastY = y;
            lastT = now;
        }
        rafId = requestAnimationFrame(tick);
    };
    if (typeof window !== "undefined")
        rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
}
