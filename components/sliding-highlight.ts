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
 * moving between items, it slides. Hover is mouse and pen only. `rest`
 * gives it a home to glide back to when the pointer leaves (the navbar's
 * current section).
 */
export function useSlidingHighlight<T extends HTMLElement>(itemSelector: string) {
  const container = useRef<T>(null);
  const highlight = useRef<HTMLSpanElement>(null);
  const resting = useRef<HTMLElement | null>(null);
  const hovering = useRef(false);

  const place = (item: HTMLElement | null) => {
    const el = highlight.current;
    if (!el) return;
    if (!item) {
      el.dataset.on = "false";
      return;
    }
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

  const onPointerOver = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    const root = container.current;
    const item = (event.target as Element).closest<HTMLElement>(itemSelector);
    if (!root || !item || !root.contains(item)) return;
    hovering.current = true;
    place(item);
  };

  const onPointerLeave = () => {
    hovering.current = false;
    place(resting.current);
  };

  /** Where the highlight sits when nothing is hovered (null: hidden). */
  const rest = (item: HTMLElement | null) => {
    resting.current = item;
    if (!hovering.current) place(item);
  };

  return { container, highlight, onPointerOver, onPointerLeave, rest };
}
