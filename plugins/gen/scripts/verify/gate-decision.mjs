// scripts/verify/gate-decision.mjs
import { dirname } from 'path';
import { readVerdict, isVerdictFresh } from './verdict.mjs';

const SUMMARY_RE = /[\\/]sections[\\/]([^\\/]+)[\\/]SUMMARY\.md$/;

export function gateDecision({ planningDir, target }) {
  if (!target || !SUMMARY_RE.test(target.replace(/\\/g, '/'))) return { block: false };
  const sectionDir = dirname(target);
  const verdict = readVerdict(sectionDir);
  if (!verdict) return { block: true, reason: `No VERDICT.json for this section. Run: node scripts/verify/verify-section.mjs --section "${sectionDir}" --project <projectDir> before marking it complete.` };
  if (!isVerdictFresh(sectionDir, verdict)) return { block: true, reason: `VERDICT.json is stale (section files changed since verification). Re-run verify-section before completing.` };
  if (verdict.floor?.pass !== true) {
    const fails = (verdict.floor?.failures || []).map(f => `${f.check}: ${f.detail}`).join('; ');
    return { block: true, reason: `Floor FAILED — section cannot be marked complete until fixed: ${fails}` };
  }
  return { block: false };
}
