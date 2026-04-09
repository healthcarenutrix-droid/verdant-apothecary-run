import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categoryObjects } from "@/data/products";

const Collection = () => {
  const { slug } = useParams();
  const category = categoryObjects.find((c) => c.slug === slug);
  const categoryName = category?.name || slug || "";
  const filtered = products.filter((p) => p.category.toLowerCase().replace(/\s/g, "-") === slug);

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

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found in this collection.</p>
            <Link to="/products" className="text-primary hover:underline text-sm font-medium">Browse all products</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-8">Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        {/* Other categories */}
        <div className="mt-16">
          <h2 className="section-title mb-6">Other Collections</h2>
          <div className="flex flex-wrap gap-3">
            {categoryObjects.filter((c) => c.slug !== slug).map((cat) => (
              <Link
                key={cat.name}
                to={`/collections/${cat.slug}`}
                className="px-5 py-2 border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
