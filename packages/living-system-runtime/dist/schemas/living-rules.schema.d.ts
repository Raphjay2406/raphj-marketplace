import { z } from "zod";
export declare const SignalKindSchema: z.ZodEnum<["time_of_day", "scroll_velocity", "pointer_idle", "battery", "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"]>;
export type SignalKind = z.infer<typeof SignalKindSchema>;
export declare const PredicateSchema: z.ZodUnion<[z.ZodObject<{
    lt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lt: number;
}, {
    lt: number;
}>, z.ZodObject<{
    gt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    gt: number;
}, {
    gt: number;
}>, z.ZodObject<{
    eq: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>;
}, "strip", z.ZodTypeAny, {
    eq: string | number | boolean;
}, {
    eq: string | number | boolean;
}>, z.ZodObject<{
    between: z.ZodTuple<[z.ZodString, z.ZodString], null>;
}, "strip", z.ZodTypeAny, {
    between: [string, string];
}, {
    between: [string, string];
}>]>;
export type Predicate = z.infer<typeof PredicateSchema>;
export declare const RuleSchema: z.ZodObject<{
    signal: z.ZodEnum<["time_of_day", "scroll_velocity", "pointer_idle", "battery", "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"]>;
    predicate: z.ZodUnion<[z.ZodObject<{
        lt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lt: number;
    }, {
        lt: number;
    }>, z.ZodObject<{
        gt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        gt: number;
    }, {
        gt: number;
    }>, z.ZodObject<{
        eq: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>;
    }, "strip", z.ZodTypeAny, {
        eq: string | number | boolean;
    }, {
        eq: string | number | boolean;
    }>, z.ZodObject<{
        between: z.ZodTuple<[z.ZodString, z.ZodString], null>;
    }, "strip", z.ZodTypeAny, {
        between: [string, string];
    }, {
        between: [string, string];
    }>]>;
    delta: z.ZodRecord<z.ZodString, z.ZodString>;
    archetype_morph: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
    predicate: {
        lt: number;
    } | {
        gt: number;
    } | {
        eq: string | number | boolean;
    } | {
        between: [string, string];
    };
    delta: Record<string, string>;
    archetype_morph?: string | undefined;
}, {
    signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
    predicate: {
        lt: number;
    } | {
        gt: number;
    } | {
        eq: string | number | boolean;
    } | {
        between: [string, string];
    };
    delta: Record<string, string>;
    archetype_morph?: string | undefined;
}>;
export declare const LivingRulesSchema: z.ZodObject<{
    schema_version: z.ZodLiteral<"4.0.0">;
    signals: z.ZodArray<z.ZodEnum<["time_of_day", "scroll_velocity", "pointer_idle", "battery", "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"]>, "many">;
    rules: z.ZodArray<z.ZodObject<{
        signal: z.ZodEnum<["time_of_day", "scroll_velocity", "pointer_idle", "battery", "connection_kbps", "device_memory_gb", "prefers_reduced_motion", "visit_count"]>;
        predicate: z.ZodUnion<[z.ZodObject<{
            lt: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lt: number;
        }, {
            lt: number;
        }>, z.ZodObject<{
            gt: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            gt: number;
        }, {
            gt: number;
        }>, z.ZodObject<{
            eq: z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>;
        }, "strip", z.ZodTypeAny, {
            eq: string | number | boolean;
        }, {
            eq: string | number | boolean;
        }>, z.ZodObject<{
            between: z.ZodTuple<[z.ZodString, z.ZodString], null>;
        }, "strip", z.ZodTypeAny, {
            between: [string, string];
        }, {
            between: [string, string];
        }>]>;
        delta: z.ZodRecord<z.ZodString, z.ZodString>;
        archetype_morph: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
        predicate: {
            lt: number;
        } | {
            gt: number;
        } | {
            eq: string | number | boolean;
        } | {
            between: [string, string];
        };
        delta: Record<string, string>;
        archetype_morph?: string | undefined;
    }, {
        signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
        predicate: {
            lt: number;
        } | {
            gt: number;
        } | {
            eq: string | number | boolean;
        } | {
            between: [string, string];
        };
        delta: Record<string, string>;
        archetype_morph?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schema_version: "4.0.0";
    signals: ("time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count")[];
    rules: {
        signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
        predicate: {
            lt: number;
        } | {
            gt: number;
        } | {
            eq: string | number | boolean;
        } | {
            between: [string, string];
        };
        delta: Record<string, string>;
        archetype_morph?: string | undefined;
    }[];
}, {
    schema_version: "4.0.0";
    signals: ("time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count")[];
    rules: {
        signal: "time_of_day" | "scroll_velocity" | "pointer_idle" | "battery" | "connection_kbps" | "device_memory_gb" | "prefers_reduced_motion" | "visit_count";
        predicate: {
            lt: number;
        } | {
            gt: number;
        } | {
            eq: string | number | boolean;
        } | {
            between: [string, string];
        };
        delta: Record<string, string>;
        archetype_morph?: string | undefined;
    }[];
}>;
export type LivingRules = z.infer<typeof LivingRulesSchema>;
//# sourceMappingURL=living-rules.schema.d.ts.map