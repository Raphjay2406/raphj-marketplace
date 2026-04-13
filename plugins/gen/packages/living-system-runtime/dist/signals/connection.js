export function subscribeConnection(cb) {
    const conn = navigator?.connection;
    if (!conn) {
        cb(10_000);
        return () => { };
    }
    const emit = () => cb((conn.downlink ?? 10) * 1000);
    emit();
    conn.addEventListener("change", emit);
    return () => conn.removeEventListener("change", emit);
}
