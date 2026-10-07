"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

/** Tiny safe renderer for **bold**, links and "- " bullet lines (no HTML injection) */
function RichText({ text }: { text: string }) {
  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (/^https?:\/\//.test(part)) {
        const href = part.replace(/[.,]$/, "");
        const internal = href.startsWith(site.url);
        return (
          <a key={i} href={internal ? href.slice(site.url.length) || "/" : href} className="font-medium text-purple underline underline-offset-2" {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
            {internal ? href.slice(site.url.length) || "/" : href}
          </a>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, i) =>
        /^\s*[-*]\s+/.test(line) ? (
          <div key={i} className="flex gap-2">
            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
            <span>{inline(line.replace(/^\s*[-*]\s+/, ""))}</span>
          </div>
        ) : line.trim() ? (
          <p key={i}>{inline(line)}</p>
        ) : null,
      )}
    </div>
  );
}

const WhatsAppIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.41" />
  </svg>
);
const MessengerIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 0C5.24 0 0 4.95 0 11.64c0 3.5 1.43 6.52 3.77 8.61.2.18.31.42.32.68l.06 2.13a.96.96 0 0 0 1.35.85l2.38-1.05a.96.96 0 0 1 .64-.05c1.09.3 2.26.46 3.48.46 6.76 0 12-4.95 12-11.64C24 4.95 18.76 0 12 0m7.2 8.96-3.52 5.6a1.8 1.8 0 0 1-2.6.48l-2.8-2.1a.72.72 0 0 0-.87 0l-3.79 2.87c-.5.38-1.16-.22-.83-.76l3.52-5.6a1.8 1.8 0 0 1 2.6-.48l2.8 2.1c.26.2.61.2.87 0l3.79-2.87c.5-.38 1.16.22.83.76" />
  </svg>
);

export function ChatDock() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next }) });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: t.forms.error }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={t.chat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass flex h-[min(560px,calc(100dvh-7rem))] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl shadow-glass"
          >
            <header className="flex items-center gap-3 bg-brand px-4 py-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold leading-tight">{t.chat.title}</p>
                <p className="text-xs text-white/70">AI · {site.name}</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label={t.nav.close}>
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" data-lenis-prevent aria-live="polite">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-purple/10 px-3.5 py-2.5">{t.chat.greeting}</div>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed",
                    m.role === "user" ? "ml-auto rounded-tr-sm bg-brand text-white" : "rounded-tl-sm bg-purple/10",
                  )}
                >
                  {m.content ? (
                    <RichText text={m.content} />
                  ) : (
                    <span className="flex gap-1 py-1" aria-label="typing">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </span>
                  )}
                </div>
              ))}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.chat.suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-full border border-purple/30 px-3 py-1.5 text-xs text-fg/80 transition hover:bg-purple/10">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line/10 p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t.chat.placeholder}
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                maxLength={1000}
                className="min-w-0 flex-1 rounded-full bg-surface/60 px-4 py-2.5 text-sm outline-none ring-purple/30 focus:ring-2"
              />
              <button type="submit" disabled={busy || !input.trim()} className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white disabled:opacity-50" aria-label="Send">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-2.5">
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
        <a
          href={`https://m.me/${site.messenger}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on Messenger"
          className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#00B2FF] to-[#A033FF] text-white shadow-lg transition hover:scale-110"
        >
          <MessengerIcon className="h-6 w-6" />
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.chat.title}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-glow transition hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-purple/40 [animation-duration:2.5s]" aria-hidden />
          {open ? <X className="relative h-6 w-6" /> : <Bot className="relative h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
