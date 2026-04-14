import { useState, useMemo, useEffect } from "react";
import { Search, MoreHorizontal, Pencil, Trash2, ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import BlogFormDialog from "@/components/dashboard/BlogFormDialog";
import { AdminBlogPost, getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "@/data/dashboard-data";

const CATEGORIES = ["All", "Wellness", "Herbs", "Remedies", "Nutrition", "Guides", "Beauty", "Spices"];

const DashboardBlogs = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<AdminBlogPost[]>(getBlogPosts());
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 8;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const btn = document.getElementById("dashboard-add-btn");
    if (!btn) return;
    const handler = () => { setEditing(null); setFormOpen(true); };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  const reload = () => setPosts(getBlogPosts());

  const filtered = useMemo(() => {
    let list = posts;
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()));
    if (filterCat !== "All") list = list.filter(p => p.category === filterCat);
    if (filterStatus !== "all") list = list.filter(p => p.status === filterStatus);
    list = [...list].sort((a, b) => {
      const v = sortAsc ? 1 : -1;
      return a.createdAt.localeCompare(b.createdAt) * v;
    });
    return list;
  }, [posts, search, filterCat, filterStatus, sortAsc]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice(page * perPage, (page + 1) * perPage);

  const handleSave = (p: AdminBlogPost) => {
    if (editing) { updateBlogPost(p); toast({ title: "Blog post updated" }); }
    else { addBlogPost(p); toast({ title: "Blog post created" }); }
    reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteBlogPost(deleteId);
    toast({ title: "Blog post deleted" });
    setDeleteId(null);
    reload();
  };

  const toggleStatus = (p: AdminBlogPost) => {
    const updated = { ...p, status: p.status === "published" ? "draft" as const : "published" as const };
    updateBlogPost(updated);
    toast({ title: `Post ${updated.status === "published" ? "published" : "unpublished"}` });
    reload();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search blog posts..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <Select value={filterCat} onValueChange={v => { setFilterCat(v); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(0); }}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="sm:hidden" onClick={() => { setEditing(null); setFormOpen(true); }}>
          + Add Post
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortAsc(!sortAsc)}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No blog posts found</TableCell></TableRow>
            ) : paged.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <img src={p.image} alt={p.title} className="w-10 h-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium max-w-[250px]">
                  <div className="truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.excerpt.substring(0, 60)}...</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.author}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "published" ? "default" : "outline"}>
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
                      <DropdownMenuItem onClick={() => toggleStatus(p)}>
                        {p.status === "published" ? <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</> : <><Eye className="h-4 w-4 mr-2" /> Publish</>}
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

      <BlogFormDialog open={formOpen} onOpenChange={setFormOpen} post={editing} onSave={handleSave} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
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

export default DashboardBlogs;
