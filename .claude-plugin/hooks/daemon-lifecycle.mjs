#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

const stateDir = ".planning/genorah";
const pidFile = join(stateDir, "daemon.pid");
const event = process.argv[2] || "SessionStart";

function isRunning(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

if (event === "SessionStart") {
  if (existsSync(pidFile)) {
    const pid = Number(readFileSync(pidFile, "utf8").trim());
    if (isRunning(pid)) process.exit(0);
    unlinkSync(pidFile);
  }
  const contextPath = join(stateDir, "CONTEXT.md");
  if (!existsSync(contextPath)) process.exit(0);
  const ctx = readFileSync(contextPath, "utf8");
  const intensity = /3d_intensity:\s*(\w+)/.exec(ctx)?.[1];
  if (intensity !== "cinematic" && intensity !== "immersive") process.exit(0);

  const child = spawn("node", ["packages/protocol/dist/bin/daemon.js"], {
    detached: true,
    stdio: "ignore"
  });
  if (!child.pid) {
    console.error("[daemon-lifecycle] failed to spawn daemon subprocess; no pid assigned");
    process.exit(1);
  }
  writeFileSync(pidFile, String(child.pid));
  child.unref();
  process.exit(0);
}

if (event === "SessionEnd") {
  if (!existsSync(pidFile)) process.exit(0);
  const pid = Number(readFileSync(pidFile, "utf8").trim());
  if (isRunning(pid)) { try { process.kill(pid); } catch {} }
  unlinkSync(pidFile);
  process.exit(0);
}
