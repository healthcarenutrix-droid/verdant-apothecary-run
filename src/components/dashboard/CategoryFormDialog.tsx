import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdminCategory, getCategories } from "@/data/dashboard-data";
import ImageUpload from "./ImageUpload";

const schema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100),
  slug: z.string().trim().min(1),
  description: z.string().max(500).optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  status: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: AdminCategory | null;
  onSave: (category: AdminCategory) => void;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CategoryFormDialog = ({ open, onOpenChange, category, onSave }: Props) => {
  const allCategories = getCategories().filter(c => !category || c.id !== category.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", image: "", parentId: "", status: true },
  });

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!category) form.setValue("slug", slugify(nameValue));
  }, [nameValue, category, form]);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image || "",
        parentId: category.parentId || "",
        status: category.status === "active",
      });
    } else {
      form.reset({ name: "", slug: "", description: "", image: "", parentId: "", status: true });
    }
  }, [category, open, form]);

  const onSubmit = (values: FormValues) => {
    const data: AdminCategory = {
      id: category?.id || `cat-${Date.now()}`,
      name: values.name,
      slug: values.slug,
      description: values.description || "",
      image: values.image || undefined,
      parentId: values.parentId || undefined,
      status: values.status ? "active" : "inactive",
      createdAt: category?.createdAt || new Date().toISOString().split("T")[0],
    };
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Herbs" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value || ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="parentId" render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {allCategories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                <FormLabel className="!mt-0">Active</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{category ? "Update" : "Create"} Category</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
