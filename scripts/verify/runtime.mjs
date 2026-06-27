// scripts/verify/runtime.mjs
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { request } from 'http';

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export function detectFramework(projectDir) {
  const pkgPath = join(projectDir, 'package.json');
  if (!existsSync(pkgPath)) return 'unknown';
  let pkg;
  try { pkg = JSON.parse(readFileSync(pkgPath, 'utf8')); } catch { return 'unknown'; }
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (deps.next) return 'next';
  if (deps.astro) return 'astro';
  if (deps['@sveltejs/kit']) return 'sveltekit';
  if (deps.nuxt) return 'nuxt';
  if (deps.vite) return 'vite';
  return 'unknown';
}

export function buildCommand() { return `${NPM} run build`; }
export function devCommand() { return `${NPM} run dev`; }

export function ensureBuild(projectDir) {
  return new Promise((resolve) => {
    const p = spawn(buildCommand(), { cwd: projectDir, shell: true });
    let err = '';
    p.stderr.on('data', d => { err += d.toString(); });
    p.on('close', code => resolve(code === 0 ? { ok: true } : { ok: false, detail: err.slice(-500) }));
    p.on('error', e => resolve({ ok: false, detail: e.message }));
  });
}

function ping(port) {
  return new Promise(resolve => {
    const req = request({ host: '127.0.0.1', port, path: '/', timeout: 1500 }, res => {
      res.resume(); resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

export async function ensureDevServer(projectDir, { port = 3000 } = {}) {
  const proc = spawn(devCommand(), { cwd: projectDir, shell: true, env: { ...process.env, PORT: String(port) } });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await ping(port)) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  const stop = async () => {
    try {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(proc.pid), '/t', '/f']);
      else process.kill(-proc.pid, 'SIGKILL');
    } catch { /* already dead */ }
  };
  return { url: `http://127.0.0.1:${port}`, stop };
}
