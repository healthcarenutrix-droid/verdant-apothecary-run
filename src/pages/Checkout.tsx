import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "Pakistan",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    clearCart();
    navigate("/order-complete");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <Button asChild><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <div className="flex-1 space-y-8">
          {/* Contact */}
          <div>
            <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="font-semibold text-foreground mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment placeholder */}
          <div>
            <h2 className="font-semibold text-foreground mb-4">Payment</h2>
            <div className="bg-secondary rounded-lg p-6 text-center text-sm text-muted-foreground">
              Cash on Delivery (COD)
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto px-12">Place Order</Button>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-secondary rounded-lg p-6 space-y-4 sticky top-24">
            <h3 className="font-semibold text-foreground">Order Summary</h3>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-card shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium shrink-0">₨ {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₨ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>₨ {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
