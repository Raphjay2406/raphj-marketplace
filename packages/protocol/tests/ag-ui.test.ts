import { describe, it, expect, vi } from "vitest";
import { AgUiEmitter, AgUiEvent, AgUiEventType } from "../src/ag-ui.js";

describe("AgUiEmitter", () => {
  it("emits a TEXT_MESSAGE_CONTENT event to all subscribers", () => {
    const em = new AgUiEmitter();
    const sub = vi.fn();
    em.subscribe(sub);
    em.emit({ type: "TEXT_MESSAGE_CONTENT", message: "hi", role: "assistant" });
    expect(sub).toHaveBeenCalledTimes(1);
    expect(sub.mock.calls[0][0].type).toBe("TEXT_MESSAGE_CONTENT");
  });

  it("supports 16 standard event types", () => {
    const required: AgUiEventType[] = [
      "TEXT_MESSAGE_CONTENT",
      "TOOL_CALL_START",
      "TOOL_CALL_END",
      "STATE_DELTA",
      "UI_RENDER",
      "AGENT_STATE_UPDATE",
      "ARTIFACT_CREATED",
      "ERROR",
      "WAVE_STARTED",
      "WAVE_COMPLETED",
      "SECTION_STARTED",
      "SECTION_COMPLETED",
      "VERDICT_ISSUED",
      "RESULT_ENVELOPE",
      "COST_BUDGET_UPDATE",
      "DAEMON_LIFECYCLE"
    ];
    required.forEach(t => {
      expect(() => new AgUiEmitter().emit({ type: t } as AgUiEvent)).not.toThrow();
    });
  });

  it("unsubscribe stops delivery", () => {
    const em = new AgUiEmitter();
    const sub = vi.fn();
    const unsub = em.subscribe(sub);
    unsub();
    em.emit({ type: "ERROR", error: { code: "WORKER_TIMEOUT", message: "x", recovery_hint: "retry_with_fallback" } });
    expect(sub).not.toHaveBeenCalled();
  });

  it("persists events to a sink", () => {
    const sink: AgUiEvent[] = [];
    const em = new AgUiEmitter({ sink: e => sink.push(e) });
    em.emit({ type: "UI_RENDER", html_ref: "hero.html" });
    expect(sink).toHaveLength(1);
  });
});
