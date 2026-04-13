import { describe, it, expect, afterEach } from "vitest";
import { startDaemon, Daemon } from "../src/daemon.js";
import { getAgUi } from "../src/ag-ui.js";

let daemon: Daemon | null = null;

afterEach(async () => {
  await daemon?.stop();
  daemon = null;
});

describe("AG-UI SSE stream", () => {
  it("delivers emitted events to SSE subscribers", async () => {
    daemon = await startDaemon({ host: "127.0.0.1", port: 0, agents: new Map() });
    const em = getAgUi();

    // Open SSE connection
    const res = await fetch(`${daemon.url}/ag-ui/stream`, {
      headers: { Accept: "text/event-stream" }
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    // Helper: read SSE chunks until we get at least one parsed JSON event
    async function readNextEvent(timeoutMs = 3000): Promise<Record<string, unknown>> {
      const deadline = Date.now() + timeoutMs;
      let buf = "";
      while (Date.now() < deadline) {
        const { value, done } = await Promise.race([
          reader.read(),
          new Promise<{ value: undefined; done: true }>(r =>
            setTimeout(() => r({ value: undefined, done: true }), deadline - Date.now())
          )
        ]);
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        // SSE lines are "data: <json>\n\n"
        const match = buf.match(/data:\s*(\{[^\n]+\})/);
        if (match) {
          return JSON.parse(match[1]);
        }
      }
      throw new Error("timed out waiting for SSE event");
    }

    // Consume the DAEMON_LIFECYCLE "ready" event that was emitted at startup
    // (it may or may not have buffered depending on timing — emit a fresh event)
    em.emit({ type: "WAVE_STARTED", wave: 1, sections: ["hero"] });

    const event = await readNextEvent();

    // Cancel the reader to avoid resource leak
    await reader.cancel();

    expect(event).toMatchObject({ type: "WAVE_STARTED", wave: 1 });
  });
});
