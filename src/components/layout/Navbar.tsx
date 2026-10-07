"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LangToggle, ThemeToggle } from "./Toggles";
import { useLang } from "@/components/providers/LangProvider";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 rounded-full px-3 pl-5 transition-all duration-500",
          scrolled || open ? "glass shadow-glass" : "border border-transparent",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="JarvX IT home">
          <span data-nav-logo className="inline-flex">
            <LogoMark className="h-8 w-auto" title="" />
          </span>
          <Wordmark className="text-xl" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {isActive(item.href) && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-[1] rounded-full bg-purple/15" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                {t.nav[item.key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle className="hidden sm:flex" />
          <ThemeToggle />
          <Button href={`tel:${site.phone}`} size="sm" className="hidden md:inline-flex" aria-label={`${t.nav.callUs} ${site.phoneDisplay}`}>
            <Phone className="h-4 w-4" />
            {t.nav.callUs}
          </Button>
          <button
            type="button"
            className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="glass fixed inset-x-3 top-[5.5rem] bottom-3 overflow-y-auto rounded-4xl p-6 lg:hidden"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }} className="space-y-1">
              {[{ href: "/", key: "home" as const }, ...nav].map((item) => (
                <motion.li key={item.href} variants={{ h: { opacity: 0, x: -20 }, s: { opacity: 1, x: 0 } }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 font-display text-2xl font-semibold",
                      (item.href === "/" ? pathname === "/" : isActive(item.href)) ? "bg-purple/15 text-fg" : "text-fg/80",
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LangToggle />
              <Button href={`tel:${site.phone}`} magnetic={false}>
                <Phone className="h-4 w-4" />
                {site.phoneDisplay}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
