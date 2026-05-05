import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categoryObjects } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

const Collection = () => {
  const { slug } = useParams();
  const category = categoryObjects.find((c) => c.slug === slug);
  const categoryName = category?.name || slug || "";
  const baseProducts = useMemo(
    () => products.filter((p) => p.category.toLowerCase().replace(/\s/g, "-") === slug),
    [slug]
  );

  const maxPrice = useMemo(
    () => Math.max(1500, ...baseProducts.map((p) => p.price)),
    [baseProducts]
  );

  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sortOptions: { value: typeof sortBy; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  const filtered = useMemo(() => {
    let list = baseProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [baseProducts, priceRange, sortBy]);

  const activeCount =
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0);

  const clearAll = () => {
    setPriceRange([0, maxPrice]);
    setSortBy("featured");
  };

  const FiltersBody = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Sort by</h3>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-md border transition-colors ${
                sortBy === opt.value
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">₨{priceRange[0]}</span>
          <span className="px-2 py-1 rounded-md bg-muted">₨{priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Other Collections</h3>
        <div className="flex flex-wrap gap-2">
          {categoryObjects
            .filter((c) => c.slug !== slug)
            .map((cat) => (
              <Link
                key={cat.name}
                to={`/collections/${cat.slug}`}
                className="px-3 py-1.5 border border-border rounded-full text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Banner */}
      <section className="relative bg-primary text-primary-foreground py-12 text-center overflow-hidden">
        {category?.image && (
          <div className="absolute inset-0">
            <img src={category.image} alt={categoryName} className="w-full h-full object-cover opacity-20" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryName || "Collection"}</h1>
          <div className="flex items-center justify-center gap-1 text-sm opacity-80">
            <Link to="/" className="hover:opacity-100">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:opacity-100">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span>{categoryName}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {baseProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found in this collection.</p>
            <Link to="/products" className="text-primary hover:underline text-sm font-medium">Browse all products</Link>
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>

              {/* Mobile filters trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeCount > 0 && (
                      <Badge className="ml-1 h-5 min-w-5 px-1.5 rounded-full">{activeCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col p-0">
                  <SheetHeader className="px-5 pt-5 pb-3 border-b">
                    <div className="mx-auto h-1.5 w-12 rounded-full bg-muted -mt-2 mb-3" />
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-left">Filters</SheetTitle>
                      {activeCount > 0 && (
                        <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
                          Clear all
                        </button>
                      )}
                    </div>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-5 py-5">
                    <FiltersBody />
                  </div>

                  <SheetFooter className="px-5 py-4 border-t bg-background">
                    <Button className="w-full h-11" onClick={() => setMobileOpen(false)}>
                      Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop sidebar */}
              <aside className="hidden lg:block w-60 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-sm">Filters</h2>
                  {activeCount > 0 && (
                    <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
                <FiltersBody />
              </aside>

              <div className="flex-1">
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">No products match these filters.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
