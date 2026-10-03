import { products } from "@/data/products";

export type ProofLang = "en" | "roman" | "ur";
export type ProofPosition = "bottom-left" | "bottom-right";
export type ProofBadge = "cod" | "verified" | "none";

export interface SocialProofSettings {
  enabled: boolean;
  initial_delay_seconds: number;
  display_seconds: number;
  gap_seconds: number;
  position: ProofPosition;
  language: ProofLang;
  badge: ProofBadge;
  product_ids: string[]; // empty = all active products
}

export const DEFAULT_PROOF_SETTINGS: SocialProofSettings = {
  enabled: false,
  initial_delay_seconds: 5,
  display_seconds: 5,
  gap_seconds: 8,
  position: "bottom-left",
  language: "en",
  badge: "cod",
  product_ids: [],
};

export const PROOF_COLUMNS =
  "enabled, initial_delay_seconds, display_seconds, gap_seconds, position, language, badge, product_ids";

export interface PurchaseNotice {
  name: { en: string; ur: string };
  city: { en: string; ur: string };
  productId: string;
  product: string;
  image: string;
  price: number;
  timestamp: number; // ms epoch
}

const NAMES = [
  ["Ayesha", "عائشہ"], ["Hamza", "حمزہ"], ["Fatima", "فاطمہ"], ["Ali", "علی"], ["Hira", "حرا"],
  ["Usman", "عثمان"], ["Sana", "ثنا"], ["Bilal", "بلال"], ["Zainab", "زینب"], ["Ahmed", "احمد"],
];
const CITIES = [
  ["Karachi", "کراچی"], ["Lahore", "لاہور"], ["Islamabad", "اسلام آباد"], ["Rawalpindi", "راولپنڈی"],
  ["Faisalabad", "فیصل آباد"], ["Multan", "ملتان"], ["Peshawar", "پشاور"], ["Quetta", "کوئٹہ"],
  ["Sialkot", "سیالکوٹ"], ["Gujranwala", "گوجرانوالہ"],
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Data source for the widget. Swap this for a real orders endpoint later, e.g.
 * `const res = await fetch("/api/recent-orders"); return res.json();`
 * — just return the same PurchaseNotice shape.
 */
export async function fetchRecentPurchases(productIds: string[], count = 10): Promise<PurchaseNotice[]> {
  const pool = productIds.length ? products.filter((p) => productIds.includes(p.id)) : products;
  if (!pool.length) return [];
  return Array.from({ length: count }, () => {
    const p = pick(pool);
    const [nEn, nUr] = pick(NAMES);
    const [cEn, cUr] = pick(CITIES);
    return {
      name: { en: nEn, ur: nUr },
      city: { en: cEn, ur: cUr },
      productId: p.id,
      product: p.name,
      image: p.image,
      price: p.variants?.[0]?.price ?? p.price,
      timestamp: Date.now() - (1 + Math.floor(Math.random() * 55)) * 60_000,
    };
  });
}

export const formatPKR = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-PK")}`;

export function timeAgo(ts: number, lang: ProofLang) {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60_000));
  if (lang === "ur") return `${m} منٹ پہلے`;
  if (lang === "roman") return `${m} minute pehle`;
  return `${m} minute${m === 1 ? "" : "s"} ago`;
}

export function headline(n: PurchaseNotice, lang: ProofLang) {
  if (lang === "ur") return `${n.name.ur}، ${n.city.ur} سے، نے ابھی خریدا`;
  if (lang === "roman") return `${n.name.en}, ${n.city.en} se, ne abhi khareeda`;
  return `${n.name.en} from ${n.city.en} just purchased`;
}

export const BADGE_TEXT: Record<Exclude<ProofBadge, "none">, Record<ProofLang, string>> = {
  cod: { en: "Cash on Delivery available", roman: "Cash on Delivery dastiyab", ur: "کیش آن ڈیلیوری دستیاب" },
  verified: { en: "Verified purchase", roman: "Tasdeeq shuda khareed", ur: "تصدیق شدہ خریداری" },
};

export const LANG_KEY = "msur_proof_lang";
export const DISMISS_KEY = "msur_proof_dismissed";
