const CANVAS_RE = /<\s*Canvas[\s/>]/g;
const PERSISTENT_RE = /<\s*PersistentCanvas[\s/>]/g;

export async function runScrollCoherence({ files, intensity }) {
  if (intensity !== "cinematic" && intensity !== "immersive") {
    return { pass: true, skipped: true };
  }
  let canvases = 0;
  let persistent = 0;
  for (const [path, src] of Object.entries(files)) {
    canvases += (src.match(CANVAS_RE) || []).length;
    persistent += (src.match(PERSISTENT_RE) || []).length;
  }
  if (canvases > 1 && persistent === 0) {
    return { pass: false, reason: "multiple <Canvas> instances detected; cinematic requires single persistent canvas" };
  }
  if (persistent === 0) {
    return { pass: false, reason: "cinematic intensity requires exactly one <PersistentCanvas>" };
  }
  if (canvases > persistent) {
    return { pass: false, reason: "multiple <Canvas> instances detected; cinematic requires single persistent canvas" };
  }
  return { pass: true };
}
