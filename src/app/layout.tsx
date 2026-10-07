import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers/Providers";
import { JsonLd } from "@/components/ui/JsonLd";
import { introScript } from "@/components/motion/IntroLoader";
import { getLang } from "@/lib/i18n/server";
import { organizationSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";

// Self-hosted fonts (no build-time network dependency)
const display = localFont({ src: "../fonts/space-grotesk-latin-wght-normal.woff2", weight: "300 700", variable: "--font-display", display: "swap" });
const body = localFont({ src: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", variable: "--font-body", display: "swap" });
const bangla = localFont({
  src: [
    { path: "../fonts/hind-siliguri-bengali-400-normal.woff2", weight: "400" },
    { path: "../fonts/hind-siliguri-bengali-600-normal.woff2", weight: "600" },
    { path: "../fonts/hind-siliguri-bengali-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-bangla",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Custom Software Company in Dhaka, Bangladesh`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["software company Bangladesh", "custom software development", "web development Dhaka", "mobile app development", "DevOps", "AI solutions", "resource augmentation", "QA testing"],
  authors: [{ name: site.name, url: site.url }],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070B1F" },
    { media: "(prefers-color-scheme: light)", color: "#F7F6FD" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${bangla.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <JsonLd data={organizationSchema()} />
      </head>
      <body>
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
