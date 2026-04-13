const BUDGETS = {
  cinematic: { js_gz: 280_000, total_transfer: 5_500_000, lcp_ms: 2400, cls: 0.05, inp_ms: 180 },
  immersive: { js_gz: 400_000, total_transfer: 8_000_000, lcp_ms: 2800, cls: 0.08, inp_ms: 200 }
};

export function checkPerfBudget(metrics, intensity) {
  const budget = BUDGETS[intensity];
  if (!budget) return { pass: true, skipped: true };
  if (metrics.js_gz > budget.js_gz) return { pass: false, reason: `JS ${metrics.js_gz} > budget ${budget.js_gz}` };
  if (metrics.total_transfer > budget.total_transfer) return { pass: false, reason: `transfer ${metrics.total_transfer} > budget ${budget.total_transfer}` };
  if (metrics.lcp_ms > budget.lcp_ms) return { pass: false, reason: `LCP ${metrics.lcp_ms}ms > budget ${budget.lcp_ms}ms` };
  if (metrics.cls > budget.cls) return { pass: false, reason: `CLS ${metrics.cls} > budget ${budget.cls}` };
  if (metrics.inp_ms > budget.inp_ms) return { pass: false, reason: `INP ${metrics.inp_ms}ms > budget ${budget.inp_ms}ms` };
  return { pass: true };
}

export const BUDGET_TABLE = BUDGETS;
