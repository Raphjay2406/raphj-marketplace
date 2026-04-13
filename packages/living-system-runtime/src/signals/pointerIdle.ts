export function subscribePointerIdle(cb: (idle_ms: number) => void, thresholdMs = 3000): () => void {
  if (typeof window === "undefined") return () => {};
  let lastMove = performance.now();
  const onMove = () => { lastMove = performance.now(); cb(0); };
  window.addEventListener("pointermove", onMove, { passive: true });
  const id = setInterval(() => {
    const idle = performance.now() - lastMove;
    if (idle >= thresholdMs) cb(idle);
  }, 500);
  return () => { window.removeEventListener("pointermove", onMove); clearInterval(id); };
}
