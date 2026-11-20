"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INTRO_KEY = "avs-cinematic-intro-played";

export default function CinematicIntro() {
  const pathname = usePathname();
  const initialized = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setPlaying(false);
      setComplete(true);
      return;
    }

    if (initialized.current) return;
    initialized.current = true;

    try {
      if (window.sessionStorage.getItem(INTRO_KEY)) {
        setComplete(true);
        document.documentElement.dataset.avsIntroSeen = "true";
        return;
      }

      window.sessionStorage.setItem(INTRO_KEY, "true");
      setPlaying(true);
    } catch {
      setComplete(true);
      document.documentElement.dataset.avsIntroSeen = "true";
    }
  }, [pathname]);

  useEffect(() => {
    if (!playing) return;

    const root = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timer = window.setTimeout(
      () => {
        setPlaying(false);
        setComplete(true);
      },
      reducedMotion ? 250 : 3900
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
            <path d="M302 164 280 187 306 199 289 223 305 247" />
            <path d="M307 198 331 180 317 161 346 137" />
            <path d="M306 200 330 216 352 199 374 217" />
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
      <button
        type="button"
        className="cinematic-intro__skip"
        onClick={() => {
          setPlaying(false);
          setComplete(true);
        }}
        aria-label="Skip intro"
      >
        Skip intro
      </button>
    </div>
  );
}
