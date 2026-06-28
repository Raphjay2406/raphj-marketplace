import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let _cache;

export function graphifyAvailable({ runner } = {}) {
  if (_cache !== undefined) return _cache;
  const run = runner || ((cmd, args) =>
    execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).toString());
  try { run('graphify', ['--version']); _cache = true; }
  catch { _cache = false; }
  return _cache;
}

export function resetCapabilityCache() { _cache = undefined; }

export function graphExists(graphPath = 'graphify-out/graph.json') {
  return existsSync(graphPath);
}

export function graphAgeMs(graphPath = 'graphify-out/graph.json', now = Date.now()) {
  if (!existsSync(graphPath)) return null;
  return now - statSync(graphPath).mtimeMs;
}
