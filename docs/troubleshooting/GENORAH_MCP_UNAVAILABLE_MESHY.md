# GENORAH_MCP_UNAVAILABLE_MESHY

## Symptom

`/gen:assets 3d` or scene-composition falls through to procedural fallback with message "Meshy MCP unavailable".

## Cause

- `MESHY_API_KEY` environment variable not set
- Meshy MCP server not running
- Node not on PATH for MCP runtime

## Recovery

1. Obtain API key from https://meshy.ai (free tier available)
2. Set env var:
   - macOS/Linux: `export MESHY_API_KEY=your_key_here`
   - Windows: `$env:MESHY_API_KEY="your_key_here"`
3. Verify server is declared in `.claude-plugin/.mcp.json`
4. Restart Claude Code session
5. Verify with: `node .claude-plugin/mcp-servers/meshy/server.mjs` — should accept stdio input

If you want offline-only: no action needed. Procedural fallback (`scripts/asset-forge/3d-procedural.mjs`) provides deterministic box/sphere/torus without Meshy.

## Prevention

Check MCP availability in session-start banner. Genorah never BLOCKS on MCP absence; degrades gracefully to procedural.

## Related

- .claude-plugin/mcp-servers/meshy/README.md
- scripts/asset-forge/3d-procedural.mjs
