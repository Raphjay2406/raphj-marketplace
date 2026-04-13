import { z } from "zod";
export declare const ChannelSchema: z.ZodEnum<["stable", "beta", "canary"]>;
export type Channel = z.infer<typeof ChannelSchema>;
export declare const CapabilitySchema: z.ZodObject<{
    id: z.ZodString;
    input: z.ZodOptional<z.ZodString>;
    output: z.ZodOptional<z.ZodString>;
    input_schema_ref: z.ZodOptional<z.ZodString>;
    output_schema_ref: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    input?: string | undefined;
    output?: string | undefined;
    input_schema_ref?: string | undefined;
    output_schema_ref?: string | undefined;
}, {
    id: string;
    input?: string | undefined;
    output?: string | undefined;
    input_schema_ref?: string | undefined;
    output_schema_ref?: string | undefined;
}>;
export declare const AgentCardSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<"a2a-v0.3">;
    id: z.ZodString;
    version: z.ZodString;
    channel: z.ZodEnum<["stable", "beta", "canary"]>;
    name: z.ZodString;
    description: z.ZodString;
    tier: z.ZodEnum<["director", "worker"]>;
    capabilities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        input: z.ZodOptional<z.ZodString>;
        output: z.ZodOptional<z.ZodString>;
        input_schema_ref: z.ZodOptional<z.ZodString>;
        output_schema_ref: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }, {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }>, "many">;
    tools: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    auth: z.ZodObject<{
        local: z.ZodObject<{
            type: z.ZodEnum<["none", "token"]>;
        }, "strip", z.ZodTypeAny, {
            type: "none" | "token";
        }, {
            type: "none" | "token";
        }>;
        remote: z.ZodObject<{
            type: z.ZodEnum<["oauth2", "token", "mtls"]>;
            flow: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        }, {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        local: {
            type: "none" | "token";
        };
        remote: {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        };
    }, {
        local: {
            type: "none" | "token";
        };
        remote: {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        };
    }>;
    streaming: z.ZodObject<{
        supports_sse: z.ZodBoolean;
        ag_ui_events: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        supports_sse: boolean;
        ag_ui_events: boolean;
    }, {
        supports_sse: boolean;
        ag_ui_events: boolean;
    }>;
    mcp: z.ZodObject<{
        sampling_v2_compatible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        sampling_v2_compatible: boolean;
    }, {
        sampling_v2_compatible: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    schema_version: "a2a-v0.3";
    version: string;
    channel: "stable" | "beta" | "canary";
    name: string;
    description: string;
    tier: "director" | "worker";
    capabilities: {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }[];
    tools: string[];
    auth: {
        local: {
            type: "none" | "token";
        };
        remote: {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        };
    };
    streaming: {
        supports_sse: boolean;
        ag_ui_events: boolean;
    };
    mcp: {
        sampling_v2_compatible: boolean;
    };
}, {
    id: string;
    schema_version: "a2a-v0.3";
    version: string;
    channel: "stable" | "beta" | "canary";
    name: string;
    description: string;
    tier: "director" | "worker";
    capabilities: {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }[];
    auth: {
        local: {
            type: "none" | "token";
        };
        remote: {
            type: "token" | "oauth2" | "mtls";
            flow?: string | undefined;
        };
    };
    streaming: {
        supports_sse: boolean;
        ag_ui_events: boolean;
    };
    mcp: {
        sampling_v2_compatible: boolean;
    };
    tools?: string[] | undefined;
}>;
export type AgentCard = z.infer<typeof AgentCardSchema>;
export declare const FrontmatterSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
    version: z.ZodString;
    channel: z.ZodEnum<["stable", "beta", "canary"]>;
    description: z.ZodString;
    tier: z.ZodEnum<["director", "worker"]>;
    capabilities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        input: z.ZodOptional<z.ZodString>;
        output: z.ZodOptional<z.ZodString>;
        input_schema_ref: z.ZodOptional<z.ZodString>;
        output_schema_ref: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }, {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }>, "many">;
    tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    version: string;
    channel: "stable" | "beta" | "canary";
    name: string;
    description: string;
    tier: "director" | "worker";
    capabilities: {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }[];
    tools?: string[] | undefined;
}, {
    id: string;
    version: string;
    channel: "stable" | "beta" | "canary";
    name: string;
    description: string;
    tier: "director" | "worker";
    capabilities: {
        id: string;
        input?: string | undefined;
        output?: string | undefined;
        input_schema_ref?: string | undefined;
        output_schema_ref?: string | undefined;
    }[];
    tools?: string[] | undefined;
}>;
export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export declare function buildAgentCard(input: Frontmatter): AgentCard;
//# sourceMappingURL=agent-card.d.ts.map