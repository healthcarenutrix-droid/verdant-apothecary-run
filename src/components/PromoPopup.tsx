import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  canShowPopup,
  markPopupSeen,
  POPUP_COLUMNS,
  type PopupSettings,
} from "@/lib/popup";

interface PromoPopupProps {
  /** Render the modal inline for the dashboard preview, skipping triggers and storage. */
  previewSettings?: PopupSettings;
}

const PromoPopup = ({ previewSettings }: PromoPopupProps) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PopupSettings | null>(previewSettings ?? null);
  const [open, setOpen] = useState(Boolean(previewSettings));
  const [copied, setCopied] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (previewSettings) {
      setSettings(previewSettings);
      setOpen(true);
      return;
    }

    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("popup_settings")
        .select(POPUP_COLUMNS)
        .eq("id", true)
        .maybeSingle();
      if (active && data) setSettings(data as PopupSettings);
    };
    void load();
    return () => {
      active = false;
    };
  }, [previewSettings]);

  const show = useCallback(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (previewSettings || !settings?.enabled) return;
    if (!canShowPopup(settings.frequency)) return;

    if (settings.trigger_type === "load") {
      const id = window.setTimeout(show, 400);
      return () => window.clearTimeout(id);
    }

    if (settings.trigger_type === "delay") {
      const id = window.setTimeout(show, Math.max(0, settings.trigger_delay_seconds) * 1000);
      return () => window.clearTimeout(id);
    }

    if (settings.trigger_type === "exit") {
      const onLeave = (event: MouseEvent) => {
        if (event.clientY <= 0) show();
      };
      document.addEventListener("mouseout", onLeave);
      return () => document.removeEventListener("mouseout", onLeave);
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      if (percent >= settings.trigger_scroll_percent) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [previewSettings, settings, show]);

  const close = useCallback(() => {
    setOpen(false);
    if (!previewSettings && settings) markPopupSeen(settings.frequency);
  }, [previewSettings, settings]);

  useEffect(() => {
    if (!open || previewSettings) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, previewSettings, close]);

  if (!settings || !settings.enabled || !open) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(settings.discount_code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCta = () => {
    const link = settings.button_link.trim();
    close();
    if (!link) return;
    if (/^https?:\/\//i.test(link)) window.open(link, "_blank", "noopener,noreferrer");
    else navigate(link.startsWith("/") ? link : `/${link}`);
  };

  const card = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={settings.headline}
      className="relative w-full max-w-[22rem] sm:max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close popup"
        className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-foreground shadow transition-colors hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>

      {settings.image_url && (
        <img
          src={settings.image_url}
          alt={settings.headline}
          className="h-40 w-full object-cover sm:h-52"
          loading="lazy"
        />
      )}

      <div className="space-y-4 p-5 text-center sm:p-7">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{settings.headline}</h2>
        {settings.body_text && (
          <p className="text-sm text-muted-foreground sm:text-base">{settings.body_text}</p>
        )}

        {settings.discount_code && (
          <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-3">
            <span className="font-mono text-base font-semibold tracking-widest text-foreground">
              {settings.discount_code}
            </span>
            <Button type="button" size="sm" variant="outline" onClick={copyCode}>
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        )}

        {settings.button_text && (
          <Button className="w-full" size="lg" onClick={handleCta}>
            {settings.button_text}
          </Button>
        )}
      </div>
    </div>
  );

  if (previewSettings) return <div className="flex justify-center">{card}</div>;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={close}
    >
      {card}
    </div>
  );
};

export default PromoPopup;
