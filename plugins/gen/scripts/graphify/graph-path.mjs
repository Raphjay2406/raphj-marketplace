// scripts/graphify/graph-path.mjs
import { join, normalize, sep, isAbsolute } from 'node:path';

export function safeGraphAsset(cwd, rel) {
  // Decode percent-encoding before path resolution to catch encoded traversal
  let decoded;
  try {
    decoded = decodeURIComponent(rel);
  } catch {
    return null;
  }
  // Reject absolute paths (would escape base regardless)
  if (isAbsolute(decoded)) return null;
  const base = join(cwd, 'graphify-out');
  const target = normalize(join(base, decoded));
  if (target !== base && !target.startsWith(base + sep)) return null;
  return target;
}
