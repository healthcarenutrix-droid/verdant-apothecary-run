import { useEffect, useState, type CSSProperties } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnnouncementSettings {
  announcement_text: string;
  enabled: boolean;
  background_color: string;
  text_color: string;
}

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  announcement_text: "Free Shipping on All Orders",
  enabled: true,
  background_color: "#2F6B2F",
  text_color: "#FFFFFF",
};

interface AnnouncementBarProps {
  settings?: AnnouncementSettings;
  preview?: boolean;
}

const AnnouncementBar = ({ settings: suppliedSettings, preview = false }: AnnouncementBarProps) => {
  const [remoteSettings, setRemoteSettings] = useState<AnnouncementSettings | null>(null);

  useEffect(() => {
    if (suppliedSettings) return;

    let active = true;

    const loadSettings = async () => {
      const { data } = await supabase
        .from("announcement_settings")
        .select("announcement_text, enabled, background_color, text_color")
        .eq("id", true)
        .maybeSingle();

      if (active && data) setRemoteSettings(data);
    };

    void loadSettings();

    const channel = supabase
      .channel("storefront-announcement-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcement_settings", filter: "id=eq.true" },
        (payload) => {
          if (payload.eventType !== "DELETE") {
            setRemoteSettings(payload.new as AnnouncementSettings);
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [suppliedSettings]);

  const settings = suppliedSettings ?? remoteSettings;
  if (!settings) return null;
  if (!settings.enabled || !settings.announcement_text.trim()) return null;

  const colors = {
    "--announcement-bg": settings.background_color,
    "--announcement-fg": settings.text_color,
  } as CSSProperties;

  return (
    <div
      className={`announcement-bar ${preview ? "rounded-md" : ""}`}
      style={colors}
      role="region"
      aria-label="Store announcement"
    >
      <div className="announcement-track" aria-label={settings.announcement_text}>
        {[0, 1].map((copy) => (
          <div className="announcement-copy" aria-hidden={copy === 1} key={copy}>
            <span>{settings.announcement_text}</span>
            <span aria-hidden="true">•</span>
            <span>{settings.announcement_text}</span>
            <span aria-hidden="true">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
