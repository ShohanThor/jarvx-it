"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { J_POINTS_3D, X_POINTS_3D } from "@/components/brand/logo-paths";

const SCALE = 1 / 28;
const RADIUS = 7.5 * SCALE; // half of the logo stroke width
const toV = ([x, y]: readonly number[], z = 0) => new THREE.Vector3((x - 60) * SCALE, -(y - 47) * SCALE, z);

function buildJCurve() {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (const s of J_POINTS_3D.segments) {
    if (s.type === "line") path.add(new THREE.LineCurve3(toV(s.from), toV(s.to)));
    else path.add(new THREE.QuadraticBezierCurve3(toV(s.from), toV(s.ctrl), toV(s.to)));
  }
  return path;
}

const GRAD_A = new THREE.Color("#3B2FA0");
const GRAD_B = new THREE.Color("#8B5CF6");
/** Brand diagonal gradient (#3B2FA0 bottom-left → purple top-right) sampled at a point */
function gradientAt(x: number, y: number, out = new THREE.Color()) {
  return out.copy(GRAD_A).lerp(GRAD_B, THREE.MathUtils.clamp((x + y + 3) / 6, 0, 1));
}

function paintGradient(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    gradientAt(pos.getX(i), pos.getY(i), c);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

const glossy = (opts: THREE.MeshPhysicalMaterialParameters) =>
  new THREE.MeshPhysicalMaterial({ roughness: 0.18, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08, ...opts });

function Stroke({ curve, color = "#ffffff", gradient, z = 0 }: { curve: THREE.Curve<THREE.Vector3>; color?: string; gradient?: boolean; z?: number }) {
  const parts = useMemo(() => {
    const tube = new THREE.TubeGeometry(curve, 320, RADIUS, 40, false);
    const glow = new THREE.TubeGeometry(curve, 160, RADIUS * 1.45, 20, false);
    const cap = new THREE.SphereGeometry(RADIUS, 32, 32);
    const start = curve.getPoint(0);
    const end = curve.getPoint(1);
    const emissive = new THREE.Color(gradient ? "#5B21B6" : "#1E3A8A");
    const emissiveIntensity = gradient ? 0.35 : 0.25;
    if (gradient) paintGradient(tube);
    const body = glossy(gradient ? { vertexColors: true, emissive, emissiveIntensity } : { color, emissive, emissiveIntensity });
    // rounded line ends, coloured to match the gradient at each end
    const capMat = (p: THREE.Vector3) => (gradient ? glossy({ color: gradientAt(p.x, p.y), emissive, emissiveIntensity }) : body);
    return { tube, glow, cap, start, end, body, startMat: capMat(start), endMat: capMat(end) };
  }, [curve, color, gradient]);

  return (
    <group position-z={z}>
      <mesh geometry={parts.tube} material={parts.body} />
      <mesh geometry={parts.cap} material={parts.startMat} position={parts.start} />
      <mesh geometry={parts.cap} material={parts.endMat} position={parts.end} />
      <mesh geometry={parts.glow}>
        <meshBasicMaterial color={gradient ? "#7C3AED" : "#3A5BC0"} transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function JXLogo({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const jCurve = useMemo(buildJCurve, []);
  const xCurve = useMemo(() => new THREE.LineCurve3(toV(X_POINTS_3D.from), toV(X_POINTS_3D.to)), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduced) return;
    const t = state.clock.elapsedTime;
    const targetY = Math.sin(t * 0.35) * 0.45 + mouse.current.x * 0.45;
    const targetX = Math.cos(t * 0.25) * 0.12 + mouse.current.y * 0.3;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, mouse.current.x * 0.25, 2, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -mouse.current.y * 0.18, 2, delta);
  });

  return (
    <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group}>
        <Stroke curve={jCurve} gradient />
        <Stroke curve={xCurve} color="#1D3FA8" z={RADIUS * 1.25} />
      </group>
    </Float>
  );
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) - 2], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  useFrame((_, d) => {
    if (ref.current && !reduced) {
      ref.current.rotation.y += d * 0.03;
      ref.current.rotation.x += d * 0.01;
    }
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.035} color="#B794F6" transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

const SYMBOLS = ["</>", "{ }", "=>", "( )", "[ ]", ";", "#", "&&", "fn", "01", "::", "</>", "λ", "!=", "++", "{}"];

function makeSymbolTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.font = "600 56px ui-monospace, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#7C3AED";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#C4B5FD";
  ctx.fillText(text, 64, 66);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function CodeSymbols({ count, reduced }: { count: number; reduced: boolean }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = 2.9 + (i % 3) * 0.7;
        return {
          texture: makeSymbolTexture(SYMBOLS[i % SYMBOLS.length]),
          base: new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r * 0.55, -1 - (i % 4) * 0.6),
          phase: Math.random() * Math.PI * 2,
          scale: 0.35 + Math.random() * 0.25,
        };
      }),
    [count],
  );
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    items.forEach((it, i) => {
      const s = refs.current[i];
      if (!s) return;
      s.position.set(it.base.x + Math.sin(t * 0.4 + it.phase) * 0.15, it.base.y + Math.sin(t * 0.6 + it.phase) * 0.25, it.base.z);
      (s.material as THREE.SpriteMaterial).opacity = 0.35 + Math.sin(t + it.phase) * 0.2;
    });
  });
  useEffect(() => () => items.forEach((it) => it.texture.dispose()), [items]);
  return (
    <>
      {items.map((it, i) => (
        <sprite key={i} ref={(el) => { refs.current[i] = el; }} position={it.base} scale={[it.scale, it.scale, it.scale]}>
          <spriteMaterial map={it.texture} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </>
  );
}

export default function HeroScene({ lowPower, reduced, active }: { lowPower: boolean; reduced: boolean; active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !reduced ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-3, -2, 3]} intensity={18} color="#7C3AED" />
      <pointLight position={[3, 2, -2]} intensity={12} color="#3B82F6" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.5} position={[0, 3, 4]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-4, 0, 2]} scale={[2, 6, 1]} color="#A78BFA" />
        <Lightformer form="ring" intensity={3} position={[4, -1, 3]} scale={2} color="#7C3AED" />
      </Environment>
      <JXLogo reduced={reduced} />
      <Particles count={lowPower ? 280 : 900} reduced={reduced} />
      <CodeSymbols count={lowPower ? 7 : 16} reduced={reduced} />
    </Canvas>
  );
}
