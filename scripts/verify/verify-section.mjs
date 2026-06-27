// scripts/verify/verify-section.mjs
import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { computeInputHash, writeVerdict, RUBRIC_VERSION } from './verdict.mjs';
import { evaluateFloor } from './floor.mjs';
import { checkAssetPresence } from './asset-requirements.mjs';
import { ensureBuild as realBuild, ensureDevServer as realDev } from './runtime.mjs';
import { probe as realProbe } from './probe.mjs';
import { runLighthouse as realLh } from './lighthouse.mjs';

function readBeat(sectionDir) {
  const plan = join(sectionDir, 'PLAN.md');
  if (!existsSync(plan)) return 'UNKNOWN';
  const m = readFileSync(plan, 'utf8').match(/beat:\s*([A-Za-z]+)/i);
  return m ? m[1].toUpperCase() : 'UNKNOWN';
}

function readManifest(projectDir) {
  const p = join(projectDir, 'public/assets/MANIFEST.json');
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return []; }
}

export async function verifySection({ sectionDir, projectDir, url, beat, perfBudget = 0.85, skipBuild = false, deps = {} }) {
  const d = {
    ensureBuild: deps.ensureBuild || realBuild,
    ensureDevServer: deps.ensureDevServer || realDev,
    probe: deps.probe || realProbe,
    runLighthouse: deps.runLighthouse || realLh,
  };
  beat = beat || readBeat(sectionDir);

  const build = skipBuild ? { ok: true } : await d.ensureBuild(projectDir);
  const callerSuppliedUrl = Boolean(url);
  let server = callerSuppliedUrl ? { url, stop: async () => {} } : null;
  let pr, lh;

  try {
    if (!server) server = await d.ensureDevServer(projectDir, {});

    // Short-circuit when dev server failed to start
    const serverReady = server.ready !== false && Boolean(server.url);
    if (!serverReady) {
      // Safe empty measurements — no probe/lighthouse possible
      pr = { console: { errors: [] }, overflow: [], axe: { critical: 0, serious: 0 }, motion: { present: false }, html: '' };
      lh = { performance: 0 };
      const buildDetail = { ok: false, detail: 'dev server did not start within timeout' };
      const assets = checkAssetPresence({ beat, html: '', manifest: readManifest(projectDir) });
      const measurements = {
        build: buildDetail, console: pr.console, overflow: pr.overflow, axe: pr.axe,
        lighthouse: lh, perfBudget, assets, interactions: { failed: [] }, motion: pr.motion,
      };
      const floor = evaluateFloor(measurements);
      const verdict = {
        section: basename(sectionDir), rubricVersion: RUBRIC_VERSION,
        inputHash: computeInputHash(sectionDir), floor,
        ceiling: { score: null, notes: 'advisory — set by judge agent, never gates the floor' },
        measurements, generatedAt: new Date().toISOString(),
      };
      writeVerdict(sectionDir, verdict);
      return verdict;
    }

    pr = await d.probe(server.url, {});
    lh = await d.runLighthouse(server.url, {});
  } finally {
    if (server && !callerSuppliedUrl) await server.stop();
  }

  const assets = checkAssetPresence({ beat, html: pr.html, manifest: readManifest(projectDir) });
  const measurements = {
    build, console: pr.console, overflow: pr.overflow, axe: pr.axe,
    lighthouse: lh, perfBudget, assets, interactions: { failed: [] }, motion: pr.motion,
  };
  const floor = evaluateFloor(measurements);
  const verdict = {
    section: basename(sectionDir), rubricVersion: RUBRIC_VERSION,
    inputHash: computeInputHash(sectionDir), floor,
    ceiling: { score: null, notes: 'advisory — set by judge agent, never gates the floor' },
    measurements, generatedAt: new Date().toISOString(),
  };
  writeVerdict(sectionDir, verdict);
  return verdict;
}

// CLI
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const arg = (k, def) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : def; };
  const sectionDir = arg('--section');
  const projectDir = arg('--project', process.cwd());
  if (!sectionDir) { console.error('--section <dir> required'); process.exit(2); }
  const v = await verifySection({
    sectionDir, projectDir, url: arg('--url'), beat: arg('--beat'),
    perfBudget: Number(arg('--budget', '0.85')),
  });
  console.log(JSON.stringify(v.floor, null, 2));
  process.exit(v.floor.pass ? 0 : 1);
}
