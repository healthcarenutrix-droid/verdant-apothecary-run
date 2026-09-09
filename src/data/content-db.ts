import { supabase } from "@/integrations/supabase/client";

// Loose client: the content tables use text ids and jsonb blobs.
const db = supabase as any;

export type Row = Record<string, any>;

export async function fetchTable(table: string): Promise<Row[]> {
  const { data, error } = await db.from(table).select("*").order("created_at", { ascending: true });
  if (error) {
    console.error(`[content-db] failed to load ${table}`, error);
    return [];
  }
  return (data || []) as Row[];
}

export async function upsertRows(table: string, rows: Row[]): Promise<void> {
  if (!rows.length) return;
  const { error } = await db.from(table).upsert(rows, { onConflict: "id" });
  if (error) console.error(`[content-db] failed to save ${table}`, error);
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) console.error(`[content-db] failed to delete from ${table}`, error);
}

/** Insert seed rows only when the table is still empty. */
export async function seedIfEmpty(table: string, rows: Row[]): Promise<Row[]> {
  const existing = await fetchTable(table);
  if (existing.length > 0) return existing;
  const { error } = await db.from(table).insert(rows);
  if (error) {
    console.error(`[content-db] failed to seed ${table}`, error);
    return [];
  }
  return await fetchTable(table);
}

export function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `item-${Date.now()}`;
}
