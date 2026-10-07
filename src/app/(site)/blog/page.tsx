import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { PostCard } from "@/components/sections/blog/PostCard";
import { getPosts } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Insights on software engineering, AI, design and digital business growth from the JarvX IT team.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const t = getDict();
  const lang = getLang();
  const posts = await getPosts();
  const q = (searchParams.q ?? "").trim().toLowerCase().slice(0, 100);
  const category = searchParams.category ?? "";
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const filtered = posts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!q || [p.title, p.excerpt, p.content, ...p.tags].some((s) => s.toLowerCase().includes(q))),
  );
  const showFeatured = !q && !category;
  const featured = showFeatured ? (posts.find((p) => p.featured) ?? posts[0]) : undefined;
  const rest = filtered.filter((p) => p.slug !== featured?.slug);

  const catHref = (c: string) => {
    const params = new URLSearchParams();
    if (c) params.set("category", c);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <PageHeader eyebrow={t.nav.blog} title="Insights & *ideas*" text="Engineering, AI, design and growth — lessons from building products every day." />
      <section className="pb-24">
        <div className="container">
          <Reveal className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <nav aria-label="Categories" className="flex flex-wrap gap-2">
              {["", ...categories].map((c) => (
                <Link
                  key={c || "all"}
                  href={catHref(c)}
                  data-no-transition
                  className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", category === c ? "bg-brand text-white" : "glass text-muted hover:text-fg")}
                >
                  {c || t.common.all}
                </Link>
              ))}
            </nav>
            <form action="/blog" role="search" className="glass flex w-full items-center rounded-full pl-4 md:w-80">
              <Search className="h-4 w-4 text-muted" />
              <label htmlFor="blog-q" className="sr-only">{t.common.search}</label>
              <input id="blog-q" name="q" defaultValue={searchParams.q} placeholder={`${t.common.search}…`} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
              {category && <input type="hidden" name="category" value={category} />}
            </form>
          </Reveal>

          {featured && (
            <Reveal className="mb-10">
              <PostCard p={featured} minRead={t.common.minRead} lang={lang} featured />
            </Reveal>
          )}

          {rest.length > 0 ? (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <StaggerItem key={p.slug} className="h-full">
                  <PostCard p={p} minRead={t.common.minRead} lang={lang} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            !featured && <p className="py-20 text-center text-lg text-muted">{t.common.noResults}</p>
          )}
        </div>
      </section>
    </>
  );
}
