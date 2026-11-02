"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const START_MS = 280;
const STEP_MS = 42;
const FLIP_MS = 55;

/**
 * Decrypting text, adapted from Aceternity UI's Encrypted Text
 * (ui.aceternity.com/components/encrypted-text) without `motion`.
 *
 * The server renders the real text, so crawlers, no-JS visitors and
 * reduced-motion visitors only ever see the real line. After mount the
 * component rewrites its own text node in place: letters and digits turn
 * to random glyphs, then resolve left to right. Spaces and punctuation
 * never change and the glyph set holds no break opportunities, so with a
 * monospace font the line keeps its exact width and wrapping throughout:
 * no layout shift. The node always ends on the real text.
 */
export function EncryptedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild;
    if (!el || !(node instanceof Text)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    const scrambles = chars.map((ch) => /[A-Za-z0-9]/.test(ch));
    const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const out = chars.map((ch, i) => (scrambles[i] ? glyph() : ch));
    const start = performance.now() + START_MS;
    let lastFlip = 0;
    let frame = 0;

    node.nodeValue = out.join("");
    el.dataset.state = "scrambling";

    const tick = (now: number) => {
      const revealed = Math.max(0, Math.floor((now - start) / STEP_MS));
      const flip = now - lastFlip >= FLIP_MS;
      if (flip) lastFlip = now;
      for (let i = 0; i < chars.length; i++) {
        if (i < revealed) out[i] = chars[i];
        else if (flip && scrambles[i]) out[i] = glyph();
      }
      node.nodeValue = out.join("");
      if (revealed >= chars.length) {
        delete el.dataset.state;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      node.nodeValue = text;
      delete el.dataset.state;
    };
  }, [text]);

  return (
    <span ref={ref} className={`encrypted ${className ?? ""}`}>
      {text}
    </span>
  );
}
