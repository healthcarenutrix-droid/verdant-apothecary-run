export type PopupTriggerType = "load" | "delay" | "exit" | "scroll";
export type PopupFrequency = "always" | "session" | "day" | "once";

export interface PopupSettings {
  enabled: boolean;
  image_url: string;
  headline: string;
  body_text: string;
  discount_code: string;
  button_text: string;
  button_link: string;
  trigger_type: PopupTriggerType;
  trigger_delay_seconds: number;
  trigger_scroll_percent: number;
  frequency: PopupFrequency;
}

export const POPUP_COLUMNS =
  "enabled, image_url, headline, body_text, discount_code, button_text, button_link, trigger_type, trigger_delay_seconds, trigger_scroll_percent, frequency";

export const DEFAULT_POPUP_SETTINGS: PopupSettings = {
  enabled: false,
  image_url: "",
  headline: "Get 10% Off Your First Order",
  body_text: "Join our list and enjoy a welcome discount on your first purchase.",
  discount_code: "",
  button_text: "Shop Now",
  button_link: "/products",
  trigger_type: "load",
  trigger_delay_seconds: 5,
  trigger_scroll_percent: 50,
  frequency: "session",
};

export const TRIGGER_OPTIONS: { value: PopupTriggerType; label: string }[] = [
  { value: "load", label: "On page load" },
  { value: "delay", label: "After delay (seconds)" },
  { value: "exit", label: "On exit intent" },
  { value: "scroll", label: "On scroll percentage" },
];

export const FREQUENCY_OPTIONS: { value: PopupFrequency; label: string }[] = [
  { value: "always", label: "Every page load" },
  { value: "session", label: "Once per session" },
  { value: "day", label: "Once per day" },
  { value: "once", label: "Once ever (until they convert)" },
];

const STORAGE_KEY = "msur_popup_last_shown";

const readTimestamp = (storage: Storage | undefined): number | null => {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const value = raw ? Number(raw) : NaN;
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

/** Whether the popup may be shown right now, given the configured frequency. */
export const canShowPopup = (frequency: PopupFrequency): boolean => {
  if (typeof window === "undefined") return false;
  if (frequency === "always") return true;

  if (frequency === "session") return readTimestamp(window.sessionStorage) === null;

  const last = readTimestamp(window.localStorage);
  if (last === null) return true;
  if (frequency === "once") return false;
  return Date.now() - last >= 24 * 60 * 60 * 1000;
};

/** Record that the popup was shown/dismissed so the frequency rule is respected. */
export const markPopupSeen = (frequency: PopupFrequency) => {
  if (typeof window === "undefined" || frequency === "always") return;
  const stamp = String(Date.now());
  try {
    if (frequency === "session") window.sessionStorage.setItem(STORAGE_KEY, stamp);
    else window.localStorage.setItem(STORAGE_KEY, stamp);
  } catch {
    /* storage unavailable */
  }
};
