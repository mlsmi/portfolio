"use client";

import { useRef } from "react";

/**
 * One highlight element that glides onto whichever item the pointer is
 * over (the `.slide-hl` CSS in app/globals.css). Adapted from Aceternity
 * UI's Card Hover Effect and the Resizable Navbar's hover pill, which use
 * motion's shared layout; here it is the element's transform and size,
 * written straight to the DOM from delegated pointer events, so the items
 * can stay server-rendered and nothing re-renders.
 *
 * The container must be the items' offsetParent (position: relative).
 * Arriving from outside, the highlight appears in place and fades in;
 * moving between items, it slides. Mouse and pen only.
 */
export function useSlidingHighlight<T extends HTMLElement>(itemSelector: string) {
  const container = useRef<T>(null);
  const highlight = useRef<HTMLSpanElement>(null);

  const onPointerOver = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    const root = container.current;
    const el = highlight.current;
    const item = (event.target as Element).closest<HTMLElement>(itemSelector);
    if (!root || !el || !item || !root.contains(item)) return;

    const arriving = el.dataset.on !== "true";
    if (arriving) el.style.transition = "none";
    el.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`;
    el.style.width = `${item.offsetWidth}px`;
    el.style.height = `${item.offsetHeight}px`;
    if (arriving) {
      void el.offsetWidth; // commit the jump before transitions return
      el.style.transition = "";
    }
    el.dataset.on = "true";
  };

  const onPointerLeave = () => {
    if (highlight.current) highlight.current.dataset.on = "false";
  };

  return { container, highlight, onPointerOver, onPointerLeave };
}
