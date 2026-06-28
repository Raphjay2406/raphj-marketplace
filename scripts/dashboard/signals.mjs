export function parseProjectMeta(projectMd = '', dnaMd = '') {
  const p = String(projectMd);
  const d = String(dnaMd);
  const name = (p.match(/^#\s+(.+)$/m)?.[1]
    ?? p.match(/^(?:project|name):\s*(.+)$/im)?.[1]
    ?? '').trim() || null;
  const goal = (p.match(/^(?:goal|objective):\s*(.+)$/im)?.[1] ?? '').trim() || null;
  const archetype = (d.match(/^(?:#+\s*)?archetype:\s*(.+)$/im)?.[1] ?? '').trim() || null;
  return { name, archetype, goal };
}

export function computeHotspots(sections = []) {
  const counts = new Map();
  for (const s of sections) {
    for (const f of s?.verdict?.failures ?? []) {
      if (!f?.check) continue;
      counts.set(f.check, (counts.get(f.check) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([check, count]) => ({ check, count }))
    .sort((a, b) => b.count - a.count);
}

const BREAKPOINTS = [
  { label: 'Mobile', width: 375 },
  { label: 'Tablet', width: 768 },
  { label: 'Desktop', width: 1280 },
  { label: 'Wide', width: 1440 },
];

export function listAuditShots(auditFiles = []) {
  const present = new Set(auditFiles);
  const out = [];
  for (const { label, width } of BREAKPOINTS) {
    const file = `screenshot-${width}px.png`;
    if (present.has(file)) out.push({ label, width, file });
  }
  return out;
}
