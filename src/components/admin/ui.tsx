"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export const TabHeader = ({ title, action }: { title: string; action?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="font-display text-2xl font-bold">{title}</h1>
    {action}
  </div>
);

export const Loading = () => (
  <div className="py-20 text-center text-white/50">
    <Loader2 className="mx-auto animate-spin" />
  </div>
);

export const ErrorMsg = ({ msg }: { msg: string }) =>
  msg ? <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{msg}</p> : null;

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-sm">
    <span className="mb-1.5 block text-white/60">{label}</span>
    {children}
  </label>
);

export const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur"
    onClick={onClose}
  >
    <div
      className="card my-8 w-full max-w-xl p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <h2 className="mb-5 font-display text-xl font-bold">{title}</h2>
      {children}
    </div>
  </div>
);

export const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
