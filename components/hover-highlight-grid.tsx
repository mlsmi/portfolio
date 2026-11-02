"use client";

import { useSlidingHighlight } from "@/components/sliding-highlight";

/**
 * Card Hover Effect, adapted from Aceternity UI
 * (ui.aceternity.com/components/card-hover-effect) without `motion`: a
 * single cyan halo slides and resizes onto whichever `[data-hover-tile]`
 * child the pointer is over. The tiles stay server-rendered; they need
 * their own background and `position: relative` to sit above the halo.
 */
export function HoverHighlightGrid({ className, children }: { className: string; children: React.ReactNode }) {
  const { container, highlight, onPointerOver, onPointerLeave } =
    useSlidingHighlight<HTMLDivElement>("[data-hover-tile]");

  return (
    <div ref={container} className={`relative ${className}`} onPointerOver={onPointerOver} onPointerLeave={onPointerLeave}>
      <span
        ref={highlight}
        aria-hidden
        className="slide-hl -m-1.5 box-content border border-accent/25 bg-accent-soft p-1.5 shadow-[0_0_40px_-12px_rgb(103_224_244/0.45)]"
      />
      {children}
    </div>
  );
}
