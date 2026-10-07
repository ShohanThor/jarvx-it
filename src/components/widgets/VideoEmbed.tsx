"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/** Click-to-load video: shows a poster until played, so the iframe never slows down page load */
export function VideoEmbed({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [play, setPlay] = useState(false);
  const url = src.replace("www.youtube.com", "www.youtube-nocookie.com");
  return (
    <div className="gradient-border glass relative aspect-video overflow-hidden rounded-4xl">
      {play ? (
        <iframe
          src={`${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play video: ${title}`} data-cursor="Play">
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-ink/40" />
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-glow-lg transition-transform duration-300 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-purple/40" />
            <Play className="relative ml-1 h-8 w-8 fill-white" />
          </span>
        </button>
      )}
    </div>
  );
}
