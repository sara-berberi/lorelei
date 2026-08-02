"use client";

import { useState } from "react";
import { cloudinaryUrl, buildSrcSet } from "@/lib/images";

interface ProductImageProps {
  src: string;
  alt: string;
  /** Rendered width hint used to pick the fallback src. */
  width?: number;
  /** `sizes` attribute — tells the browser how wide the image renders. */
  sizes?: string;
  className?: string;
  /**
   * Above-the-fold images load eagerly with high priority; everything else
   * stays lazy so the first screen paints fast on mobile.
   */
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  width = 600,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className = "",
  priority = false,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f7f6f4]">
        <span className="text-[10px] tracking-widest uppercase text-gray-300">No Image</span>
      </div>
    );
  }

  return (
    <>
      {/* Tiny blurred placeholder holds the space and avoids a white flash
          while the real image streams in over a slow mobile connection. */}
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[#f7f6f4] animate-imgPulse"
          style={{
            backgroundImage: `url(${cloudinaryUrl(src, { width: 24, quality: "30" })})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            transform: "scale(1.06)",
          }}
        />
      )}
      <img
        src={cloudinaryUrl(src, { width })}
        srcSet={buildSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        // @ts-expect-error fetchPriority is valid HTML, typed only in React 19+
        fetchpriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      <style jsx global>{`
        @keyframes imgPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-imgPulse {
          animation: imgPulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-imgPulse {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
