import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden px-5 pt-28 text-center">
      <div aria-hidden className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
      <div className="relative">
        <LogoMark className="mx-auto h-20 w-auto animate-float" />
        <p className="mt-8 font-display text-8xl font-bold text-gradient">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold">This page drifted into space</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/contact" variant="secondary">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
