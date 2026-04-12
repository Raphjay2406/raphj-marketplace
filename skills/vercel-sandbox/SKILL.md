---
name: "vercel-sandbox"
description: "Vercel Sandbox (GA 2026-01) — sandboxed code execution for user-provided code. Use for in-product playgrounds, AI-generated snippet execution, and untrusted workload isolation."
tier: "domain"
triggers: "vercel sandbox, code sandbox, untrusted code, code playground, ai code execution"
version: "3.20.0"
---

## Layer 1: Decision Guidance

### When to Use

- In-product code playground (education, docs-with-runnable-examples).
- Executing AI-generated code safely before surfacing results.
- Untrusted user input that must run (scripting, rule engines, math).

### When NOT to Use

- Trusted first-party code — regular Fluid Compute functions are cheaper.

## Layer 2: Example

```ts
import { createSandbox } from '@vercel/sandbox';

export async function POST(req: Request) {
  const { code } = await req.json();
  const sandbox = await createSandbox({
    runtime: 'node22',
    timeoutMs: 10_000,
    memoryMb: 512,
  });
  const result = await sandbox.exec({ entry: 'main.js', files: { 'main.js': code } });
  await sandbox.destroy();
  return Response.json({ stdout: result.stdout, exitCode: result.exitCode });
}
```

## Layer 3: Integration Context

- Wrap every agent tool call that executes code with Sandbox — never run AI-generated code in the main function.
- Pair with `pii-regex-v2026` on output before surfacing.
- Cost: billed per sandbox-second; cap via `timeoutMs`.
- Pair with `vercel-botid` to prevent bot-driven abuse.

## Layer 4: Anti-Patterns

- Running user code in main function — single vuln blows your Vercel team open.
- Unlimited timeout — cost and DOS risk.
- Returning raw stderr with file paths — leaks infrastructure.
