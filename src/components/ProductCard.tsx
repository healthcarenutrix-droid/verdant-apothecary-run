import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const hasVariants = !!(product.variants && product.variants.length > 0) || !!product.priceRange;
  const wishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={300}
          height={300}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
            Sale!
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 bg-card/80 hover:bg-card rounded-full p-2 transition-colors"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </Link>
      <div className="p-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₨ {product.originalPrice.toLocaleString()}</span>
          )}
          {product.priceRange ? (
            <span className="text-sm font-semibold text-foreground">{product.priceRange}</span>
          ) : (
            <span className="text-sm font-semibold text-foreground">₨ {product.price.toLocaleString()}</span>
          )}
        </div>
        <div className="pt-1">
          {hasVariants ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <Link to={`/product/${product.id}`}>Select options</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full text-xs"
              onClick={() => addToCart(product)}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
