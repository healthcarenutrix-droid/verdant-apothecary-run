import { useState, useMemo, useEffect } from "react";
import { Search, MoreHorizontal, Pencil, Trash2, ArrowUpDown, CheckSquare, X, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import ProductFormDialog from "@/components/dashboard/ProductFormDialog";
import { AdminProduct, getProducts, addProduct, updateProduct, deleteProduct, getCategories } from "@/data/dashboard-data";

type SortKey = "name" | "price" | "stock";

const DashboardProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>(getProducts());
  const categories = getCategories();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const perPage = 5;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Bulk edit state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>("no-change");
  const [bulkCategory, setBulkCategory] = useState<string>("no-change");
  const [bulkPriceAction, setBulkPriceAction] = useState<string>("no-change");
  const [bulkPriceValue, setBulkPriceValue] = useState("");
  const [bulkStockAction, setBulkStockAction] = useState<string>("no-change");
  const [bulkStockValue, setBulkStockValue] = useState("");

  useEffect(() => {
    const btn = document.getElementById("dashboard-add-btn");
    if (!btn) return;
    const handler = () => { setEditing(null); setFormOpen(true); };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  const reload = () => { setProducts(getProducts()); setSelectedIds(new Set()); };

  const filtered = useMemo(() => {
    let list = products;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filterCat !== "all") list = list.filter(p => p.categoryId === filterCat);
    if (filterStatus !== "all") list = list.filter(p => p.status === filterStatus);
    list = [...list].sort((a, b) => {
      const v = sortAsc ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * v;
      if (sortKey === "price") return (a.price - b.price) * v;
      return (a.stock - b.stock) * v;
    });
    return list;
  }, [products, search, filterCat, filterStatus, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleSave = (p: AdminProduct) => {
    if (editing) { updateProduct(p); toast({ title: "Product updated" }); }
    else { addProduct(p); toast({ title: "Product created" }); }
    reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProduct(deleteId);
    toast({ title: "Product deleted" });
    setDeleteId(null);
    reload();
  };

  const catName = (id: string) => categories.find(c => c.id === id)?.name || "—";

  // Bulk selection helpers
  const allPageSelected = paged.length > 0 && paged.every(p => selectedIds.has(p.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (allPageSelected) {
      const next = new Set(selectedIds);
      paged.forEach(p => next.delete(p.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paged.forEach(p => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const selectAllFiltered = () => {
    const next = new Set(selectedIds);
    filtered.forEach(p => next.add(p.id));
    setSelectedIds(next);
  };

  const clearSelection = () => setSelectedIds(new Set());

  const openBulkEdit = () => {
    setBulkStatus("no-change");
    setBulkCategory("no-change");
    setBulkPriceAction("no-change");
    setBulkPriceValue("");
    setBulkStockAction("no-change");
    setBulkStockValue("");
    setBulkEditOpen(true);
  };

  const handleBulkEdit = () => {
    let count = 0;
    selectedIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (!prod) return;
      const updated = { ...prod };
      let changed = false;

      if (bulkStatus !== "no-change") {
        updated.status = bulkStatus as "active" | "draft";
        changed = true;
      }
      if (bulkCategory !== "no-change") {
        updated.categoryId = bulkCategory;
        changed = true;
      }
      if (bulkPriceAction !== "no-change" && bulkPriceValue) {
        const val = parseFloat(bulkPriceValue);
        if (!isNaN(val)) {
          if (bulkPriceAction === "set") updated.price = val;
          else if (bulkPriceAction === "increase") updated.price = updated.price + val;
          else if (bulkPriceAction === "decrease") updated.price = Math.max(0, updated.price - val);
          else if (bulkPriceAction === "increase-pct") updated.price = Math.round(updated.price * (1 + val / 100));
          else if (bulkPriceAction === "decrease-pct") updated.price = Math.round(updated.price * (1 - val / 100));
          changed = true;
        }
      }
      if (bulkStockAction !== "no-change" && bulkStockValue) {
        const val = parseInt(bulkStockValue);
        if (!isNaN(val)) {
          if (bulkStockAction === "set") updated.stock = val;
          else if (bulkStockAction === "increase") updated.stock = updated.stock + val;
          else if (bulkStockAction === "decrease") updated.stock = Math.max(0, updated.stock - val);
          changed = true;
        }
      }

      if (changed) { updateProduct(updated); count++; }
    });

    setBulkEditOpen(false);
    toast({ title: `${count} product(s) updated` });
    reload();
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteProduct(id));
    toast({ title: `${selectedIds.size} product(s) deleted` });
    setBulkDeleteOpen(false);
    reload();
  };

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      {someSelected && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 animate-in slide-in-from-top-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {selectedIds.size} product{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          {selectedIds.size < filtered.length && (
            <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={selectAllFiltered}>
              Select all {filtered.length}
            </Button>
          )}
          <div className="flex-1" />
          <Button size="sm" variant="default" onClick={openBulkEdit}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Bulk Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <Select value={filterCat} onValueChange={v => { setFilterCat(v); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(0); }}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="sm:hidden" onClick={() => { setEditing(null); setFormOpen(true); }}>
          + Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allPageSelected && paged.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-16">Image</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                <span className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("price")}>
                <span className="flex items-center gap-1">Price <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("stock")}>
                <span className="flex items-center gap-1">Stock <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
            ) : paged.map(p => (
              <TableRow key={p.id} className={selectedIds.has(p.id) ? "bg-primary/5" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(p.id)}
                    onCheckedChange={() => toggleSelect(p.id)}
                    aria-label={`Select ${p.name}`}
                  />
                </TableCell>
                <TableCell>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{catName(p.categoryId)}</TableCell>
                <TableCell>
                  <span>₨ {p.price.toLocaleString()}</span>
                  {p.compareAtPrice && <span className="text-xs text-muted-foreground line-through ml-2">₨ {p.compareAtPrice.toLocaleString()}</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={p.stock <= 5 ? "destructive" : "secondary"}>{p.stock}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === "active" ? "default" : "outline"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditing(p); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(p.id)}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} onSave={handleSave} />

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Product{selectedIds.size > 1 ? "s" : ""}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete all selected products. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditOpen} onOpenChange={setBulkEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Bulk Edit {selectedIds.size} Product{selectedIds.size > 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription>
              Only fields you change will be updated. Leave as "No change" to skip.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-change">No change</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-change">No change</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Price</Label>
              <div className="flex gap-2">
                <Select value={bulkPriceAction} onValueChange={setBulkPriceAction}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    <SelectItem value="set">Set to</SelectItem>
                    <SelectItem value="increase">Increase by ₨</SelectItem>
                    <SelectItem value="decrease">Decrease by ₨</SelectItem>
                    <SelectItem value="increase-pct">Increase by %</SelectItem>
                    <SelectItem value="decrease-pct">Decrease by %</SelectItem>
                  </SelectContent>
                </Select>
                {bulkPriceAction !== "no-change" && (
                  <Input
                    type="number"
                    placeholder={bulkPriceAction.includes("pct") ? "e.g. 10" : "e.g. 500"}
                    value={bulkPriceValue}
                    onChange={e => setBulkPriceValue(e.target.value)}
                    className="flex-1"
                  />
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Stock</Label>
              <div className="flex gap-2">
                <Select value={bulkStockAction} onValueChange={setBulkStockAction}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-change">No change</SelectItem>
                    <SelectItem value="set">Set to</SelectItem>
                    <SelectItem value="increase">Increase by</SelectItem>
                    <SelectItem value="decrease">Decrease by</SelectItem>
                  </SelectContent>
                </Select>
                {bulkStockAction !== "no-change" && (
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={bulkStockValue}
                    onChange={e => setBulkStockValue(e.target.value)}
                    className="flex-1"
                  />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEditOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkEdit}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardProducts;
