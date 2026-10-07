import { ImageResponse } from "next/og";
import { J_PATH, X_PATH } from "@/components/brand/logo-paths";

export const runtime = "edge";

/** Dynamic, per-page Open Graph image: /api/og?title=...&subtitle=... */
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "JarvX IT").slice(0, 90);
  const subtitle = (searchParams.get("subtitle") || "Custom software, web & mobile apps and AI solutions").slice(0, 150);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#070B1F",
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(124,58,237,.55), transparent 45%), radial-gradient(circle at 10% 100%, rgba(59,47,160,.6), transparent 50%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="84" height="66" viewBox="0 0 120 94" fill="none">
            <defs>
              <linearGradient id="g" x1="10" y1="88" x2="110" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#3B2FA0" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <path d={J_PATH} stroke="url(#g)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            <path d={X_PATH} stroke="#3A5BC0" strokeWidth="15" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            <span>Jarv</span>
            <span style={{ color: "#9F67FF" }}>X</span>
            <span style={{ color: "#9AA6B4", marginLeft: 10, fontWeight: 500 }}>IT</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: title.length > 45 ? 60 : 74, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,.72)", lineHeight: 1.35 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "rgba(255,255,255,.6)" }}>
          <span>jarvxit.com</span>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, immutable" } },
  );
}
