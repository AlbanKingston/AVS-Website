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
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (path.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-obsidian/95 pt-[env(safe-area-inset-top)]">
      <div className="container-avs flex h-16 items-center justify-between">
        <Link href="/" aria-label="AVS home" onClick={() => setOpen(false)}>
          <Logo size={50} />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
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
          className="grid h-11 w-11 place-items-center rounded-full text-ivory/70 transition-colors hover:text-gold md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="container-avs max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-obsidian py-4 md:hidden"
          style={{
            maxHeight:
              "calc(100dvh - 4rem - env(safe-area-inset-top))",
          }}
        >
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
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
          </div>
        </nav>
      )}
    </header>
  );
}
