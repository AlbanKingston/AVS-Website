"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  Image as ImageIcon,
  Briefcase,
  IndianRupee,
  Quote,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { Loading } from "./ui";

interface Stats {
  enquiries: number;
  newEnquiries: number;
  wonEnquiries: number;
  portfolio: number;
  services: number;
  pricing: number;
  testimonials: number;
  recentEnquiries: Enquiry[];
}

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: "bg-gold/20 text-gold",
  contacted: "bg-amber-400/20 text-amber-300",
  in_progress: "bg-orange-400/20 text-orange-300",
  won: "bg-green-400/20 text-green-300",
  closed: "bg-white/10 text-white/50",
};

export default function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const sb = createClient();
      const [enquiries, portfolio, services, pricing, testimonials] =
        await Promise.all([
          sb
            .from("enquiries")
            .select("*")
            .order("created_at", { ascending: false }),
          sb
            .from("portfolio_projects")
            .select("id", { count: "exact", head: true }),
          sb.from("services").select("id", { count: "exact", head: true }),
          sb
            .from("pricing_plans")
            .select("id", { count: "exact", head: true }),
          sb
            .from("testimonials")
            .select("id", { count: "exact", head: true }),
        ]);

      const allEnquiries = (enquiries.data as Enquiry[]) || [];

      setStats({
        enquiries: allEnquiries.length,
        newEnquiries: allEnquiries.filter((e) => e.status === "new").length,
        wonEnquiries: allEnquiries.filter((e) => e.status === "won").length,
        portfolio: portfolio.count || 0,
        services: services.count || 0,
        pricing: pricing.count || 0,
        testimonials: testimonials.count || 0,
        recentEnquiries: allEnquiries.slice(0, 5),
      });
    }
    load();
  }, []);

  if (!stats) return <Loading />;

  const statCards = [
    {
      label: "Total Enquiries",
      value: stats.enquiries,
      icon: Inbox,
      gradient: "from-gold to-gold-dark",
      glow: "shadow-[0_0_30px_rgba(214,173,85,0.15)]",
    },
    {
      label: "New / Unread",
      value: stats.newEnquiries,
      icon: AlertCircle,
      gradient: "from-amber-500 to-amber-700",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    },
    {
      label: "Won Deals",
      value: stats.wonEnquiries,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-green-700",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.12)]",
    },
    {
      label: "Portfolio Projects",
      value: stats.portfolio,
      icon: ImageIcon,
      gradient: "from-orange-500 to-amber-700",
      glow: "shadow-[0_0_30px_rgba(249,115,22,0.12)]",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Briefcase,
      gradient: "from-gold-light to-gold",
      glow: "shadow-[0_0_30px_rgba(240,213,138,0.12)]",
    },
    {
      label: "Pricing Plans",
      value: stats.pricing,
      icon: IndianRupee,
      gradient: "from-yellow-500 to-amber-600",
      glow: "shadow-[0_0_30px_rgba(234,179,8,0.12)]",
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Welcome back 👋
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, gradient, glow }) => (
          <div
            key={label}
            className={`card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 ${glow}`}
          >
            {/* Gradient accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.06] transition-opacity group-hover:opacity-[0.1]`}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Clock size={18} className="text-muted" />
          <h2 className="font-display text-lg font-semibold">
            Recent Enquiries
          </h2>
        </div>

        {stats.recentEnquiries.length === 0 ? (
          <div className="card p-8 text-center">
            <Inbox size={32} className="mx-auto text-muted/30" />
            <p className="mt-3 text-sm text-muted">
              No enquiries yet. They&apos;ll appear here as customers reach out.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentEnquiries.map((e) => (
              <div
                key={e.id}
                className="card flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:border-gold/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium">{e.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[e.status]}`}
                    >
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {e.service || e.message || "No message"}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted/60">
                  {new Date(e.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tip */}
      <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/[0.04] p-5">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="mt-0.5 shrink-0 text-gold" />
          <div>
            <h3 className="mb-1 text-sm font-semibold text-gold">Quick Tip</h3>
            <p className="text-sm leading-relaxed text-muted">
              Use the{" "}
              <strong className="text-ivory/70">Portfolio</strong> tab to upload
              your best work — featured projects appear on the home page. Keep
              your <strong className="text-ivory/70">Contact Details</strong>{" "}
              updated so customers can reach you via WhatsApp and phone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
