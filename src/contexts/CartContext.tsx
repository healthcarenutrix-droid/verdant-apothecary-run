import React, { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductVariant } from "@/data/dashboard-data";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  image?: string;
  images?: string[];
  priceRange?: string;
  originalPrice?: number;
  variants?: ProductVariant[];
}

interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((product: Product, variant?: ProductVariant) => {
    const cartId = variant ? `${product.id}-${variant.id}` : product.id;
    const price = variant ? variant.price : product.price;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, id: cartId, price, quantity: 1, selectedVariant: variant }];
    });
    toast({ title: "Added to cart", description: `${product.name}${variant ? ` (${variant.label})` : ""} has been added to your cart.` });
  }, [toast]);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
