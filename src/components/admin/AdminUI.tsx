"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  BriefcaseBusiness, FileText, FolderKanban, Gauge, HelpCircle, Image as ImageIcon, Inbox, LogOut, Mail, MessageSquareQuote,
  Package, BarChart3, Settings, Users, UserSquare2, Wrench, Loader2, Upload, X, Trash2, ExternalLink,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { login, logout, saveRecord, changePassword, type FormState } from "@/lib/admin/actions";
import type { Field } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

/* ---------- shared ---------- */

export function SubmitButton({ children, className, variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "danger" | "ghost" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-60",
        variant === "primary" && "bg-brand text-white shadow-glow hover:shadow-glow-lg",
        variant === "danger" && "bg-red-500/10 text-red-500 hover:bg-red-500/20",
        variant === "ghost" && "border border-line/15 hover:border-purple/50",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ConfirmSubmit({ label = "Delete", message = "Delete this item permanently?" }: { label?: string; message?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4" /> {label}
    </button>
  );
}

/* ---------- login ---------- */

export function LoginForm() {
  const [state, action] = useFormState<FormState, FormData>(login, {});
  return (
    <form action={action} className="glass w-full max-w-sm space-y-4 rounded-4xl p-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <LogoMark className="h-12 w-auto" />
        <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {state.error && <p className="text-sm text-red-500" role="alert">{state.error}</p>}
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}

/* ---------- sidebar ---------- */

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: Gauge },
  { href: "/admin/leads", label: "Leads", Icon: Inbox },
  { href: "/admin/applications", label: "Applications", Icon: UserSquare2 },
  { href: "/admin/subscribers", label: "Subscribers", Icon: Mail },
  { section: "Content" },
  { href: "/admin/services", label: "Services", Icon: Wrench },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/projects", label: "Portfolio", Icon: FolderKanban },
  { href: "/admin/posts", label: "Blog", Icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/clients", label: "Client logos", Icon: ImageIcon },
  { href: "/admin/stats", label: "Stats", Icon: BarChart3 },
  { href: "/admin/team", label: "Team", Icon: Users },
  { href: "/admin/faqs", label: "FAQ", Icon: HelpCircle },
  { href: "/admin/jobs", label: "Jobs", Icon: BriefcaseBusiness },
  { section: "Account" },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
] as const;

export function Sidebar({ email, counts }: { email: string; counts: { leads: number; applications: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="glass fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-semibold lg:hidden" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <aside
        className={cn(
          "glass fixed inset-y-3 left-3 z-40 flex w-64 flex-col rounded-4xl p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-[110%]",
        )}
      >
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 pt-2">
          <LogoMark className="h-7 w-auto" />
          <Wordmark className="text-lg" />
          <span className="ml-auto rounded-full bg-purple/15 px-2 py-0.5 text-[10px] font-bold uppercase text-purple">CMS</span>
        </Link>
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {NAV.map((item, i) =>
            "section" in item ? (
              <p key={i} className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                {item.section}
              </p>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                  (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)) ? "bg-brand text-white" : "text-fg/75 hover:bg-purple/10",
                )}
              >
                <item.Icon className="h-4 w-4" />
                {item.label}
                {item.href === "/admin/leads" && counts.leads > 0 && <span className="ml-auto rounded-full bg-red-500 px-2 text-[11px] font-bold text-white">{counts.leads}</span>}
                {item.href === "/admin/applications" && counts.applications > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 text-[11px] font-bold text-white">{counts.applications}</span>
                )}
              </Link>
            ),
          )}
        </nav>
        <div className="mt-4 border-t border-line/10 pt-4">
          <p className="truncate px-3 text-xs text-muted">{email}</p>
          <div className="mt-2 flex gap-2">
            <a href="/" target="_blank" className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line/15 py-2 text-xs font-semibold hover:border-purple/50">
              <ExternalLink className="h-3.5 w-3.5" /> Site
            </a>
            <form action={logout} className="flex-1">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-full border border-line/15 py-2 text-xs font-semibold hover:border-red-500/50 hover:text-red-500">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- image upload ---------- */

function ImageInput({ name, defaultValue, multiple }: { name: string; defaultValue: string; multiple?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const urls = value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    const uploaded: string[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.set("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.url) uploaded.push(j.url);
      else setErr(j.error ?? "Upload failed");
    }
    setValue((v) => (multiple ? [...v.split(/\r?\n/).filter(Boolean), ...uploaded].join("\n") : (uploaded[0] ?? v)));
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((u) => (
            <div key={u} className="group relative h-20 w-28 overflow-hidden rounded-xl border border-line/15 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setValue(urls.filter((x) => x !== u).join("\n"))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      {multiple ? (
        <textarea name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={3} className="input font-mono text-xs" placeholder="One image URL per line" />
      ) : (
        <input name={name} value={value} onChange={(e) => setValue(e.target.value)} className="input" placeholder="/media/... or https://..." />
      )}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-line/15 px-4 py-2 text-xs font-semibold hover:border-purple/50">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Upload {multiple ? "images" : "image"}
        </button>
        <span className="text-xs text-muted">Converted to WebP automatically</span>
        {err && <span className="text-xs text-red-500">{err}</span>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => upload(e.target.files)} />
    </div>
  );
}

/* ---------- generic record form ---------- */

export function RecordForm({ resourceKey, id, fields, values }: { resourceKey: string; id: string | null; fields: Field[]; values: Record<string, string | boolean> }) {
  const [state, action] = useFormState<FormState, FormData>(saveRecord.bind(null, resourceKey, id), {});
  return (
    <form action={action} className="space-y-6">
      <div className="glass grid gap-5 rounded-4xl p-6 md:grid-cols-2 md:p-8">
        {fields.map((f) => {
          const v = values[f.name];
          const err = state.fieldErrors?.[f.name];
          const wide = ["textarea", "markdown", "list", "json", "images", "image"].includes(f.type);
          const id = `f-${f.name}`;
          return (
            <div key={f.name} className={cn(wide && "md:col-span-2")}>
              {f.type === "boolean" ? (
                <label className="flex cursor-pointer items-center gap-3 pt-6">
                  <input type="checkbox" name={f.name} defaultChecked={Boolean(v)} className="peer sr-only" />
                  <span className="relative h-6 w-11 rounded-full bg-line/20 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-purple peer-checked:after:translate-x-5" />
                  <span className="text-sm font-medium">{f.label}</span>
                </label>
              ) : (
                <>
                  <label className="label" htmlFor={id}>
                    {f.label} {f.required && <span className="text-purple">*</span>}
                  </label>
                  {f.type === "image" || f.type === "images" ? (
                    <ImageInput name={f.name} defaultValue={String(v ?? "")} multiple={f.type === "images"} />
                  ) : f.type === "select" ? (
                    <select id={id} name={f.name} defaultValue={String(v ?? "")} className="input">
                      {!f.required && <option value="">—</option>}
                      {f.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : ["textarea", "markdown", "list", "json"].includes(f.type) ? (
                    <textarea
                      id={id}
                      name={f.name}
                      defaultValue={String(v ?? "")}
                      rows={f.rows ?? (f.type === "json" ? 6 : 4)}
                      className={cn("input", (f.type === "json" || f.type === "markdown") && "font-mono text-xs leading-relaxed")}
                      placeholder={f.placeholder}
                    />
                  ) : (
                    <input id={id} name={f.name} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} defaultValue={String(v ?? "")} className="input" />
                  )}
                  {f.help && !err && <p className="mt-1 text-xs text-muted">{f.help}</p>}
                </>
              )}
              {err && <p className="mt-1 text-xs font-medium text-red-500">{err}</p>}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <SubmitButton>Save</SubmitButton>
        {state.error && <p className="text-sm text-red-500" role="alert">{state.error}</p>}
      </div>
    </form>
  );
}

/* ---------- settings ---------- */

export function PasswordForm() {
  const [state, action] = useFormState<FormState, FormData>(changePassword, {});
  return (
    <form action={action} className="glass max-w-md space-y-4 rounded-4xl p-6">
      <h2 className="font-display text-xl font-semibold">Change password</h2>
      <div>
        <label className="label" htmlFor="current">Current password</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="next">New password (10+ characters)</label>
        <input id="next" name="next" type="password" required minLength={10} autoComplete="new-password" className="input" />
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.fieldErrors?.ok && <p className="text-sm text-emerald-500">{state.fieldErrors.ok}</p>}
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
