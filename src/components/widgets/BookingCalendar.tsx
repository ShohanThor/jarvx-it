"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { Button } from "@/components/ui/Button";
import { DHAKA_OFFSET_MIN, SLOT_HOURS, WORK_DAYS, dhakaSlot } from "@/lib/booking";
import { cn } from "@/lib/utils";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Pick a day and a 30-minute video-call slot (Dhaka business hours) */
export function BookingCalendar() {
  const { t, lang } = useLang();
  const today = useMemo(() => {
    const d = new Date(Date.now() + DHAKA_OFFSET_MIN * 60_000);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() };
  }, []);
  const [view, setView] = useState({ y: today.y, m: today.m });
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const key = `${view.y}-${String(view.m + 1).padStart(2, "0")}`;
    fetch(`/api/bookings?month=${key}`)
      .then((r) => (r.ok ? r.json() : { taken: [] }))
      .then((j) => setTaken(j.taken ?? []))
      .catch(() => setTaken([]));
  }, [view]);

  const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
  const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const isPast = (d: number) => view.y < today.y || (view.y === today.y && (view.m < today.m || (view.m === today.m && d < today.d)));
  const available = (d: number) => !isPast(d) && WORK_DAYS.includes(new Date(Date.UTC(view.y, view.m, d)).getUTCDay());
  const canPrev = view.y > today.y || view.m > today.m;
  const monthLabel = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const slots = day
    ? SLOT_HOURS.map((h) => dhakaSlot(view.y, view.m, day, h)).filter((s) => s.getTime() > Date.now() + 2 * 3600_000 && !taken.includes(s.toISOString()))
    : [];

  const shift = (n: number) => {
    setDay(null);
    setSlot(null);
    setView((v) => {
      const m = v.m + n;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slot) return;
    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(fd), source: "booking", meetingAt: slot.toISOString(), service: "Discovery call" }),
    }).catch(() => null);
    if (res?.ok) setStatus("done");
    else {
      setStatus("error");
      setError((await res?.json().catch(() => null))?.error ?? t.forms.error);
    }
  }

  if (status === "done" && slot)
    return (
      <div className="glass flex flex-col items-center rounded-4xl p-10 text-center" role="status">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-glow">
          <CalendarCheck className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold">Meeting requested!</h3>
        <p className="mt-2 text-muted">
          {slot.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })} (your time). We&apos;ll email you a calendar invite.
        </p>
      </div>
    );

  return (
    <div className="glass grid gap-6 rounded-4xl p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">{monthLabel}</p>
          <div className="flex gap-1">
            <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="grid h-9 w-9 place-items-center rounded-full hover:bg-purple/10 disabled:opacity-30" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => shift(1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-purple/10" aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
          {DOW.map((d) => (
            <span key={d} className="py-2">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel}>
          {Array.from({ length: first }, (_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
            const ok = available(d);
            return (
              <button
                key={d}
                type="button"
                disabled={!ok}
                onClick={() => {
                  setDay(d);
                  setSlot(null);
                }}
                aria-pressed={day === d}
                className={cn(
                  "aspect-square rounded-xl text-sm font-medium transition",
                  day === d ? "bg-brand text-white shadow-glow" : ok ? "hover:bg-purple/15" : "text-muted/40",
                  ok && day !== d && "bg-purple/5",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">Sunday–Thursday · 30-minute video call · times shown in your timezone</p>
      </div>

      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          {!day ? (
            <motion.p key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="m-auto text-center text-muted">
              Pick a day to see available times.
            </motion.p>
          ) : (
            <motion.div key={day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
              <p className="mb-3 font-semibold">Available times</p>
              {slots.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.toISOString()}
                      type="button"
                      onClick={() => setSlot(s)}
                      aria-pressed={slot?.getTime() === s.getTime()}
                      className={cn("rounded-xl border px-3 py-2.5 text-sm font-medium transition", slot?.getTime() === s.getTime() ? "border-transparent bg-brand text-white" : "border-line/15 hover:border-purple")}
                    >
                      {s.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No free slots on this day.</p>
              )}
              {slot && (
                <form onSubmit={submit} className="mt-5 space-y-3">
                  <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <label className="sr-only" htmlFor="bk-name">{t.forms.name}</label>
                  <input id="bk-name" name="name" required placeholder={t.forms.name} className="input" autoComplete="name" />
                  <label className="sr-only" htmlFor="bk-email">{t.forms.email}</label>
                  <input id="bk-email" name="email" type="email" required placeholder={t.forms.email} className="input" autoComplete="email" />
                  <label className="sr-only" htmlFor="bk-msg">{t.forms.message}</label>
                  <input id="bk-msg" name="message" placeholder="What would you like to discuss?" className="input" />
                  <Button type="submit" className="w-full" magnetic={false} disabled={status === "loading"}>
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
                    Book meeting
                  </Button>
                  {status === "error" && <p className="text-sm text-red-500">{error}</p>}
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
