---
name: cost-governance
description: Per-project asset budget with warn/exceeded states + auto-downgrade chain
tier: domain
triggers:
  - "asset budget"
  - "cost ledger"
  - "downgrade"
version: 4.0.0
---

# Cost Governance

## Layer 1 — Decision

Every project declares `asset_budget_usd` in DESIGN-DNA.md (default 20). Asset director enforces budget; warn at 80%, downgrade or escalate at 100%.

## Layer 2 — Example

```ts
import { CostLedger } from "@genorah/asset-forge";
const ledger = new CostLedger({
  budget_usd: 30,
  downgrade_chain: { rodin: "meshy", kling: "flux-kontext" }
});
ledger.record({ provider: "rodin", cost_usd: 12 });
if (ledger.status() === "warn") emit({ type: "COST_BUDGET_UPDATE", spent_usd: ledger.spend_usd, budget_usd: 30 });
if (ledger.status() === "exceeded") {
  const fallback = ledger.pickDowngrade("rodin"); // "meshy"
}
```

## Layer 3 — Integration

- DNA token: `asset_budget_usd`, `auto_downgrade: true|false`
- Ledger lives in asset-director state
- Emits AG-UI `COST_BUDGET_UPDATE` events at threshold crossings

## Layer 4 — Anti-Patterns

- No budget set (silent overspend)
- Auto-downgrade on cinematic-tier without user opt-in
- Hard cap without escalation chain (UX-hostile)
