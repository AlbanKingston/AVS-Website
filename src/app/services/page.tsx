import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import { getServices } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Services",
  description:
    "Graphic design, branding, digital marketing, website development, printing and video production by AVS.",
};

export default async function Services() {
  const services = await getServices();
  return (
    <div className="section">
      <div className="container-avs">
        <SectionHeading
          eyebrow="Our Services"
          title="Everything your brand needs"
          sub="Pick a service to enquire, or combine several for a complete brand launch."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.07}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
