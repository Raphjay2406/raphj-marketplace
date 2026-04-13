/**
 * Task 2: Theatre.js 0.7.x wrapper.
 *
 * Provides a thin singleton façade over @theatre/core 0.7.x so the rest of
 * canvas-runtime never imports @theatre/core directly. This makes version
 * bumps a one-file change.
 *
 * API surface used: getProject, IProject, ISheet, ISequence, ISheetObject,
 * types, onChange, val, createRafDriver.
 */
import { getProject, types, onChange, val, createRafDriver, } from "@theatre/core";
export { types, onChange, val };
// ---------------------------------------------------------------------------
// Project registry — deduplicate projects by id
// ---------------------------------------------------------------------------
const projectRegistry = new Map();
/**
 * Return (or lazily create) a Theatre.js project by id.
 * Projects are singletons within a runtime session.
 */
export function getOrCreateProject(id, options = {}) {
    if (projectRegistry.has(id))
        return projectRegistry.get(id);
    const project = getProject(id, options.state ? { state: options.state } : undefined);
    projectRegistry.set(id, project);
    return project;
}
/**
 * Return a named sheet from a project. Sheets are lightweight; Theatre.js
 * caches them internally by (sheetId, instanceId).
 */
export function getSheet(project, sheetId, instanceId) {
    return instanceId ? project.sheet(sheetId, instanceId) : project.sheet(sheetId);
}
/**
 * Play a sheet's sequence with optional range / rate overrides.
 * Returns a Promise that resolves to true when complete or false if interrupted.
 */
export function playSequence(sheet, options = {}) {
    const seq = sheet.sequence;
    return seq.play({
        range: options.from != null && options.to != null ? [options.from, options.to] : undefined,
        rate: options.rate ?? 1,
        iterationCount: options.iterationCount ?? 1,
    });
}
/**
 * Scrub a sequence to a specific position without playing.
 */
export function scrubSequence(sheet, position) {
    sheet.sequence.position = position;
}
// ---------------------------------------------------------------------------
// Raf driver — single shared driver per session for R3F integration
// ---------------------------------------------------------------------------
let sharedRafDriver = null;
/**
 * Return (or create) a shared RAF driver suitable for use with R3F's
 * `frameloop="demand"` mode.
 */
export function getSharedRafDriver() {
    if (!sharedRafDriver) {
        sharedRafDriver = createRafDriver({ name: "genorah-canvas-raf" });
    }
    return sharedRafDriver;
}
/**
 * Tick the shared RAF driver manually — call this inside R3F's `useFrame`.
 */
export function tickRafDriver(delta) {
    sharedRafDriver?.tick(delta);
}
// ---------------------------------------------------------------------------
// SheetObject convenience helper
// ---------------------------------------------------------------------------
/**
 * Get a typed SheetObject. The `defaultValues` shape defines the prop types
 * and their defaults using @theatre/core `types.*` constructors.
 */
export function getSheetObject(sheet, objectKey, defaultValues) {
    return sheet.object(objectKey, defaultValues);
}
// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------
/**
 * Clear the project registry. Useful in tests and HMR scenarios.
 */
export function resetTheatreRuntime() {
    projectRegistry.clear();
    sharedRafDriver = null;
}
