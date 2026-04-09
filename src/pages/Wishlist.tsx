import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">Your wishlist is empty</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((product) => (
            <div key={product.id} className="flex items-center gap-4 border border-border rounded-lg p-4">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">₨ {product.originalPrice.toLocaleString()}</span>
                  )}
                  {product.priceRange ? (
                    <span className="text-sm font-semibold text-foreground">{product.priceRange}</span>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">₨ {product.price.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!product.priceRange && (
                  <Button size="sm" onClick={() => { addToCart(product); removeFromWishlist(product.id); }}>
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                  </Button>
                )}
                {product.priceRange && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/product/${product.id}`}>Select Options</Link>
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => removeFromWishlist(product.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
