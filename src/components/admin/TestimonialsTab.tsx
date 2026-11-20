"use client";

import { useState } from "react";
import { Plus, Eye, EyeOff, Pencil, Trash2, Quote, MessageSquareQuote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { DEFAULT_TESTIMONIALS } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";
import { useTable } from "./useTable";
import { ErrorMsg, Field, Loading, Modal, TabHeader } from "./ui";

export default function TestimonialsTab() {
  const { rows, loading, error, save, remove, reload } = useTable<Testimonial>("testimonials", "client_name");
  const [edit, setEdit] = useState<Partial<Testimonial> | null>(null);
  const [msg, setMsg] = useState("");

  async function seedPlaceholder() {
    setMsg("");
    const payload = DEFAULT_TESTIMONIALS.map(({ id, ...testimonial }) => testimonial);
    const { error: err } = await createClient()
      .from("testimonials")
      .insert(payload);
    if (err) setMsg(err.message);
    else reload();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (edit && (await save(edit))) setEdit(null);
  }

  return (
    <>
      <TabHeader
        title="Testimonials"
        action={
          <button
            className="btn-primary !py-2"
            onClick={() =>
              setEdit({
                client_name: "",
                client_role: "",
                quote: "",
                published: true,
              })
            }
          >
            <Plus size={16} /> Add testimonial
          </button>
        }
      />
      <ErrorMsg msg={error || msg} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <MessageSquareQuote size={36} className="mx-auto text-white/15" />
          <p className="mt-3 text-white/50">
            No testimonials yet.
          </p>
          <p className="mt-1 text-sm text-white/30">
            The built-in testimonial is only a placeholder. Replace it with
            real client feedback before publishing.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button className="btn-primary !py-2" onClick={seedPlaceholder}>
              Load placeholder testimonial
            </button>
            <button
              className="btn-ghost !py-2"
              onClick={() =>
                setEdit({
                  client_name: "",
                  client_role: "",
                  quote: "",
                  published: true,
                })
              }
            >
              <Plus size={16} /> Add your first testimonial
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((t) => (
            <div
              key={t.id}
              className={`card relative overflow-hidden p-5 transition-all duration-200 hover:border-white/20 ${
                !t.published ? "opacity-60" : ""
              }`}
            >
              <Quote
                size={32}
                className="absolute right-4 top-4 text-white/[0.04]"
              />
              <p className="relative text-sm leading-relaxed text-white/75">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-avs-gradient text-xs font-bold text-ink">
                  {t.client_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.client_name}</p>
                  {t.client_role && (
                    <p className="text-xs text-white/40">{t.client_role}</p>
                  )}
                </div>
                {!t.published && (
                  <span className="ml-2 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                    Hidden
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-3">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.08] hover:text-neon"
                  onClick={() => setEdit(t)}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.08] hover:text-neon"
                  onClick={() =>
                    save({ id: t.id, published: !t.published })
                  }
                >
                  {t.published ? (
                    <>
                      <EyeOff size={12} /> Hide
                    </>
                  ) : (
                    <>
                      <Eye size={12} /> Publish
                    </>
                  )}
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => remove(t.id)}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? "Edit testimonial" : "Add testimonial"}
          onClose={() => setEdit(null)}
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Client name">
              <input
                required
                className="input"
                value={edit.client_name || ""}
                onChange={(e) =>
                  setEdit({ ...edit, client_name: e.target.value })
                }
              />
            </Field>
            <Field label="Role / business">
              <input
                className="input"
                value={edit.client_role || ""}
                onChange={(e) =>
                  setEdit({ ...edit, client_role: e.target.value })
                }
              />
            </Field>
            <Field label="Quote">
              <textarea
                required
                rows={4}
                className="input"
                value={edit.quote || ""}
                onChange={(e) =>
                  setEdit({ ...edit, quote: e.target.value })
                }
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!edit.published}
                onChange={(e) =>
                  setEdit({ ...edit, published: e.target.checked })
                }
                className="accent-neon"
              />
              Published on the website
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
