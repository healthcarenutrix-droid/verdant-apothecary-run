import { hasMarketingConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    ttq?: {
      track?: (event: string, params?: Record<string, unknown>) => void;
      page?: () => void;
      load?: (id: string) => void;
      [key: string]: unknown;
    };
  }
}

export interface PixelSettings {
  ga4_id: string;
  google_ads_id: string;
  meta_pixel_id: string;
  tiktok_pixel_id: string;
}

export const EMPTY_PIXEL_SETTINGS: PixelSettings = {
  ga4_id: "",
  google_ads_id: "",
  meta_pixel_id: "",
  tiktok_pixel_id: "",
};

export interface PixelItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PixelEventData {
  value?: number;
  currency?: string;
  orderId?: string;
  items?: PixelItem[];
}

const CURRENCY = "PKR";

function canTrack() {
  return typeof window !== "undefined" && hasMarketingConsent();
}

function gaItems(items: PixelItem[] = []) {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
}

function metaContents(items: PixelItem[] = []) {
  return items.map((item) => ({ id: item.id, quantity: item.quantity, item_price: item.price }));
}

function ttContents(items: PixelItem[] = []) {
  return items.map((item) => ({
    content_id: item.id,
    content_name: item.name,
    content_type: "product",
    price: item.price,
    quantity: item.quantity,
  }));
}

function fire(
  gaEvent: string,
  metaEvent: string,
  tiktokEvent: string,
  data: PixelEventData = {},
) {
  if (!canTrack()) return;
  const { value, currency = CURRENCY, orderId, items = [] } = data;

  window.gtag?.("event", gaEvent, {
    currency,
    value,
    transaction_id: orderId,
    items: gaItems(items),
  });

  window.fbq?.("track", metaEvent, {
    value,
    currency,
    contents: metaContents(items),
    content_type: "product",
    ...(orderId ? { order_id: orderId } : {}),
  });

  window.ttq?.track?.(tiktokEvent, {
    value,
    currency,
    contents: ttContents(items),
    ...(orderId ? { order_id: orderId } : {}),
  });
}

export function trackAddToCart(item: PixelItem) {
  fire("add_to_cart", "AddToCart", "AddToCart", {
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackBeginCheckout(items: PixelItem[], value: number) {
  fire("begin_checkout", "InitiateCheckout", "InitiateCheckout", { value, items });
}

export function trackPurchase(orderId: string, value: number, items: PixelItem[], currency = CURRENCY) {
  fire("purchase", "Purchase", "CompletePayment", { orderId, value, items, currency });
}
