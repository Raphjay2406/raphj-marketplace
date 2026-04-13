export function applyDelta(delta) {
    if (typeof document === "undefined")
        return;
    const root = document.documentElement;
    for (const [k, v] of Object.entries(delta))
        root.style.setProperty(k, v);
}
export function revertDelta(keys) {
    if (typeof document === "undefined")
        return;
    const root = document.documentElement;
    for (const k of keys)
        root.style.removeProperty(k);
}
