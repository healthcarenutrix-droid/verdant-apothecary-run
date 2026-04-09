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
import { AdminOrder } from "@/data/dashboard-data";

const schema = z.object({
  customer: z.string().trim().min(1, "Customer name is required").max(200),
  email: z.string().email("Valid email required"),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  total: z.coerce.number().positive("Total must be positive"),
  items: z.coerce.number().int().min(1, "At least 1 item"),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer: "", email: "", phone: "", address: "",
      total: 0, items: 1, status: "pending", notes: "",
    },
  });

  useEffect(() => {
    if (order) {
      form.reset({
        customer: order.customer,
        email: order.email,
        phone: order.phone || "",
        address: order.address || "",
        total: order.total,
        items: order.items,
        status: order.status,
        notes: order.notes || "",
      });
    } else {
      form.reset({
        customer: "", email: "", phone: "", address: "",
        total: 0, items: 1, status: "pending", notes: "",
      });
    }
  }, [order, open, form]);

  const onSubmit = (values: FormValues) => {
    const data: AdminOrder = {
      id: order?.id || `ORD-${Date.now().toString().slice(-4)}`,
      customer: values.customer,
      email: values.email,
      phone: values.phone || "",
      address: values.address || "",
      total: values.total,
      items: values.items,
      status: values.status,
      createdAt: order?.createdAt || new Date().toISOString().split("T")[0],
      notes: values.notes || "",
    };
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="total" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total (₨) *</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="items" render={({ field }) => (
                <FormItem>
                  <FormLabel>Items *</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              <Button type="submit">{order ? "Update" : "Create"} Order</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderFormDialog;
