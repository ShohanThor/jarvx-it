import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/** Gate /admin and /api/admin behind a valid session (pages re-check server-side too) */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("jx_admin")?.value;
  let ok = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), { algorithms: ["HS256"] });
      ok = true;
    } catch {}
  }
  if (ok) {
    const res = NextResponse.next();
    res.headers.set("x-robots-tag", "noindex, nofollow");
    return res;
  }
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
