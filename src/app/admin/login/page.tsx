"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add your keys to .env.local first.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error: err } = await createClient().auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (err) return setError("Invalid email or password.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-gold-light/5 blur-[100px]" />
      </div>

      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-sm space-y-5 rounded-3xl border border-border bg-surface/80 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex justify-center pb-1">
          <Logo size={38} />
        </div>

        <div className="text-center">
          <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-xs text-muted">
            Sign in to manage your website content
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              name="email"
              type="email"
              required
              className="input !pl-10"
              placeholder="Email address"
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              name="password"
              type="password"
              required
              className="input !pl-10"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          disabled={busy}
          className="btn-primary w-full disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-[10px] text-muted/50">
          Protected area · Authorized personnel only
        </p>
      </form>
    </div>
  );
}
