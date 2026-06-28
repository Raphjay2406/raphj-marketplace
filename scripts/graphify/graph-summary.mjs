// scripts/graphify/graph-summary.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function graphSummary(cwd = '.', now = Date.now()) {
  const graphPath = join(cwd, 'graphify-out', 'graph.json');
  if (!existsSync(graphPath)) return { exists: false, nodes: null, edges: null, ageMs: null };
  let json;
  try { json = JSON.parse(readFileSync(graphPath, 'utf8')); }
  catch { return { exists: false, nodes: null, edges: null, ageMs: null }; }

  const nodes = Array.isArray(json.nodes) ? json.nodes.length : null;
  const edgeArr = [json.edges, json.links, json.relationships].find(Array.isArray);
  const edges = edgeArr ? edgeArr.length : null;
  let ageMs = null;
  try { ageMs = now - statSync(graphPath).mtimeMs; } catch { /* ignore */ }
  return { exists: true, nodes, edges, ageMs };
}
