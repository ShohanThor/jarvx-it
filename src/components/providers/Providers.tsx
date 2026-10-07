"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { LangProvider } from "./LangProvider";
import type { Lang } from "@/lib/i18n/dictionaries";

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <LangProvider lang={lang}>{children}</LangProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
