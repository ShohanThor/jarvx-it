"use client";

import { useState } from "react";
import { CheckCircle2, FileUp, Loader2, Send } from "lucide-react";
import { useLang } from "@/components/providers/LangProvider";
import { Button } from "@/components/ui/Button";

const MAX_MB = 5;

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cv = fd.get("cv") as File | null;
    if (!cv || cv.size === 0) return setError("Please attach your CV (PDF or Word).");
    if (cv.size > MAX_MB * 1024 * 1024) return setError(`CV must be smaller than ${MAX_MB} MB.`);
    fd.set("jobId", jobId);
    setError("");
    setStatus("loading");
    const res = await fetch("/api/apply", { method: "POST", body: fd }).catch(() => null);
    if (res?.ok) setStatus("done");
    else {
      setStatus("error");
      setError((await res?.json().catch(() => null))?.error ?? t.forms.error);
    }
  }

  if (status === "done")
    return (
      <div className="glass flex items-start gap-3 rounded-4xl p-8" role="status">
        <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" />
        <div>
          <p className="font-display text-xl font-semibold">Application received!</p>
          <p className="mt-1 text-muted">Thanks for applying for {jobTitle}. Our team will review your profile and get back to you soon.</p>
        </div>
      </div>
    );

  return (
    <form onSubmit={submit} className="glass space-y-4 rounded-4xl p-6 md:p-8" encType="multipart/form-data">
      <h2 className="font-display text-2xl font-semibold">Apply for this role</h2>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ap-name">{t.forms.name} *</label>
          <input id="ap-name" name="name" required className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="ap-email">{t.forms.email} *</label>
          <input id="ap-email" name="email" type="email" required className="input" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="ap-phone">{t.forms.phone}</label>
          <input id="ap-phone" name="phone" type="tel" className="input" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="ap-linkedin">LinkedIn</label>
          <input id="ap-linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="ap-portfolio">Portfolio / GitHub</label>
        <input id="ap-portfolio" name="portfolio" type="url" placeholder="https://github.com/…" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="ap-cover">Why you? (cover letter)</label>
        <textarea id="ap-cover" name="coverLetter" rows={5} className="input resize-none" />
      </div>
      <div>
        <span className="label">CV *</span>
        <label
          htmlFor="ap-cv"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-purple/30 bg-purple/5 px-6 py-8 text-center transition hover:border-purple/60 hover:bg-purple/10"
        >
          <FileUp className="h-7 w-7 text-purple" />
          <span className="font-medium">{fileName || "Upload your CV"}</span>
          <span className="text-xs text-muted">PDF, DOC or DOCX · max {MAX_MB} MB</span>
        </label>
        <input
          id="ap-cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        />
      </div>
      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === "loading" ? t.common.sending : t.common.apply}
      </Button>
    </form>
  );
}
