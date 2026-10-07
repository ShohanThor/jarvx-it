"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { useLang } from "@/components/providers/LangProvider";
import { cn } from "@/lib/utils";

type P = { slug: string; title: string; client: string; category: string; summary: string; cover: string; tech: string[] };
const CATEGORIES = ["Ecommerce", "Healthcare", "SaaS", "Mobile", "Web"];

export function PortfolioGrid({ projects }: { projects: P[] }) {
  const { t } = useLang();
  const [filter, setFilter] = useState<string>("All");
  const cats = ["All", ...CATEGORIES.filter((c) => projects.some((p) => p.category === c))];
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter projects by category">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            onClick={() => setFilter(c)}
            className={cn("relative h-11 rounded-full px-5 text-sm font-semibold transition-colors", filter === c ? "text-white" : "glass text-muted hover:text-fg")}
          >
            {filter === c && <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-brand shadow-glow" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative">
              {c === "All" ? t.common.all : c} <span className="opacity-60">({c === "All" ? projects.length : projects.filter((p) => p.category === c).length})</span>
            </span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard p={p} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
