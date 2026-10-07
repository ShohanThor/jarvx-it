import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "jx_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function authKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(secret);
}

export type Session = { sub: string; email: string };

export async function createSession(user: { id: string; email: string }) {
  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(authKey());
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, authKey(), { algorithms: ["HS256"] });
    return { sub: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  return s;
}

export function destroySession() {
  cookies().delete(SESSION_COOKIE);
}
