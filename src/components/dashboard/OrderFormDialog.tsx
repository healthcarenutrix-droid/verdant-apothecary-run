import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminOrder, getProducts, AdminProduct, ProductVariant } from "@/data/dashboard-data";
import { Plus, Minus, X, Package } from "lucide-react";

interface OrderLine {
  productId: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  price: number;
  qty: number;
}

const schema = z.object({
  customer: z.string().trim().min(1, "Customer name is required").max(200),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: AdminOrder | null;
  onSave: (order: AdminOrder) => void;
}

const OrderFormDialog = ({ open, onOpenChange, order, onSave }: Props) => {
  const products = getProducts().filter(p => p.status === "active");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer: "", email: "", phone: "", address: "",
      status: "pending", notes: "",
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        customer: order.customer,
        email: order.email,
        phone: order.phone || "",
        address: order.address || "",
        status: order.status,
        notes: order.notes || "",
      });
      // Reconstruct lines from existing order
      if (order.productNames && order.productNames.length > 0) {
        const existingLines: OrderLine[] = order.productNames.map((name, i) => ({
          productId: `existing-${i}`,
          productName: name,
          price: i === 0 ? order.total : 0, // approximate
          qty: i === 0 ? order.items : 0,
        }));
        // Try to match with actual products for better data
        const matchedLines: OrderLine[] = [];
        for (const name of order.productNames) {
          const prod = products.find(p => p.name.includes(name) || name.includes(p.name.split("|")[0].trim()));
          matchedLines.push({
            productId: prod?.id || `unknown-${name}`,
            productName: prod?.name || name,
            price: prod?.price || 0,
            qty: 1,
          });
        }
        setLines(matchedLines.length > 0 ? matchedLines : existingLines);
      } else {
        setLines([]);
      }
    } else {
      form.reset({
        customer: "", email: "", phone: "", address: "",
        status: "pending", notes: "",
      });
      setLines([]);
    }
    setAddingProduct(false);
    setSelectedProductId("");
    setSelectedVariantId("");
  }, [order, open, form]);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;

  const addProductToOrder = () => {
    if (!selectedProduct) return;

    let variant: ProductVariant | undefined;
    if (hasVariants && selectedVariantId) {
      variant = selectedProduct.variants?.find(v => v.id === selectedVariantId);
    }

    const price = variant ? variant.price : selectedProduct.price;
    const label = variant ? variant.label : undefined;

    // Check if already in lines
    const existingIdx = lines.findIndex(l =>
      l.productId === selectedProduct.id && l.variantId === (variant?.id || undefined)
    );

    if (existingIdx >= 0) {
      setLines(lines.map((l, i) => i === existingIdx ? { ...l, qty: l.qty + 1 } : l));
    } else {
      setLines([...lines, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        variantId: variant?.id,
        variantLabel: label,
        price,
        qty: 1,
      }]);
    }

    setSelectedProductId("");
    setSelectedVariantId("");
    setAddingProduct(false);
  };

  const updateLineQty = (idx: number, delta: number) => {
    setLines(lines.map((l, i) => {
      if (i !== idx) return l;
      const newQty = l.qty + delta;
      return newQty <= 0 ? l : { ...l, qty: newQty };
    }));
  };

  const removeLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  const totalItems = lines.reduce((s, l) => s + l.qty, 0);
  const totalPrice = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const onSubmit = (values: FormValues) => {
    const data: AdminOrder = {
      id: order?.id || `ORD-${Date.now().toString().slice(-4)}`,
      customer: values.customer,
      email: values.email,
      phone: values.phone || "",
      address: values.address || "",
      total: totalPrice,
      items: totalItems,
      productNames: lines.map(l => {
        const shortName = l.productName.split("|")[0].trim();
        return l.variantLabel ? `${shortName} (${l.variantLabel})` : shortName;
      }),
      status: values.status,
      createdAt: order?.createdAt || new Date().toISOString().split("T")[0],
      notes: values.notes || "",
    };
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Add Order"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="customer" render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name *</FormLabel>
                <FormControl><Input placeholder="e.g. Ahmed Khan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="+92 300 1234567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Textarea rows={2} placeholder="Delivery address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Selection Section */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" /> Order Products
                </h3>
                {!addingProduct && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddingProduct(true)}>
                    <Plus className="h-3 w-3 mr-1" /> Add Product
                  </Button>
                )}
              </div>

              {/* Add product picker */}
              {addingProduct && (
                <div className="border border-primary/20 bg-primary/5 rounded-md p-3 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Select Product</label>
                    <Select value={selectedProductId} onValueChange={(val) => { setSelectedProductId(val); setSelectedVariantId(""); }}>
                      <SelectTrigger><SelectValue placeholder="Choose a product..." /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            <span className="flex items-center gap-2">
                              {p.image && <img src={p.image} alt="" className="h-5 w-5 rounded object-cover" />}
                              <span className="truncate max-w-[250px]">{p.name.split("|")[0].trim()}</span>
                              <span className="text-muted-foreground text-xs">₨ {p.price}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Variant picker */}
                  {selectedProduct && hasVariants && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Select Variant</label>
                      <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
                        <SelectTrigger><SelectValue placeholder="Choose variant..." /></SelectTrigger>
                        <SelectContent>
                          {selectedProduct.variants!.map(v => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.label} — ₨ {v.price.toLocaleString()} ({v.stock} in stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={addProductToOrder}
                      disabled={!selectedProductId || (hasVariants && !selectedVariantId)}
                    >
                      Add to Order
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setAddingProduct(false); setSelectedProductId(""); setSelectedVariantId(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Line items */}
              {lines.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No products added yet. Click "Add Product" to select items.</p>
              ) : (
                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-border rounded-md p-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{line.productName.split("|")[0].trim()}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {line.variantLabel && <Badge variant="secondary" className="text-xs h-5">{line.variantLabel}</Badge>}
                          <span>₨ {line.price.toLocaleString()} each</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateLineQty(idx, -1)} disabled={line.qty <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{line.qty}</span>
                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateLineQty(idx, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-medium w-20 text-right">₨ {(line.price * line.qty).toLocaleString()}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeLine(idx)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  {/* Summary */}
                  <div className="flex justify-between items-center pt-2 border-t border-border text-sm">
                    <span className="text-muted-foreground">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                    <span className="font-semibold text-foreground">Total: ₨ {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl><Textarea rows={2} placeholder="Order notes..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={lines.length === 0}>{order ? "Update" : "Create"} Order</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormDialog;