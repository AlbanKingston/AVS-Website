"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function EnquiryForm({
  services,
  initialService = "",
}: {
  services: string[];
  initialService?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      service: String(fd.get("service") || ""),
      message: String(fd.get("message") || "").trim(),
    };
    if (!/^[+\d][\d\s-]{6,16}$/.test(payload.phone)) {
      setError("Please enter a valid phone number.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    if (!isSupabaseConfigured()) {
      setError(
        "Enquiries aren't connected yet. Please use WhatsApp or email instead."
      );
      setState("error");
      return;
    }
    const { error: err } = await createClient().from("enquiries").insert(payload);
    if (err) {
      setError("Something went wrong. Please try again in a moment.");
      setState("error");
      return;
    }
    form.reset();
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <CheckCircle2 className="text-gold" size={48} />
        <h3 className="mt-4 font-display text-2xl font-bold">
          Enquiry received!
        </h3>
        <p className="mt-2 text-muted">
          Thanks for reaching out. Our team will contact you shortly.
        </p>
        <button className="btn-ghost mt-6" onClick={() => setState("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-ivory/70">Name *</span>
          <input
            name="name"
            required
            maxLength={100}
            className="input"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-ivory/70">Phone number *</span>
          <input
            name="phone"
            type="tel"
            required
            className="input"
            placeholder="+91 …"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ivory/70">Email address</span>
        <input
          name="email"
          type="email"
          className="input"
          placeholder="you@example.com"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ivory/70">Required service *</span>
        <select
          name="service"
          required
          defaultValue={initialService}
          className="input"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-ivory/70">
          Project description *
        </span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={2000}
          className="input resize-none"
          placeholder="Tell us about your project, timeline and budget…"
        />
      </label>
      {state === "error" && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary w-full disabled:opacity-60"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="animate-spin" size={16} /> Sending…
          </>
        ) : (
          "Submit Enquiry"
        )}
      </button>
    </form>
  );
}
