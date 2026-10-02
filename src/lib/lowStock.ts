import type { AdminProduct } from "@/data/dashboard-data";
import { queueNotification } from "@/lib/notifications";

export const DEFAULT_LOW_STOCK = 5;

export interface LowStockItem {
  label: string;
  stock: number;
  threshold: number;
}

/** Returns every product/variant at or below its low-stock level. */
export function getLowStockItems(p: AdminProduct): LowStockItem[] {
  const base = p.lowStockThreshold ?? DEFAULT_LOW_STOCK;
  if (p.variants && p.variants.length > 0) {
    return p.variants
      .map((v) => ({ label: v.label, stock: v.stock, threshold: v.lowStockThreshold ?? base }))
      .filter((v) => v.stock <= v.threshold);
  }
  return p.stock <= base ? [{ label: "Default", stock: p.stock, threshold: base }] : [];
}

export const isLowStock = (p: AdminProduct) => getLowStockItems(p).length > 0;

/** Emails admin about items that newly dropped to/below their level. */
export function notifyLowStock(prev: AdminProduct | null | undefined, next: AdminProduct) {
  const before = new Set(prev ? getLowStockItems(prev).map((i) => i.label) : []);
  const fresh = getLowStockItems(next).filter((i) => !before.has(i.label));
  if (fresh.length === 0) return;
  const lines = fresh.map((i) => `• ${i.label}: ${i.stock} left (alert level ${i.threshold})`).join("\n");
  queueNotification({
    eventType: "low_stock",
    subject: `Low stock: ${next.name}`,
    body: `The following stock is at or below its alert level:\n${lines}`,
    payload: { productId: next.id, product: next.name, items: fresh },
  });
}
