import { useEffect, useState, Fragment } from "react";
import { format } from "date-fns";
import { Mail, Save, Send, RefreshCw, Power, ChevronDown, ChevronRight, Package, User, MapPin, MessageSquare } from "lucide-react";
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

interface OrderItem {
  id: string;
  name: string;
  variant?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderPayload {
  orderId?: string;
  placedAt?: string;
  customer?: { name?: string; email?: string; phone?: string };
  shipping?: { address?: string; city?: string; state?: string; zip?: string; country?: string };
  items?: OrderItem[];
  itemCount?: number;
  total?: number;
  currency?: string;
  paymentMethod?: string;
}

interface NotificationEvent {
  id: string;
  event_type: string;
  subject: string;
  body: string;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  payload: any;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  sent: "bg-green-500/10 text-green-600 border-green-500/20",
  skipped: "bg-muted text-muted-foreground border-border",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
};

const formatMoney = (n: number, currency = "PKR") =>
  `${currency === "PKR" ? "₨" : currency} ${Number(n ?? 0).toLocaleString()}`;

const OrderDetails = ({ payload }: { payload: OrderPayload }) => {
  const { customer, shipping, items = [], total, currency, paymentMethod, orderId, itemCount } = payload;
  return (
    <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/30 rounded-md border border-border">
      <div className="space-y-3">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
            <Package className="h-4 w-4" /> Order
          </h4>
          <p className="text-xs text-muted-foreground">ID: <span className="font-mono">{orderId ?? "—"}</span></p>
          <p className="text-xs text-muted-foreground">Items: {itemCount ?? items.length}</p>
          <p className="text-xs text-muted-foreground">Payment: {paymentMethod ?? "—"}</p>
          <p className="text-sm font-semibold mt-1">Total: {formatMoney(total ?? 0, currency)}</p>
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
            <User className="h-4 w-4" /> Customer
          </h4>
          <p className="text-xs">{customer?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{customer?.email ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{customer?.phone ?? "—"}</p>
        </div>
        {shipping && (
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
              <MapPin className="h-4 w-4" /> Shipping
            </h4>
            <p className="text-xs text-muted-foreground">
              {[shipping.address, shipping.city, shipping.state, shipping.zip, shipping.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Line items</h4>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No items.</p>
        ) : (
          <div className="rounded-md border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">Item</TableHead>
                  <TableHead className="h-8 text-xs text-right">Qty</TableHead>
                  <TableHead className="h-8 text-xs text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, idx) => (
                  <TableRow key={`${it.id}-${idx}`}>
                    <TableCell className="py-2 text-xs">
                      <div className="font-medium">{it.name}</div>
                      {it.variant && <div className="text-muted-foreground">{it.variant}</div>}
                    </TableCell>
                    <TableCell className="py-2 text-xs text-right">{it.quantity}</TableCell>
                    <TableCell className="py-2 text-xs text-right">{formatMoney(it.lineTotal, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

const GenericDetails = ({ event }: { event: NotificationEvent }) => (
  <div className="p-4 bg-muted/30 rounded-md border border-border space-y-3">
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
        <MessageSquare className="h-4 w-4" /> Body
      </h4>
      <pre className="text-xs whitespace-pre-wrap font-sans text-muted-foreground">{event.body}</pre>
    </div>
    {event.payload && (
      <div>
        <h4 className="text-sm font-semibold mb-1">Payload</h4>
        <pre className="text-[11px] whitespace-pre-wrap font-mono text-muted-foreground bg-background p-2 rounded border border-border overflow-x-auto">
          {JSON.stringify(event.payload, null, 2)}
        </pre>
      </div>
    )}
    {event.error_message && (
      <p className="text-xs text-red-600">Error: {event.error_message}</p>
    )}
  </div>
);

const DashboardEmail = () => {
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  useEffect(() => { loadAll(); }, []);

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
      body: `This is a test notification queued at ${new Date().toLocaleString()}.`,
    });
    toast({ title: "Test notification queued", description: `Recipient: ${recipientEmail}` });
    loadAll();
  };

  const toggleExpand = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const renderSummary = (ev: NotificationEvent) => {
    if (ev.event_type === "order" && ev.payload) {
      const p = ev.payload as OrderPayload;
      return (
        <span className="text-xs text-muted-foreground">
          {p.customer?.name ?? "—"} • {p.itemCount ?? p.items?.length ?? 0} items • {formatMoney(p.total ?? 0, p.currency)}
        </span>
      );
    }
    return <span className="text-xs text-muted-foreground truncate block max-w-md">{ev.subject}</span>;
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
            your inbox, an email sender domain needs to be configured.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notification Events</CardTitle>
          <CardDescription>
            The 50 most recent triggers — click a row to see structured order details.
          </CardDescription>
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
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev) => {
                    const isOpen = !!expanded[ev.id];
                    return (
                      <Fragment key={ev.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleExpand(ev.id)}
                        >
                          <TableCell>
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </TableCell>
                          <TableCell className="capitalize font-medium">{ev.event_type}</TableCell>
                          <TableCell>{renderSummary(ev)}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{ev.recipient_email ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[ev.status] ?? ""}>
                              {ev.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {format(new Date(ev.created_at), "MMM d, HH:mm")}
                          </TableCell>
                        </TableRow>
                        {isOpen && (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="p-3">
                              {ev.event_type === "order" && ev.payload ? (
                                <OrderDetails payload={ev.payload as OrderPayload} />
                              ) : (
                                <GenericDetails event={ev} />
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
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
