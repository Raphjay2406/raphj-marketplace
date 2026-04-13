export function applyDelta(delta: Record<string, string>): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(delta)) root.style.setProperty(k, v);
}

export function revertDelta(keys: string[]): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const k of keys) root.style.removeProperty(k);
}
