"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Logo from "./Logo";

const ORBS = [
  { c: "bg-gold/15", s: "h-80 w-80", p: "left-[5%] top-[15%]", d: "0s" },
  { c: "bg-gold-light/10", s: "h-64 w-64", p: "right-[8%] top-[25%]", d: "2s" },
  { c: "bg-gold/10", s: "h-52 w-52", p: "left-[42%] bottom-[10%]", d: "4s" },
];

export default function Hero() {
  return (
    <section className="hero-section relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* animated background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {ORBS.map((o, i) => (
          <div
            key={i}
            className={`absolute ${o.s} ${o.p} ${o.c} animate-float rounded-full blur-[100px]`}
            style={{ animationDelay: o.d }}
          />
        ))}
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
          className="mb-8 flex justify-center"
        >
          <Logo size={56} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto max-w-5xl font-display text-4xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl"
        >
          WE CREATE. WE ELEVATE.
          <br />
          <span className="gradient-text">WE MAKE BRANDS UNFORGETTABLE.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg"
        >
          Transforming ideas into powerful digital experiences through
          creativity, strategy and innovation.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
          transition={{ delay: 0.9 }}
          className="mt-12 text-xs uppercase tracking-[0.3em] text-gold/50"
        >
          Creativity That Makes You Viral.
        </motion.p>
      </div>
    </section>
  );
}
