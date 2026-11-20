"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="hero-section relative flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_35%,rgba(214,173,85,0.10),transparent_35%),radial-gradient(ellipse_at_82%_20%,rgba(240,213,138,0.08),transparent_32%),radial-gradient(ellipse_at_55%_90%,rgba(214,173,85,0.06),transparent_38%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(214,173,85,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(214,173,85,0.3) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="container-avs relative z-10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex justify-center"
        >
          <Logo size={56} priority />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.04 }}
          className="mx-auto max-w-5xl font-display text-4xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl"
        >
          WE CREATE. WE ELEVATE.
          <br />
          <span className="gradient-text">WE MAKE BRANDS UNFORGETTABLE.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.32 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
        >
          Transforming ideas into powerful digital experiences through
          creativity, strategy and innovation.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.32 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/contact" className="btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link href="/portfolio" className="btn-ghost">
            Explore Our Work <ChevronRight size={16} />
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.16, duration: 0.3 }}
          className="mt-12 text-xs uppercase tracking-[0.3em] text-gold/50"
        >
          Creativity That Makes You Viral.
        </motion.p>
      </div>
    </section>
  );
}
