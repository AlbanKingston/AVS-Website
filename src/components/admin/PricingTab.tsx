"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, IndianRupee, Sparkles } from "lucide-react";
import type { PricingPlan } from "@/lib/types";
import { DEFAULT_PRICING } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/util";
import { useTable } from "./useTable";
import { ErrorMsg, Field, Loading, Modal, TabHeader, lines } from "./ui";

type Draft = Partial<PricingPlan> & { featuresText?: string; priceText?: string };

export default function PricingTab() {
  const { rows, loading, error, save, remove, reload } = useTable<PricingPlan>("pricing_plans", "sort_order");
  const [edit, setEdit] = useState<Draft | null>(null);
  const [msg, setMsg] = useState("");

  async function seed() {
    const payload = DEFAULT_PRICING.map(({ id, ...rest }) => rest);
    const { error: err } = await createClient().from("pricing_plans").insert(payload);
    if (err) setMsg(err.message);
    else reload();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const { featuresText, priceText, ...rest } = edit;
    const raw = (priceText ?? (rest.starting_price ?? "")).toString().replace(/[^\d.]/g, "");
    const row = {
      ...rest,
      starting_price: raw === "" ? null : Number(raw),
      features: lines(featuresText ?? (rest.features || []).join("\n")),
      sort_order: Number(rest.sort_order ?? rows.length + 1),
    };
    if (await save(row)) setEdit(null);
  }

  return (
    <>
      <TabHeader
        title="Pricing"
        action={
          <button
            className="btn-primary !py-2"
            onClick={() =>
              setEdit({
                service_name: "",
                description: "",
                features: [],
                highlight: false,
                starting_price: null,
                sort_order: rows.length + 1,
              })
            }
          >
            <Plus size={16} /> Add plan
          </button>
        }
      />
      <ErrorMsg msg={error || msg} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="card p-8 text-center">
          <IndianRupee size={36} className="mx-auto text-white/15" />
          <p className="mt-3 text-white/60">
            No plans saved yet; the site shows the default four packages.
          </p>
          <button className="btn-primary mt-4 !py-2" onClick={seed}>
            Load default plans
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <div
              key={p.id}
              className={`card relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 ${
                p.highlight ? "border-violet-electric/30 shadow-glow/20" : ""
              }`}
            >
              {p.highlight && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-avs-gradient px-2.5 py-0.5 text-[10px] font-bold text-ink">
                  <Sparkles size={10} /> Popular
                </div>
              )}
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                {p.service_name}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-neon">
                {formatPrice(p.starting_price)}
              </p>
              {p.description && (
                <p className="mt-1 text-xs text-white/40">{p.description}</p>
              )}
              {p.features.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {p.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-neon/60" />
                      {f}
                    </li>
                  ))}
                  {p.features.length > 4 && (
                    <li className="text-xs text-white/30">
                      +{p.features.length - 4} more
                    </li>
                  )}
                </ul>
              )}
              <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
                <button
                  className="inline-flex items-center gap-1. rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.08] hover:text-neon"
                  onClick={() => setEdit(p)}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => remove(p.id)}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <Modal title={edit.id ? "Edit plan" : "Add plan"} onClose={() => setEdit(null)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Service name">
              <input
                required
                className="input"
                value={edit.service_name || ""}
                onChange={(e) => setEdit({ ...edit, service_name: e.target.value })}
              />
            </Field>
            <Field label="Starting price in ₹ (leave empty for 'Custom quotation')">
              <input
                className="input"
                inputMode="numeric"
                value={edit.priceText ?? (edit.starting_price ?? "").toString()}
                onChange={(e) => setEdit({ ...edit, priceText: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <input
                className="input"
                value={edit.description || ""}
                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              />
            </Field>
            <Field label="Features (one per line)">
              <textarea
                rows={5}
                className="input"
                value={edit.featuresText ?? (edit.features || []).join("\n")}
                onChange={(e) => setEdit({ ...edit, featuresText: e.target.value })}
              />
            </Field>
            <Field label="Display order">
              <input
                type="number"
                className="input"
                value={edit.sort_order ?? 0}
                onChange={(e) =>
                  setEdit({ ...edit, sort_order: Number(e.target.value) })
                }
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!edit.highlight}
                onChange={(e) =>
                  setEdit({ ...edit, highlight: e.target.checked })
                }
                className="accent-neon"
              />
              <Sparkles size={14} className="text-violet-electric" />
              Highlight as &quot;Most Popular&quot;
            </label>
            <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-4">
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
              <button className="btn-primary !py-2">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
