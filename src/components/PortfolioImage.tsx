"use client";

import Image from "next/image";
import { useState } from "react";

export default function PortfolioImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(!src || src === fallbackSrc);
  const imageSrc = useFallback ? fallbackSrc : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      style={{ objectPosition: "center" }}
      priority={priority}
      onError={() => {
        if (!useFallback && src !== fallbackSrc) setUseFallback(true);
      }}
    />
  );
}
