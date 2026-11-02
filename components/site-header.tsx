"use client";

import { useEffect, useRef } from "react";

import { useSlidingHighlight } from "@/components/sliding-highlight";
import { SITE } from "@/lib/site-config";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#activity", label: "Activity" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

/** Past this scroll offset (px) the bar contracts into its floating form. */
const FLOAT_AFTER = 80;

const LINK = "relative block px-2 py-1.5 text-sm text-muted transition-colors hover:text-ink sm:px-3";

/**
 * Resizable Navbar, adapted from Aceternity UI
 * (ui.aceternity.com/components/resizable-navbar) without `motion`: a
 * full-width bar at the top that contracts into a floating, inset bar once
 * the page scrolls (data-scrolled drives the CSS transition, .site-bar in
 * app/globals.css), with a hover highlight that glides between links.
 */
export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const { container, highlight, onPointerOver, onPointerLeave } = useSlidingHighlight<HTMLElement>("a");

  useEffect(() => {
    const el = header.current;
    if (!el) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      el.dataset.scrolled = String(window.scrollY > FLOAT_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header ref={header} data-scrolled="false" className="fixed inset-x-0 top-0 z-40">
      <div className="site-bar">
        <a href="#top" className="nums text-sm text-ink transition-colors hover:text-accent">
          {SITE.handle}
        </a>
        <nav
          ref={container}
          aria-label="Site"
          className="relative"
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
        >
          <span ref={highlight} aria-hidden className="slide-hl border border-accent/20 bg-accent-soft" />
          <ul className="flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={LINK}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="hidden sm:block">
              <a href={SITE.githubUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
