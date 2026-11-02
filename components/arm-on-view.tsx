"use client";

import { useEffect, useRef } from "react";

/**
 * Wrapper that arms a CSS entrance (data-boot="armed") while it is still
 * off screen, then fires it (data-boot="go") once enough of it is in
 * view. Only with JS and motion allowed, and only if it starts off
 * screen: otherwise it never arms and its content is simply there. The
 * same pattern as the heatmap boot (components/heatmap-tooltip.tsx).
 */
export function ArmOnView({
  threshold = 0.35,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    el.dataset.boot = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < threshold) return;
        el.dataset.boot = "go";
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      delete el.dataset.boot;
    };
  }, [threshold]);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
