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
import {
  getProject,
  types,
  onChange,
  val,
  createRafDriver,
  type IProject,
  type ISheet,
  type ISequence,
  type ISheetObject,
  type IRafDriver,
  type UnknownShorthandCompoundProps,
} from "@theatre/core";

export { types, onChange, val, type IProject, type ISheet, type ISequence, type ISheetObject, type UnknownShorthandCompoundProps };

// ---------------------------------------------------------------------------
// Project registry — deduplicate projects by id
// ---------------------------------------------------------------------------
const projectRegistry = new Map<string, IProject>();

export interface TheatreProjectOptions {
  /** Optional persisted state JSON loaded from storage */
  state?: object;
}

/**
 * Return (or lazily create) a Theatre.js project by id.
 * Projects are singletons within a runtime session.
 */
export function getOrCreateProject(
  id: string,
  options: TheatreProjectOptions = {}
): IProject {
  if (projectRegistry.has(id)) return projectRegistry.get(id)!;
  const project = getProject(id, options.state ? { state: options.state as never } : undefined);
  projectRegistry.set(id, project);
  return project;
}

/**
 * Return a named sheet from a project. Sheets are lightweight; Theatre.js
 * caches them internally by (sheetId, instanceId).
 */
export function getSheet(project: IProject, sheetId: string, instanceId?: string): ISheet {
  return instanceId ? project.sheet(sheetId, instanceId) : project.sheet(sheetId);
}

// ---------------------------------------------------------------------------
// Sequence helpers
// ---------------------------------------------------------------------------

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
export function playSequence(
  sheet: ISheet,
  options: PlayOptions = {}
): Promise<boolean> {
  const seq: ISequence = sheet.sequence;
  return seq.play({
    range: options.from != null && options.to != null ? [options.from, options.to] : undefined,
    rate: options.rate ?? 1,
    iterationCount: options.iterationCount ?? 1,
  });
}

/**
 * Scrub a sequence to a specific position without playing.
 */
export function scrubSequence(sheet: ISheet, position: number): void {
  sheet.sequence.position = position;
}

// ---------------------------------------------------------------------------
// Raf driver — single shared driver per session for R3F integration
// ---------------------------------------------------------------------------
let sharedRafDriver: IRafDriver | null = null;

/**
 * Return (or create) a shared RAF driver suitable for use with R3F's
 * `frameloop="demand"` mode.
 */
export function getSharedRafDriver(): IRafDriver {
  if (!sharedRafDriver) {
    sharedRafDriver = createRafDriver({ name: "genorah-canvas-raf" });
  }
  return sharedRafDriver;
}

/**
 * Tick the shared RAF driver manually — call this inside R3F's `useFrame`.
 */
export function tickRafDriver(delta: number): void {
  sharedRafDriver?.tick(delta);
}

// ---------------------------------------------------------------------------
// SheetObject convenience helper
// ---------------------------------------------------------------------------

/**
 * Get a typed SheetObject. The `defaultValues` shape defines the prop types
 * and their defaults using @theatre/core `types.*` constructors.
 */
export function getSheetObject<Props extends UnknownShorthandCompoundProps>(
  sheet: ISheet,
  objectKey: string,
  defaultValues: Props
): ISheetObject<Props> {
  return sheet.object(objectKey, defaultValues);
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

/**
 * Clear the project registry. Useful in tests and HMR scenarios.
 */
export function resetTheatreRuntime(): void {
  projectRegistry.clear();
  sharedRafDriver = null;
}
