import Link from "next/link";
import Image from "next/image";
import { Sparkles, Zap, ShieldCheck, Layers, Quote } from "lucide-react";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import { getPortfolio, getServices, getTestimonials } from "@/lib/data";

export const revalidate = 60;

const WHY = [
  {
    icon: Layers,
    t: "One Studio, Every Need",
    d: "Design, marketing, web, print and video under one roof.",
  },
  {
    icon: Zap,
    t: "Fast Turnaround",
    d: "Quick drafts and clear timelines so your campaigns never wait.",
  },
  {
    icon: Sparkles,
    t: "Creative, Not Generic",
    d: "Original ideas tailored to your brand, never recycled templates.",
  },
  {
    icon: ShieldCheck,
    t: "Quality You Can Trust",
    d: "Careful finishing on every pixel, print and project.",
  },
];

export default async function Home() {
  const [services, portfolio, testimonials] = await Promise.all([
    getServices(),
    getPortfolio(),
    getTestimonials(),
  ]);
  const featured = (
    portfolio.some((p) => p.featured)
      ? portfolio.filter((p) => p.featured)
      : portfolio
  ).slice(0, 3);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container-avs">
          <SectionHeading
            eyebrow="What We Do"
            title="Services built to make you viral"
            sub="From first logo to final launch, everything your brand needs to be seen."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <ServiceCard service={s} compact />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-ghost">
              See all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-charcoal/50">
        <div className="container-avs">
          <SectionHeading
            eyebrow="Featured Work"
            title="Projects that turned heads"
            sub="A glimpse of what we create for brands across industries."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link
                  href="/portfolio"
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border transition-all duration-300 hover:border-gold/30"
                >
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-xs uppercase tracking-widest text-gold">
                      {p.category}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/portfolio" className="btn-primary">
              View full portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-avs">
          <SectionHeading
            eyebrow="Why Choose AVS"
            title="Creative energy, professional delivery"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow-sm">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-obsidian">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-display text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-charcoal/50">
        <div className="container-avs">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our clients say"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <figure className="card h-full p-7">
                  <Quote className="text-gold" />
                  <blockquote className="mt-4 text-ivory/80">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <strong>{t.client_name}</strong>
                    <span className="block text-muted">{t.client_role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-avs">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-10 text-center sm:p-16">
              <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gold-light/10 blur-[100px]" />
              <h2 className="relative font-display text-3xl font-bold sm:text-5xl">
                Ready to make your brand{" "}
                <span className="gradient-text">unforgettable</span>?
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-muted">
                Tell us about your idea and get a free, no-obligation quote.
              </p>
              <Link href="/contact" className="btn-primary relative mt-8">
                Get a Free Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
