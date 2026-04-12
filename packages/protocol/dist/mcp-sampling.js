export function buildSamplingRequest(input) {
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
export function registerAgentAsMcpPrimitive(registry, input) {
    const key = `${input.agent_id}/${input.capability}`;
    registry[key] = input.handler;
}
