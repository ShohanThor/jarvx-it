"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Brain, Cloud, Code2, MonitorSmartphone, ShieldCheck, Users } from "lucide-react";
import { useInView, usePrefersReducedMotion } from "@/components/motion/hooks";
import type { IconKind } from "./ServiceIconScene";

const ServiceIconScene = dynamic(() => import("./ServiceIconScene"), { ssr: false });

const FALLBACK: Record<IconKind, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  users: Users,
  shield: ShieldCheck,
  devices: MonitorSmartphone,
  cloud: Cloud,
  brain: Brain,
};

/** Small animated 3D icon. Mounted only while on screen; static icon otherwise or with reduced motion. */
export function ServiceIcon({ kind, hovered = false, size = "h-20 w-20" }: { kind: string; hovered?: boolean; size?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, "100px", false);
  const reduced = usePrefersReducedMotion();
  const k = (kind in FALLBACK ? kind : "code") as IconKind;
  const Icon = FALLBACK[k];
  return (
    <div ref={ref} className={`relative ${size}`} aria-hidden>
      <div className="absolute inset-2 rounded-full bg-purple/25 blur-xl" />
      {visible && !reduced ? (
        <ServiceIconScene kind={k} hovered={hovered} />
      ) : (
        <div className="relative grid h-full w-full place-items-center">
          <Icon className="h-9 w-9 text-purple" />
        </div>
      )}
    </div>
  );
}
