"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Lite YouTube embed: the card shows its screenshot with a play button,
 * and the iframe (privacy-enhanced youtube-nocookie.com, autoplaying)
 * mounts only when the visitor asks for it. Until that click, the page
 * loads nothing from YouTube.
 */
export function DemoVideo({
  youtubeId,
  poster,
  name,
  priority,
}: {
  youtubeId: string;
  poster: string;
  name: string;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="aspect-[16/10] w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={`${name} demo video`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src={poster}
        alt={`Screenshot of ${name}`}
        width={1600}
        height={1000}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="aspect-[16/10] w-full object-cover"
      />
      {/* Sits above the card's stretched link. */}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${name} demo video`}
        className="group/play absolute inset-0 z-[2] flex items-center justify-center bg-black/20 transition-colors hover:bg-black/35"
      >
        <span className="flex items-center gap-3 border border-line-strong bg-bg/85 px-5 py-3 backdrop-blur-sm transition-colors group-hover/play:border-accent">
          <svg aria-hidden viewBox="0 0 12 14" className="h-3.5 w-3 fill-accent">
            <path d="M0 0l12 7-12 7z" />
          </svg>
          <span className="font-mono text-xs tracking-[0.18em] text-ink uppercase">Play demo</span>
        </span>
      </button>
    </div>
  );
}
