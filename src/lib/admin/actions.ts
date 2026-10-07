"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { deleteCv } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { APPLICATION_STATUSES, LEAD_STATUSES, getResource, type Field } from "./resources";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

// Prisma delegates share a shape; index them by model name from the resource config
type Delegate = {
  create: (a: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (a: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (a: { where: { id: string } }) => Promise<unknown>;
};
// Compared against for unknown emails so response time does not reveal which accounts exist
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

const delegate = (model: string) => (db as unknown as Record<string, Delegate>)[model];

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  if (!rateLimit(`login:${clientIp()}`, 8, 15 * 60_000)) return { error: "Too many attempts. Try again in 15 minutes." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = await db.adminUser.findUnique({ where: { email } });
  // Always run a bcrypt compare to keep timing similar for unknown emails
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Invalid email or password." };
  await createSession(user);
  redirect("/admin");
}

export async function logout() {
  destroySession();
  redirect("/admin/login");
}

function parseField(f: Field, fd: FormData): { value?: unknown; error?: string } {
  const raw = fd.get(f.name);
  const str = typeof raw === "string" ? raw.trim() : "";
  switch (f.type) {
    case "boolean":
      return { value: raw === "on" };
    case "number": {
      if (!str) return f.required ? { error: "Required" } : { value: 0 };
      const n = Number(str);
      return Number.isFinite(n) ? { value: Math.round(n) } : { error: "Must be a number" };
    }
    case "list":
    case "images": {
      const items = str.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
      if (f.required && !items.length) return { error: "Required" };
      return { value: JSON.stringify(items) };
    }
    case "json": {
      if (!str) return { value: f.placeholder ?? "{}" };
      try {
        return { value: JSON.stringify(JSON.parse(str)) };
      } catch {
        return { error: "Invalid JSON" };
      }
    }
    case "date": {
      if (!str) return f.required ? { error: "Required" } : { value: f.name === "publishedAt" ? new Date() : null };
      const d = new Date(str);
      return isNaN(d.getTime()) ? { error: "Invalid date" } : { value: d };
    }
    case "slug": {
      const s = slugify(str);
      return !s && f.required ? { error: "Required" } : { value: s };
    }
    default:
      if (f.required && !str) return { error: "Required" };
      if (f.type === "select" && str && f.options && !f.options.includes(str)) return { error: "Invalid option" };
      return { value: str };
  }
}

export async function saveRecord(resourceKey: string, id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return { error: "Unknown resource" };
  const data: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};
  for (const f of res.fields) {
    const { value, error } = parseField(f, fd);
    if (error) fieldErrors[f.name] = error;
    else data[f.name] = value;
  }
  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  try {
    const model = delegate(res.model);
    if (id) await model.update({ where: { id }, data });
    else await model.create({ data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const target = String((e.meta?.target as string[] | undefined)?.join(", ") ?? "field");
      return { error: `Another record already uses this ${target}.`, fieldErrors: { [target.split(",")[0]]: "Must be unique" } };
    }
    console.error("[admin] save failed", e);
    return { error: "Could not save. Check the values and try again." };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${res.key}?saved=1`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  await requireAdmin();
  const res = getResource(resourceKey);
  if (!res) return;
  await delegate(res.model).delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`/admin/${res.key}?deleted=1`);
}

export async function updateLead(id: string, fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  await db.lead.update({
    where: { id },
    data: {
      ...(LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number]) ? { status } : {}),
      notes: String(fd.get("notes") ?? "").slice(0, 5000),
    },
  });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

export async function updateApplication(id: string, fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status"));
  await db.application.update({
    where: { id },
    data: {
      ...(APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number]) ? { status } : {}),
      notes: String(fd.get("notes") ?? "").slice(0, 5000),
    },
  });
  revalidatePath("/admin/applications");
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  const app = await db.application.delete({ where: { id } });
  await deleteCv(app.cvPath);
  revalidatePath("/admin/applications");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await db.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const s = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 10) return { error: "New password must be at least 10 characters." };
  const user = await db.adminUser.findUnique({ where: { id: s.sub } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is incorrect." };
  await db.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { error: undefined, fieldErrors: { ok: "Password updated." } };
}
