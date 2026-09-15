import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/consent";

const GOOGLE_ADS_ID = "AW-10833445743";
const TIKTOK_PIXEL_ID = "D9QNEOJC77U05N07MKL0";
const META_PIXEL_ID = "YOUR_FB_PIXEL_ID";

function injectGoogleAds() {
  if (typeof window.gtag === "function") return; // already injected
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);
}

function injectTikTok() {
  if (window.ttq && Array.isArray(window.ttq)) return; // already injected
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
    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  })(window, document, "ttq");
  /* eslint-enable */
}

function injectMeta() {
  if (typeof window.fbq === "function") return; // already injected
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

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");

  // <noscript> fallback pixel (must live in <body>, never <head>)
  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

const TrackingScripts = () => {
  const location = useLocation();
  const injectedRef = useRef(false);

  // One-time injection, gated on cookie consent
  useEffect(() => {
    const maybeInject = () => {
      if (injectedRef.current || !hasMarketingConsent()) return;
      injectedRef.current = true;
      injectGoogleAds();
      injectTikTok();
      injectMeta();
    };

    maybeInject();
    if (!injectedRef.current) {
      window.addEventListener(CONSENT_EVENT, maybeInject);
      window.addEventListener("storage", maybeInject);
      return () => {
        window.removeEventListener(CONSENT_EVENT, maybeInject);
        window.removeEventListener("storage", maybeInject);
      };
    }
  }, []);

  // Re-fire pageview equivalents on client-side route changes
  const isFirstRoute = useRef(true);
  useEffect(() => {
    if (!injectedRef.current) return;
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return; // initial pageview already fired by the snippets above
    }
    if (!hasMarketingConsent()) return;
    window.gtag?.("event", "page_view", { send_to: GOOGLE_ADS_ID });
    window.ttq?.page?.();
    window.fbq?.("track", "PageView");
  }, [location.pathname, location.search]);

  return null;
};

export default TrackingScripts;
