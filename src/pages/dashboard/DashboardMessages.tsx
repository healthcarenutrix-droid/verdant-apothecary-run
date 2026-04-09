import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Mail, MailOpen, Reply, Archive, Trash2, Search, Filter,
  Eye, Send, Clock, CheckCircle2, AlertCircle, MessageSquare, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  getMessages, updateMessage, deleteMessage, ContactMessage,
} from "@/data/dashboard-data";

const statusConfig = {
  unread: { label: "Unread", icon: Mail, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  read: { label: "Read", icon: MailOpen, color: "bg-muted text-muted-foreground border-border" },
  replied: { label: "Replied", icon: CheckCircle2, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  archived: { label: "Archived", icon: Archive, color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

const DashboardMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>(getMessages());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const refresh = () => setMessages(getMessages());

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [messages, search, statusFilter]);

  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter((m) => m.status === "unread").length,
    replied: messages.filter((m) => m.status === "replied").length,
    archived: messages.filter((m) => m.status === "archived").length,
  }), [messages]);

  const openMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === "unread") {
      const updated = { ...msg, status: "read" as const };
      updateMessage(updated);
      refresh();
    }
  };

  const handleReply = () => {
    if (!selectedMsg || !replyText.trim()) return;
    const updated: ContactMessage = {
      ...selectedMsg,
      status: "replied",
      reply: replyText,
      repliedAt: new Date().toISOString(),
    };
    updateMessage(updated);
    refresh();
    setSelectedMsg(updated);
    setShowReplyDialog(false);
    setReplyText("");
    toast({ title: "Reply sent", description: `Reply sent to ${updated.name}` });
  };

  const handleStatusChange = (id: string, status: ContactMessage["status"]) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    updateMessage({ ...msg, status });
    refresh();
    if (selectedMsg?.id === id) setSelectedMsg({ ...msg, status });
    toast({ title: "Status updated" });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMessage(deleteId);
    refresh();
    if (selectedMsg?.id === deleteId) setSelectedMsg(null);
    setDeleteId(null);
    toast({ title: "Message deleted" });
  };

  const handleBulkAction = (action: "read" | "archived" | "delete") => {
    selectedIds.forEach((id) => {
      if (action === "delete") {
        deleteMessage(id);
      } else {
        const msg = messages.find((m) => m.id === id);
        if (msg) updateMessage({ ...msg, status: action });
      }
    });
    refresh();
    setSelectedIds(new Set());
    toast({ title: `Bulk ${action} applied to ${selectedIds.size} messages` });
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((m) => m.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground text-sm">Manage customer inquiries from the contact form</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare, cls: "text-foreground" },
          { label: "Unread", value: stats.unread, icon: Mail, cls: "text-blue-600" },
          { label: "Replied", value: stats.replied, icon: CheckCircle2, cls: "text-green-600" },
          { label: "Archived", value: stats.archived, icon: Archive, cls: "text-orange-600" },
        ].map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${s.cls}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex gap-2 items-center bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("read")}>
              <MailOpen className="h-3.5 w-3.5 mr-1" /> Mark Read
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("archived")}>
              <Archive className="h-3.5 w-3.5 mr-1" /> Archive
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Messages list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
        {/* List */}
        <div className="lg:col-span-2 border border-border rounded-xl overflow-hidden bg-card">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <Checkbox
              checked={filtered.length > 0 && selectedIds.size === filtered.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-xs text-muted-foreground">{filtered.length} messages</span>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No messages found</p>
              </div>
            ) : (
              filtered.map((msg) => {
                const cfg = statusConfig[msg.status];
                const isActive = selectedMsg?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                      isActive ? "bg-accent" : ""
                    } ${msg.status === "unread" ? "bg-primary/[0.03]" : ""}`}
                    onClick={() => openMessage(msg)}
                  >
                    <Checkbox
                      checked={selectedIds.has(msg.id)}
                      onCheckedChange={() => toggleSelect(msg.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${msg.status === "unread" ? "font-semibold" : "font-medium"}`}>
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {format(new Date(msg.date), "MMM d")}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${msg.status === "unread" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.message}</p>
                      <Badge variant="outline" className={`mt-1 text-[10px] px-1.5 py-0 ${cfg.color}`}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 border border-border rounded-xl bg-card">
          {selectedMsg ? (
            <div className="flex flex-col h-full">
              <div className="p-4 md:p-6 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedMsg.subject}</h2>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{selectedMsg.name}</span>
                      <span>·</span>
                      <span>{selectedMsg.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(selectedMsg.date), "PPpp")}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => { setReplyText(""); setShowReplyDialog(true); }}
                      title="Reply"
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStatusChange(selectedMsg.id, "archived")}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(selectedMsg.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
                {/* Original message */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
                </div>

                {/* Reply if exists */}
                {selectedMsg.reply && (
                  <div className="border-l-4 border-primary rounded-lg p-4 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Your Reply</span>
                      {selectedMsg.repliedAt && (
                        <span className="text-xs text-muted-foreground">
                          · {format(new Date(selectedMsg.repliedAt), "PPpp")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMsg.reply}</p>
                  </div>
                )}
              </div>
              {/* Quick reply inline */}
              {selectedMsg.status !== "replied" && (
                <div className="p-4 border-t border-border">
                  <Button onClick={() => { setReplyText(""); setShowReplyDialog(true); }} className="w-full">
                    <Reply className="h-4 w-4 mr-2" /> Write a Reply
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Select a message</p>
                <p className="text-sm">Click on a message to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMsg?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border">
              <p className="font-medium text-foreground mb-1">Original: {selectedMsg?.subject}</p>
              <p className="line-clamp-3">{selectedMsg?.message}</p>
            </div>
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>Cancel</Button>
            <Button onClick={handleReply} disabled={!replyText.trim()}>
              <Send className="h-4 w-4 mr-2" /> Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardMessages;
