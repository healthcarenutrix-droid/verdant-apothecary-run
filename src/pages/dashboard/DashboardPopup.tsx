import { useEffect, useRef, useState } from "react";
import { ImagePlus, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PromoPopup from "@/components/PromoPopup";
import {
  DEFAULT_POPUP_SETTINGS,
  FREQUENCY_OPTIONS,
  POPUP_COLUMNS,
  TRIGGER_OPTIONS,
  type PopupFrequency,
  type PopupSettings,
  type PopupTriggerType,
} from "@/lib/popup";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

const DashboardPopup = () => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<PopupSettings>(DEFAULT_POPUP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("popup_settings")
        .select(POPUP_COLUMNS)
        .eq("id", true)
        .maybeSingle();
      if (data) setSettings({ ...DEFAULT_POPUP_SETTINGS, ...(data as PopupSettings) });
      if (error) toast({ title: "Could not load popup settings", description: error.message, variant: "destructive" });
      setLoading(false);
    };
    void load();
  }, [toast]);

  const update = <Key extends keyof PopupSettings>(key: Key, value: PopupSettings[Key]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const handleImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Choose an image file", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: "Image is too large", description: "Please use an image under 1.5 MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("image_url", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const headline = settings.headline.trim();
    if (!headline) {
      toast({ title: "Headline is required", variant: "destructive" });
      return;
    }

    const payload = {
      id: true,
      enabled: settings.enabled,
      image_url: settings.image_url,
      headline,
      body_text: settings.body_text.trim(),
      discount_code: settings.discount_code.trim().toUpperCase(),
      button_text: settings.button_text.trim(),
      button_link: settings.button_link.trim(),
      trigger_type: settings.trigger_type,
      trigger_delay_seconds: Math.min(600, Math.max(0, Number(settings.trigger_delay_seconds) || 0)),
      trigger_scroll_percent: Math.min(100, Math.max(1, Number(settings.trigger_scroll_percent) || 1)),
      frequency: settings.frequency,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    const { error } = await supabase.from("popup_settings").upsert(payload);
    setSaving(false);

    if (error) {
      toast({ title: "Could not save popup settings", description: error.message, variant: "destructive" });
      return;
    }

    setSettings({ ...settings, ...payload });
    toast({ title: "Popup settings saved", description: "The storefront popup is updated live." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Popup Settings</h1>
        <p className="text-sm text-muted-foreground">
          Show a promotional popup with a discount code anywhere on the store.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5" /> Promotional popup
            </CardTitle>
            <CardDescription>Everything here updates the storefront popup immediately after saving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="popup-enabled">Enable popup</Label>
                <p className="text-xs text-muted-foreground">Master on/off switch for all visitors.</p>
              </div>
              <Switch
                id="popup-enabled"
                checked={settings.enabled}
                onCheckedChange={(value) => update("enabled", value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Banner image</Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImage(event.target.files?.[0])}
                />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="mr-2 h-4 w-4" /> Upload image
                </Button>
                {settings.image_url && (
                  <Button type="button" variant="ghost" onClick={() => update("image_url", "")}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                )}
              </div>
              {settings.image_url && (
                <img
                  src={settings.image_url}
                  alt="Popup banner preview"
                  className="h-36 w-full rounded-lg object-cover"
                />
              )}
              <p className="text-xs text-muted-foreground">PNG or JPG up to 1.5 MB. You can also paste an image URL below.</p>
              <Input
                value={settings.image_url.startsWith("data:") ? "" : settings.image_url}
                placeholder="https://example.com/banner.jpg"
                onChange={(event) => update("image_url", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="popup-headline">Headline</Label>
              <Input
                id="popup-headline"
                value={settings.headline}
                maxLength={120}
                onChange={(event) => update("headline", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="popup-body">Body text</Label>
              <Textarea
                id="popup-body"
                rows={3}
                maxLength={400}
                value={settings.body_text}
                onChange={(event) => update("body_text", event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="popup-code">Discount code</Label>
                <Input
                  id="popup-code"
                  value={settings.discount_code}
                  maxLength={40}
                  placeholder="WELCOME10"
                  onChange={(event) => update("discount_code", event.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty to hide the code box.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="popup-button-text">Button text</Label>
                <Input
                  id="popup-button-text"
                  value={settings.button_text}
                  maxLength={40}
                  onChange={(event) => update("button_text", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="popup-button-link">Button link</Label>
              <Input
                id="popup-button-link"
                value={settings.button_link}
                maxLength={300}
                placeholder="/products"
                onChange={(event) => update("button_link", event.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use a store path like /products, or a full https:// link.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select
                  value={settings.trigger_type}
                  onValueChange={(value) => update("trigger_type", value as PopupTriggerType)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRIGGER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {settings.trigger_type === "delay" && (
                <div className="space-y-2">
                  <Label htmlFor="popup-delay">Delay (seconds)</Label>
                  <Input
                    id="popup-delay"
                    type="number"
                    min={0}
                    max={600}
                    value={settings.trigger_delay_seconds}
                    onChange={(event) => update("trigger_delay_seconds", Number(event.target.value))}
                  />
                </div>
              )}

              {settings.trigger_type === "scroll" && (
                <div className="space-y-2">
                  <Label htmlFor="popup-scroll">Scroll percentage</Label>
                  <Input
                    id="popup-scroll"
                    type="number"
                    min={1}
                    max={100}
                    value={settings.trigger_scroll_percent}
                    onChange={(event) => update("trigger_scroll_percent", Number(event.target.value))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) => update("frequency", value as PopupFrequency)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading || saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Live preview</CardTitle>
            <CardDescription>This is how the popup looks to shoppers.</CardDescription>
          </CardHeader>
          <CardContent>
            <PromoPopup previewSettings={{ ...settings, enabled: true }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPopup;
