import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type P = { slug: string; title: string; client: string; category: string; summary: string; cover: string; tech: string[] };

export function ProjectCard({ p, priority = false }: { p: P; priority?: boolean }) {
  return (
    <Link href={`/portfolio/${p.slug}`} className="gradient-border glass group block h-full overflow-hidden rounded-4xl" data-cursor="View">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={p.cover}
          alt={p.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="glass absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold">{p.category}</span>
        <span className="absolute bottom-5 right-5 grid h-12 w-12 translate-y-4 place-items-center rounded-full bg-brand text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="p-6 md:p-7">
        <p className="text-sm text-muted">{p.client}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{p.title}</h3>
        <p className="mt-2 line-clamp-2 text-muted">{p.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.slice(0, 4).map((t) => (
            <li key={t} className="rounded-full bg-purple/10 px-2.5 py-1 text-xs font-medium text-purple dark:text-purple-300">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
