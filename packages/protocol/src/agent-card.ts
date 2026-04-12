import { z } from "zod";

export const ChannelSchema = z.enum(["stable", "beta", "canary"]);
export type Channel = z.infer<typeof ChannelSchema>;

export const CapabilitySchema = z.object({
  id: z.string().min(1),
  input: z.string().optional(),
  output: z.string().optional(),
  input_schema_ref: z.string().optional(),
  output_schema_ref: z.string().optional()
});

export const AgentCardSchema = z.object({
  schema_version: z.literal("a2a-v0.3"),
  id: z.string().regex(/^[a-z0-9_-]+\/[a-z0-9_-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?$/),
  channel: ChannelSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  tier: z.enum(["director", "worker"]),
  capabilities: z.array(CapabilitySchema).min(1),
  tools: z.array(z.string()).default([]),
  auth: z.object({
    local: z.object({ type: z.enum(["none", "token"]) }),
    remote: z.object({
      type: z.enum(["oauth2", "token", "mtls"]),
      flow: z.string().optional()
    })
  }),
  streaming: z.object({
    supports_sse: z.boolean(),
    ag_ui_events: z.boolean()
  }),
  mcp: z.object({
    sampling_v2_compatible: z.boolean()
  })
});
export type AgentCard = z.infer<typeof AgentCardSchema>;

export const FrontmatterSchema = z.object({
  name: z.string().min(1),
  id: z.string().regex(/^[a-z0-9_-]+\/[a-z0-9_-]+$/),
  version: z.string(),
  channel: ChannelSchema,
  description: z.string().min(1),
  tier: z.enum(["director", "worker"]),
  capabilities: z.array(CapabilitySchema).min(1),
  tools: z.array(z.string()).optional()
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export function buildAgentCard(input: Frontmatter): AgentCard {
  const fm = FrontmatterSchema.parse(input);
  return AgentCardSchema.parse({
    schema_version: "a2a-v0.3",
    id: fm.id,
    version: fm.version,
    channel: fm.channel,
    name: fm.name,
    description: fm.description,
    tier: fm.tier,
    capabilities: fm.capabilities,
    tools: fm.tools ?? [],
    auth: {
      local: { type: "none" },
      remote: { type: "oauth2", flow: "authorization_code_pkce" }
    },
    streaming: { supports_sse: true, ag_ui_events: true },
    mcp: { sampling_v2_compatible: true }
  });
}
