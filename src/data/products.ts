import { Product } from "@/contexts/CartContext";
import { getProducts, getCategories, AdminCategory, onContentChange } from "@/data/dashboard-data";

export interface StorefrontCategory {
  name: string;
  slug: string;
  image?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
}

function buildProducts(): Product[] {
  const adminProducts = getProducts().filter(p => p.status === "active");
  const cats = getCategories();

  return adminProducts.map(p => {
    const cat = cats.find(c => c.id === p.categoryId);
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      category: cat?.name || "Uncategorized",
      rating: p.rating || 4,
      image: p.image,
      images: p.images || [p.image],
      priceRange: p.priceRange,
      originalPrice: p.compareAtPrice,
      options: p.options,
      variants: p.variants,
    };
  });
}

function buildCategories(): string[] {
  return getCategories()
    .filter(c => c.status === "active")
    .map(c => c.name);
}

function buildCategoryObjects(): StorefrontCategory[] {
  return getCategories()
    .filter(c => c.status === "active")
    .map(c => ({
      name: c.name,
      slug: c.handle || c.slug,
      image: c.image,
      description: c.description,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
    }));
}

// Live arrays: mutated in place whenever the database content is (re)loaded,
// so existing imports keep working without a page reload.
export const products: Product[] = [];
export const categories: string[] = [];
export const categoryObjects: StorefrontCategory[] = [];

export function refreshStorefrontData() {
  products.length = 0;
  products.push(...buildProducts());
  categories.length = 0;
  categories.push(...buildCategories());
  categoryObjects.length = 0;
  categoryObjects.push(...buildCategoryObjects());
}

export const getStorefrontProducts = buildProducts;
export const getStorefrontCategories = buildCategories;
export const getStorefrontCategoryObjects = buildCategoryObjects;


onContentChange(() => { refreshStorefrontData(); });
