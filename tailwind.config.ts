import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        navy: { DEFAULT: "#0D2B7E", 50: "#EEF1FB", 100: "#D5DCF3", 400: "#3A5BC0", 600: "#0D2B7E", 800: "#081B52" },
        purple: { DEFAULT: "#7C3AED", 300: "#B794F6", 400: "#9F67FF", 500: "#7C3AED", 600: "#6A2BD6" },
        indigo: { DEFAULT: "#3B2FA0" },
        slate: { brand: "#5E6B78" },
        ink: "#070B1F",
        mist: "#F7F6FD",
        // theme-aware tokens (see globals.css)
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-bangla)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "var(--font-bangla)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        brand: "linear-gradient(135deg, #3B2FA0 0%, #7C3AED 100%)",
        "brand-r": "linear-gradient(90deg, #3B2FA0 0%, #7C3AED 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,58,237,.25), 0 10px 40px -10px rgba(124,58,237,.55)",
        "glow-lg": "0 0 80px -10px rgba(124,58,237,.6)",
        glass: "0 8px 32px -8px rgba(7,11,31,.25)",
      },
      borderRadius: { "4xl": "2rem" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shine: { from: { transform: "translateX(-120%) skewX(-20deg)" }, to: { transform: "translateX(220%) skewX(-20deg)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        shine: "shine .9s ease",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
