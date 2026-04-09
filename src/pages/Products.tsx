import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const Products = () => {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [search, selectedCats, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="section-title mb-8">Shop</h1>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Button variant="outline" className="mb-6 lg:hidden" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`w-full lg:w-56 shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div>
            <h3 className="font-semibold text-sm mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <Checkbox id={cat} checked={selectedCats.includes(cat)} onCheckedChange={() => toggleCat(cat)} />
                  <Label htmlFor={cat} className="text-sm cursor-pointer">{cat}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Price Range</h3>
            <Slider min={0} max={1500} step={50} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
            <p className="text-xs text-muted-foreground">₨{priceRange[0]} — ₨{priceRange[1]}</p>
          </div>
        </aside>

        <div className="flex-1">
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
