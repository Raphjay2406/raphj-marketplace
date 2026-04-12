import { writeFileSync, mkdirSync } from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ResultEnvelopeSchema } from "../src/envelope.ts";

const out = "src/schemas/result-envelope.schema.json";
mkdirSync("src/schemas", { recursive: true });
const schema = zodToJsonSchema(ResultEnvelopeSchema, {
  name: "ResultEnvelope",
  $refStrategy: "none"
});
writeFileSync(out, JSON.stringify(schema, null, 2));
console.log(`wrote ${out}`);
