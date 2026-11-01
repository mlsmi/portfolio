"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted autoplay loop with the project screenshot as poster. Under
 * prefers-reduced-motion the video never mounts and the poster image
 * stands alone.
 */
export function ProjectVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const [reduce, setReduce] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduce) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className="aspect-[16/10] w-full object-cover" loading="lazy" />;
  }

  return (
    <video
      ref={videoRef}
      className="aspect-[16/10] w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
