"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Tip = { x: number; y: number; text: string };

function tipFor(target: EventTarget | null): Tip | null {
  if (!(target instanceof Element)) return null;
  const text = target.getAttribute("data-tip");
  if (!text) return null;
  const rect = target.getBoundingClientRect();
  const x = Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90);
  return { x, y: rect.top - 8, text };
}

/**
 * GitHub-style tooltip for the contribution heatmap. Event delegation: any
 * descendant carrying data-tip gets a tooltip above it.
 *
 * Mouse: shows on hover, hides on leave. Touch: a tap shows it and it stays
 * after the finger lifts (hiding on pointerleave would make the reader hold
 * the press, which on phones starts text selection and the magnifier); it
 * hides on a tap elsewhere or on any scroll, since a fixed tooltip would
 * otherwise drift away from its cell.
 *
 * Portaled to <body>: a transformed ancestor (the panel's scroll-reveal
 * animation) would otherwise become the containing block of a fixed
 * element and push the tooltip off-screen.
 */
export function HeatmapTooltip({ children }: { children: React.ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tip) return;
    const hide = () => setTip(null);
    const hideOutside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setTip(null);
    };
    window.addEventListener("scroll", hide, { passive: true, once: true });
    document.addEventListener("pointerdown", hideOutside);
    return () => {
      window.removeEventListener("scroll", hide);
      document.removeEventListener("pointerdown", hideOutside);
    };
  }, [tip]);

  return (
    <div
      ref={ref}
      onPointerOver={(e) => {
        if (e.pointerType !== "touch") setTip(tipFor(e.target));
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") setTip(null);
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") setTip(tipFor(e.target));
      }}
      onScrollCapture={() => setTip(null)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      {tip
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full border border-line-strong bg-raised px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap text-ink"
              style={{ left: tip.x, top: tip.y }}
            >
              {tip.text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
