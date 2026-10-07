import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { ChatDock } from "@/components/widgets/ChatDock";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <a href="#main" className="sr-only z-[100] rounded-full bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <IntroLoader />
      <Navbar />
      <main id="main" className="relative overflow-x-clip">
        {children}
      </main>
      <Footer />
      <ChatDock />
      <CustomCursor />
      <PageTransition />
    </SmoothScroll>
  );
}
