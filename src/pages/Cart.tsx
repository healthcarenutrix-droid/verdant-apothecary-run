import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold text-foreground mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="section-title mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items Table */}
        <div className="flex-1">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="py-5 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link to={`/product/${item.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive mt-2 transition-colors">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-center text-sm font-medium">₨ {item.price.toLocaleString()}</div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-secondary transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="col-span-4 md:col-span-2 text-right text-sm font-semibold">₨ {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            <Button asChild variant="outline">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-secondary rounded-lg p-6 space-y-4 sticky top-24">
            <h3 className="font-semibold text-foreground">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₨ {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-primary">Free</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">₨ {totalPrice.toLocaleString()}</span>
            </div>
            <Button asChild className="w-full">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
