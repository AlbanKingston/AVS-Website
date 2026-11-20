import { createClient as createSb } from "@supabase/supabase-js";
import {
  DEFAULT_PORTFOLIO,
  DEFAULT_PRICING,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_TESTIMONIALS,
  getPortfolioFallbackImage,
} from "./defaults";
import type {
  PortfolioProject,
  PricingPlan,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

// Server-side read-only fetchers. Fall back to placeholder content when
// Supabase isn't configured or a table is empty, so the site always renders.
function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSb(url, key, { auth: { persistSession: false } });
}

async function load<T>(
  table: string,
  order: string,
  ascending: boolean,
  fallback: T[],
  filter?: (q: any) => any
): Promise<T[]> {
  const c = sb();
  if (!c) return fallback;
  try {
    let q = c.from(table).select("*").order(order, { ascending });
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

const isEventManagementOrDecoration = (value: string) =>
  /event.{0,30}(management|decorat)|(?:management|decorat).{0,30}event/i.test(value);

export const getServices = async () =>
  (await load<Service>("services", "sort_order", true, DEFAULT_SERVICES)).filter(
    (service) => !isEventManagementOrDecoration(`${service.slug} ${service.title}`)
  );
export const getPricing = async () =>
  (await load<PricingPlan>("pricing_plans", "sort_order", true, DEFAULT_PRICING)).filter(
    (plan) => !isEventManagementOrDecoration(plan.service_name)
  );
export const getPortfolio = async () =>
  (
    await load<PortfolioProject>(
      "portfolio_projects",
      "created_at",
      false,
      DEFAULT_PORTFOLIO
    )
  )
    .filter((project) => !/decorat/i.test(`${project.title} ${project.category}`))
    .map((project) => ({
      ...project,
      image_url:
        project.image_url?.trim() ||
        getPortfolioFallbackImage(project.category),
    }));
export const getTestimonials = () =>
  load<Testimonial>("testimonials", "client_name", true, DEFAULT_TESTIMONIALS, (q) =>
    q.eq("published", true)
  );

export async function getSettings(): Promise<SiteSettings> {
  const c = sb();
  if (!c) return DEFAULT_SETTINGS;
  try {
    const { data } = await c.from("site_settings").select("*").eq("id", 1).single();
    return data ? { ...DEFAULT_SETTINGS, ...(data as SiteSettings) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
