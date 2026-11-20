"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Expand } from "lucide-react";
import { PORTFOLIO_CATEGORIES, type PortfolioProject } from "@/lib/types";
import { getPortfolioFallbackImage } from "@/lib/defaults";
import PortfolioImage from "@/components/PortfolioImage";

export default function PortfolioGallery({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<PortfolioProject | null>(null);

  const shown =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    if (!active) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {["All", ...PORTFOLIO_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`min-h-11 rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color] duration-200 ${
              filter === c
                ? "border-transparent bg-gold-gradient font-semibold text-obsidian"
                : "border-border text-muted hover:border-gold/50 hover:text-gold"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, index) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={() => setActive(p)}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border text-left transition-[border-color] duration-200 hover:border-gold/30"
              aria-label={`Open ${p.title}`}
            >
              <PortfolioImage
                src={p.image_url}
                fallbackSrc={getPortfolioFallbackImage(p.category)}
                alt={p.title}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                className="object-cover object-center transition duration-700 group-hover:scale-110"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent opacity-80 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition group-hover:translate-y-0">
                <span className="text-xs uppercase tracking-widest text-gold">
                  {p.category}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold">
                  {p.title}
                </h3>
              </div>
              <Expand
                size={18}
                className="absolute right-4 top-4 text-gold opacity-0 transition group-hover:opacity-100"
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-muted">
          No projects in this category yet.
        </p>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              className="absolute right-[calc(1.25rem+env(safe-area-inset-right))] top-[calc(1.25rem+env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full bg-surface text-ivory transition-colors hover:bg-gold/20 hover:text-gold"
              aria-label="Close preview"
              onClick={() => setActive(null)}
            >
              <X />
            </button>
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10] max-h-[60dvh] w-full">
                <PortfolioImage
                  src={active.image_url}
                  fallbackSrc={getPortfolioFallbackImage(active.category)}
                  alt={active.title}
                  sizes="100vw"
                  className="object-cover object-center bg-black"
                />
              </div>
              <div className="p-6">
                <span className="text-xs uppercase tracking-widest text-gold">
                  {active.category}
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold">
                  {active.title}
                </h3>
                <p className="mt-2 text-muted">{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
