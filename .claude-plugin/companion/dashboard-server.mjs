#!/usr/bin/env node
/**
 * Genorah Dashboard Server — zero-dependency Node
 *
 * Serves .planning/genorah/ state via HTTP + SSE on localhost:4455 (fallback up to 4465).
 * File-watching with 250ms debounce + 5s polling fallback for Windows compatibility.
 *
 * Endpoints:
 *   GET  /                       → dashboard.html
 *   GET  /api/state              → full snapshot JSON
 *   GET  /api/sse                → Server-Sent Events stream of state updates
 *   GET  /api/screenshot/:path   → stream PNG from audit/
 *   POST /api/action/:cmd        → queue action for user to trigger
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(process.cwd(), '.planning', 'genorah');
const PORT_RANGE = [4455, 4456, 4457, 4458, 4459, 4460, 4461, 4462, 4463, 4464, 4465];
const clients = new Set();

function safeRead(p, fallback = '') {
  try { return fs.readFileSync(p, 'utf8'); } catch { return fallback; }
}

function safeReaddir(p, fallback = []) {
  try { return fs.readdirSync(p); } catch { return fallback; }
}

function parseDnaTokens(dnaMd) {
  const tokens = {};
  const matches = dnaMd.matchAll(/--color-(\w+):\s*(#[0-9a-fA-F]{3,8}|oklch\([^)]+\)|rgb\([^)]+\))/g);
  for (const m of matches) tokens[m[1]] = m[2];
  return tokens;
}

function scanSections() {
  const secDir = path.join(ROOT, 'sections');
  return safeReaddir(secDir).map(name => {
    const dir = path.join(secDir, name);
    if (!fs.statSync(dir).isDirectory()) return null;
    const summary = safeRead(path.join(dir, 'SUMMARY.md'));
    const plan = safeRead(path.join(dir, 'PLAN.md'));
    const score = (summary.match(/Score:\s*(\d+)/i) || [])[1];
    const tier = (summary.match(/Tier:\s*([A-Za-z-]+)/i) || [])[1];
    const status = (summary.match(/Status:\s*([A-Za-z]+)/i) || [])[1] || 'pending';
    const beat = (plan.match(/beat:\s*(\w+)/i) || [])[1];
    return { name, score: score ? +score : null, tier, status, beat };
  }).filter(Boolean);
}

function snapshot() {
  return {
    ts: new Date().toISOString(),
    project: safeRead(path.join(ROOT, 'PROJECT.md')),
    dna_tokens: parseDnaTokens(safeRead(path.join(ROOT, 'DESIGN-DNA.md'))),
    master_plan: safeRead(path.join(ROOT, 'MASTER-PLAN.md')),
    context: safeRead(path.join(ROOT, 'CONTEXT.md')),
    state: safeRead(path.join(ROOT, 'STATE.md')),
    sections: scanSections(),
    decisions_tail: safeRead(path.join(ROOT, 'DECISIONS.md')).split('\n').slice(-40).join('\n'),
    action_queue: safeReaddir(path.join(ROOT, '.action-queue')),
  };
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function broadcast() {
  const data = `data: ${JSON.stringify(snapshot())}\n\n`;
  for (const c of clients) {
    try { c.write(data); } catch { clients.delete(c); }
  }
}

function streamFile(res, filePath, contentType = 'application/octet-stream') {
  try {
    const stat = fs.statSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404).end('not found');
  }
}

function handleAction(req, res, cmd) {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const queueDir = path.join(ROOT, '.action-queue');
      fs.mkdirSync(queueDir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      fs.writeFileSync(path.join(queueDir, `${ts}-${cmd}.json`), body || '{}');
      res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"queued":true}');
    } catch (e) {
      res.writeHead(500).end(JSON.stringify({ error: e.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);
  const p = url.pathname;

  if (p === '/' || p === '/index.html') {
    streamFile(res, path.join(__dirname, 'dashboard.html'), 'text/html; charset=utf-8');
  } else if (p === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(snapshot()));
  } else if (p === '/api/sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(`data: ${JSON.stringify(snapshot())}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
  } else if (p.startsWith('/api/screenshot/')) {
    const rel = p.slice('/api/screenshot/'.length);
    const abs = path.join(ROOT, 'audit', rel);
    if (!abs.startsWith(path.join(ROOT, 'audit'))) return res.writeHead(403).end();
    streamFile(res, abs, 'image/png');
  } else if (p.startsWith('/api/action/') && req.method === 'POST') {
    const cmd = p.slice('/api/action/'.length).replace(/[^a-z0-9-]/gi, '');
    handleAction(req, res, cmd);
  } else {
    res.writeHead(404).end('not found');
  }
});

// File watching with polling fallback for Windows
const onChange = debounce(broadcast, 250);
try {
  fs.watch(ROOT, { recursive: true }, onChange);
} catch {
  // recursive watch unsupported — use polling
  setInterval(broadcast, 5000);
}
// Always also poll as fallback (fs.watch is flaky on Windows)
setInterval(broadcast, 5000);

function listen(idx = 0) {
  if (idx >= PORT_RANGE.length) {
    console.error('No available port in range 4455-4465');
    process.exit(1);
  }
  const port = PORT_RANGE[idx];
  server.once('error', err => {
    if (err.code === 'EADDRINUSE') listen(idx + 1);
    else { console.error(err); process.exit(1); }
  });
  server.listen(port, () => {
    const info = { port, pid: process.pid, started_at: new Date().toISOString() };
    try {
      fs.mkdirSync(ROOT, { recursive: true });
      fs.writeFileSync(path.join(ROOT, '.dashboard-info'), JSON.stringify(info, null, 2));
    } catch {}
    console.log(`Genorah dashboard → http://localhost:${port}`);
  });
}

listen();

process.on('SIGINT', () => {
  try { fs.unlinkSync(path.join(ROOT, '.dashboard-info')); } catch {}
  process.exit(0);
});
