"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ServiceIcon } from "@/components/three/ServiceIcon";

type ServiceCard = { slug: string; title: string; shortDesc: string; icon: string };

function Card({ s, index, cta }: { s: ServiceCard; index: number; cta: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} className="h-full">
      <TiltCard className="p-7 md:p-8">
        <Link href={`/services/${s.slug}`} className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <ServiceIcon kind={s.icon} hovered={hovered} />
            <span className="font-display text-sm font-semibold text-muted/60">0{index + 1}</span>
          </div>
          <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
          <p className="mt-3 flex-1 leading-relaxed text-muted">{s.shortDesc}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-purple dark:text-purple-300">
            {cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </TiltCard>
    </div>
  );
}

export function ServicesGrid({ services, cta }: { services: ServiceCard[]; cta: string }) {
  return (
    <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <StaggerItem key={s.slug} className="h-full">
          <Card s={s} index={i} cta={cta} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
