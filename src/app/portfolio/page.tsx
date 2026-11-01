import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGallery from "@/components/PortfolioGallery";
import { getPortfolio } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Our Portfolio",
  description: "Explore branding, design, website and video projects by AVS.",
};

export default async function Portfolio() {
  const projects = await getPortfolio();
  return (
    <div className="section">
      <div className="container-avs">
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Work we're proud of"
          sub="Filter by category and tap any project for a full-screen preview."
        />
        <PortfolioGallery projects={projects} />
      </div>
    </div>
  );
}
