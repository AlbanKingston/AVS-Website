"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold/10 bg-obsidian/95 shadow-[0_1px_20px_rgba(214,173,85,0.05)] backdrop-blur-xl"
          : "border-b border-transparent bg-obsidian/80 backdrop-blur-md"
      }`}
    >
      <div className="container-avs flex h-16 items-center justify-between">
        <Link href="/" aria-label="AVS home" onClick={() => setOpen(false)}>
          <Logo size={50} />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium transition-colors duration-300 hover:text-gold ${
                path === l.href ? "text-gold" : "text-ivory/70"
              }`}
            >
              {l.label}
              {path === l.href && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-gold-gradient" />
              )}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary !py-2">
            Get a Free Quote
          </Link>
        </nav>
        <button
          className="text-ivory/70 transition hover:text-gold md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="container-avs flex flex-col gap-1 border-t border-border bg-obsidian py-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base transition ${
                path === l.href
                  ? "bg-gold/10 text-gold"
                  : "text-ivory/80 hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2"
          >
            Get a Free Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
