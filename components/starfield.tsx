"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; v: number };

/**
 * Fixed full-viewport star canvas behind everything. Two visual depths via
 * radius/alpha, drifting very slowly. Under prefers-reduced-motion (or
 * when something goes wrong) it renders a single static frame.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function seed() {
      const count = Math.min(170, Math.round((width * height) / 11000));
      stars = Array.from({ length: count }, () => {
        const deep = Math.random() < 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: deep ? 0.6 : 1.1,
          a: deep ? 0.25 + Math.random() * 0.2 : 0.4 + Math.random() * 0.35,
          v: deep ? 0.006 : 0.014,
        };
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#cfe4ef";
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      ctx.globalAlpha = 1;
    }

    function tick() {
      for (const s of stars) {
        s.y -= s.v;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
      }
      draw();
      raf = window.requestAnimationFrame(tick);
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    }

    function start() {
      window.cancelAnimationFrame(raf);
      resize();
      if (!reduce.matches) raf = window.requestAnimationFrame(tick);
    }

    start();
    window.addEventListener("resize", start);
    reduce.addEventListener("change", start);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", start);
      reduce.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
