import { useEffect, useState } from "react";
import { Megaphone, Save } from "lucide-react";
import AnnouncementBar, {
  DEFAULT_ANNOUNCEMENT_SETTINGS,
  type AnnouncementSettings,
} from "@/components/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DashboardAnnouncement = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AnnouncementSettings>(DEFAULT_ANNOUNCEMENT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("announcement_settings")
        .select("announcement_text, enabled, background_color, text_color")
        .eq("id", true)
        .maybeSingle();

      if (data) setSettings(data);
      if (error) toast({ title: "Could not load announcement", description: error.message, variant: "destructive" });
      setLoading(false);
    };

    void loadSettings();
  }, [toast]);

  const updateSetting = <Key extends keyof AnnouncementSettings>(key: Key, value: AnnouncementSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    const announcementText = settings.announcement_text.trim();
    if (!announcementText) {
      toast({ title: "Announcement text is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("announcement_settings").upsert({
      id: true,
      announcement_text: announcementText,
      enabled: settings.enabled,
      background_color: settings.background_color,
      text_color: settings.text_color,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);

    if (error) {
      toast({ title: "Could not save announcement", description: error.message, variant: "destructive" });
      return;
    }

    setSettings((current) => ({ ...current, announcement_text: announcementText }));
    toast({ title: "Announcement bar updated", description: "The storefront has been updated live." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Announcement Bar</h1>
        <p className="text-sm text-muted-foreground">Control the scrolling message shown above the store navigation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Megaphone className="h-5 w-5" /> Bar Settings
          </CardTitle>
          <CardDescription>Changes appear across the storefront as soon as you save.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
            <div className="space-y-1">
              <Label htmlFor="announcement-enabled">Show announcement bar</Label>
              <p className="text-sm text-muted-foreground">Turn the storefront message on or off.</p>
            </div>
            <Switch
              id="announcement-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting("enabled", checked)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-text">Announcement text</Label>
            <Input
              id="announcement-text"
              value={settings.announcement_text}
              onChange={(event) => updateSetting("announcement_text", event.target.value)}
              maxLength={160}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">{settings.announcement_text.length}/160 characters</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="announcement-background">Background color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="announcement-background"
                  type="color"
                  value={settings.background_color}
                  onChange={(event) => updateSetting("background_color", event.target.value.toUpperCase())}
                  className="h-10 w-14 cursor-pointer p-1"
                  disabled={loading}
                />
                <Input
                  value={settings.background_color}
                  onChange={(event) => updateSetting("background_color", event.target.value)}
                  aria-label="Background color hex value"
                  maxLength={7}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcement-text-color">Text color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="announcement-text-color"
                  type="color"
                  value={settings.text_color}
                  onChange={(event) => updateSetting("text_color", event.target.value.toUpperCase())}
                  className="h-10 w-14 cursor-pointer p-1"
                  disabled={loading}
                />
                <Input
                  value={settings.text_color}
                  onChange={(event) => updateSetting("text_color", event.target.value)}
                  aria-label="Text color hex value"
                  maxLength={7}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <AnnouncementBar settings={settings} preview />
            {!settings.enabled && <p className="text-sm text-muted-foreground">Enable the bar to see its preview.</p>}
          </div>

          <Button onClick={handleSave} disabled={loading || saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Announcement"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnnouncement;
