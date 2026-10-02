import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ShoppingBag, MessageSquare, PackageMinus, Info, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Notif {
  id: string;
  event_type: string;
  subject: string;
  created_at: string;
  is_read: boolean;
}

const META: Record<string, { icon: typeof Bell; path: string }> = {
  order: { icon: ShoppingBag, path: "/dashboard/orders" },
  message: { icon: MessageSquare, path: "/dashboard/messages" },
  low_stock: { icon: PackageMinus, path: "/dashboard/products" },
};

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("notification_events")
      .select("id, event_type, subject, created_at, is_read")
      .neq("event_type", "test")
      .order("created_at", { ascending: false })
      .limit(30);
    setItems((data as Notif[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notification_events" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const unread = items.filter((i) => !i.is_read).length;

  const markRead = async (ids: string[]) => {
    if (!ids.length) return;
    setItems((prev) => prev.map((i) => (ids.includes(i.id) ? { ...i, is_read: true } : i)));
    await supabase.from("notification_events").update({ is_read: true }).in("id", ids);
  };

  const openItem = (n: Notif) => {
    markRead([n.id]);
    setOpen(false);
    navigate(META[n.event_type]?.path || "/dashboard/email");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm">Notifications</p>
          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!unread}
            onClick={() => markRead(items.filter((i) => !i.is_read).map((i) => i.id))}>
            <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
          </Button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No notifications yet</p>
          ) : items.map((n) => {
            const Icon = META[n.event_type]?.icon || Info;
            return (
              <button key={n.id} onClick={() => openItem(n)}
                className={cn("w-full flex gap-3 px-4 py-3 text-left border-b border-border last:border-0 hover:bg-muted transition-colors", !n.is_read && "bg-primary/5")}>
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", !n.is_read ? "font-semibold text-foreground" : "text-muted-foreground")}>{n.subject}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
              </button>
            );
          })}
        </div>
        <button onClick={() => { setOpen(false); navigate("/dashboard/email"); }}
          className="w-full text-xs text-primary py-2.5 border-t border-border hover:bg-muted">View all</button>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
