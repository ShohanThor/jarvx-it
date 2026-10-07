"use client";

import { createContext, useCallback, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Dictionary, type Lang } from "@/lib/i18n/dictionaries";

type Ctx = { lang: Lang; t: Dictionary; setLang: (l: Lang) => void; pending: boolean };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const setLang = useCallback(
    (l: Lang) => {
      document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = l;
      start(() => router.refresh());
    },
    [router],
  );
  return <LangContext.Provider value={{ lang, t: dictionaries[lang], setLang, pending }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
