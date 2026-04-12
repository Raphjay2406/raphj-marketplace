import { jsx as _jsx } from "react/jsx-runtime";
export function FallbackHero({ src, alt }) {
    return (_jsx("div", { style: { position: "fixed", inset: 0, zIndex: -1 }, children: _jsx("img", { src: src, alt: alt, style: { width: "100%", height: "100%", objectFit: "cover" } }) }));
}
