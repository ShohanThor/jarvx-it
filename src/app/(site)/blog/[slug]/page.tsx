import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft, Clock } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { PostCard } from "@/components/sections/blog/PostCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getPost, getPosts } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getPost(params.slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, type: "article" });
}

/** Strip raw HTML from markdown so CMS content can't inject scripts */
function renderMarkdown(md: string) {
  const safe = md.replace(/<[^>]*>/g, "");
  const html = marked.parse(safe, { async: false, gfm: true }) as string;
  return html.replace(/href="\s*(javascript|data|vbscript):[^"]*"/gi, 'href="#"');
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const t = getDict();
  const lang = getLang();
  const p = await getPost(params.slug);
  if (!p) notFound();
  const related = (await getPosts())
    .filter((x) => x.slug !== p.slug)
    .map((x) => ({ x, score: (x.category === p.category ? 2 : 0) + x.tags.filter((tag) => p.tags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.x);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(p),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: p.title, path: `/blog/${p.slug}` },
          ]),
        ]}
      />
      <article>
        <header className="relative pb-10 pt-36 md:pt-44">
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
          <div className="container relative max-w-4xl">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple">
              <ArrowLeft className="h-4 w-4" /> {t.nav.blog}
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <Link href={`/blog?category=${encodeURIComponent(p.category)}`} className="rounded-full bg-purple/10 px-3 py-1 font-semibold text-purple dark:text-purple-300">
                {p.category}
              </Link>
              <time dateTime={p.publishedAt.toISOString()}>{formatDate(p.publishedAt, lang)}</time>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {p.readingTime} {t.common.minRead}
              </span>
              <span>· {p.author}</span>
            </div>
            <SplitWords as="h1" text={p.title} animateOnMount className="mt-5 font-display text-4xl font-bold leading-[1.08] md:text-6xl" />
            <Reveal delay={0.3}>
              <p className="mt-5 text-xl text-muted">{p.excerpt}</p>
            </Reveal>
          </div>
        </header>
        <div className="container max-w-5xl">
          <Reveal variant="clip" className="relative aspect-[16/8] overflow-hidden rounded-4xl">
            <Image src={p.cover} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </Reveal>
        </div>
        <div className="container max-w-3xl py-14">
          <div className="prose-brand" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
          {p.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 border-t border-line/10 pt-8">
              {p.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/blog?q=${encodeURIComponent(tag)}`} className="glass rounded-full px-3 py-1.5 text-sm text-muted hover:text-purple">
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <h2 className="mb-8 font-display text-3xl font-bold">Related posts</h2>
            <Stagger className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <StaggerItem key={r.slug} className="h-full">
                  <PostCard p={r} minRead={t.common.minRead} lang={lang} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
      <FinalCta t={t} />
    </>
  );
}
