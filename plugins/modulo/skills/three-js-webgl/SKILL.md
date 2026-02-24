# Three.js & WebGL

3D scenes, particle systems, interactive 3D elements, and WebGL integration with React Three Fiber for premium visual experiences.

## React Three Fiber — Basic Scene

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";

function FloatingShape() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export function Scene3D() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingShape />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
```

## Particle Field

```tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.2;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8b5cf6"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <Particles count={3000} />
      </Canvas>
    </div>
  );
}
```

## 3D Product Viewer

```tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="text-sm text-muted-foreground">Loading 3D model...</div>
    </Html>
  );
}

export function ProductViewer3D({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="aspect-square w-full rounded-lg border bg-muted/20">
      <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Suspense fallback={<LoadingSpinner />}>
          <Model url={modelUrl} />
          <Environment preset="studio" />
        </Suspense>
        <ContactShadows position={[0, -0.5, 0]} opacity={0.4} blur={2} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
```

## Scroll-Driven 3D Animation

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

function ScrollMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!meshRef.current) return;
    const offset = scroll.offset; // 0 to 1
    meshRef.current.rotation.y = offset * Math.PI * 2;
    meshRef.current.position.y = Math.sin(offset * Math.PI) * 2;
    meshRef.current.scale.setScalar(1 + offset * 0.5);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export function ScrollScene() {
  return (
    <div className="h-[300vh]">
      <div className="sticky top-0 h-screen">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <ScrollMesh />
        </Canvas>
      </div>
    </div>
  );
}
```

## Gradient Sphere (Custom Shader)

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const GradientMaterial = shaderMaterial(
  { uTime: 0, uColor1: new THREE.Color("#8b5cf6"), uColor2: new THREE.Color("#ec4899") },
  // Vertex shader
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // Fragment shader
  `uniform float uTime;
   uniform vec3 uColor1;
   uniform vec3 uColor2;
   varying vec2 vUv;
   void main() {
     float noise = sin(vUv.x * 10.0 + uTime) * sin(vUv.y * 10.0 + uTime) * 0.5 + 0.5;
     vec3 color = mix(uColor1, uColor2, noise);
     gl_FragColor = vec4(color, 1.0);
   }`
);

extend({ GradientMaterial });

function GradientSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime * 0.5;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      {/* @ts-expect-error — custom shader material */}
      <gradientMaterial ref={materialRef} />
    </mesh>
  );
}

export function GradientScene() {
  return (
    <div className="h-[600px] w-full bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <GradientSphere />
      </Canvas>
    </div>
  );
}
```

## Next.js Dynamic Import (No SSR)

```tsx
// components/scene-wrapper.tsx
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./scene-3d").then((m) => m.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
    </div>
  ),
});

export { Scene3D };
```

## Astro — Three.js Island

```astro
---
// src/pages/index.astro
import Scene3D from "../components/Scene3D";
---

<section class="h-screen">
  <!-- client:only skips SSR entirely — required for Three.js -->
  <Scene3D client:only="react" />
</section>
```

## Key Rules

- Always use `dynamic(() => ..., { ssr: false })` in Next.js — Three.js requires browser APIs
- Astro: use `client:only="react"` — Three.js cannot be server-rendered
- Use `@react-three/fiber` (R3F) for React integration, `@react-three/drei` for helpers
- Limit particle count: 1000-3000 for smooth performance on mobile
- Use `useFrame` for animations — runs at display refresh rate
- Enable `OrbitControls` for interactive viewing, disable zoom on mobile
- Use `Suspense` with `Html` loader for async model loading (GLTF)
- Use `Environment` presets for realistic lighting without manual light setup
- Optimize: use instanced meshes for many identical objects
- Dispose geometries and materials in cleanup to prevent memory leaks
