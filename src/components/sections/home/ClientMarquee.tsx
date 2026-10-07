import Image from "next/image";
import type { ClientLogo } from "@prisma/client";

export function ClientMarquee({ title, clients }: { title: string; clients: ClientLogo[] }) {
  if (!clients.length) return null;
  const row = [...clients, ...clients];
  return (
    <section id="clients" className="relative py-14" aria-label={title}>
      <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted">{title}</p>
      <div className="group mask-fade-x overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]" style={{ "--marquee-duration": `${clients.length * 4}s` } as React.CSSProperties}>
          {row.map((c, i) => (
            <li key={`${c.id}-${i}`} aria-hidden={i >= clients.length} className="shrink-0">
              {c.logo ? (
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={180}
                  height={60}
                  className="h-10 w-auto opacity-60 transition duration-300 hover:opacity-100 dark:brightness-[1.8] dark:hover:brightness-200"
                />
              ) : (
                <span className="font-display text-2xl font-bold text-muted">{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
