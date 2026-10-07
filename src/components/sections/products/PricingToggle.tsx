"use client";

import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/LangProvider";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";
const BillingContext = createContext<{ billing: Billing; setBilling: (b: Billing) => void }>({ billing: "monthly", setBilling: () => {} });
export const useBilling = () => useContext(BillingContext);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  return <BillingContext.Provider value={{ billing, setBilling }}>{children}</BillingContext.Provider>;
}

export function PricingToggle({ className }: { className?: string }) {
  const { billing, setBilling } = useBilling();
  const { t } = useLang();
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div className="glass relative inline-flex rounded-full p-1" role="radiogroup" aria-label="Billing period">
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={billing === b}
            onClick={() => setBilling(b)}
            className={cn("relative h-10 rounded-full px-5 text-sm font-semibold transition-colors", billing === b ? "text-white" : "text-muted hover:text-fg")}
          >
            {billing === b && <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{t.common[b]}</span>
          </button>
        ))}
      </div>
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">{t.common.save}</span>
    </div>
  );
}

/** Animated price that follows the billing toggle */
export function Price({ monthly, yearly, className }: { monthly: number; yearly: number; className?: string }) {
  const { billing } = useBilling();
  const { t } = useLang();
  const value = billing === "monthly" ? monthly : yearly;
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <motion.span key={`${billing}-${value}`} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-4xl font-bold">
        ${value.toLocaleString("en-US")}
      </motion.span>
      <span className="text-sm text-muted">{billing === "monthly" ? t.common.perMonth : t.common.perYear}</span>
    </span>
  );
}
