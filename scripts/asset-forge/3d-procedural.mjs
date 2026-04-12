#!/usr/bin/env node
/**
 * 3d-procedural — v3.5.4 (lightweight initial path)
 *
 * Emits deterministic glTF from procedural primitives WITHOUT native WebGL.
 * Ships a minimal subset (box, sphere, torus) encoded as JSON-only glTF 2.0
 * with embedded buffers. Full Three.js offscreen path deferred to v3.5.6.
 *
 * Usage:
 *   node scripts/asset-forge/3d-procedural.mjs box --seed 42 --size 2 --out box.gltf
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { argv, exit, stderr } from 'node:process';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const v = argv[i + 1];
      if (v && !v.startsWith('--')) { a[k.slice(2)] = v; i++; } else a[k.slice(2)] = true;
    } else a._.push(k);
  }
  return a;
}

// Deterministic RNG (mulberry32)
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function box(size) {
  const s = size / 2;
  const positions = [
    -s,-s, s,  s,-s, s,  s, s, s, -s, s, s,
    -s,-s,-s, -s, s,-s,  s, s,-s,  s,-s,-s,
    -s, s,-s, -s, s, s,  s, s, s,  s, s,-s,
    -s,-s,-s,  s,-s,-s,  s,-s, s, -s,-s, s,
     s,-s,-s,  s, s,-s,  s, s, s,  s,-s, s,
    -s,-s,-s, -s,-s, s, -s, s, s, -s, s,-s,
  ];
  const indices = [
    0,1,2, 0,2,3,  4,5,6, 4,6,7,  8,9,10, 8,10,11,
    12,13,14, 12,14,15,  16,17,18, 16,18,19,  20,21,22, 20,22,23,
  ];
  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) };
}

function sphere(radius, segments = 16) {
  const positions = [], indices = [];
  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments;
    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      positions.push(radius * Math.sin(theta) * Math.cos(phi), radius * Math.cos(theta), radius * Math.sin(theta) * Math.sin(phi));
    }
  }
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const a = lat * (segments + 1) + lon;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) };
}

function torus(radius, tube, radialSegments = 16, tubularSegments = 32) {
  const positions = [], indices = [];
  for (let j = 0; j <= radialSegments; j++) {
    for (let i = 0; i <= tubularSegments; i++) {
      const u = (i / tubularSegments) * Math.PI * 2;
      const v = (j / radialSegments) * Math.PI * 2;
      positions.push(
        (radius + tube * Math.cos(v)) * Math.cos(u),
        (radius + tube * Math.cos(v)) * Math.sin(u),
        tube * Math.sin(v)
      );
    }
  }
  for (let j = 1; j <= radialSegments; j++) {
    for (let i = 1; i <= tubularSegments; i++) {
      const a = (tubularSegments + 1) * j + i - 1;
      const b = (tubularSegments + 1) * (j - 1) + i - 1;
      const c = (tubularSegments + 1) * (j - 1) + i;
      const d = (tubularSegments + 1) * j + i;
      indices.push(a, b, d, b, c, d);
    }
  }
  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) };
}

function buildGltf({ positions, indices }, baseColor = [0.5, 0.5, 0.6, 1]) {
  // Pack to binary chunk (base64-encoded)
  const posBytes = new Uint8Array(positions.buffer);
  const idxBytes = new Uint8Array(indices.buffer);
  const padLen = (n) => (4 - (n % 4)) % 4;
  const posPad = padLen(posBytes.byteLength);
  const total = posBytes.byteLength + posPad + idxBytes.byteLength;
  const buf = new Uint8Array(total);
  buf.set(posBytes, 0);
  buf.set(idxBytes, posBytes.byteLength + posPad);
  const b64 = Buffer.from(buf).toString('base64');
  return {
    asset: { version: '2.0', generator: 'genorah-3d-procedural v3.5.4' },
    buffers: [{ byteLength: total, uri: `data:application/octet-stream;base64,${b64}` }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes.byteLength, target: 34962 },
      { buffer: 0, byteOffset: posBytes.byteLength + posPad, byteLength: idxBytes.byteLength, target: 34963 },
    ],
    accessors: [
      { bufferView: 0, componentType: 5126, count: positions.length / 3, type: 'VEC3',
        min: [-10, -10, -10], max: [10, 10, 10] },
      { bufferView: 1, componentType: 5123, count: indices.length, type: 'SCALAR' },
    ],
    materials: [{ pbrMetallicRoughness: { baseColorFactor: baseColor, metallicFactor: 0.1, roughnessFactor: 0.8 } }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1, material: 0 }] }],
    nodes: [{ mesh: 0 }],
    scenes: [{ nodes: [0] }],
    scene: 0,
  };
}

const PRIMITIVES = {
  box: (args, r) => box(Number(args.size || 2)),
  sphere: (args, r) => sphere(Number(args.size || 1), 16),
  torus: (args, r) => torus(Number(args.size || 1), Number(args.tube || 0.3), 16, 32),
};

const args = parseArgs(argv);
const primName = args._[0];
if (!primName || !PRIMITIVES[primName]) {
  stderr.write(`usage: 3d-procedural <box|sphere|torus> [--seed N] [--size N] [--out path]\n`);
  exit(2);
}

const r = rng(Number(args.seed || 42));
const geom = PRIMITIVES[primName](args, r);
const gltf = buildGltf(geom);

if (args.out) {
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, JSON.stringify(gltf));
  console.log(`✓ ${primName} → ${args.out}`);
} else {
  process.stdout.write(JSON.stringify(gltf));
}
