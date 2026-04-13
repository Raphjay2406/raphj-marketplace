import { useEffect, useState } from "react";
function lerp3(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
export function interpolateBookmarks(a, b, t) {
    return {
        pos: lerp3(a.camera.pos, b.camera.pos, t),
        look_at: lerp3(a.camera.look_at, b.camera.look_at, t),
        fov: a.camera.fov + (b.camera.fov - a.camera.fov) * t
    };
}
export function useCameraBookmark(bookmarks) {
    const [state, setState] = useState(() => interpolateBookmarks(bookmarks[0], bookmarks[0], 0));
    useEffect(() => {
        const onScroll = () => {
            const elements = bookmarks.map(b => document.querySelector(b.scroll_anchor));
            const viewportH = window.innerHeight;
            const scrollY = window.scrollY;
            for (let i = 0; i < bookmarks.length - 1; i++) {
                const el = elements[i];
                const next = elements[i + 1];
                if (!el || !next)
                    continue;
                const start = el.offsetTop;
                const end = next.offsetTop;
                if (scrollY + viewportH / 2 >= start && scrollY + viewportH / 2 < end) {
                    const t = (scrollY + viewportH / 2 - start) / (end - start);
                    setState(interpolateBookmarks(bookmarks[i], bookmarks[i + 1], t));
                    return;
                }
            }
            // past last bookmark
            const last = bookmarks[bookmarks.length - 1];
            setState(interpolateBookmarks(last, last, 0));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [bookmarks]);
    return state;
}
