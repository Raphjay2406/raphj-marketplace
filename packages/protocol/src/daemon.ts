import Fastify, { FastifyInstance } from "fastify";
import FastifySse from "fastify-sse-v2";
import type { AgentCard } from "./agent-card.js";
import type { ResultEnvelope } from "./envelope.js";
import { dispatch } from "./dispatch.js";
import { getAgUi } from "./ag-ui.js";

export interface RegisteredAgent {
  card: AgentCard;
  handler: (payload: unknown) => Promise<ResultEnvelope<unknown>>;
}

export interface DaemonOptions {
  host: string;
  port: number;
  agents: Map<string, RegisteredAgent>;
}

export interface Daemon {
  url: string;
  host: string;
  port: number;
  instance: FastifyInstance;
  stop(): Promise<void>;
}

export async function startDaemon(opts: DaemonOptions): Promise<Daemon> {
  const app = Fastify({ logger: false });
  await app.register(FastifySse);
  const em = getAgUi();

  app.get("/.well-known/agent.json", async () => ({
    schema_version: "a2a-v0.3",
    agents: Array.from(opts.agents.values()).map(a => a.card)
  }));

  app.post("/a2a/:agent/:capability", async (req, reply) => {
    const { agent, capability } = req.params as { agent: string; capability: string };
    const entry = opts.agents.get(agent);
    if (!entry) return reply.code(404).send({ error: "unknown_agent", agent });
    const hasCap = entry.card.capabilities.some(c => c.id === capability);
    if (!hasCap) return reply.code(404).send({ error: "unknown_capability", agent, capability });
    const env = await dispatch({
      worker: agent,
      payload: req.body ?? {},
      handler: async p => entry.handler(p),
      emitter: em
    });
    return env;
  });

  app.get("/ag-ui/stream", (req, reply) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer: any[] = [];
    let resolve: (() => void) | null = null;
    const unsub = em.subscribe((event) => {
      buffer.push(event);
      if (resolve) { resolve(); resolve = null; }
    });
    const heartbeat = setInterval(() => {
      buffer.push({ type: "HEARTBEAT", at: Date.now() });
      if (resolve) { resolve(); resolve = null; }
    }, 15_000);
    req.raw.on("close", () => { clearInterval(heartbeat); unsub(); });

    reply.sse(
      (async function* () {
        try {
          while (true) {
            while (buffer.length > 0) {
              yield { data: JSON.stringify(buffer.shift()) };
            }
            await new Promise<void>(r => { resolve = r; });
          }
        } finally {
          clearInterval(heartbeat);
          unsub();
        }
      })()
    );
  });

  await app.listen({ host: opts.host, port: opts.port });
  const address = app.server.address();
  if (!address || typeof address === "string") throw new Error("daemon failed to bind");
  em.emit({ type: "DAEMON_LIFECYCLE", state: "ready" });
  return {
    host: address.address,
    port: address.port,
    url: `http://${address.address}:${address.port}`,
    instance: app,
    stop: async () => {
      em.emit({ type: "DAEMON_LIFECYCLE", state: "stopping" });
      await app.close();
      em.emit({ type: "DAEMON_LIFECYCLE", state: "stopped" });
    }
  };
}
