"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="mt-10 border-t border-border bg-charcoal">
      <div className="container-avs grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Creativity That Makes You Viral. Branding, digital marketing,
            websites, printing and video, all under one studio.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-ivory">Explore</h4>
          <ul className="space-y-2 text-sm text-muted">
            {["about", "services", "portfolio", "pricing", "contact"].map(
              (p) => (
                <li key={p}>
                  <Link
                    className="capitalize transition-colors duration-300 hover:text-gold"
                    href={`/${p}`}
                  >
                    {p}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-ivory">Reach us</h4>
          <ul className="space-y-2 text-sm text-muted">
            {settings.business_email && (
              <li>
                <a
                  className="transition-colors duration-300 hover:text-gold"
                  href={`mailto:${settings.business_email}`}
                >
                  {settings.business_email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a
                  className="transition-colors duration-300 hover:text-gold"
                  href={`tel:${settings.phone}`}
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.instagram_url && (
              <li>
                <a
                  className="transition-colors duration-300 hover:text-gold"
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            )}
            {settings.facebook_url && (
              <li>
                <a
                  className="transition-colors duration-300 hover:text-gold"
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
            )}
            {!settings.business_email && !settings.phone && (
              <li>
                <Link
                  className="transition-colors duration-300 hover:text-gold"
                  href="/contact"
                >
                  Send an enquiry
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted/60">
        © {new Date().getFullYear()} Amazing Viral Studios. All rights
        reserved.
      </div>
    </footer>
  );
}
