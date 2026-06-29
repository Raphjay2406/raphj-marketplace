# meshy-mcp (scaffold)

Minimal MCP server exposing Meshy v4 text-to-3D and image-to-3D tools. v3.5.4 ships the stdio protocol scaffold + tool schemas; actual API calls require `MESHY_API_KEY` env var.

## Install

```bash
# In plugin runtime, reference via .mcp.json
{
  "mcpServers": {
    "meshy": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/.claude-plugin/mcp-servers/meshy/server.mjs"],
      "env": { "MESHY_API_KEY": "${MESHY_API_KEY}" }
    }
  }
}
```

## Tools exposed

- `meshy_text_to_3d` — text prompt → GLB (async job; poll via `meshy_check_status`)
- `meshy_image_to_3d` — image URL → GLB (async)
- `meshy_check_status` — poll job status / retrieve result URL

## Rate limits

Meshy v4: ~200 requests/day on free tier, 20 requests/minute. Client-side token bucket implemented.

## Fallback

If `MESHY_API_KEY` missing at startup → server refuses to start with actionable error. Callers should detect MCP absence and fall back to `scripts/asset-forge/3d-procedural.mjs` for offline primitives.
