import type { StructuredError } from "./errors.js";

export type AgUiEventType =
  | "TEXT_MESSAGE_CONTENT"
  | "TOOL_CALL_START"
  | "TOOL_CALL_END"
  | "STATE_DELTA"
  | "UI_RENDER"
  | "AGENT_STATE_UPDATE"
  | "ARTIFACT_CREATED"
  | "ERROR"
  | "WAVE_STARTED"
  | "WAVE_COMPLETED"
  | "SECTION_STARTED"
  | "SECTION_COMPLETED"
  | "VERDICT_ISSUED"
  | "RESULT_ENVELOPE"
  | "COST_BUDGET_UPDATE"
  | "DAEMON_LIFECYCLE";

export type AgUiEvent =
  | { type: "TEXT_MESSAGE_CONTENT"; message: string; role: "user" | "assistant" }
  | { type: "TOOL_CALL_START"; tool: string; args?: Record<string, unknown> }
  | { type: "TOOL_CALL_END"; tool: string; ok: boolean; duration_ms: number }
  | { type: "STATE_DELTA"; path: string; value: unknown }
  | { type: "UI_RENDER"; html_ref: string }
  | { type: "AGENT_STATE_UPDATE"; agent: string; state: string }
  | { type: "ARTIFACT_CREATED"; path: string; sha256?: string }
  | { type: "ERROR"; error: StructuredError }
  | { type: "WAVE_STARTED"; wave: number; sections: string[] }
  | { type: "WAVE_COMPLETED"; wave: number; score?: number }
  | { type: "SECTION_STARTED"; section: string; worker: string }
  | { type: "SECTION_COMPLETED"; section: string; status: "ok" | "partial" | "failed" }
  | { type: "VERDICT_ISSUED"; validator: string; pass: boolean; score?: number }
  | { type: "RESULT_ENVELOPE"; correlation_id: string; summary: string }
  | { type: "COST_BUDGET_UPDATE"; spent_usd: number; budget_usd: number }
  | { type: "DAEMON_LIFECYCLE"; state: "starting" | "ready" | "stopping" | "stopped" };

export type AgUiListener = (event: AgUiEvent) => void;

export interface AgUiEmitterOptions {
  sink?: (event: AgUiEvent) => void;
}

export class AgUiEmitter {
  private listeners = new Set<AgUiListener>();
  private sink?: (event: AgUiEvent) => void;

  constructor(options: AgUiEmitterOptions = {}) {
    this.sink = options.sink;
  }

  subscribe(listener: AgUiListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: AgUiEvent): void {
    for (const l of this.listeners) l(event);
    this.sink?.(event);
  }
}

let globalEmitter: AgUiEmitter | null = null;
export function getAgUi(): AgUiEmitter {
  if (!globalEmitter) globalEmitter = new AgUiEmitter();
  return globalEmitter;
}
