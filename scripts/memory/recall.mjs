import { execFileSync } from 'node:child_process';
import { graphifyAvailable as realAvailable, graphExists as realExists } from '../graphify/capability.mjs';

function parseBm25(out) {
  let arr;
  try { arr = JSON.parse(out); } catch { return []; }
  if (!Array.isArray(arr)) return [];
  return arr.map(r => ({ id: r.ref, summary: r.summary || '', source: r.ref, score: r.score ?? 0 }));
}

function parseGraphify(out, k) {
  const lines = String(out).split('\n').map(l => l.trim()).filter(Boolean);
  return lines.slice(0, k).map((line, i) => ({ id: `g${i}`, summary: line, source: 'graphify', score: null }));
}

export function recall(question, { kind = null, k = 10, graphPath = 'graphify-out/graph.json', deps = {} } = {}) {
  const run = deps.run || ((cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', timeout: 30000 }));
  const available = deps.graphifyAvailable || realAvailable;
  const exists = deps.graphExists || realExists;

  if (available() && exists(graphPath)) {
    try {
      const out = run('graphify', ['query', question, '--graph', graphPath]);
      return { provider: 'graphify', hits: parseGraphify(out, k) };
    } catch { /* fall through to BM25 */ }
  }

  try {
    const args = ['scripts/semantic-index.mjs', 'query', '--text', question, '--top-k', String(k)];
    if (kind) { args.push('--kind', kind); }
    const out = run('node', args);
    return { provider: 'semantic-index', hits: parseBm25(out) };
  } catch {
    return { provider: 'none', hits: [] };
  }
}
