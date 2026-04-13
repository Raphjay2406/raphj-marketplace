const KEY = "genorah:ls:visits";
export function readVisitCount() {
    try {
        return Number(localStorage.getItem(KEY)) || 0;
    }
    catch {
        return 0;
    }
}
export function incrementVisit() {
    const next = readVisitCount() + 1;
    try {
        localStorage.setItem(KEY, String(next));
    }
    catch { }
    return next;
}
export function subscribeVisitCount(cb) {
    cb(readVisitCount());
    return () => { };
}
