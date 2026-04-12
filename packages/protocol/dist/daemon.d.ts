import { FastifyInstance } from "fastify";
import type { AgentCard } from "./agent-card.js";
import type { ResultEnvelope } from "./envelope.js";
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
export declare function startDaemon(opts: DaemonOptions): Promise<Daemon>;
//# sourceMappingURL=daemon.d.ts.map