import type { ResultEnvelope } from "./envelope.js";
export interface SamplingRequest {
    jsonrpc: "2.0";
    id: string;
    method: "sampling/createMessage";
    params: {
        messages: Array<{
            role: "user" | "assistant";
            content: {
                type: "text";
                text: string;
            };
        }>;
        metadata: {
            agent_id: string;
            capability: string;
        };
        modelPreferences?: {
            speedPriority?: number;
            intelligencePriority?: number;
        };
    };
}
export interface BuildRequestInput {
    agent_id: string;
    capability: string;
    payload: unknown;
    model_preferences?: {
        speedPriority?: number;
        intelligencePriority?: number;
    };
}
export declare function buildSamplingRequest(input: BuildRequestInput): SamplingRequest;
export interface RegisterInput<P, T> {
    agent_id: string;
    capability: string;
    handler: (payload: P) => Promise<ResultEnvelope<T>>;
}
export declare function registerAgentAsMcpPrimitive<P, T>(registry: Record<string, (payload: P) => Promise<ResultEnvelope<T>>>, input: RegisterInput<P, T>): void;
//# sourceMappingURL=mcp-sampling.d.ts.map