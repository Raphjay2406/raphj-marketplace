/**
 * Render core — Playwright-driven 3dsvg capture.
 *
 * Loads template.html in a headless Chromium, injects preset config, uses
 * 3dsvg's registerCanvas prop to expose the WebGL canvas, captures PNG
 * via toBlob() → Buffer, writes to disk. For video: captures N frames
 * + invokes ffmpeg via @ffmpeg-installer/ffmpeg to encode MP4.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = pathToFileURL(join(__dirname, 'template.html')).href;

async function launchPage(width, height) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--disable-features=BlockInsecurePrivateNetworkRequests'],
  });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    // network isolation — we serve template from file://
    offline: false,  // allow CDN for 3dsvg package if template references it; swap to true when self-hosted
  });
  const page = await context.newPage();
  return { browser, page };
}

function sanitizeText(text) {
  // Brand text: WebGL-rendered, not DOM. But we strip control chars + limit length.
  return String(text).replace(/[\x00-\x1f\x7f-\x9f]/g, '').slice(0, 200);
}

async function sanitizeSvg(raw) {
  if (!raw) return null;
  const { optimize } = await import('svgo');
  const forbidden = new Set(['script', 'foreignObject', 'iframe', 'object', 'embed']);
  const result = optimize(raw, {
    plugins: [
      { name: 'removeDoctype' },
      { name: 'removeXMLProcInst' },
      { name: 'removeComments' },
      { name: 'removeMetadata' },
      { name: 'removeScriptElement' },
      {
        name: 'genorah-allowlist',
        fn: () => ({
          element: {
            enter: (node) => {
              if (forbidden.has(node.name)) {
                throw new Error(`Forbidden SVG element: ${node.name}`);
              }
              // Reject on* attrs
              for (const attr of Object.keys(node.attributes || {})) {
                if (/^on[a-z]+/i.test(attr)) {
                  throw new Error(`Forbidden event handler: ${attr}`);
                }
              }
              // External image href blocked (data: only)
              if (node.name === 'image' && node.attributes.href && !node.attributes.href.startsWith('data:')) {
                throw new Error(`External image href forbidden: ${node.attributes.href}`);
              }
            }
          }
        })
      }
    ]
  });
  return result.data;
}

async function renderOnce({ preset_id, text, svg, material, animation, depth, color, rotationY, width, height, override }) {
  const { browser, page } = await launchPage(width, height);
  try {
    await page.goto(TEMPLATE);

    // Inject preset config into page-scope + wait for 3dsvg ready event
    const safeText = sanitizeText(text);
    const safeSvg = svg ? await sanitizeSvg(svg) : null;

    await page.evaluate(({ preset_id, text, svg, material, animation, depth, color, rotationY, override }) => {
      window.__GENORAH_PRESET__ = {
        preset_id, text, svg, material, animation, depth, color, rotationY, ...override
      };
      window.__GENORAH_MOUNT__();
    }, { preset_id, text: safeText, svg: safeSvg, material, animation, depth, color, rotationY, override });

    // Wait for render complete (3dsvg onReady callback)
    await page.waitForFunction(() => window.__GENORAH_READY__ === true, { timeout: 10000 });

    // Capture canvas pixels
    const dataUrl = await page.evaluate(() => {
      const canvas = window.__GENORAH_CANVAS__;
      if (!canvas) throw new Error('Canvas not registered');
      return canvas.toDataURL('image/png');
    });

    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    return { buf, width, height };
  } finally {
    await browser.close();
  }
}

export async function renderPreset({ preset_id, override = {}, output_dir, width = 3840, height = 2160 }) {
  const presets = loadPresets();
  const preset = presets.find(p => p.id === preset_id);
  if (!preset) throw new Error(`Preset not found: ${preset_id}`);
  if (preset.disabled) throw new Error(`Preset disabled: ${preset_id} (${preset.fallback_strategy})`);

  const config = mergeOverride(preset, override);
  const start = Date.now();
  const { buf } = await renderOnce({
    preset_id,
    text: config.text_template?.replace(/\{brand_name\}|\{headline\}|\{cta_text\}/, override.text || 'BRAND'),
    material: config.material,
    animation: config.animation === 'none' ? 'none' : 'none', // static render for PNG
    depth: config.depth,
    color: config.color_override || null,
    rotationY: 0,
    width,
    height,
    override,
  });

  mkdirSync(output_dir, { recursive: true });
  const outPath = join(output_dir, `${preset_id}.png`);
  writeFileSync(outPath, buf);

  return { path: outPath, size_kb: Math.round(buf.length / 1024), duration_ms: Date.now() - start };
}

export async function renderBatch({ archetype, beat, brand_name, materials, angles, breakpoints, output_dir }) {
  const presets = loadPresets();
  const basePreset = presets.find(p => p.archetype === archetype && p.beat === beat);
  if (!basePreset) throw new Error(`No preset for ${archetype}/${beat}`);
  if (basePreset.disabled) throw new Error(`Disabled: ${basePreset.fallback_strategy}`);

  const mats = materials || defaultMaterials(archetype);
  const angs = angles || [0, -0.6, 0.6]; // front, 3/4R, 3/4L (radians)
  const bps  = breakpoints || [{ w: 2048, h: 1152 }, { w: 3840, h: 2160 }];

  mkdirSync(output_dir, { recursive: true });
  const variants = [];
  const start = Date.now();

  for (const material of mats) {
    for (const rotY of angs) {
      for (const bp of bps) {
        const w = typeof bp === 'object' ? bp.w : bp;
        const h = typeof bp === 'object' ? bp.h : Math.round(bp * 9 / 16);
        const angleLabel = rotY === 0 ? 'front' : rotY < 0 ? '34r' : '34l';
        const bpLabel = w >= 3840 ? '4k' : '2k';
        const fileName = `${brand_name.toLowerCase()}-${material}-${angleLabel}-${bpLabel}.png`;
        const outPath = join(output_dir, fileName);

        const { buf } = await renderOnce({
          preset_id: basePreset.id,
          text: brand_name,
          material,
          animation: 'none',
          depth: basePreset.depth,
          color: null,
          rotationY: rotY,
          width: w,
          height: h,
          override: {},
        });

        writeFileSync(outPath, buf);
        variants.push({ material, angle: angleLabel, bp: bpLabel, path: outPath, size_kb: Math.round(buf.length / 1024) });
      }
    }
  }

  const manifest = { archetype, beat, brand_name, generated_at: new Date().toISOString(), variants };
  const manifestPath = join(output_dir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const totalSize = variants.reduce((a, v) => a + v.size_kb, 0);
  return { variants, manifest_path: manifestPath, total_size_mb: (totalSize / 1024).toFixed(2), duration_ms: Date.now() - start };
}

export async function renderVideo({ preset_id, override = {}, duration_s = 4, fps = 60, width = 1920, height = 1080, output_path }) {
  // Frame-by-frame capture, then FFmpeg encode
  const ffmpeg = await import('@ffmpeg-installer/ffmpeg').catch(() => null);
  if (!ffmpeg) throw new Error('@ffmpeg-installer/ffmpeg not installed');

  const presets = loadPresets();
  const preset = presets.find(p => p.id === preset_id);
  if (!preset) throw new Error(`Preset not found: ${preset_id}`);

  const tmpDir = join(dirname(output_path), `.frames-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });

  const frameCount = duration_s * fps;
  const start = Date.now();

  // Launch page once, render all frames by advancing the 3dsvg clock
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(TEMPLATE);

  await page.evaluate((cfg) => {
    window.__GENORAH_PRESET__ = cfg;
    window.__GENORAH_MOUNT__();
  }, { preset_id, ...override, material: preset.material, animation: preset.animation, depth: preset.depth });

  await page.waitForFunction(() => window.__GENORAH_READY__ === true, { timeout: 10000 });

  for (let i = 0; i < frameCount; i++) {
    await page.evaluate((t) => window.__GENORAH_ADVANCE__(t), i / fps);
    const dataUrl = await page.evaluate(() => window.__GENORAH_CANVAS__.toDataURL('image/png'));
    writeFileSync(join(tmpDir, `f${String(i).padStart(5, '0')}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
  }

  await browser.close();

  // FFmpeg encode
  const r = spawnSync(ffmpeg.path, [
    '-y', '-framerate', String(fps),
    '-i', join(tmpDir, 'f%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20',
    output_path,
  ], { stdio: 'pipe' });

  if (r.status !== 0) throw new Error(`FFmpeg failed: ${r.stderr?.toString()}`);

  // Cleanup frame dir
  const { rmSync } = await import('node:fs');
  rmSync(tmpDir, { recursive: true, force: true });

  const { statSync } = await import('node:fs');
  const size = statSync(output_path).size;
  return { path: output_path, size_kb: Math.round(size / 1024), frames: frameCount, duration_s, duration_ms: Date.now() - start };
}

// Helpers

function loadPresets() {
  // Walk up to find skills/design-archetypes/seeds/3dsvg-presets.json
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, 'skills/design-archetypes/seeds/3dsvg-presets.json');
    if (existsSync(candidate)) {
      return JSON.parse(readFileSync(candidate, 'utf8')).presets;
    }
    dir = dirname(dir);
  }
  throw new Error('3dsvg-presets.json not found (walked 6 levels up from server)');
}

function mergeOverride(preset, override) {
  const merged = { ...preset };
  const matrix = preset.field_overridable || {
    color_override: true, depth: false, material: false, animation: false, text_template: true, bevel: false,
  };
  for (const [k, v] of Object.entries(override)) {
    if (matrix[k] === true) merged[k] = v;
    else if (matrix[k] === false) throw new Error(`Forbidden override for field "${k}" on preset ${preset.id}`);
  }
  return merged;
}

function defaultMaterials(archetype) {
  // Archetype → default 5 materials from preset library's preference tables.
  // These must match the archetype×material table in skills/3dsvg-extrusion/SKILL.md.
  const map = {
    'Luxury':         ['gold', 'chrome', 'metal', 'glass', 'clay'],
    'Ethereal':       ['glass', 'holographic', 'metal', 'plastic', 'emissive'],
    'Brutalist':      ['rubber', 'plastic', 'clay', 'metal', 'default'],
    'Kinetic':        ['chrome', 'metal', 'glass', 'emissive', 'holographic'],
    'Neon-Noir':      ['emissive', 'chrome', 'glass', 'metal', 'holographic'],
    'Cyberpunk-HUD':  ['emissive', 'chrome', 'metal', 'glass', 'plastic'],
    'Spatial-VisionOS': ['glass', 'holographic', 'plastic', 'metal', 'emissive'],
    'Claymorphism':   ['clay', 'rubber', 'plastic', 'default', 'glass'],
    'Y2K':            ['chrome', 'holographic', 'glass', 'metal', 'emissive'],
    // Fallback for any archetype not in map:
  };
  return map[archetype] || ['plastic', 'metal', 'glass', 'chrome', 'clay'];
}
