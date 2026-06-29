// scripts/dashboard/view-model.mjs
// Pure presentation transforms for the Genorah dashboard. No DOM, no I/O.
// Imported BOTH by node:test (server-side) and by the browser page, which loads
// it from the server route /scripts/dashboard/view-model.mjs. Keep it
// dependency-free and self-contained so it runs identically in both places.

const TIERS = [
  { min: 235, label: 'SOTM-Ready', klass: 'sotm' },
  { min: 220, label: 'Honoree', klass: 'honoree' },
  { min: 200, label: 'SOTD-Ready', klass: 'sotd' },
  { min: 170, label: 'Strong', klass: 'strong' },
  { min: 140, label: 'Baseline', klass: 'baseline' },
  { min: -Infinity, label: 'Reject', klass: 'reject' },
];

export function scoreTier(score) {
  const n = Number(score);
  if (score == null || Number.isNaN(n)) return { label: '—', klass: 'none' };
  for (const t of TIERS) if (n >= t.min) return { label: t.label, klass: t.klass };
  return { label: 'Reject', klass: 'reject' };
}

export function summarize(sections = []) {
  const list = Array.isArray(sections) ? sections : [];
  const scored = list.filter(s => Number.isFinite(s?.score)); // excludes NaN/Infinity, not just typeof
  const verified = list.filter(s => s?.verdict);
  const floorPass = verified.filter(s => s.verdict.floorPass === true).length;
  const floorFail = verified.filter(s => s.verdict.floorPass === false).length;
  const avgScore = scored.length
    ? Math.round(scored.reduce((a, s) => a + s.score, 0) / scored.length)
    : null;
  return { total: list.length, verified: verified.length, floorPass, floorFail, avgScore };
}

export function hotspotBars(hotspots = [], maxPx = 200) {
  const list = Array.isArray(hotspots)
    ? hotspots.filter(h => h && typeof h.count === 'number')
    : [];
  if (!list.length) return [];
  const max = Math.max(...list.map(h => h.count));
  return list.map(h => ({
    check: h.check,
    count: h.count,
    pct: max ? Math.round((h.count / max) * 100) : 0,
    px: max ? Math.max(2, Math.round((h.count / max) * maxPx)) : 2,
  }));
}

const DEFAULT_THEME = {
  bg: '#0a0a0b', surface: '#141418', raised: '#1c1c22', text: '#e8e8ea',
  muted: '#8a8a95', border: '#2a2a31', primary: '#7c5cff', accent: '#7c5cff',
  glow: '#7c5cff', ok: '#3fc28a', warn: '#f0a830', fail: '#ef4458',
};

export function themeFromTokens(dnaTokens = {}) {
  const t = dnaTokens && typeof dnaTokens === 'object' ? dnaTokens : {};
  const out = { ...DEFAULT_THEME };
  for (const key of Object.keys(DEFAULT_THEME)) {
    const v = t[key];
    if (typeof v === 'string' && v.trim()) out[key] = v.trim();
  }
  return out;
}

export function relativeTime(iso, nowIso) {
  const then = Date.parse(iso);
  const now = Date.parse(nowIso);
  if (Number.isNaN(then) || Number.isNaN(now)) return '—';
  const sec = Math.max(0, Math.round((now - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

function waveStatus(secs) {
  if (secs.some(s => s?.verdict?.floorPass === false)) return 'failed';
  const allDone = secs.every(
    s => (typeof s?.score === 'number' && s.score >= 200) || s?.verdict?.floorPass === true,
  );
  if (allDone) return 'done';
  if (secs.some(s => /build|progress|wip/i.test(s?.status || ''))) return 'building';
  if (secs.some(s => /qa|review/i.test(s?.status || ''))) return 'qa';
  return 'pending';
}

export function deriveWaves(sections = [], masterPlan = '') {
  const list = Array.isArray(sections) ? sections : [];
  const byWave = new Map();
  for (const s of list) {
    const n = s?.wave ?? null;
    if (n == null) continue;
    const key = String(n);
    if (!byWave.has(key)) byWave.set(key, []);
    byWave.get(key).push(s);
  }
  if (byWave.size) {
    return [...byWave.keys()]
      .sort((a, b) => Number(a) - Number(b))
      .map(n => ({ n, label: `Wave ${n}`, count: byWave.get(n).length, status: waveStatus(byWave.get(n)) }));
  }
  // Fallback: no section carries a wave — scrape numbers from the master plan.
  const nums = [...new Set([...String(masterPlan).matchAll(/wave[:\s]+(\d+)/gi)].map(m => m[1]))];
  return nums
    .sort((a, b) => Number(a) - Number(b))
    .map(n => ({ n, label: `Wave ${n}`, count: 0, status: 'planned' }));
}

export function buildViewModel(snapshot = {}, nowIso = '') {
  const s = snapshot && typeof snapshot === 'object' ? snapshot : {};
  const meta = s.project_meta || {};
  const sections = Array.isArray(s.sections) ? s.sections : [];
  return {
    ts: s.ts || null,
    tsLabel: s.ts ? relativeTime(s.ts, nowIso || s.ts) : '—',
    project: {
      name: meta.name || 'Genorah Dashboard',
      sub: [meta.archetype, meta.goal].filter(Boolean).join('  ·  ') || '—',
    },
    theme: themeFromTokens(s.dna_tokens),
    dnaChips: Object.entries(s.dna_tokens || {}).map(([token, value]) => ({ token, value })),
    stats: summarize(sections),
    waves: deriveWaves(sections, s.master_plan || ''),
    sections: sections.map(sec => {
      const score = Number.isFinite(sec.score) ? sec.score : null; // normalize: no NaN reaches the UI
      const tier = scoreTier(score);
      const v = sec.verdict;
      const verdict = !v
        ? { state: 'none', label: 'not verified', failures: [], ceiling: null }
        : v.floorPass
          ? { state: 'pass', label: 'FLOOR PASS', failures: [], ceiling: v.ceiling ?? null }
          : { state: 'fail', label: 'FLOOR FAIL', failures: (v.failures || []).map(f => f.check), ceiling: v.ceiling ?? null };
      return {
        name: sec.name,
        beat: sec.beat || '—',
        wave: sec.wave ?? null,
        score,
        scoreLabel: score == null ? '—' : String(score),
        tierLabel: tier.label,
        tierKlass: tier.klass,
        status: sec.status || null,
        verdict,
      };
    }),
    hotspots: hotspotBars(s.hotspots || []),
    screenshots: Array.isArray(s.screenshots) ? s.screenshots : [],
    graph: s.graph || { exists: false },
    context: s.context || '',
    decisions: s.decisions_tail || '',
    queue: Array.isArray(s.action_queue) ? s.action_queue : [],
  };
}
