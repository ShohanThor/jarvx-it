"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { Button } from "@/components/ui/Button";

/** Compact inquiry form used on service and product detail pages */
export function QuickInquiry({ source, subject, title }: { source: "service" | "product"; subject: string; title?: string }) {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(fd), source, service: subject }),
    }).catch(() => null);
    setStatus(res?.ok ? "done" : "error");
  }

  if (status === "done")
    return (
      <div className="glass flex items-center gap-3 rounded-3xl p-6" role="status">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
        <p>{t.forms.success}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="glass space-y-4 rounded-4xl p-6 md:p-8">
      {title && <h2 className="font-display text-2xl font-semibold">{title}</h2>}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="qi-name">{t.forms.name}</label>
          <input id="qi-name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="qi-email">{t.forms.email}</label>
          <input id="qi-email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="qi-phone">{t.forms.phone}</label>
          <input id="qi-phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="qi-company">{t.forms.company}</label>
          <input id="qi-company" name="company" className="input" autoComplete="organization" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="qi-message">{t.forms.message}</label>
        <textarea id="qi-message" name="message" rows={4} className="input resize-none" defaultValue={`I'm interested in ${subject}.`} />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === "loading" ? t.common.sending : t.common.submit}
      </Button>
      {status === "error" && <p className="text-sm text-red-500">{t.forms.error}</p>}
    </form>
  );
}
