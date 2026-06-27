# @genorah/gpt-image-mcp

MCP server for OpenAI **gpt-image-2** image generation + editing. Tools: `generate_image`, `edit_image`.

## Build
```bash
npm install -w @genorah/gpt-image-mcp
npm run build -w @genorah/gpt-image-mcp
```

## Configure (.mcp.json)
```json
"gpt-image": {
  "command": "node",
  "args": ["d:/Modulo/Plugins/v0-ahh-skill/packages/gpt-image-mcp/dist/index.js"],
  "env": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "GPT_IMAGE_OUTPUT_DIR": "${GPT_IMAGE_OUTPUT_DIR}",
    "GPT_IMAGE_MODEL": "${GPT_IMAGE_MODEL:-gpt-image-2}"
  },
  "optional": true
}
```

## Tools
- `generate_image(prompt, size?, quality?, background?, output_format?, n?, output_path?)`
- `edit_image(image_path, prompt, mask_path?, input_fidelity?, size?, quality?, background?, output_format?, output_path?)`

Outputs are saved to `GPT_IMAGE_OUTPUT_DIR` and the saved path is returned. `background: "transparent"` requires a `gpt-image-1`/`1.5` model.
