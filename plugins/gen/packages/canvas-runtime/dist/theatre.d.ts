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
import { types, onChange, val, type IProject, type ISheet, type ISequence, type ISheetObject, type IRafDriver, type UnknownShorthandCompoundProps } from "@theatre/core";
export { types, onChange, val, type IProject, type ISheet, type ISequence, type ISheetObject, type UnknownShorthandCompoundProps };
export interface TheatreProjectOptions {
    /** Optional persisted state JSON loaded from storage */
    state?: object;
}
/**
 * Return (or lazily create) a Theatre.js project by id.
 * Projects are singletons within a runtime session.
 */
export declare function getOrCreateProject(id: string, options?: TheatreProjectOptions): IProject;
/**
 * Return a named sheet from a project. Sheets are lightweight; Theatre.js
 * caches them internally by (sheetId, instanceId).
 */
export declare function getSheet(project: IProject, sheetId: string, instanceId?: string): ISheet;
export interface PlayOptions {
    /** Start position in seconds (default 0) */
    from?: number;
    /** End position in seconds (default: sequence length) */
    to?: number;
    /** Playback rate multiplier (default 1) */
    rate?: number;
    /** Whether to iterate (default false) */
    iterationCount?: number;
}
/**
 * Play a sheet's sequence with optional range / rate overrides.
 * Returns a Promise that resolves to true when complete or false if interrupted.
 */
export declare function playSequence(sheet: ISheet, options?: PlayOptions): Promise<boolean>;
/**
 * Scrub a sequence to a specific position without playing.
 */
export declare function scrubSequence(sheet: ISheet, position: number): void;
/**
 * Return (or create) a shared RAF driver suitable for use with R3F's
 * `frameloop="demand"` mode.
 */
export declare function getSharedRafDriver(): IRafDriver;
/**
 * Tick the shared RAF driver manually — call this inside R3F's `useFrame`.
 */
export declare function tickRafDriver(delta: number): void;
/**
 * Get a typed SheetObject. The `defaultValues` shape defines the prop types
 * and their defaults using @theatre/core `types.*` constructors.
 */
export declare function getSheetObject<Props extends UnknownShorthandCompoundProps>(sheet: ISheet, objectKey: string, defaultValues: Props): ISheetObject<Props>;
/**
 * Clear the project registry. Useful in tests and HMR scenarios.
 */
export declare function resetTheatreRuntime(): void;
