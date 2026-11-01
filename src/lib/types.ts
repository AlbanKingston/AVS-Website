export type PortfolioCategory =
  | "Graphic Designing"
  | "Branding"
  | "Website Development"
  | "Social Media Campaigns"
  | "Video Production";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Graphic Designing",
  "Branding",
  "Website Development",
  "Social Media Campaigns",
  "Video Production",
];

export interface PortfolioProject {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  image_url: string;
  featured: boolean;
  created_at?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  items: string[];
  image_url: string;
  sort_order: number;
}

export interface PricingPlan {
  id: string;
  service_name: string;
  starting_price: number | null; // null = custom quotation
  description: string;
  features: string[];
  highlight: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  quote: string;
  published: boolean;
}

export type EnquiryStatus = "new" | "contacted" | "in_progress" | "won" | "closed";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface SiteSettings {
  business_email: string;
  phone: string;
  whatsapp_number: string; // digits only with country code, e.g. 91XXXXXXXXXX
  instagram_url: string;
  facebook_url: string;
  address: string;
  map_query: string;
}
