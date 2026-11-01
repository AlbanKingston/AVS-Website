import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Target, Palette, BadgeCheck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Amazing Viral Studios: our vision, mission, creative approach and commitment to quality.",
};

const BLOCKS = [
  {
    icon: Eye,
    t: "Our Vision",
    d: "To be the creative partner every growing business trusts to be seen, remembered and chosen.",
  },
  {
    icon: Target,
    t: "Our Mission",
    d: "To deliver design, marketing and technology that are bold, affordable and built to get results.",
  },
  {
    icon: Palette,
    t: "Our Creative Approach",
    d: "We listen first, research your audience, then craft ideas that blend originality with strategy, so every creative has a purpose.",
  },
  {
    icon: BadgeCheck,
    t: "Commitment to Quality",
    d: "From a single poster to a full website, every project goes through careful review and honest communication.",
  },
];

const REASONS = [
  "A single studio for design, digital, print and video",
  "Modern, technology-driven creative thinking",
  "Transparent pricing and clear timelines",
  "Personal attention, with direct access to the people doing the work",
  "Designs made for your brand, never generic templates",
];

export default function About() {
  return (
    <div className="section">
      <div className="container-avs">
        <SectionHeading
          eyebrow="About Us"
          title="We are Amazing Viral Studios"
          sub="A modern creative agency helping businesses stand out, from the first logo to the final launch."
        />

        <Reveal>
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg text-muted">
            AVS brings together designers, developers and marketers under one
            roof. Our mission is simple:{" "}
            <span className="gradient-text font-semibold">
              Creativity That Makes You Viral.
            </span>{" "}
            We help local and growing businesses build a strong brand presence,
            online and offline.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {BLOCKS.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.07}>
              <div className="card h-full p-8 transition-all duration-300 hover:border-gold/40 hover:shadow-glow-sm">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-obsidian">
                  <Icon size={22} />
                </span>
                <h3 className="font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="card mx-auto max-w-3xl p-8 sm:p-12">
            <h3 className="font-display text-2xl font-bold">
              Why businesses choose AVS
            </h3>
            <ul className="mt-6 space-y-4">
              {REASONS.map((r) => (
                <li key={r} className="flex gap-3 text-ivory/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-gradient" />
                  {r}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary mt-8">
              Start your project
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
