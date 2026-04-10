import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { AdminProduct, getCategories, ProductOption, ProductVariant } from "@/data/dashboard-data";
import MultiImageUpload from "./MultiImageUpload";
import { Plus, Trash2, X, Wand2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  priceRange: z.string().max(50).optional(),
  status: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: AdminProduct | null;
  onSave: (product: AdminProduct) => void;
}

// Helper: generate cartesian product of option values
function generateCombinations(options: ProductOption[]): Record<string, string>[] {
  if (options.length === 0) return [];
  const [first, ...rest] = options;
  if (rest.length === 0) {
    return first.values.map(v => ({ [first.name]: v }));
  }
  const restCombos = generateCombinations(rest);
  const result: Record<string, string>[] = [];
  for (const val of first.values) {
    for (const combo of restCombos) {
      result.push({ [first.name]: val, ...combo });
    }
  }
  return result;
}

function comboLabel(optionValues: Record<string, string>): string {
  return Object.values(optionValues).join(" / ");
}

const ProductFormDialog = ({ open, onOpenChange, product, onSave }: Props) => {
  const categories = getCategories().filter(c => c.status === "active");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", description: "", price: 0, compareAtPrice: "",
      stock: 0, categoryId: "", images: [], priceRange: "", status: true,
    },
  });

  // Options state (e.g. [{name: "Size", values: ["S","M","L"]}, {name: "Color", values: ["Red","Blue"]}])
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState<Record<string, string>>({}); // keyed by option id

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || "",
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images || (product.image ? [product.image] : []),
        priceRange: product.priceRange || "",
        status: product.status === "active",
      });
      setOptions(product.options || []);
      setVariants(product.variants || []);
    } else {
      form.reset({
        name: "", description: "", price: 0, compareAtPrice: "",
        stock: 0, categoryId: "", images: [], priceRange: "", status: true,
      });
      setOptions([]);
      setVariants([]);
    }
    setNewOptionName("");
    setNewOptionValue({});
  }, [product, open, form]);

  // Add a new option (e.g. "Size")
  const addOption = () => {
    const name = newOptionName.trim();
    if (!name || options.some(o => o.name.toLowerCase() === name.toLowerCase())) return;
    setOptions([...options, { id: `opt-${Date.now()}`, name, values: [] }]);
    setNewOptionName("");
  };

  // Add value to an option
  const addOptionValue = (optionId: string) => {
    const val = (newOptionValue[optionId] || "").trim();
    if (!val) return;
    setOptions(options.map(o => {
      if (o.id !== optionId) return o;
      if (o.values.includes(val)) return o;
      return { ...o, values: [...o.values, val] };
    }));
    setNewOptionValue({ ...newOptionValue, [optionId]: "" });
  };

  // Remove value from option
  const removeOptionValue = (optionId: string, value: string) => {
    setOptions(options.map(o =>
      o.id === optionId ? { ...o, values: o.values.filter(v => v !== value) } : o
    ));
  };

  // Remove entire option
  const removeOption = (optionId: string) => {
    setOptions(options.filter(o => o.id !== optionId));
  };

  // Generate variants from options
  const generateVariants = () => {
    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }
    const combos = generateCombinations(validOptions);
    const basePrice = form.getValues("price") || 0;
    const baseStock = form.getValues("stock") || 0;

    // Preserve existing variant data if the combo matches
    const newVariants: ProductVariant[] = combos.map((combo, i) => {
      const label = comboLabel(combo);
      const existing = variants.find(v => v.label === label);
      return existing || {
        id: `var-${Date.now()}-${i}`,
        label,
        optionValues: combo,
        price: basePrice,
        stock: baseStock,
        sku: "",
      };
    });
    setVariants(newVariants);
  };

  // Update a variant field
  const updateVariant = (idx: number, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const onSubmit = (values: FormValues) => {
    const imgs = values.images.length > 0 ? values.images : ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200"];

    const data: AdminProduct = {
      id: product?.id || `prod-${Date.now()}`,
      name: values.name,
      description: values.description || "",
      price: values.price,
      compareAtPrice: typeof values.compareAtPrice === "number" ? values.compareAtPrice : undefined,
      stock: values.stock,
      categoryId: values.categoryId,
      image: imgs[0],
      images: imgs,
      status: values.status ? "active" : "draft",
      createdAt: product?.createdAt || new Date().toISOString().split("T")[0],
      priceRange: values.priceRange || undefined,
      options: options.filter(o => o.values.length > 0),
      variants: variants.length > 0 ? variants : undefined,
    };
    onSave(data);
    onOpenChange(false);
  };

  const validOptions = options.filter(o => o.values.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Saffron" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Product description..." rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price (₨) *</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="compareAtPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare at Price</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="Optional" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock *</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="priceRange" render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range Display (optional)</FormLabel>
                <FormControl><Input placeholder="e.g. ₨ 120–₨ 450" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="images" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images *</FormLabel>
                <FormControl>
                  <MultiImageUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ===== OPTIONS SECTION (Shopify-like) ===== */}
            <div className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Product Options</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Add options like Size, Color, Weight, etc. Then generate variant combinations.
              </p>

              {/* Existing options */}
              {options.map(opt => (
                <div key={opt.id} className="border border-border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{opt.name}</span>
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => removeOption(opt.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.values.map(val => (
                      <Badge key={val} variant="secondary" className="gap-1 pr-1">
                        {val}
                        <button type="button" onClick={() => removeOptionValue(opt.id, val)} className="ml-0.5 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      className="text-sm h-8"
                      placeholder={`Add ${opt.name.toLowerCase()} value...`}
                      value={newOptionValue[opt.id] || ""}
                      onChange={e => setNewOptionValue({ ...newOptionValue, [opt.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOptionValue(opt.id); } }}
                    />
                    <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => addOptionValue(opt.id)}>
                      Add
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add new option */}
              <div className="flex gap-2">
                <Input
                  className="text-sm"
                  placeholder="Option name (e.g. Size, Color, Weight)"
                  value={newOptionName}
                  onChange={e => setNewOptionName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }}
                />
                <Button type="button" variant="outline" onClick={addOption} disabled={!newOptionName.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              </div>
            </div>

            {/* ===== VARIANTS SECTION ===== */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Variants {variants.length > 0 && `(${variants.length})`}
                </h3>
                {validOptions.length > 0 && (
                  <Button type="button" size="sm" variant="outline" onClick={generateVariants}>
                    <Wand2 className="h-3 w-3 mr-1" /> Generate Variants
                  </Button>
                )}
              </div>

              {variants.length === 0 && validOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">Add options above to create multi-variant products.</p>
              )}
              {variants.length === 0 && validOptions.length > 0 && (
                <p className="text-xs text-muted-foreground">Click "Generate Variants" to create all combinations.</p>
              )}

              {variants.length > 0 && (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-1">
                    <div className="col-span-3">Variant</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-2">Price (₨)</div>
                    <div className="col-span-2">Compare</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-1"></div>
                  </div>
                  {variants.map((v, idx) => (
                    <div key={v.id} className="grid grid-cols-12 gap-2 items-center border border-border rounded-md p-2">
                      <div className="col-span-3">
                        <span className="text-sm font-medium text-foreground">{v.label}</span>
                      </div>
                      <div className="col-span-2">
                        <Input className="text-xs h-8" placeholder="SKU" value={v.sku || ""} onChange={e => updateVariant(idx, "sku", e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <Input className="text-xs h-8" type="number" step="0.01" value={v.price} onChange={e => updateVariant(idx, "price", Number(e.target.value))} />
                      </div>
                      <div className="col-span-2">
                        <Input className="text-xs h-8" type="number" step="0.01" placeholder="—" value={v.compareAtPrice || ""} onChange={e => updateVariant(idx, "compareAtPrice", e.target.value ? Number(e.target.value) : undefined)} />
                      </div>
                      <div className="col-span-2">
                        <Input className="text-xs h-8" type="number" value={v.stock} onChange={e => updateVariant(idx, "stock", Number(e.target.value))} />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeVariant(idx)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              <Button type="submit">{product ? "Update" : "Create"} Product</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
