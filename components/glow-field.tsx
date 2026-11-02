"use client";

import { useEffect } from "react";

/** How far outside a panel (px) the pointer still lights its border. */
const PROXIMITY = 72;

/**
 * Pointer driver for every `[data-glow]` panel (the `.glow-panel` CSS in
 * app/globals.css). Adapted from Aceternity UI's Glowing Effect and Card
 * Spotlight (ui.aceternity.com/components/glowing-effect, /card-spotlight),
 * without their per-card listeners or the `motion` dependency.
 *
 * One passive pointermove/scroll listener, throttled to a frame, updates
 * only the panels on screen (an IntersectionObserver keeps that set):
 * --glow-active lights the border arc while the pointer is near, and
 * --glow-start is the arc's angle toward the pointer, unwrapped so the
 * CSS transition always turns the short way round. Inside a panel,
 * --mx/--my place the spotlight wash. The panels stay server components;
 * this writes CSS variables only and never re-renders. Mouse only: on
 * touch screens the effect stays off.
 */
export function GlowField() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const panels = document.querySelectorAll<HTMLElement>("[data-glow]");
    const visible = new Set<HTMLElement>();
    const angles = new WeakMap<HTMLElement, number>();
    let x = -1e5;
    let y = -1e5;
    let frame = 0;

    const off = (el: HTMLElement) => {
      el.style.setProperty("--glow-active", "0");
      el.style.setProperty("--glow-hover", "0");
    };

    const update = () => {
      frame = 0;
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        const near =
          x > r.left - PROXIMITY && x < r.right + PROXIMITY && y > r.top - PROXIMITY && y < r.bottom + PROXIMITY;
        if (!near) {
          off(el);
          continue;
        }
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        el.style.setProperty("--glow-active", "1");
        el.style.setProperty("--glow-hover", inside ? "1" : "0");
        if (inside) {
          el.style.setProperty("--mx", `${Math.round(x - r.left)}px`);
          el.style.setProperty("--my", `${Math.round(y - r.top)}px`);
        }
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Right at the centre the angle is noise; hold the last one.
        if (Math.hypot(x - cx, y - cy) < Math.min(r.width, r.height) * 0.08) continue;
        const target = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
        const prev = angles.get(el) ?? target;
        const next = prev + ((((target - prev) % 360) + 540) % 360) - 180;
        angles.set(el, next);
        el.style.setProperty("--glow-start", next.toFixed(1));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visible.add(el);
          } else {
            visible.delete(el);
            off(el);
          }
        }
        schedule();
      },
      { rootMargin: `${PROXIMITY}px` },
    );
    panels.forEach((el) => observer.observe(el));

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      x = event.clientX;
      y = event.clientY;
      schedule();
    };
    const onLeave = () => {
      x = -1e5;
      y = -1e5;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
