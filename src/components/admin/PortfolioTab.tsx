"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Upload, Star, Pencil, Trash2 } from "lucide-react";
import { PORTFOLIO_CATEGORIES, type PortfolioProject } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useTable } from "./useTable";
import { ErrorMsg, Field, Loading, Modal, TabHeader } from "./ui";

const EMPTY: Partial<PortfolioProject> = {
  title: "",
  category: "Graphic Designing",
  description: "",
  image_url: "",
  featured: false,
};

export default function PortfolioTab() {
  const { rows, loading, error, save, remove } = useTable<PortfolioProject>(
    "portfolio_projects",
    "created_at",
    false
  );
  const [edit, setEdit] = useState<Partial<PortfolioProject> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setMsg("");
    const sb = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: err } = await sb.storage
      .from("portfolio")
      .upload(path, file, { contentType: file.type });
    if (err) setMsg(err.message);
    else {
      const { data } = sb.storage.from("portfolio").getPublicUrl(path);
      setEdit((e) => ({ ...e, image_url: data.publicUrl }));
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) upload(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit?.image_url)
      return setMsg("Please upload an image or paste an image URL.");
    if (await save(edit)) setEdit(null);
  }

  return (
    <>
      <TabHeader
        title="Portfolio Projects"
        action={
          <button
            className="btn-primary !py-2"
            onClick={() => setEdit({ ...EMPTY })}
          >
            <Plus size={16} /> Add project
          </button>
        }
      />
      <ErrorMsg msg={error} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <Upload size={36} className="mx-auto text-muted/30" />
          <p className="mt-3 text-muted">No projects saved yet.</p>
          <p className="mt-1 text-sm text-muted/60">
            Add portfolio projects to showcase on the public website.
          </p>
          <button
            className="btn-primary mt-4 !py-2"
            onClick={() => setEdit({ ...EMPTY })}
          >
            <Plus size={16} /> Add your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <div
              key={p.id}
              className="card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/20 hover:shadow-glow-sm"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={p.image_url}
                  alt={p.title}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.featured && (
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-obsidian">
                    <Star size={10} fill="currentColor" /> Featured
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    className="rounded-xl bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20"
                    onClick={() => setEdit(p)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="rounded-xl bg-red-500/20 p-2.5 text-red-400 backdrop-blur transition hover:bg-red-500/30"
                    onClick={() => remove(p.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-gold">{p.category}</p>
                <h3 className="mt-0.5 font-semibold">{p.title}</h3>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? "Edit project" : "Add project"}
          onClose={() => setEdit(null)}
        >
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Title">
              <input
                required
                className="input"
                value={edit.title || ""}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className="input"
                value={edit.category}
                onChange={(e) =>
                  setEdit({ ...edit, category: e.target.value as any })
                }
              >
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                className="input"
                value={edit.description || ""}
                onChange={(e) =>
                  setEdit({ ...edit, description: e.target.value })
                }
              />
            </Field>

            {/* Drag & drop image upload */}
            <Field label="Image">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  dragOver
                    ? "border-gold bg-gold/5"
                    : "border-border hover:border-gold/30"
                }`}
              >
                <Upload
                  size={24}
                  className={`mb-2 ${dragOver ? "text-gold" : "text-muted/50"}`}
                />
                <p className="text-sm text-muted">
                  Drag & drop an image, or{" "}
                  <label className="cursor-pointer font-medium text-gold hover:underline">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && upload(e.target.files[0])
                      }
                    />
                  </label>
                </p>
              </div>
            </Field>

            <Field label="…or paste image URL">
              <input
                className="input"
                placeholder="https://"
                value={edit.image_url || ""}
                onChange={(e) =>
                  setEdit({ ...edit, image_url: e.target.value })
                }
              />
            </Field>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-gold" />
                Uploading…
              </div>
            )}

            {edit.image_url && (
              <div className="overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={edit.image_url}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!edit.featured}
                onChange={(e) =>
                  setEdit({ ...edit, featured: e.target.checked })
                }
                className="accent-[#D6AD55]"
              />
              <Star size={14} className="text-gold" />
              Show on home page (featured)
            </label>

            {msg && <p className="text-sm text-red-400">{msg}</p>}
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                className="btn-ghost !py-2"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                className="btn-primary !py-2 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
