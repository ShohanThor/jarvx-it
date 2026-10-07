"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type IconKind = "code" | "users" | "shield" | "devices" | "cloud" | "brain";

function Mat({ color = "#7C3AED", emissive = "#3B2FA0" }: { color?: string; emissive?: string }) {
  return <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={0.4} roughness={0.2} metalness={0.4} clearcoat={1} clearcoatRoughness={0.1} />;
}

function Spin({ children, speed = 0.6, hovered }: { children: React.ReactNode; speed?: number; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * speed * (hovered ? 3 : 1);
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.8) * 0.25;
    const target = hovered ? 1.15 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, target, 6, d));
  });
  return <group ref={ref}>{children}</group>;
}

function Orbiters({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => ref.current && (ref.current.rotation.z += d * (hovered ? 2.4 : 0.9)));
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <Mat />
      </mesh>
      <group ref={ref}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 0.95, Math.sin((i * Math.PI * 2) / 3) * 0.95, 0]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <Mat color="#1D3FA8" emissive="#0D2B7E" />
          </mesh>
        ))}
      </group>
    </>
  );
}

function Shape({ kind, hovered }: { kind: IconKind; hovered: boolean }) {
  switch (kind) {
    case "code":
      return (
        <Spin hovered={hovered}>
          <mesh>
            <torusKnotGeometry args={[0.55, 0.18, 128, 24]} />
            <Mat />
          </mesh>
        </Spin>
      );
    case "users":
      return <Orbiters hovered={hovered} />;
    case "shield":
      return (
        <Spin hovered={hovered} speed={0.8}>
          <mesh>
            <octahedronGeometry args={[0.85, 0]} />
            <Mat />
          </mesh>
          <mesh scale={1.25}>
            <octahedronGeometry args={[0.85, 0]} />
            <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.35} />
          </mesh>
        </Spin>
      );
    case "devices":
      return (
        <Spin hovered={hovered}>
          <RoundedBox args={[1.25, 0.85, 0.12]} radius={0.08} position={[-0.15, 0.1, 0]}>
            <Mat color="#1D3FA8" emissive="#0D2B7E" />
          </RoundedBox>
          <RoundedBox args={[0.45, 0.8, 0.1]} radius={0.07} position={[0.5, -0.2, 0.2]}>
            <Mat />
          </RoundedBox>
        </Spin>
      );
    case "cloud":
      return (
        <Spin hovered={hovered} speed={0.4}>
          {[
            [0, 0.1, 0, 0.5],
            [-0.5, -0.1, 0, 0.36],
            [0.5, -0.1, 0, 0.38],
            [0.2, 0.35, -0.1, 0.32],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 32, 32]} />
              <Mat color={i % 2 ? "#8B5CF6" : "#7C3AED"} />
            </mesh>
          ))}
        </Spin>
      );
    case "brain":
      return (
        <Spin hovered={hovered} speed={0.5}>
          <mesh>
            <icosahedronGeometry args={[0.55, 1]} />
            <Mat />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.95, 1]} />
            <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.4} />
          </mesh>
        </Spin>
      );
  }
}

export default function ServiceIconScene({ kind, hovered }: { kind: IconKind; hovered: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={2.2} />
      <pointLight position={[-2, -1, 2]} intensity={8} color="#A78BFA" />
      <Shape kind={kind} hovered={hovered} />
    </Canvas>
  );
}
