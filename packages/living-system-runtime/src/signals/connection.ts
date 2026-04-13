export function subscribeConnection(cb: (kbps: number) => void): () => void {
  const conn = (navigator as any)?.connection;
  if (!conn) { cb(10_000); return () => {}; }
  const emit = () => cb((conn.downlink ?? 10) * 1000);
  emit();
  conn.addEventListener("change", emit);
  return () => conn.removeEventListener("change", emit);
}
