// scripts/audit-perf-hook.mjs
import { checkPerfBudget } from "./validators/web-vitals-budget.mjs";

export function auditPerf({ metrics, intensity, emit }) {
  const result = checkPerfBudget(metrics, intensity);
  if (emit) emit({ type: "VERDICT_ISSUED", validator: "perf-budget", pass: result.pass, reason: result.reason });
  return result;
}
