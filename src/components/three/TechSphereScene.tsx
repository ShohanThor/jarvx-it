"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  siReact, siNextdotjs, siTypescript, siNodedotjs, siExpress, siPhp, siLaravel, siPython, siDjango,
  siRubyonrails, siTailwindcss, siDocker, siKubernetes, siAmazonwebservices, siGooglecloud, siPostgresql, siMongodb,
} from "simple-icons";

type Icon = { title: string; path: string; hex: string };
const TECH: { icon: Icon; name: string; color?: string }[] = [
  { icon: siReact, name: "React" },
  { icon: siNextdotjs, name: "Next.js", color: "#ffffff" },
  { icon: siTypescript, name: "TypeScript" },
  { icon: siNodedotjs, name: "Node.js" },
  { icon: siExpress, name: "Express", color: "#ffffff" },
  { icon: siPhp, name: "PHP" },
  { icon: siLaravel, name: "Laravel" },
  { icon: siPython, name: "Python", color: "#FFD43B" },
  { icon: siDjango, name: "Django", color: "#44B78B" },
  { icon: siRubyonrails, name: "Rails", color: "#FF4F4F" },
  { icon: siTailwindcss, name: "Tailwind" },
  { icon: siDocker, name: "Docker" },
  { icon: siKubernetes, name: "Kubernetes" },
  { icon: siAmazonwebservices, name: "AWS", color: "#FF9900" },
  { icon: siGooglecloud, name: "GCP" },
  { icon: siPostgresql, name: "PostgreSQL", color: "#6B9BF5" },
  { icon: siMongodb, name: "MongoDB" },
];

/** Draw a glass chip with the brand logo + name onto a canvas texture */
function chipTexture(icon: Icon, name: string, color?: string) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, S, S, 0);
  g.addColorStop(0, "rgba(59,47,160,0.85)");
  g.addColorStop(1, "rgba(14,19,46,0.92)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(167,139,250,0.7)";
  ctx.stroke();
  ctx.save();
  ctx.translate(S / 2 - 48, 52);
  ctx.scale(4, 4); // simple-icons paths are 24x24
  ctx.fillStyle = color ?? `#${icon.hex}`;
  ctx.fill(new Path2D(icon.path));
  ctx.restore();
  ctx.fillStyle = "#EDE9FE";
  ctx.font = "600 30px system-ui, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name, S / 2, 196);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = phi * i;
    pts.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return pts;
}

function Chips({ onHover }: { onHover: (name: string | null) => void }) {
  const items = useMemo(() => {
    const pts = fibonacciSphere(TECH.length, 2.4);
    return TECH.map((t, i) => ({ ...t, pos: pts[i], tex: chipTexture(t.icon, t.name, t.color) }));
  }, []);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => items.forEach((i) => i.tex.dispose()), [items]);

  useFrame((_, delta) => {
    refs.current.forEach((s, i) => {
      if (!s) return;
      s.getWorldPosition(tmp);
      const depth = THREE.MathUtils.clamp((tmp.z + 2.4) / 4.8, 0, 1); // 0 back → 1 front
      const target = (hovered === i ? 1.05 : 0.66) * (0.75 + depth * 0.35);
      const sc = THREE.MathUtils.damp(s.scale.x, target, 8, delta);
      s.scale.setScalar(sc);
      (s.material as THREE.SpriteMaterial).opacity = 0.25 + depth * 0.75;
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <sprite
          key={it.name}
          ref={(el) => { refs.current[i] = el; }}
          position={it.pos}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(i);
            onHover(it.name);
          }}
          onPointerOut={() => {
            setHovered(null);
            onHover(null);
          }}
        >
          <spriteMaterial map={it.tex} transparent depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

function Wire() {
  return (
    <mesh>
      <icosahedronGeometry args={[2.05, 2]} />
      <meshBasicMaterial color="#7C3AED" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

export default function TechSphereScene({ active, interactive, reduced, onHover }: { active: boolean; interactive: boolean; reduced: boolean; onHover: (n: string | null) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 6.6], fov: 45 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} frameloop={active ? "always" : "never"}>
      <Wire />
      <Chips onHover={onHover} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={interactive} autoRotate={!reduced} autoRotateSpeed={1.2} rotateSpeed={0.6} enableDamping />
    </Canvas>
  );
}
