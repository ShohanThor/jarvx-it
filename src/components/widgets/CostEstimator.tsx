"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { Button } from "@/components/ui/Button";
import { ESTIMATOR, estimate, type Design, type Feature, type ProjectType, type Selection, type Timeline } from "@/lib/estimator";
import { cn } from "@/lib/utils";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all duration-300",
        active ? "border-transparent bg-brand text-white shadow-glow" : "border-line/15 bg-surface/50 text-fg/80 hover:border-purple/50",
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function Group({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-3 font-display text-lg font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-purple/15 text-sm text-purple dark:text-purple-300">{n}</span>
        {title}
      </legend>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

const money = (n: number, cur: "USD" | "BDT", lang: string) =>
  cur === "USD" ? `$${n.toLocaleString("en-US")}` : `৳${n.toLocaleString(lang === "bn" ? "bn-BD" : "en-IN")}`;

export function CostEstimator() {
  const { t, lang } = useLang();
  const e = t.estimator;
  const [sel, setSel] = useState<Selection>({ type: "webapp", features: ["auth", "admin"], design: "custom", timeline: "standard" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const result = useMemo(() => estimate(sel), [sel]);

  const toggleFeature = (f: Feature) =>
    setSel((s) => ({ ...s, features: s.features.includes(f) ? s.features.filter((x) => x !== f) : [...s.features, f] }));

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    setStatus("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "estimator",
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        service: e.types[sel.type],
        budget: `$${result.usd.low}–$${result.usd.high}`,
        timeline: e.timelines[sel.timeline],
        details: { ...sel, estimateUSD: result.usd, estimateBDT: result.bdt, weeks: result.weeks },
        website: fd.get("website"),
      }),
    }).catch(() => null);
    setStatus(res?.ok ? "done" : "error");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="glass space-y-8 rounded-4xl p-6 md:p-9">
        <Group n={1} title={e.step1}>
          {(Object.keys(ESTIMATOR.types) as ProjectType[]).map((k) => (
            <Chip key={k} active={sel.type === k} onClick={() => setSel((s) => ({ ...s, type: k }))}>
              {e.types[k]}
            </Chip>
          ))}
        </Group>
        <Group n={2} title={e.step2}>
          {(Object.keys(ESTIMATOR.features) as Feature[]).map((k) => (
            <Chip key={k} active={sel.features.includes(k)} onClick={() => toggleFeature(k)}>
              {e.features[k]}
            </Chip>
          ))}
        </Group>
        <Group n={3} title={e.step3}>
          {(Object.keys(ESTIMATOR.designs) as Design[]).map((k) => (
            <Chip key={k} active={sel.design === k} onClick={() => setSel((s) => ({ ...s, design: k }))}>
              {e.designs[k]}
            </Chip>
          ))}
        </Group>
        <Group n={4} title={e.step4}>
          {(Object.keys(ESTIMATOR.timelines) as Timeline[]).map((k) => (
            <Chip key={k} active={sel.timeline === k} onClick={() => setSel((s) => ({ ...s, timeline: k }))}>
              {e.timelines[k]}
            </Chip>
          ))}
        </Group>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="gradient-border is-active relative overflow-hidden rounded-4xl bg-gradient-to-br from-indigo/90 to-purple/90 p-7 text-white shadow-glow-lg md:p-9">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">{e.result}</p>
          <div aria-live="polite">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={`${result.usd.low}-${result.usd.high}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="mt-3 font-display text-4xl font-bold md:text-5xl"
              >
                {money(result.usd.low, "USD", lang)} – {money(result.usd.high, "USD", lang)}
              </motion.p>
            </AnimatePresence>
            <p className="mt-2 text-lg text-white/85">
              {money(result.bdt.low, "BDT", lang)} – {money(result.bdt.high, "BDT", lang)}
            </p>
            <p className="mt-1 text-sm text-white/70">≈ {result.weeks} weeks</p>
          </div>
          <p className="mt-5 text-sm text-white/75">{e.resultNote}</p>

          <div className="mt-6 rounded-3xl bg-white/10 p-5 backdrop-blur">
            {status === "done" ? (
              <p className="flex items-start gap-3 text-sm" role="status">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> {t.forms.success}
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <p className="font-display font-semibold">{e.getProposal}</p>
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <label className="sr-only" htmlFor="est-name">{t.forms.name}</label>
                <input id="est-name" name="name" required placeholder={t.forms.name} className="w-full rounded-2xl bg-white/90 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-brand focus:ring-4 focus:ring-white/30" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="sr-only" htmlFor="est-email">{t.forms.email}</label>
                  <input id="est-email" name="email" type="email" required placeholder={t.forms.email} className="w-full rounded-2xl bg-white/90 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-brand focus:ring-4 focus:ring-white/30" />
                  <label className="sr-only" htmlFor="est-phone">{t.forms.phone}</label>
                  <input id="est-phone" name="phone" type="tel" placeholder={t.forms.phone} className="w-full rounded-2xl bg-white/90 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-brand focus:ring-4 focus:ring-white/30" />
                </div>
                <Button type="submit" variant="white" className="w-full" magnetic={false} disabled={status === "loading"}>
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {status === "loading" ? t.common.sending : e.getProposal}
                </Button>
                {status === "error" && <p className="text-xs text-red-200">{t.forms.error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
