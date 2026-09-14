import { useEffect, useState } from "react";
import { Save, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EMPTY_PIXEL_SETTINGS, type PixelSettings } from "@/lib/pixels";

const fields: { key: keyof PixelSettings; label: string; placeholder: string; helper: string }[] = [
  {
    key: "ga4_id",
    label: "Google Analytics 4 Measurement ID",
    placeholder: "G-XXXXXXXXXX",
    helper: "Google Analytics → Admin → Data Streams → your web stream. Starts with G-.",
  },
  {
    key: "google_ads_id",
    label: "Google Ads Conversion ID",
    placeholder: "AW-XXXXXXXXX",
    helper: "Google Ads → Goals → Conversions → Google tag. Starts with AW-.",
  },
  {
    key: "meta_pixel_id",
    label: "Meta (Facebook) Pixel ID",
    placeholder: "123456789012345",
    helper: "Meta Events Manager → Data Sources → your pixel. A 15–16 digit number.",
  },
  {
    key: "tiktok_pixel_id",
    label: "TikTok Pixel ID",
    placeholder: "CXXXXXXXXXXXXXXXXXXX",
    helper: "TikTok Ads Manager → Tools → Events → Web Events → your pixel.",
  },
];

const DashboardPixels = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PixelSettings>(EMPTY_PIXEL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("ga4_id, google_ads_id, meta_pixel_id, tiktok_pixel_id")
        .eq("id", 1)
        .maybeSingle();
      if (data) setSettings({ ...EMPTY_PIXEL_SETTINGS, ...data });
      if (error) toast({ title: "Could not load pixel settings", description: error.message, variant: "destructive" });
      setLoading(false);
    };
    void load();
  }, [toast]);

  const update = (key: keyof PixelSettings, value: string) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    const trimmed: PixelSettings = {
      ga4_id: settings.ga4_id.trim(),
      google_ads_id: settings.google_ads_id.trim(),
      meta_pixel_id: settings.meta_pixel_id.trim(),
      tiktok_pixel_id: settings.tiktok_pixel_id.trim(),
    };

    if (trimmed.ga4_id && !/^G-[A-Z0-9]{6,}$/i.test(trimmed.ga4_id)) {
      toast({ title: "Check the GA4 ID", description: "It should look like G-XXXXXXX.", variant: "destructive" });
      return;
    }
    if (trimmed.google_ads_id && !/^AW-\d{6,}$/i.test(trimmed.google_ads_id)) {
      toast({ title: "Check the Google Ads ID", description: "It should look like AW-123456789.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...trimmed, updated_at: new Date().toISOString() });
    setSaving(false);

    if (error) {
      toast({ title: "Could not save pixel settings", description: error.message, variant: "destructive" });
      return;
    }

    setSettings(trimmed);
    toast({ title: "Pixel settings saved", description: "New visitors will load the updated tags." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pixel Settings</h1>
        <p className="text-sm text-muted-foreground">
          Connect your advertising and analytics tags. Leave a field empty to keep that tag switched off.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Radar className="h-5 w-5" /> Tracking IDs
          </CardTitle>
          <CardDescription>
            Tags only load for visitors who accept cookies on the storefront banner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={settings[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => update(field.key, event.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">{field.helper}</p>
            </div>
          ))}

          <Button onClick={handleSave} disabled={loading || saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPixels;
