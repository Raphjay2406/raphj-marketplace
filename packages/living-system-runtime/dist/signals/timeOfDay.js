export function currentTimeHM(now = new Date()) {
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
export function subscribeTimeOfDay(cb, interval = 60_000) {
    cb(currentTimeHM());
    const id = setInterval(() => cb(currentTimeHM()), interval);
    return () => clearInterval(id);
}
