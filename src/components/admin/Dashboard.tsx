"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Image as ImageIcon,
  Briefcase,
  IndianRupee,
  Quote,
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Logo from "../Logo";
import { createClient } from "@/lib/supabase/client";
import OverviewTab from "./OverviewTab";
import EnquiriesTab from "./EnquiriesTab";
import PortfolioTab from "./PortfolioTab";
import ServicesTab from "./ServicesTab";
import PricingTab from "./PricingTab";
import TestimonialsTab from "./TestimonialsTab";
import SettingsTab from "./SettingsTab";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, C: OverviewTab },
  { id: "enquiries", label: "Enquiries", icon: Inbox, C: EnquiriesTab },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon, C: PortfolioTab },
  { id: "services", label: "Services", icon: Briefcase, C: ServicesTab },
  { id: "pricing", label: "Pricing", icon: IndianRupee, C: PricingTab },
  { id: "testimonials", label: "Testimonials", icon: Quote, C: TestimonialsTab },
  { id: "settings", label: "Contact Details", icon: Settings, C: SettingsTab },
] as const;

export default function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();
  const Active = TABS.find((t) => t.id === tab)!.C;

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setUser(data.user));
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  function switchTab(id: (typeof TABS)[number]["id"]) {
    setTab(id);
    setSidebarOpen(false);
  }

  return (
    <div className="relative min-h-screen md:flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-charcoal/95 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Logo size={30} />
          <button
            className="rounded-lg p-1.5 text-muted hover:bg-surface md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/50">
            Navigation
          </p>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                tab === id
                  ? "bg-gold-gradient font-semibold text-obsidian shadow-glow-sm"
                  : "text-muted hover:bg-surface hover:text-ivory"
              }`}
            >
              <Icon
                size={18}
                className={
                  tab === id
                    ? ""
                    : "text-muted/60 transition-colors group-hover:text-gold"
                }
              />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-4">
          {user?.email && (
            <p
              className="mb-3 truncate px-3 text-xs text-muted/50"
              title={user.email}
            >
              {user.email}
            </p>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <section className="min-h-screen flex-1">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-obsidian/80 px-4 py-3 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-surface"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-display text-sm font-semibold capitalize">
            {TABS.find((t) => t.id === tab)?.label}
          </h2>
        </div>
        <div className="p-5 sm:p-8">
          <Active />
        </div>
      </section>
    </div>
  );
}
