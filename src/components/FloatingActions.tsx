"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/util";

export default function FloatingActions({
  settings,
}: {
  settings: SiteSettings;
}) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  const wa = whatsappLink(
    settings.whatsapp_number,
    "Hi AVS! I'd like to enquire about your services."
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {settings.phone && (
        <a
          href={`tel:${settings.phone}`}
          aria-label="Call AVS"
          className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-obsidian shadow-glow transition-transform duration-300 hover:scale-110"
        >
          <Phone size={22} />
        </a>
      )}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-obsidian shadow-lg transition-transform duration-300 hover:scale-110"
        >
          <MessageCircle size={26} />
        </a>
      ) : (
        <a
          href="/contact"
          aria-label="Send an enquiry"
          className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-obsidian shadow-glow transition-transform duration-300 hover:scale-110"
        >
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  );
}
