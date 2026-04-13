import React, { useEffect, useRef } from "react";

export interface NoiseBackdropProps {
  /** Noise intensity 0–1 */
  intensity?: number;
  /** Backdrop blur radius in px (CSS fallback) */
  blurPx?: number;
  className?: string;
  children?: React.ReactNode;
}

const WGSL_NOISE = /* wgsl */ `
@group(0) @binding(0) var<uniform> intensity: f32;
@group(0) @binding(1) var<uniform> time: f32;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2f(1.0, 0.0)), u.x),
    mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), u.x),
    u.y
  );
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  var pos = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0,  1.0), vec2f(1.0, -1.0), vec2f( 1.0, 1.0)
  );
  return vec4f(pos[vi], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / vec2f(1280.0, 720.0);
  let n = noise(uv * 200.0 + time * 0.1);
  return vec4f(0.0, 0.0, 0.0, n * intensity * 0.15);
}
`;

function isWebGPUAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * NoiseBackdrop — DNA-matched noise overlay with WebGPU shader path.
 * Falls back to CSS `backdrop-filter` + SVG feTurbulence when WebGPU unavailable.
 */
export function NoiseBackdrop({
  intensity = 0.4,
  blurPx = 12,
  className,
  children,
}: NoiseBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gpuAvailable = isWebGPUAvailable();

  useEffect(() => {
    if (!gpuAvailable || !canvasRef.current) return;

    let animId: number;
    let device: GPUDevice | null = null;

    (async () => {
      const adapter = await (navigator as unknown as { gpu: GPU }).gpu.requestAdapter();
      if (!adapter) return;
      device = await adapter.requestDevice();
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("webgpu") as GPUCanvasContext;
      const format = (navigator as unknown as { gpu: GPU }).gpu.getPreferredCanvasFormat();
      ctx.configure({ device, format });

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: device.createShaderModule({ code: WGSL_NOISE }), entryPoint: "vs_main" },
        fragment: {
          module: device.createShaderModule({ code: WGSL_NOISE }),
          entryPoint: "fs_main",
          targets: [{ format, blend: { color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" }, alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" } } }],
        },
        primitive: { topology: "triangle-list" },
      });

      const intensityBuf = device.createBuffer({ size: 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      const timeBuf = device.createBuffer({ size: 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      device.queue.writeBuffer(intensityBuf, 0, new Float32Array([intensity]));

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: intensityBuf } },
          { binding: 1, resource: { buffer: timeBuf } },
        ],
      });

      let t = 0;
      const frame = () => {
        t += 0.016;
        device!.queue.writeBuffer(timeBuf, 0, new Float32Array([t]));
        const encoder = device!.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{ view: ctx.getCurrentTexture().createView(), loadOp: "clear", storeOp: "store", clearValue: { r: 0, g: 0, b: 0, a: 0 } }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6);
        pass.end();
        device!.queue.submit([encoder.finish()]);
        animId = requestAnimationFrame(frame);
      };
      animId = requestAnimationFrame(frame);
    })();

    return () => {
      cancelAnimationFrame(animId);
      device?.destroy();
    };
  }, [gpuAvailable, intensity]);

  if (!gpuAvailable) {
    // CSS fallback: backdrop-filter blur + SVG noise filter
    return (
      <div
        className={className}
        data-webgpu-effect="noise-backdrop"
        data-fallback="css"
        style={{
          position: "relative",
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: intensity * 0.15,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={className}
      data-webgpu-effect="noise-backdrop"
      data-fallback="gpu"
      style={{ position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      {children}
    </div>
  );
}
