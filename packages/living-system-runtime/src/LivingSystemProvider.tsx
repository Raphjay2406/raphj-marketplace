import React, { useEffect } from "react";
import { LivingRules, LivingRulesSchema, Predicate, SignalKind } from "./schemas/living-rules.schema.js";
import { applyDelta, revertDelta } from "./applyDelta.js";
import { subscribeTimeOfDay } from "./signals/timeOfDay.js";
import { subscribeScrollVelocity } from "./signals/scrollVelocity.js";
import { subscribePointerIdle } from "./signals/pointerIdle.js";
import { subscribeBattery } from "./signals/battery.js";
import { subscribeConnection } from "./signals/connection.js";
import { subscribeVisitCount } from "./signals/visitCount.js";

function evaluate(predicate: Predicate, value: unknown): boolean {
  if ("lt" in predicate && typeof value === "number") return value < predicate.lt;
  if ("gt" in predicate && typeof value === "number") return value > predicate.gt;
  if ("eq" in predicate) return value === predicate.eq;
  if ("between" in predicate && typeof value === "string") {
    const [a, b] = predicate.between;
    return value >= a && value <= b;
  }
  return false;
}

export function LivingSystemProvider({ rules, children }: { rules: LivingRules; children: React.ReactNode }) {
  useEffect(() => {
    LivingRulesSchema.parse(rules);
    const unsubs: Array<() => void> = [];
    const appliedKeys = new Set<string>();

    const evaluateRules = (signal: SignalKind, value: unknown) => {
      for (const rule of rules.rules) {
        if (rule.signal !== signal) continue;
        if (evaluate(rule.predicate, value)) {
          applyDelta(rule.delta);
          Object.keys(rule.delta).forEach(k => appliedKeys.add(k));
        }
      }
    };

    if (rules.signals.includes("time_of_day")) {
      unsubs.push(subscribeTimeOfDay(v => evaluateRules("time_of_day", v)));
    }
    if (rules.signals.includes("scroll_velocity")) {
      unsubs.push(subscribeScrollVelocity(v => evaluateRules("scroll_velocity", v)));
    }
    if (rules.signals.includes("pointer_idle")) {
      unsubs.push(subscribePointerIdle(v => evaluateRules("pointer_idle", v)));
    }
    if (rules.signals.includes("battery")) {
      subscribeBattery(v => evaluateRules("battery", v)).then(u => unsubs.push(u));
    }
    if (rules.signals.includes("connection_kbps")) {
      unsubs.push(subscribeConnection(v => evaluateRules("connection_kbps", v)));
    }
    if (rules.signals.includes("visit_count")) {
      unsubs.push(subscribeVisitCount(v => evaluateRules("visit_count", v)));
    }

    return () => {
      unsubs.forEach(u => u());
      revertDelta(Array.from(appliedKeys));
    };
  }, [rules]);

  return <>{children}</>;
}
