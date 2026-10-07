"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const BUDGETS = ["< $3k", "$3k – $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure yet"];
const TIMELINES = ["ASAP", "1 – 3 months", "3 – 6 months", "6+ months", "Flexible"];
const STEPS = ["Service", "Budget", "Timeline", "Details"];

type Props = { services: string[]; products: string[]; initialService?: string; initialMessage?: string };

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border p-4 text-left font-medium transition-all duration-300",
        active ? "border-purple bg-purple/10 shadow-glow" : "border-line/15 bg-surface/40 hover:border-purple/50",
      )}
    >
      {children}
      <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition", active ? "border-transparent bg-brand text-white" : "border-line/30")}>
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

export function ContactWizard({ services, products, initialService = "", initialMessage = "" }: Props) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({ service: initialService, budget: "", timeline: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const canNext = [data.service, data.budget, data.timeline][step] !== "";
  const go = (d: number) => {
    setDir(d);
    setStep((s) => s + d);
  };
  const pick = (key: keyof typeof data, value: string) => {
    setData((x) => ({ ...x, [key]: value }));
    setTimeout(() => go(1), 250);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(fd), ...data, source: "inquiry" }),
    }).catch(() => null);
    setStatus(res?.ok ? "done" : "error");
  }

  if (status === "done")
    return (
      <div className="glass flex flex-col items-center rounded-4xl p-10 text-center" role="status">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-glow">
          <CheckCircle2 className="h-8 w-8" />
        </motion.span>
        <h3 className="mt-6 font-display text-2xl font-semibold">{t.forms.success}</h3>
      </div>
    );

  const options = [[...services, ...products.map((p) => `Product: ${p}`), "Something else"], BUDGETS, TIMELINES];
  const keys = ["service", "budget", "timeline"] as const;

  return (
    <div className="glass overflow-hidden rounded-4xl">
      <div className="border-b border-line/10 p-6 md:px-8">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition", i <= step ? "bg-brand text-white" : "bg-line/10 text-muted")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-sm font-medium sm:block", i === step ? "text-fg" : "text-muted")}>{s}</span>
              {i < STEPS.length - 1 && (
                <span className="relative h-0.5 flex-1 overflow-hidden rounded bg-line/10">
                  <motion.span className="absolute inset-y-0 left-0 bg-brand" animate={{ width: i < step ? "100%" : "0%" }} />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="relative min-h-[420px] p-6 md:p-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step < 3 ? (
              <>
                <h3 className="mb-5 font-display text-2xl font-semibold">
                  {["What can we help you with?", "What's your budget?", "When do you want to launch?"][step]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {options[step].map((o) => (
                    <Option key={o} active={data[keys[step]] === o} onClick={() => pick(keys[step], o)}>
                      {o}
                    </Option>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display text-2xl font-semibold">How can we reach you?</h3>
                <p className="text-sm text-muted">
                  {data.service} · {data.budget} · {data.timeline}
                </p>
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="cw-name">{t.forms.name} *</label>
                    <input id="cw-name" name="name" required className="input" autoComplete="name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="cw-email">{t.forms.email} *</label>
                    <input id="cw-email" name="email" type="email" required className="input" autoComplete="email" />
                  </div>
                  <div>
                    <label className="label" htmlFor="cw-phone">{t.forms.phone}</label>
                    <input id="cw-phone" name="phone" type="tel" className="input" autoComplete="tel" />
                  </div>
                  <div>
                    <label className="label" htmlFor="cw-company">{t.forms.company}</label>
                    <input id="cw-company" name="company" className="input" autoComplete="organization" />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="cw-message">{t.forms.message}</label>
                  <textarea id="cw-message" name="message" rows={4} defaultValue={initialMessage} className="input resize-none" />
                </div>
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status === "loading" ? t.common.sending : t.common.submit}
                </Button>
                {status === "error" && <p className="text-sm text-red-500">{t.forms.error}</p>}
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between border-t border-line/10 p-4 md:px-8">
        <button type="button" onClick={() => go(-1)} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:text-fg disabled:opacity-0">
          <ArrowLeft className="h-4 w-4" /> {t.common.back}
        </button>
        {step < 3 && (
          <button type="button" onClick={() => go(1)} disabled={!canNext} className="inline-flex items-center gap-2 rounded-full bg-purple/10 px-4 py-2 text-sm font-semibold text-purple transition hover:bg-purple/20 disabled:opacity-40 dark:text-purple-300">
            {t.common.next} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
