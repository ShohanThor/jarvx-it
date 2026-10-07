import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

type P = { slug: string; title: string; excerpt: string; cover: string; category: string; publishedAt: Date; readingTime: number };

export function PostCard({ p, minRead, lang = "en", featured = false }: { p: P; minRead: string; lang?: string; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      className={`gradient-border glass group grid h-full overflow-hidden rounded-4xl ${featured ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" : "aspect-[16/9]"}`}>
        <Image
          src={p.cover}
          alt=""
          fill
          priority={featured}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-col ${featured ? "justify-center p-8 md:p-12" : "p-6"}`}>
        <div className="flex items-center gap-3 text-xs font-medium text-muted">
          <span className="rounded-full bg-purple/10 px-2.5 py-1 font-semibold text-purple dark:text-purple-300">{p.category}</span>
          <time dateTime={p.publishedAt.toISOString()}>{formatDate(p.publishedAt, lang)}</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {p.readingTime} {minRead}
          </span>
        </div>
        <h3 className={`mt-4 font-display font-semibold leading-tight transition-colors group-hover:text-purple ${featured ? "text-3xl md:text-4xl" : "text-xl"}`}>{p.title}</h3>
        <p className={`mt-3 text-muted ${featured ? "text-lg" : "line-clamp-2"}`}>{p.excerpt}</p>
      </div>
    </Link>
  );
}
