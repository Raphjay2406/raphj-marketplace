#!/usr/bin/env node
import { spawn } from "child_process";
const env = { ...process.env, GENORAH_OFFLINE: "1" };
const child = spawn("node", ["scripts/gen-self-audit.mjs"], { env, stdio: "inherit" });
child.on("exit", code => process.exit(code ?? 1));
