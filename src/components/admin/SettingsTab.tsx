"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, Settings2 } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/client";
import { ErrorMsg, Field, Loading, TabHeader } from "./ui";

const FIELDS: { key: keyof SiteSettings; label: string; hint?: string; icon?: string }[] = [
  { key: "business_email", label: "Business email", hint: "e.g. hello@avs.in", icon: "✉️" },
  { key: "phone", label: "Phone (click-to-call)", hint: "+91XXXXXXXXXX", icon: "📞" },
  { key: "whatsapp_number", label: "WhatsApp number", hint: "Digits with country code, no + or spaces", icon: "💬" },
  { key: "instagram_url", label: "Instagram URL", hint: "https://instagram.com/your-handle", icon: "📸" },
  { key: "facebook_url", label: "Facebook URL", hint: "https://facebook.com/your-page", icon: "👍" },
  { key: "address", label: "Business address / location", hint: "Full address for display", icon: "📍" },
  { key: "map_query", label: "Google Maps search text", hint: "Optional. Defaults to the address", icon: "🗺️" },
];

export default function SettingsTab() {
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    createClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else if (data) setS({ ...DEFAULT_SETTINGS, ...(data as SiteSettings) });
        setLoading(false);
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setSaving(true);
    const { error } = await createClient().from("site_settings").update(s).eq("id", 1);
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Saved successfully! Changes appear on the site within a minute.");
  }

  if (loading) return <Loading />;

  return (
    <>
      <TabHeader
        title="Contact Details"
        action={
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Settings2 size={14} />
            These details appear on the public website
          </div>
        }
      />
      <ErrorMsg msg={err} />

      <form onSubmit={onSubmit} className="card max-w-2xl space-y-5 p-6 sm:p-8">
        {FIELDS.map(({ key, label, hint, icon }) => (
          <Field key={key} label={`${icon || ""} ${label}`}>
            <input
              className="input"
              value={s[key]}
              placeholder={hint}
              onChange={(e) => setS({ ...s, [key]: e.target.value })}
            />
          </Field>
        ))}

        {msg && (
          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-sm text-green-300">
            <CheckCircle2 size={16} />
            {msg}
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-4">
          <button
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}
