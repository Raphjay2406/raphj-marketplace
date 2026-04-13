import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageSchema } from "./schema.js";
// ── Section renderers ────────────────────────────────────────────────────────
function HeroRenderer({ section }) {
    return (_jsxs("section", { "data-sdui": "hero", style: section.backgroundImage ? { backgroundImage: `url(${section.backgroundImage})` } : undefined, children: [_jsx("h1", { children: section.heading }), section.subheading && _jsx("p", { children: section.subheading }), section.cta && (_jsx("a", { href: section.cta.href, "data-sdui-cta": true, children: section.cta.label }))] }));
}
function TextRenderer({ section }) {
    return (_jsx("section", { "data-sdui": "text", style: { textAlign: section.align }, children: _jsx("p", { children: section.body }) }));
}
function GridRenderer({ section }) {
    return (_jsx("section", { "data-sdui": "grid", "data-columns": section.columns, style: { display: "grid", gridTemplateColumns: `repeat(${section.columns}, 1fr)` }, children: section.items.map((item, i) => (_jsxs("div", { "data-sdui-grid-item": true, children: [item.image && _jsx("img", { src: item.image, alt: item.title }), _jsx("h3", { children: item.title }), item.description && _jsx("p", { children: item.description })] }, i))) }));
}
// ── Section dispatcher ───────────────────────────────────────────────────────
export function SectionRenderer({ section }) {
    switch (section.type) {
        case "hero":
            return _jsx(HeroRenderer, { section: section });
        case "text":
            return _jsx(TextRenderer, { section: section });
        case "grid":
            return _jsx(GridRenderer, { section: section });
    }
}
export function PageRenderer({ spec }) {
    const page = PageSchema.parse(spec);
    return (_jsx("main", { "data-sdui-page": page.slug, children: page.sections.map((section, i) => (_jsx(SectionRenderer, { section: section }, i))) }));
}
