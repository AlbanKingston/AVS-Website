"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Small CRUD helper around a Supabase table.
export function useTable<T extends { id: string }>(
  table: string,
  orderBy: string,
  ascending = true
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error: err } = await createClient()
      .from(table)
      .select("*")
      .order(orderBy, { ascending });
    if (err) setError(err.message);
    else setRows((data as T[]) || []);
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (row: Partial<T>) => {
    const sb = createClient().from(table);
    const { id, ...rest } = row as any;
    const { error: err } = id ? await sb.update(rest).eq("id", id) : await sb.insert(rest);
    if (err) {
      setError(err.message);
      return false;
    }
    setError("");
    await load();
    return true;
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const { error: err } = await createClient().from(table).delete().eq("id", id);
    if (err) setError(err.message);
    else await load();
  };

  return { rows, loading, error, save, remove, reload: load };
}
