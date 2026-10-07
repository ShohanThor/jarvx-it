"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";

export function NewsletterForm() {
  const { t } = useLang();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }

  if (state === "done")
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-purple-300" role="status">
        <Check className="h-4 w-4" /> {t.forms.subscribed}
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <p className="text-sm text-muted">{t.forms.newsletter}</p>
      <div className="glass flex items-center rounded-full p-1 focus-within:border-purple">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.forms.email}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted/70"
        />
        <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-white" aria-label={t.forms.subscribe} disabled={state === "loading"}>
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-400">{t.forms.error}</p>}
    </form>
  );
}
