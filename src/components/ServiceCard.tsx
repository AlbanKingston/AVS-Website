import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import type { Service } from "@/lib/types";

export default function ServiceCard({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold">{service.title}</h3>
        <p className="mt-2 text-sm text-muted">{service.description}</p>
        {!compact && (
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            {service.items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                {it}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/contact?service=${encodeURIComponent(service.title)}`}
          className="btn-primary mt-6 self-start !py-2.5"
        >
          Enquire Now
        </Link>
      </div>
    </article>
  );
}
