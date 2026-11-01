"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Phone, Mail, MessageCircle, Trash2 } from "lucide-react";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { useTable } from "./useTable";
import { ErrorMsg, Loading, TabHeader } from "./ui";

const STATUSES: EnquiryStatus[] = [
  "new",
  "contacted",
  "in_progress",
  "won",
  "closed",
];
const COLORS: Record<EnquiryStatus, string> = {
  new: "bg-gold/20 text-gold",
  contacted: "bg-amber-400/20 text-amber-300",
  in_progress: "bg-orange-400/20 text-orange-300",
  won: "bg-green-400/20 text-green-300",
  closed: "bg-white/10 text-white/50",
};

const FILTER_OPTS: { label: string; value: EnquiryStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Won", value: "won" },
  { label: "Closed", value: "closed" },
];

export default function EnquiriesTab() {
  const { rows, loading, error, save, remove } = useTable<Enquiry>(
    "enquiries",
    "created_at",
    false
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.service.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rows, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rows.length };
    STATUSES.forEach((s) => {
      counts[s] = rows.filter((e) => e.status === s).length;
    });
    return counts;
  }, [rows]);

  return (
    <>
      <TabHeader title={`Customer Enquiries (${rows.length})`} />
      <ErrorMsg msg={error} />

      {/* Search and Filter Bar */}
      {!loading && rows.length > 0 && (
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input !pl-10"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="shrink-0 text-muted" />
            {FILTER_OPTS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === value
                    ? "bg-gold-gradient text-obsidian shadow-sm"
                    : "border border-border text-muted hover:border-gold/30 hover:text-ivory"
                }`}
              >
                {label}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {statusCounts[value] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <MessageCircle size={36} className="mx-auto text-muted/30" />
          <p className="mt-3 text-muted">No enquiries yet.</p>
          <p className="mt-1 text-sm text-muted/60">
            They&apos;ll appear here when customers submit the contact form.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <Search size={28} className="mx-auto text-muted/30" />
          <p className="mt-3 text-sm text-muted">
            No enquiries match your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="card overflow-hidden p-5 transition-all duration-200 hover:border-gold/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{e.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${COLORS[e.status]}`}
                    >
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted/60">
                    {new Date(e.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <select
                  aria-label="Update status"
                  value={e.status}
                  onChange={(ev) =>
                    save({
                      id: e.id,
                      status: ev.target.value as EnquiryStatus,
                    })
                  }
                  className="input !w-auto !py-1.5 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {e.service && (
                <p className="mt-2.5 inline-block rounded-lg bg-gold/[0.08] px-2.5 py-1 text-xs font-medium text-gold">
                  {e.service}
                </p>
              )}

              {e.message && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                  {e.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted transition hover:bg-gold/10 hover:text-gold"
                  href={`tel:${e.phone}`}
                >
                  <Phone size={13} /> {e.phone}
                </a>
                {e.email && (
                  <a
                    className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted transition hover:bg-gold/10 hover:text-gold"
                    href={`mailto:${e.email}`}
                  >
                    <Mail size={13} /> {e.email}
                  </a>
                )}
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs text-green-400 transition hover:bg-green-500/20"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wa.me/${e.phone.replace(/\D/g, "")}`}
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <button
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => remove(e.id)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
