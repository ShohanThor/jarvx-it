import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";
import { Price } from "./PricingToggle";
import type { ProductT } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ProductCard({ p, t, compact = false }: { p: ProductT; t: Dictionary; compact?: boolean }) {
  return (
    <TiltCard max={6} className="overflow-hidden">
      <div className="flex h-full flex-col">
        <Link href={`/products/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-t-3xl">
          <Image
            src={p.screenshots[0] ?? "/logo.png"}
            alt={`${p.name} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold">{p.category}</span>
        </Link>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <Link href={`/products/${p.slug}`} className="group/title inline-flex items-center gap-1.5">
            <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
            <ArrowUpRight className="h-5 w-5 text-purple transition group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5" />
          </Link>
          <p className="mt-2 text-muted">{p.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {p.features.slice(0, compact ? 3 : 5).map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple" />
                <span className="text-fg/85">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">{t.common.from}</span>
            <Price monthly={p.monthlyPrice} yearly={p.yearlyPrice} className="mt-1 flex" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href={`/contact?product=${p.slug}&type=demo`} size="sm">
                {t.common.bookDemo}
              </Button>
              <Button href={`/contact?product=${p.slug}&type=trial`} size="sm" variant="secondary">
                {t.common.startTrial}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
