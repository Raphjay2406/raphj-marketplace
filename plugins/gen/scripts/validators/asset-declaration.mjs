// scripts/validators/asset-declaration.mjs
const REQUIRES_ASSET = new Set(['HOOK', 'PEAK']);

export function lintPlanAssets(planText) {
  const beatMatch = String(planText).match(/beat:\s*([A-Za-z]+)/i);
  const beat = beatMatch ? beatMatch[1].toUpperCase() : 'UNKNOWN';
  const violations = [];
  if (REQUIRES_ASSET.has(beat)) {
    const assetsMatch = planText.match(/assets:\s*\n((?:\s*-\s.*\n?)+)/i);
    const hasPayload = assetsMatch && /source:|intent:|3d|shader|canvas/i.test(assetsMatch[1]);
    if (!hasPayload) violations.push({ beat, detail: `${beat} beat must declare an assets: block naming a wow payload (gpt-image/3d/shader/canvas).` });
  }
  return { ok: violations.length === 0, violations };
}
