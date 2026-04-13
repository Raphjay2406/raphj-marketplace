import { spawn } from "child_process";
import { writeFileSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export interface SandboxInput {
  entry_source: string;
  payload: unknown;
  timeout_ms: number;
  allow_net?: string[];
}

export interface SandboxResult {
  stdout: string;
  parsed: unknown;
  duration_ms: number;
}

export async function runInSandbox(input: SandboxInput): Promise<SandboxResult> {
  const dir = mkdtempSync(join(tmpdir(), "genorah-sandbox-"));
  const entry = join(dir, "agent.ts");
  writeFileSync(entry, input.entry_source);
  const allowNet = input.allow_net?.length ? [`--allow-net=${input.allow_net.join(",")}`] : [];
  const args = ["run", "--no-prompt", ...allowNet, entry];
  return await new Promise((resolve, reject) => {
    const started = Date.now();
    const child = spawn("deno", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    child.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
    const to = setTimeout(() => child.kill(), input.timeout_ms);
    child.on("exit", (code: number | null) => {
      clearTimeout(to);
      if (code !== 0) return reject(new Error(`sandbox exited ${code}: ${stderr}`));
      try {
        const parsed = JSON.parse(stdout || "{}");
        resolve({ stdout, parsed, duration_ms: Date.now() - started });
      } catch {
        reject(new Error(`sandbox output not JSON: ${stdout}`));
      }
    });
    child.stdin.write(JSON.stringify(input.payload));
    child.stdin.end();
  });
}
