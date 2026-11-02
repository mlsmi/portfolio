"use client";

import { useEffect, useRef } from "react";

import type { MarqueeRow } from "@/lib/skills";

/** Resting drift in px per second. */
const BASE_SPEED = 38;
/** Copies per row: enough to cover any viewport while one copy wraps. */
const COPIES = 3;

/**
 * Scroll Based Velocity, adapted from Magic UI
 * (magicui.design/docs/components/scroll-based-velocity) without
 * `motion`: oversized rows drift in opposite directions, speed up with
 * scroll velocity and follow the scroll direction.
 *
 * One rAF loop, running only while the band is on screen and the tab is
 * visible, writes each track's transform; a track wraps after exactly one
 * copy's width, so it loops seamlessly. Decorative (every phrase is real
 * copy from elsewhere on the page), so the band is aria-hidden. Reduced
 * motion: the rows stand still.
 */
export function VelocityMarquee({ rows }: { rows: MarqueeRow[] }) {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = band.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(root.querySelectorAll<HTMLElement>("[data-track]"));
    const widths = tracks.map(() => 0);
    const offsets = tracks.map(() => 0);
    const measure = () =>
      tracks.forEach((track, i) => {
        widths[i] = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      });

    let frame = 0;
    let running = false;
    let last = 0;
    let lastY = window.scrollY;
    let boost = 0;
    let heading = 1;

    const tick = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 0;
      last = now;
      const y = window.scrollY;
      const velocity = dt > 0 ? (y - lastY) / dt : 0;
      lastY = y;
      if (Math.abs(velocity) > 30) heading = velocity > 0 ? 1 : -1;
      const target = Math.min(6, (Math.abs(velocity) / 1000) * 5);
      boost += (target - boost) * Math.min(1, dt * 5);
      tracks.forEach((track, i) => {
        const w = widths[i];
        if (!w) return;
        offsets[i] += rows[i].direction * heading * BASE_SPEED * (1 + boost) * dt;
        offsets[i] = ((offsets[i] % w) + w) % w;
        track.style.transform = `translate3d(${(-offsets[i]).toFixed(2)}px, 0, 0)`;
      });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.visibilityState !== "visible") return;
      running = true;
      last = 0;
      lastY = window.scrollY;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    measure();
    const resize = new ResizeObserver(measure);
    tracks.forEach((track) => track.firstElementChild && resize.observe(track.firstElementChild));
    let inView = false;
    const view = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    view.observe(root);
    const onVisibility = () => (document.visibilityState === "visible" && inView ? start() : stop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rows]);

  return (
    <div ref={band} aria-hidden className="vm select-none">
      {rows.map((row, r) => (
        <div key={r} className={`vm-row vm-${row.tone}`}>
          <div data-track className="vm-track">
            {Array.from({ length: COPIES }, (_, c) => (
              <div key={c} className="vm-copy">
                {row.items.map((item) => (
                  <span key={item} className="flex items-center">
                    <span className="vm-item">{item}</span>
                    <span className="vm-sep" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
