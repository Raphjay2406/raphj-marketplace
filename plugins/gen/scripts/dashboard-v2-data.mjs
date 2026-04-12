#!/usr/bin/env node
/**
 * dashboard-v2-data — v3.5.6
 *
 * Aggregates project state into structured JSON for dashboard-v2 consumption.
 * Serves /api/state endpoint in companion dashboard.
 *
 * Subcommands: snapshot | tail-ledger
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { argv, exit } from 'node:process';

function safeRead(path) { try { return existsSync(path) ? readFileSync(path, 'utf8') : ''; } catch { return ''; } }
function safeJson(path) { try { return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null; } catch { return null; } }

function cmd_snapshot() {
  const snapshot = {
    ts: new Date().toISOString(),
    project: {
      name: extractProjectName(),
      archetype: extractArchetype(),
    },
    pipeline: {
      stage: extractStage(),
      wave: extractWave(),
    },
    sections: extractSections(),
    decisions: {
      pending: countDecisionsByStatus('pending'),
      applied: countDecisionsByStatus('applied'),
    },
    ledger_stats: countLedgerKinds(),
    subgate_grid: extractSubgateGrid(),
    assets: extractAssetsSummary(),
    cost: readCostSnapshot(),
  };
  console.log(JSON.stringify(snapshot, null, 2));
}

function extractProjectName() {
  const p = safeRead('.planning/genorah/PROJECT.md');
  const m = p.match(/^#\s+(.+?)$/m);
  return m?.[1] || 'unnamed';
}

function extractArchetype() {
  const p = safeRead('.planning/genorah/DESIGN-DNA.md');
  const m = p.match(/archetype:\s*(\S+)/i);
  return m?.[1] || null;
}

function extractStage() {
  const s = safeRead('.planning/genorah/STATE.md');
  const m = s.match(/stage:\s*(\d+)/i) || s.match(/phase:\s*(\w+)/i);
  return m?.[1] || 'unknown';
}

function extractWave() {
  const s = safeRead('.planning/genorah/STATE.md');
  const m = s.match(/wave:\s*(\d+)/i);
  return m ? Number(m[1]) : null;
}

function extractSections() {
  const dir = '.planning/genorah/sections';
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => statSync(`${dir}/${n}`).isDirectory()).map((id) => {
    const summaryPath = `${dir}/${id}/SUMMARY.md`;
    const trajPath = `${dir}/${id}/trajectory.json`;
    const summary = safeRead(summaryPath);
    const designM = summary.match(/design[:\s]+(\d+)/i);
    const uxM = summary.match(/ux[:\s]+(\d+)/i);
    return {
      id,
      state: existsSync(summaryPath) ? 'shipped' : 'pending',
      design: designM ? Number(designM[1]) : null,
      ux: uxM ? Number(uxM[1]) : null,
      has_trajectory: existsSync(trajPath),
    };
  });
}

function countDecisionsByStatus(status) {
  const d = safeJson('.planning/genorah/decisions.json');
  return d?.decisions?.filter((x) => x.status === status).length || 0;
}

function countLedgerKinds() {
  const path = '.planning/genorah/journal.ndjson';
  if (!existsSync(path)) return {};
  const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);
  const counts = {};
  for (const l of lines) {
    try { const e = JSON.parse(l); counts[e.kind] = (counts[e.kind] || 0) + 1; } catch {}
  }
  return counts;
}

function extractSubgateGrid() {
  const auditDir = '.planning/genorah/audit';
  if (!existsSync(auditDir)) return {};
  const grid = {};
  for (const subgate of ['ux-heuristics', 'interaction-fidelity', 'cognitive-load', 'conversion', 'visual-craft', 'synthetic', 'motion-health']) {
    const subgatePath = `${auditDir}/${subgate}`;
    if (!existsSync(subgatePath)) continue;
    grid[subgate] = readdirSync(subgatePath).filter((f) => f.endsWith('.json')).map((f) => {
      const d = safeJson(`${subgatePath}/${f}`);
      return { section: f.replace(/\.json$/, ''), score: d?.total, max: d?.max, fails: d?.checks?.filter((c) => !c.passed).map((c) => c.id) || [] };
    });
  }
  return grid;
}

function extractAssetsSummary() {
  const m = safeJson('public/assets/MANIFEST.json');
  if (!m) return null;
  return {
    total: m.assets?.length || 0,
    by_kind: (m.assets || []).reduce((acc, a) => { acc[a.kind] = (acc[a.kind] || 0) + 1; return acc; }, {}),
    license_unknown: (m.assets || []).filter((a) => a.license === 'unknown').length,
    avg_dna_coverage: (m.assets || []).reduce((s, a) => s + (a.dna_coverage?.primary || 0) + (a.dna_coverage?.secondary || 0) + (a.dna_coverage?.accent || 0), 0) / Math.max(m.assets?.length || 1, 1),
  };
}

function readCostSnapshot() {
  const path = '.planning/genorah/cost-ledger.ndjson';
  if (!existsSync(path)) return null;
  const entries = readFileSync(path, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  return {
    total_tokens: entries.reduce((s, e) => s + e.tokens_in + e.tokens_out, 0),
    total_usd: entries.reduce((s, e) => s + e.api_usd, 0),
    calls: entries.length,
    cache_hits: entries.filter((e) => e.cache_hit).length,
  };
}

function cmd_tail_ledger() {
  const path = '.planning/genorah/journal.ndjson';
  if (!existsSync(path)) { console.log('[]'); return; }
  const n = Number(process.argv[3] === 'tail-ledger' ? (process.argv[4] || 50) : 50);
  const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean).slice(-n);
  console.log(JSON.stringify(lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean), null, 2));
}

const sub = argv[2];
switch (sub) {
  case 'snapshot': cmd_snapshot(); break;
  case 'tail-ledger': cmd_tail_ledger(); break;
  default:
    console.error('usage: dashboard-v2-data <snapshot|tail-ledger [N]>');
    exit(2);
}
