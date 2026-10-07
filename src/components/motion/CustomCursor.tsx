"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], [data-cursor], input[type='submit'], label[for], summary";

/** Purple dot + trailing ring. Grows over links/cards; shows a label for [data-cursor="Drag"] etc. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
    };
    const over = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.(INTERACTIVE) as HTMLElement | null;
      const cursorLabel = target?.dataset.cursor ?? "";
      setLabel(cursorLabel.length > 1 ? cursorLabel : "");
      targetScale = target ? (cursorLabel.length > 1 ? 2.6 : 1.9) : 1;
      ring.current?.classList.toggle("is-hover", !!target);
    };
    const leave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };
    const down = () => (targetScale *= 0.8);
    const up = () => (targetScale /= 0.8);

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      scale += (targetScale - scale) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex h-9 w-9 items-center justify-center rounded-full border border-purple/70 opacity-0 transition-[background-color,border-color,opacity] duration-300 [&.is-hover]:border-purple [&.is-hover]:bg-purple/15"
      >
        {label && <span className="text-[7px] font-semibold uppercase tracking-widest text-purple-300">{label}</span>}
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-purple opacity-0 shadow-[0_0_12px_2px_rgba(124,58,237,.7)]" />
    </>
  );
}
