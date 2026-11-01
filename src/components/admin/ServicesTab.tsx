"use client";

import { useState } from "react";
import { Plus, Upload, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/lib/types";
import { DEFAULT_SERVICES } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";
import { useTable } from "./useTable";
import { ErrorMsg, Field, Loading, Modal, TabHeader, lines } from "./ui";

type Draft = Partial<Service> & { itemsText?: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ServicesTab() {
  const { rows, loading, error, save, remove, reload } = useTable<Service>(
    "services",
    "sort_order"
  );
  const [edit, setEdit] = useState<Draft | null>(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  async function seed() {
    const payload = DEFAULT_SERVICES.map(({ id, ...rest }) => rest);
    const { error: err } = await createClient()
      .from("services")
      .insert(payload);
    if (err) setMsg(err.message);
    else reload();
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setMsg("");
    const sb = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `services/${crypto.randomUUID()}.${ext}`;
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const { itemsText, ...rest } = edit;
    const row = {
      ...rest,
      slug: rest.slug || slugify(rest.title || ""),
      items: lines(itemsText ?? (rest.items || []).join("\n")),
      sort_order: Number(rest.sort_order ?? rows.length + 1),
    };
    if (await save(row)) setEdit(null);
  }

  return (
    <>
      <TabHeader
        title="Services"
        action={
          <button
            className="btn-primary !py-2"
            onClick={() =>
              setEdit({
                title: "",
                description: "",
                image_url: "",
                items: [],
                sort_order: rows.length + 1,
              })
            }
          >
            <Plus size={16} /> Add service
          </button>
        }
      />
      <ErrorMsg msg={error || msg} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="card p-8 text-center">
          <GripVertical size={36} className="mx-auto text-muted/30" />
          <p className="mt-3 text-muted">
            No services saved yet; the site shows the default five.
          </p>
          <p className="mt-1 text-sm text-muted/60">
            Load the defaults below to start customizing.
          </p>
          <button className="btn-primary mt-4 !py-2" onClick={seed}>
            Load default services
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((s) => (
            <div
              key={s.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-4 transition-all duration-200 hover:border-gold/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-xs font-bold text-gold">
                  {s.sort_order}
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-xs text-muted">
                    {s.items.length} offerings · /{s.slug}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted transition hover:bg-gold/10 hover:text-gold"
                  onClick={() => setEdit(s)}
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => remove(s.id)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <Modal
          title={edit.id ? "Edit service" : "Add service"}
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
            <Field label="Short description">
              <input
                className="input"
                value={edit.description || ""}
                onChange={(e) =>
                  setEdit({ ...edit, description: e.target.value })
                }
              />
            </Field>
            <Field label="Offerings (one per line)">
              <textarea
                rows={6}
                className="input"
                value={edit.itemsText ?? (edit.items || []).join("\n")}
                onChange={(e) =>
                  setEdit({ ...edit, itemsText: e.target.value })
                }
              />
            </Field>

            {/* Image Upload */}
            <Field label="Image">
              <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border p-4 text-center transition-colors hover:border-gold/30">
                <Upload size={20} className="mb-1.5 text-muted/50" />
                <p className="text-xs text-muted">
                  <label className="cursor-pointer font-medium text-gold hover:underline">
                    Upload an image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && uploadImage(e.target.files[0])
                      }
                    />
                  </label>{" "}
                  or paste a URL below
                </p>
              </div>
            </Field>

            <Field label="Image URL">
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
                  className="h-32 w-full object-cover"
                />
              </div>
            )}

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
