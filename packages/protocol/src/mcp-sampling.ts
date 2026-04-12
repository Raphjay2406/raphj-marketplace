import type { ResultEnvelope } from "./envelope.js";

export interface SamplingRequest {
  jsonrpc: "2.0";
  id: string;
  method: "sampling/createMessage";
  params: {
    messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string } }>;
    metadata: { agent_id: string; capability: string };
    modelPreferences?: { speedPriority?: number; intelligencePriority?: number };
  };
}

export interface BuildRequestInput {
  agent_id: string;
  capability: string;
  payload: unknown;
  model_preferences?: { speedPriority?: number; intelligencePriority?: number };
}

export function buildSamplingRequest(input: BuildRequestInput): SamplingRequest {
  return {
    jsonrpc: "2.0",
    id: `${Date.now()}`,
    method: "sampling/createMessage",
    params: {
      messages: [
        { role: "user", content: { type: "text", text: JSON.stringify(input.payload) } }
      ],
      metadata: { agent_id: input.agent_id, capability: input.capability },
      modelPreferences: input.model_preferences
    }
  };
}

export interface RegisterInput<P, T> {
  agent_id: string;
  capability: string;
  handler: (payload: P) => Promise<ResultEnvelope<T>>;
}

export function registerAgentAsMcpPrimitive<P, T>(
  registry: Record<string, (payload: P) => Promise<ResultEnvelope<T>>>,
  input: RegisterInput<P, T>
): void {
  const key = `${input.agent_id}/${input.capability}`;
  registry[key] = input.handler;
}
