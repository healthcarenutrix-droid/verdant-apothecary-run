export type ConsentChoice = "accepted" | "declined";

const STORAGE_KEY = "msur_cookie_consent";
export const CONSENT_EVENT = "msur-consent-change";

export function getConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export function hasMarketingConsent(): boolean {
  return getConsent() === "accepted";
}

export function onConsentChange(handler: (choice: ConsentChoice | null) => void) {
  const listener = () => handler(getConsent());
  window.addEventListener(CONSENT_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CONSENT_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
