import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, Save, Send, RefreshCw, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { queueNotification } from "@/lib/notifications";

interface NotificationEvent {
  id: string;
  event_type: string;
  subject: string;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  sent: "bg-green-500/10 text-green-600 border-green-500/20",
  skipped: "bg-muted text-muted-foreground border-border",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
};

const DashboardEmail = () => {
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<NotificationEvent[]>([]);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: s }, { data: e }] = await Promise.all([
      supabase.from("notification_settings").select("*").eq("id", true).maybeSingle(),
      supabase.from("notification_events").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (s) {
      setRecipientEmail(s.recipient_email);
      setEnabled(s.enabled);
    }
    setEvents((e ?? []) as NotificationEvent[]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    if (!validateEmail(recipientEmail)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("notification_settings")
      .update({ recipient_email: recipientEmail.trim(), enabled, updated_at: new Date().toISOString() })
      .eq("id", true);
    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Settings saved", description: enabled ? "Notifications are ON." : "Notifications are OFF." });
  };

  const handleToggle = async (next: boolean) => {
    setEnabled(next);
    const { error } = await supabase
      .from("notification_settings")
      .update({ enabled: next, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      setEnabled(!next);
    } else {
      toast({ title: next ? "Notifications enabled" : "Notifications disabled" });
    }
  };

  const handleTest = async () => {
    if (!validateEmail(recipientEmail)) {
      toast({ title: "Save a valid email first", variant: "destructive" });
      return;
    }
    await queueNotification({
      eventType: "test",
      subject: "Test notification from Healthcare Nutrix",
      body: `This is a test notification queued at ${new Date().toLocaleString()}.\n\nIf you can see this entry in the log, the notification system is wired up correctly.`,
    });
    toast({ title: "Test notification queued", description: `Recipient: ${recipientEmail}` });
    loadAll();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Email Notifications</h1>
        <p className="text-muted-foreground text-sm">
          Get notified by email whenever a new order is placed or a contact message is received.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Notification Settings
          </CardTitle>
          <CardDescription>
            Set the email that should receive alerts and toggle notifications on/off.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient email</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="you@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Power className="h-4 w-4" /> Enable notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                When off, new orders and messages won't trigger an email.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={handleToggle} disabled={loading} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={loading}>
              <Send className="h-4 w-4 mr-2" /> Send Test Notification
            </Button>
            <Button variant="ghost" onClick={loadAll} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>

          <div className="rounded-md bg-muted/50 border border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Notification events are
            currently being logged in the system below. To deliver them as actual emails to
            your inbox, an email sender domain needs to be configured. Let me know when
            you're ready to set that up.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notification Events</CardTitle>
          <CardDescription>The 50 most recent triggers — orders, messages and tests.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notification events yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell className="capitalize">{ev.event_type}</TableCell>
                      <TableCell className="max-w-xs truncate">{ev.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{ev.recipient_email ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[ev.status] ?? ""}>
                          {ev.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {format(new Date(ev.created_at), "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEmail;
