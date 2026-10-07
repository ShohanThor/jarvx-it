"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = !mounted || resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn("glass relative grid h-10 w-10 place-items-center rounded-full text-fg transition hover:border-purple/50", className)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={cn("h-[18px] w-[18px] transition-all duration-500", dark ? "rotate-90 scale-0" : "rotate-0 scale-100")} />
      <Moon className={cn("absolute h-[18px] w-[18px] transition-all duration-500", dark ? "rotate-0 scale-100" : "-rotate-90 scale-0")} />
    </button>
  );
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang, pending } = useLang();
  return (
    <div className={cn("glass relative flex h-10 items-center rounded-full p-1 text-xs font-semibold", pending && "opacity-70", className)} role="group" aria-label="Language">
      {(["en", "bn"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => l !== lang && setLang(l)}
          aria-pressed={lang === l}
          className={cn("relative z-[1] h-8 rounded-full px-3 transition-colors", lang === l ? "bg-brand text-white" : "text-muted hover:text-fg")}
        >
          {l === "en" ? "EN" : "বাং"}
        </button>
      ))}
    </div>
  );
}
