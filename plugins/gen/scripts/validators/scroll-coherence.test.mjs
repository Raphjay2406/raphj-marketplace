import { test } from "node:test";
import { strict as assert } from "node:assert";
import { runScrollCoherence } from "./scroll-coherence.mjs";

test("passes when single persistent <Canvas> in layout", async () => {
  const layout = `
import { PersistentCanvas, SceneDirector } from "@genorah/canvas-runtime";
export default function Layout({ children }) {
  return <><PersistentCanvas intensity="cinematic"><SceneDirector choreography={c}/></PersistentCanvas>{children}</>;
}`;
  const result = await runScrollCoherence({ files: { "app/layout.tsx": layout }, intensity: "cinematic" });
  assert.equal(result.pass, true);
});

test("fails when multiple Canvas instances for cinematic intensity", async () => {
  const hero = `import { Canvas } from "@react-three/fiber"; export default () => <Canvas/>;`;
  const about = `import { Canvas } from "@react-three/fiber"; export default () => <Canvas/>;`;
  const result = await runScrollCoherence({ files: { "app/hero/page.tsx": hero, "app/about/page.tsx": about }, intensity: "cinematic" });
  assert.equal(result.pass, false);
  assert.match(result.reason, /multiple.*Canvas/i);
});

test("is skipped for intensity=accent", async () => {
  const result = await runScrollCoherence({ files: {}, intensity: "accent" });
  assert.equal(result.pass, true);
  assert.equal(result.skipped, true);
});
