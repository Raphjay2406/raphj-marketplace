import { scoreNeuroAesthetic } from "./validators/neuro-aesthetic.mjs";

export function auditNeuro({ inputs, emit }) {
  const result = scoreNeuroAesthetic(inputs);
  if (emit) emit({ type: "VERDICT_ISSUED", validator: "neuro-aesthetic", pass: result.score >= 14, score: result.score });
  return result;
}
