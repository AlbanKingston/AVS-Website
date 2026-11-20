"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CinematicIntro() {
  const pathname = usePathname();
  const introRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (pathname === "/") return;
    setPlaying(false);
    setComplete(true);
  }, [pathname]);

  useEffect(() => {
    if (!playing) return;

    const root = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reducedMotion ? 2400 : 8000;
    const animation = introRef.current
      ?.getAnimations()
      .find((item) => {
        const endTime = item.effect?.getComputedTiming().endTime;
        return typeof endTime === "number" && endTime >= duration - 1;
      });
    const endTime = animation?.effect?.getComputedTiming().endTime;
    const currentTime = animation?.currentTime;
    const elapsed = typeof currentTime === "number" ? currentTime : 0;
    const remaining = Math.max(
      0,
      (typeof endTime === "number" ? endTime : duration) - elapsed
    );
    const timer = window.setTimeout(
      () => {
        setPlaying(false);
        setComplete(true);
      },
      remaining
    );
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlaying(false);
        setComplete(true);
      }
    };

    root.dataset.avsIntroActive = "true";
    document.body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", closeOnEscape);
      delete root.dataset.avsIntroActive;
      document.body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
    };
  }, [playing]);

  if (pathname !== "/" || complete) return null;

  return (
    <div
      ref={introRef}
      className={`cinematic-intro${playing ? " is-playing" : ""}`}
    >
      <div className="cinematic-intro__beam" />
      <div className="cinematic-intro__lockup">
        <div className="cinematic-intro__mark">
          <Image
            src="/avs-logo.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 640px) 76vw, 480px"
            className="cinematic-intro__image"
          />
          <svg
            className="cinematic-intro__cracks"
            viewBox="0 0 612 408"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M302 130 284 157 318 178 290 199 323 220 296 244 309 273"
            />
            <path
              d="M190 148 238 168 224 192 278 202 259 230 305 246 288 269"
            />
            <path
              d="M426 143 386 160 405 180 360 198 379 219 343 241"
            />
          </svg>
          <span className="cinematic-intro__fragment cinematic-intro__fragment--one" />
          <span className="cinematic-intro__fragment cinematic-intro__fragment--two" />
          <span className="cinematic-intro__fragment cinematic-intro__fragment--three" />
          <span className="cinematic-intro__fragment cinematic-intro__fragment--four" />
          <span className="cinematic-intro__fragment cinematic-intro__fragment--five" />
          <span className="cinematic-intro__fragment cinematic-intro__fragment--six" />
          <span className="cinematic-intro__spark cinematic-intro__spark--one" />
          <span className="cinematic-intro__spark cinematic-intro__spark--two" />
          <span className="cinematic-intro__spark cinematic-intro__spark--three" />
          <span className="cinematic-intro__spark cinematic-intro__spark--four" />
        </div>
        <div className="cinematic-intro__wordmark">
          <span>AMAZING VIRAL STUDIOS</span>
          <span className="cinematic-intro__tagline">DIGITAL SOLUTIONS</span>
        </div>
      </div>
    </div>
  );
}
