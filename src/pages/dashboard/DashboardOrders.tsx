import { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, MoreHorizontal, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import OrderFormDialog from "@/components/dashboard/OrderFormDialog";
import { AdminOrder, getOrders, addOrder, updateOrder, deleteOrder, getProducts } from "@/data/dashboard-data";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

type SortKey = "total" | "date" | "items";

const DashboardOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>(getOrders());
  const products = getProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminOrder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const btn = document.getElementById("dashboard-add-btn");
    if (!btn) return;
    const handler = () => { setEditing(null); setFormOpen(true); };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  const reload = () => setOrders(getOrders());

  const filtered = useMemo(() => {
    let list = orders;
    if (search) list = list.filter(o =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus !== "all") list = list.filter(o => o.status === filterStatus);
    if (filterProduct !== "all") list = list.filter(o => o.productNames?.some(n => n.toLowerCase().includes(filterProduct.toLowerCase())));
    if (priceRange !== "all") {
      list = list.filter(o => {
        if (priceRange === "0-500") return o.total <= 500;
        if (priceRange === "500-1000") return o.total > 500 && o.total <= 1000;
        if (priceRange === "1000-2000") return o.total > 1000 && o.total <= 2000;
        if (priceRange === "2000+") return o.total > 2000;
        return true;
      });
    }
    list = [...list].sort((a, b) => {
      const v = sortAsc ? 1 : -1;
      if (sortKey === "total") return (a.total - b.total) * v;
      if (sortKey === "items") return (a.items - b.items) * v;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * v;
    });
    return list;
  }, [orders, search, filterStatus, filterProduct, priceRange, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleSave = (o: AdminOrder) => {
    if (editing) { updateOrder(o); toast({ title: "Order updated" }); }
    else { addOrder(o); toast({ title: "Order created" }); }
    reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteOrder(deleteId);
    toast({ title: "Order deleted" });
    setDeleteId(null);
    reload();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Price" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-500">₨ 0 – 500</SelectItem>
            <SelectItem value="500-1000">₨ 500 – 1,000</SelectItem>
            <SelectItem value="1000-2000">₨ 1,000 – 2,000</SelectItem>
            <SelectItem value="2000+">₨ 2,000+</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Product" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map(p => <SelectItem key={p.id} value={p.name}>{p.name.substring(0, 30)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="sm:hidden" onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add Order</Button>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("items")}>
                <span className="flex items-center gap-1">Items <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("total")}>
                <span className="flex items-center gap-1">Total <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No orders found</TableCell></TableRow>
            ) : filtered.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{o.customer}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                  {o.productNames?.join(", ") || "—"}
                </TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell className="font-medium">₨ {o.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusColor[o.status] || "secondary"} className="capitalize">{o.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{o.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditing(o); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(o.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderFormDialog open={formOpen} onOpenChange={setFormOpen} order={editing} onSave={handleSave} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardOrders;
