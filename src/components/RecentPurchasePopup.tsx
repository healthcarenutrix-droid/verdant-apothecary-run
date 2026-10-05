import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Truck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  BADGE_TEXT, DEFAULT_PROOF_SETTINGS, DISMISS_KEY, LANG_KEY, PROOF_COLUMNS,
  fetchRecentPurchases, formatPKR, headline, timeAgo,
  type ProofLang, type PurchaseNotice, type SocialProofSettings,
} from "@/lib/socialProof";

interface Props {
  /** Admin preview: use these settings instead of loading, ignore dismissal. */
  previewSettings?: SocialProofSettings;
}

const LANGS: { id: ProofLang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "roman", label: "Roman" },
  { id: "ur", label: "اردو" },
];

const RecentPurchasePopup = ({ previewSettings }: Props) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SocialProofSettings | null>(previewSettings ?? null);
  const [queue, setQueue] = useState<PurchaseNotice[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => !previewSettings && sessionStorage.getItem(DISMISS_KEY) === "1",
  );
  const [lang, setLang] = useState<ProofLang | null>(() => localStorage.getItem(LANG_KEY) as ProofLang | null);
  const hovered = useRef(false);
  const timer = useRef<number>();

  useEffect(() => { if (previewSettings) setSettings(previewSettings); }, [previewSettings]);

  useEffect(() => {
    if (previewSettings || dismissed) return;
    supabase.from("social_proof_settings").select(PROOF_COLUMNS).eq("id", true).maybeSingle()
      .then(({ data }) => setSettings({ ...DEFAULT_PROOF_SETTINGS, ...((data as any) || {}) }));
  }, [previewSettings, dismissed]);

  const productKey = settings?.product_ids.join(",");
  useEffect(() => {
    if (!settings?.enabled) return;
    fetchRecentPurchases(settings.product_ids).then((q) => { setQueue(q); setIndex(0); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.enabled, productKey]);

  // Show/hide loop
  useEffect(() => {
    if (!settings?.enabled || dismissed || !queue.length) return;
    const show = (delay: number) => {
      timer.current = window.setTimeout(() => {
        setVisible(true);
        hide();
      }, delay * 1000);
    };
    const hide = () => {
      timer.current = window.setTimeout(function tick() {
        if (hovered.current) { timer.current = window.setTimeout(tick, 500); return; }
        setVisible(false);
        setIndex((i) => (i + 1) % queue.length);
        show(settings.gap_seconds);
      }, settings.display_seconds * 1000);
    };
    show(settings.initial_delay_seconds);
    return () => window.clearTimeout(timer.current);
  }, [settings?.enabled, settings?.initial_delay_seconds, settings?.display_seconds, settings?.gap_seconds, queue, dismissed]);

  if (!settings?.enabled || dismissed || !queue.length) return null;
  const n = queue[index];
  const l: ProofLang = lang ?? settings.language;
  const rtl = l === "ur";
  const badge = settings.badge !== "none" ? BADGE_TEXT[settings.badge][l] : null;
  const hiddenMotion = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  }[settings.animation_direction];

  const close = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    window.clearTimeout(timer.current);
    if (!previewSettings) { sessionStorage.setItem(DISMISS_KEY, "1"); setDismissed(true); }
  };

  const chooseLang = (e: React.MouseEvent, id: ProofLang) => {
    e.stopPropagation();
    setLang(id);
    localStorage.setItem(LANG_KEY, id);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      dir={rtl ? "rtl" : "ltr"}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
      onClick={() => navigate(`/product/${n.productId}`)}
      className={cn(
        "fixed z-40 left-3 right-3 sm:left-auto sm:right-auto sm:w-[380px] cursor-pointer",
        settings.position.startsWith("top-") ? "top-24 sm:top-5" : "bottom-20 sm:bottom-5",
        settings.position.endsWith("-left") && "sm:left-5",
        settings.position.endsWith("-right") && "sm:right-5",
        settings.position.endsWith("-center") && "sm:left-1/2 sm:-translate-x-1/2",
        "overflow-hidden rounded-lg bg-card text-card-foreground border-2 border-primary/70 shadow-xl p-3.5 pe-9",
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : cn("opacity-0 pointer-events-none", hiddenMotion),
        rtl && "font-urdu",
      )}
    >
      <span className="absolute inset-y-0 start-0 w-1.5 bg-primary" aria-hidden="true" />
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-2 end-2 h-7 w-7 rounded-full flex items-center justify-center bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex gap-3">
        <img src={n.image} alt="" loading="lazy" width={64} height={64}
          className="h-16 w-16 rounded-xl object-cover bg-muted shrink-0" />
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-medium text-foreground/80", rtl && "leading-7")}>{headline(n, l)}</p>
          <p className="text-sm font-bold text-foreground truncate" dir="auto">{n.product}</p>
          <p className={cn("text-xs text-foreground/75", rtl && "leading-7")}>
            <span className="font-bold text-primary" dir="ltr">{formatPKR(n.price)}</span> · {timeAgo(n.timestamp, l)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        {badge ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1">
            {settings.badge === "cod" ? <Truck className="h-3 w-3" /> : <BadgeCheck className="h-3 w-3" />}
            {badge}
          </span>
        ) : <span />}
        <div className="flex rounded-full border border-border overflow-hidden text-[10px]" dir="ltr">
          {LANGS.map((o) => (
            <button key={o.id} type="button" onClick={(e) => chooseLang(e, o.id)}
              className={cn("px-2 py-0.5", l === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted", o.id === "ur" && "font-urdu")}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPurchasePopup;
