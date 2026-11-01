import Link from "next/link";
import { Check } from "lucide-react";
import type { PricingPlan } from "@/lib/types";
import { formatPrice } from "@/lib/util";

export default function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`card relative flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-2 ${
        plan.highlight
          ? "border-gold shadow-glow"
          : "hover:border-gold/30 hover:shadow-glow-sm"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-8 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-obsidian">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-xl font-bold">{plan.service_name}</h3>
      <p className="mt-1 text-sm text-muted">{plan.description}</p>
      <div className="mt-6">
        {plan.starting_price !== null && (
          <span className="block text-xs uppercase tracking-widest text-muted">
            Starting at
          </span>
        )}
        <span className="gradient-text font-display text-3xl font-extrabold">
          {formatPrice(plan.starting_price)}
        </span>
      </div>
      <ul className="my-6 flex-1 space-y-3 text-sm text-ivory/80">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-gold" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/contact?service=${encodeURIComponent(plan.service_name)}`}
        className={plan.highlight ? "btn-primary" : "btn-ghost"}
      >
        Get Custom Quote
      </Link>
    </div>
  );
}
