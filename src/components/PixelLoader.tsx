import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/consent";
import { EMPTY_PIXEL_SETTINGS, type PixelSettings } from "@/lib/pixels";

const injected = {
  gtag: false,
  meta: false,
  tiktok: false,
};

function injectGoogle(ga4Id: string, adsId: string) {
  if (injected.gtag) return;
  const primaryId = ga4Id || adsId;
  if (!primaryId) return;
  injected.gtag = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as unknown as (...args: unknown[]) => void;

  window.gtag("js", new Date());
  if (ga4Id) window.gtag("config", ga4Id);
  if (adsId) window.gtag("config", adsId);
}

function injectMeta(pixelId: string) {
  if (injected.meta || !pixelId) return;
  injected.meta = true;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", pixelId);
  window.fbq?.("track", "PageView");
}

function injectTikTok(pixelId: string) {
  if (injected.tiktok || !pixelId) return;
  injected.tiktok = true;

  /* eslint-disable */
  (function (w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page", "track", "identify", "instances", "debug", "on", "off", "once",
      "ready", "alias", "group", "enableCookie", "disableCookie",
    ];
    ttq.setAndDefer = function (obj: any, method: string) {
      obj[method] = function () {
        obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (id: string) {
      const inst = ttq._i[id] || [];
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(inst, ttq.methods[i]);
      return inst;
    };
    ttq.load = function (id: string, options?: any) {
      const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = url;
      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[id] = options || {};
      const script = d.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `${url}?sdkid=${id}&lib=${t}`;
      const first = d.getElementsByTagName("script")[0];
      first.parentNode!.insertBefore(script, first);
    };
    ttq.load(pixelId);
    ttq.page();
  })(window, document, "ttq");
  /* eslint-enable */
}

const PixelLoader = () => {
  const [consented, setConsented] = useState(() => hasMarketingConsent());
  const [settings, setSettings] = useState<PixelSettings>(EMPTY_PIXEL_SETTINGS);

  useEffect(() => {
    const sync = () => setConsented(hasMarketingConsent());
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!consented) return;
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("ga4_id, google_ads_id, meta_pixel_id, tiktok_pixel_id")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled && data) setSettings(data);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [consented]);

  useEffect(() => {
    if (!consented) return;
    const ga4 = settings.ga4_id?.trim() ?? "";
    const ads = settings.google_ads_id?.trim() ?? "";
    injectGoogle(ga4, ads);
    injectMeta(settings.meta_pixel_id?.trim() ?? "");
    injectTikTok(settings.tiktok_pixel_id?.trim() ?? "");
  }, [consented, settings]);

  return null;
};

export default PixelLoader;
