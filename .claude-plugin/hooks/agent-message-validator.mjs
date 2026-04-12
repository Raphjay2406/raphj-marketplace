#!/usr/bin/env node
import { readFileSync } from "fs";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const schemaPath = "packages/protocol/src/schemas/result-envelope.schema.json";

let validate;
try {
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  validate = ajv.compile(schema);
} catch (e) {
  // schema not built yet — pass-through
  process.exit(0);
}

const input = JSON.parse(readFileSync(0, "utf8"));
if (input.tool_name === "SendMessage" && input.tool_input?.message) {
  try {
    const maybeEnvelope = JSON.parse(input.tool_input.message);
    if (maybeEnvelope?.schema_version === "4.0.0") {
      const ok = validate(maybeEnvelope);
      if (!ok) {
        console.error(`[v4 protocol] SendMessage envelope failed schema validation`);
        console.error(JSON.stringify(validate.errors, null, 2));
        process.exit(2);
      }
    }
  } catch { /* not JSON — pass */ }
}
process.exit(0);
