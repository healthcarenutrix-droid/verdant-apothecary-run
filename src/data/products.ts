import { Product } from "@/contexts/CartContext";
import { getProducts, getCategories, AdminCategory } from "@/data/dashboard-data";

export interface StorefrontCategory {
  name: string;
  slug: string;
  image?: string;
  description: string;
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
      slug: c.slug,
      image: c.image,
      description: c.description,
    }));
}

export const products: Product[] = buildProducts();
export const categories: string[] = buildCategories();
export const categoryObjects: StorefrontCategory[] = buildCategoryObjects();

export const getStorefrontProducts = buildProducts;
export const getStorefrontCategories = buildCategories;
export const getStorefrontCategoryObjects = buildCategoryObjects;
