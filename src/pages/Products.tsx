import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const Products = () => {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const clearAll = () => {
    setSelectedCats([]);
    setPriceRange([0, 1500]);
  };

  const activeCount = selectedCats.length + (priceRange[0] !== 0 || priceRange[1] !== 1500 ? 1 : 0);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [search, selectedCats, priceRange]);

  const FiltersBody = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox id={`cat-${cat}`} checked={selectedCats.includes(cat)} onCheckedChange={() => toggleCat(cat)} />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <Slider min={0} max={1500} step={50} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">₨{priceRange[0]}</span>
          <span className="px-2 py-1 rounded-md bg-muted">₨{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="section-title mb-6 lg:mb-8">Shop</h1>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {/* Mobile filter trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden relative gap-2">
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

              {selectedCats.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-sm mb-3">Active</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCats.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleCat(c)}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                      >
                        {c}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
        <aside className="hidden lg:block w-56 shrink-0">
          <FiltersBody />
        </aside>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
