"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type Tip = { x: number; y: number; text: string };

/**
 * GitHub-style hover tooltip for the contribution heatmap. Event
 * delegation: any descendant carrying data-tip gets a tooltip above it.
 * Portaled to <body>: a transformed ancestor (the panel's scroll-reveal
 * animation) would otherwise become the containing block of a fixed
 * element and push the tooltip off-screen.
 */
export function HeatmapTooltip({ children }: { children: React.ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);

  function onOver(event: React.PointerEvent) {
    const target = event.target as Element;
    const text = target.getAttribute?.("data-tip");
    if (!text) {
      setTip(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90);
    setTip({ x, y: rect.top - 8, text });
  }

  return (
    <div onPointerOver={onOver} onPointerLeave={() => setTip(null)}>
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
