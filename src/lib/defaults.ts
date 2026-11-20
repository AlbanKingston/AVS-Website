import type {
  PortfolioProject,
  PricingPlan,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  business_email: "", // TODO: set in Admin → Contact Details
  phone: "", // TODO
  whatsapp_number: "", // digits with country code, e.g. 91XXXXXXXXXX
  instagram_url: "",
  facebook_url: "",
  address: "",
  map_query: "",
};

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "s1",
    slug: "graphic-design-branding",
    title: "Graphic Designing & Branding",
    description:
      "Identities and visuals that make your business instantly recognisable.",
    items: [
      "Logo designing",
      "Business cards",
      "Brochures",
      "Posters and banners",
      "Social media creatives",
      "Festival posters",
    ],
    image_url: "/images/projects/brand-identity.svg",
    sort_order: 1,
  },
  {
    id: "s2",
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "Campaigns and content that turn scrolling into enquiries.",
    items: [
      "Social media management",
      "Instagram marketing",
      "Facebook advertising",
      "Promotional campaigns",
      "Reels and video promotions",
    ],
    image_url: "/images/projects/instagram-campaign.svg",
    sort_order: 2,
  },
  {
    id: "s3",
    slug: "website-development",
    title: "Website Development",
    description: "Fast, modern websites and web apps built to convert.",
    items: [
      "Business websites",
      "E-commerce websites",
      "Portfolio websites",
      "Custom web applications",
      "Website maintenance",
    ],
    image_url: "/images/projects/business-website.svg",
    sort_order: 3,
  },
  {
    id: "s5",
    slug: "printing-solutions",
    title: "Printing Solutions",
    description: "Sharp, durable print for every business and occasion.",
    items: [
      "Flex printing",
      "Vinyl printing",
      "Invitation cards",
      "ID cards",
      "Business stationery",
      "Custom printing solutions",
    ],
    image_url: "/images/projects/printing-solutions.svg",
    sort_order: 5,
  },
  {
    id: "s6",
    slug: "video-production",
    title: "Video Production & Creative Media",
    description: "Scroll-stopping video from idea to final cut.",
    items: [
      "Promotional videos",
      "Reels editing",
      "Event videography",
      "Motion graphics",
      "AI-powered creative content",
    ],
    image_url: "/images/projects/promo-video.svg",
    sort_order: 6,
  },
];

export const DEFAULT_PRICING: PricingPlan[] = [
  {
    id: "p1",
    service_name: "Website Development",
    starting_price: 8999,
    description: "A modern, responsive website for your business.",
    features: ["Responsive design", "SEO-friendly structure", "Contact & WhatsApp integration"],
    highlight: true,
    sort_order: 1,
  },
  {
    id: "p2",
    service_name: "Branding Package",
    starting_price: 5999,
    description: "A complete identity to launch or refresh your brand.",
    features: ["Logo design", "Colour & type guidelines", "Business card design"],
    highlight: false,
    sort_order: 2,
  },
  {
    id: "p4",
    service_name: "Graphic Designing",
    starting_price: null,
    description: "Posters, creatives, brochures and more, priced to your scope.",
    features: ["Unlimited ideas", "Print-ready files", "Custom quotation"],
    highlight: false,
    sort_order: 3,
  },
  {
    id: "p5",
    service_name: "Digital Marketing",
    starting_price: null,
    description: "Social media and ad campaigns planned around your goals.",
    features: ["Strategy & content", "Ad management", "Custom quotation"],
    highlight: false,
    sort_order: 4,
  },
];

export const DEFAULT_PORTFOLIO: PortfolioProject[] = [
  {
    id: "w1",
    title: "Brand Identity Concept",
    category: "Branding",
    description: "Placeholder project. Replace via Admin → Portfolio.",
    image_url: "/images/projects/brand-identity.svg",
    featured: true,
  },
  {
    id: "w2",
    title: "Festival Poster Series",
    category: "Graphic Designing",
    description: "Placeholder project. Replace via Admin → Portfolio.",
    image_url: "/images/projects/festival-poster.svg",
    featured: true,
  },
  {
    id: "w3",
    title: "Business Website",
    category: "Website Development",
    description: "Placeholder project. Replace via Admin → Portfolio.",
    image_url: "/images/projects/business-website.svg",
    featured: true,
  },
  {
    id: "w4",
    title: "Instagram Campaign",
    category: "Social Media Campaigns",
    description: "Placeholder project. Replace via Admin → Portfolio.",
    image_url: "/images/projects/instagram-campaign.svg",
    featured: false,
  },
  {
    id: "w5",
    title: "Promo Video Reel",
    category: "Video Production",
    description: "Placeholder project. Replace via Admin → Portfolio.",
    image_url: "/images/projects/promo-video.svg",
    featured: false,
  },
];

export function getPortfolioFallbackImage(category: PortfolioProject["category"]) {
  const project = DEFAULT_PORTFOLIO.find((item) => item.category === category);
  return project?.image_url ?? DEFAULT_PORTFOLIO[0].image_url;
}

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    client_name: "Sample Client",
    client_role: "Placeholder — replace in Admin → Testimonials",
    quote:
      "This is a placeholder testimonial. Add real client feedback from the admin dashboard.",
    published: true,
  },
];
