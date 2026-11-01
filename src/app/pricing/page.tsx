import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PricingCard from "@/components/PricingCard";
import Reveal from "@/components/Reveal";
import { getPricing } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Pricing & Packages",
  description: "Transparent starting prices for website development and branding, with custom quotes for every other service.",
};

export default async function Pricing() {
  const plans = await getPricing();
  return (
    <div className="section">
      <div className="container-avs">
        <SectionHeading
          eyebrow="Pricing & Packages"
          title="Clear starting prices"
          sub="Every project is different. Final pricing depends on scope, so request a quote and we'll tailor it to you."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.07}>
              <PricingCard plan={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
