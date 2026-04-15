import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Star, Minus, Plus, ShoppingCart, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import { ProductVariant } from "@/data/dashboard-data";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const wishlisted = product ? isInWishlist(product.id) : false;
  const hasOptions = product?.options && product.options.length > 0;
  const hasVariants = product?.variants && product.variants.length > 0;

  const selectedVariant: ProductVariant | null = useMemo(() => {
    if (!product || !hasVariants || !hasOptions) return null;
    if (Object.keys(selectedOptions).length !== (product.options?.length || 0)) return null;
    return product.variants?.find(v =>
      product.options!.every(opt => v.optionValues[opt.name] === selectedOptions[opt.name])
    ) || null;
  }, [selectedOptions, product, hasVariants, hasOptions]);

  const activePrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
  const activeCompare = selectedVariant?.compareAtPrice || product?.originalPrice;
  const allImages = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <Button asChild><Link to="/products">Back to Shop</Link></Button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);


  const handleSelectOption = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  // Check if a specific option value is available (has stock in any matching variant)
  const isValueAvailable = (optionName: string, value: string): boolean => {
    if (!product.variants) return true;
    return product.variants.some(v =>
      v.optionValues[optionName] === value && v.stock > 0
    );
  };

  const allOptionsSelected = hasOptions
    ? Object.keys(selectedOptions).length === (product.options?.length || 0)
    : true;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product, selectedVariant || undefined);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/collections/${product.category.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <ProductImageGallery images={allImages} name={product.name} />

          {/* Info */}
          <div className="space-y-5">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < product.rating ? "text-yellow-500 fill-yellow-500" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating}/5)</span>
            </div>

            <div className="flex items-center gap-3">
              {activeCompare && (
                <span className="text-lg text-muted-foreground line-through">₨ {activeCompare.toLocaleString()}</span>
              )}
              <span className={`text-2xl font-bold ${activeCompare ? "text-green-600" : "text-foreground"}`}>₨ {activePrice.toLocaleString()}</span>
              {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                <span className="text-xs text-destructive font-medium">Only {selectedVariant.stock} left!</span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Multi-Option Selectors */}
            {hasOptions && product.options!.map(option => (
              <div key={option.id} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {option.name}
                  {selectedOptions[option.name] && (
                    <span className="text-muted-foreground font-normal ml-2">— {selectedOptions[option.name]}</span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map(val => {
                    const available = isValueAvailable(option.name, val);
                    const isSelected = selectedOptions[option.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectOption(option.name, val)}
                        disabled={!available}
                        className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : available
                              ? "border-border hover:border-primary text-foreground"
                              : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* SKU display */}
            {selectedVariant?.sku && (
              <p className="text-xs text-muted-foreground">SKU: {selectedVariant.sku}</p>
            )}

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-secondary transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-border">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-secondary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                className="flex-1 md:flex-none md:px-12"
                disabled={hasOptions && !allOptionsSelected}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
              </Button>
            </div>

            {hasOptions && !allOptionsSelected && (
              <p className="text-sm text-muted-foreground italic">Please select all options to add to cart</p>
            )}
            {selectedVariant && selectedVariant.stock === 0 && (
              <p className="text-sm text-destructive italic">This variant is out of stock</p>
            )}

            <div className="border-t border-border pt-5 space-y-2 text-sm">
              <p><span className="text-muted-foreground">Category:</span>{" "}
                <Link to={`/collections/${product.category.toLowerCase().replace(/\s/g, "-")}`} className="text-primary hover:underline">{product.category}</Link>
              </p>
              <p><span className="text-muted-foreground">Availability:</span> <span className="text-primary font-medium">In Stock</span></p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="border-b border-border w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Description</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <p className="text-muted-foreground leading-relaxed">{product.description}. Our products are 100% natural, lab tested, and sourced from premium quality herbs. We ensure that every product meets the highest standards of purity and effectiveness.</p>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
