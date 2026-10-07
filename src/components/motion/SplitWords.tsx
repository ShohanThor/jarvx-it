"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Word-by-word reveal. Real text stays in the DOM (good for SEO and screen readers).
 * Wrap words in *asterisks* to render them with the brand gradient.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.07,
  as = "h2",
  animateOnMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
  animateOnMount?: boolean;
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };
  return (
    <Tag
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) => {
        const highlight = w.length > 2 && w.startsWith("*") && w.endsWith("*");
        const word = highlight ? w.slice(1, -1) : w;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-top">
            <motion.span
              className={cn("inline-block will-change-transform", highlight && "text-gradient")}
              variants={{ hidden: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0 } }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}
