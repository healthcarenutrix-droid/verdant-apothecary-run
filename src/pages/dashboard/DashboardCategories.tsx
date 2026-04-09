import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import CategoryFormDialog from "@/components/dashboard/CategoryFormDialog";
import { AdminCategory, getCategories, addCategory, updateCategory, deleteCategory, getProducts } from "@/data/dashboard-data";

const DashboardCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>(getCategories());
  const products = getProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const btn = document.getElementById("dashboard-add-btn");
    if (!btn) return;
    const handler = () => { setEditing(null); setFormOpen(true); };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  const reload = () => setCategories(getCategories());

  const handleSave = (c: AdminCategory) => {
    if (editing) { updateCategory(c); toast({ title: "Category updated" }); }
    else { addCategory(c); toast({ title: "Category created" }); }
    reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCategory(deleteId);
    toast({ title: "Category deleted" });
    setDeleteId(null);
    reload();
  };

  const productCount = (catId: string) => products.filter(p => p.categoryId === catId).length;

  return (
    <div className="space-y-4">
      <Button variant="outline" className="sm:hidden" onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add Category</Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <Card key={c.id} className="overflow-hidden">
            {c.image && (
              <div className="h-32 overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
                </div>
                <Badge variant={c.status === "active" ? "default" : "outline"}>{c.status}</Badge>
              </div>
              {c.description && <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-muted-foreground">{productCount(c.id)} products</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(c); setFormOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} onSave={handleSave} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>This will not delete the products in this category.</AlertDialogDescription>
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

export default DashboardCategories;
