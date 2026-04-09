import prodSaffron from "@/assets/prod-saffron.webp";
import prodAnardana from "@/assets/prod-anardana.webp";
import prodKaliMirch from "@/assets/prod-kali-mirch.jpg";
import prodBlackPepper from "@/assets/prod-black-pepper.webp";
import prodGinger from "@/assets/prod-ginger.webp";
import prodNeem from "@/assets/prod-neem.webp";
import prodRedChilli from "@/assets/prod-red-chilli.jpg";
import prodCardamom from "@/assets/prod-cardamom.webp";
import prodShikakai from "@/assets/prod-shikakai.webp";
import prodAshwagandha from "@/assets/prod-ashwagandha.webp";
import prodWhitePepper from "@/assets/prod-white-pepper.webp";
import prodCumin from "@/assets/prod-cumin.jpg";

import catArqiyat from "@/assets/cat-arqiyat.webp";
import catDryfruits from "@/assets/cat-dryfruits.webp";
import catPreserves from "@/assets/cat-preserves.webp";
import catOils from "@/assets/cat-oils.webp";
import catHerbs from "@/assets/cat-herbs.webp";
import catSpices from "@/assets/cat-spices.webp";

export interface ProductVariant {
  id: string;
  label: string; // e.g. "50g", "100g", "250g"
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  categoryId: string;
  image: string;
  images?: string[];
  status: "active" | "draft";
  createdAt: string;
  priceRange?: string;
  rating?: number;
  variants?: ProductVariant[];
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  productNames?: string[];
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  email?: string;
  rating: number;
  text: string;
  image?: string;
  status: "visible" | "hidden";
  createdAt: string;
}

const defaultCategories: AdminCategory[] = [
  { id: "cat-1", name: "Herbs", slug: "herbs", description: "Natural medicinal herbs", image: catHerbs, status: "active", createdAt: "2025-01-10" },
  { id: "cat-2", name: "Spices", slug: "spices", description: "Premium quality spices", image: catSpices, status: "active", createdAt: "2025-01-10" },
  { id: "cat-3", name: "Dry Fruits", slug: "dry-fruits", description: "Dried fruits and nuts", image: catDryfruits, status: "active", createdAt: "2025-01-12" },
  { id: "cat-4", name: "Herbal Oils", slug: "herbal-oils", description: "Essential and herbal oils", image: catOils, status: "active", createdAt: "2025-01-15" },
  { id: "cat-5", name: "Arqiyat", slug: "arqiyat", description: "Traditional herbal distillates", image: catArqiyat, status: "active", createdAt: "2025-01-18" },
  { id: "cat-6", name: "Fruit Preserves", slug: "fruit-preserves", description: "Natural fruit preserves and jams", image: catPreserves, status: "active", createdAt: "2025-02-01" },
];

const defaultProducts: AdminProduct[] = [
  {
    id: "prod-1", name: "Saffron | Zafran | زعفران", price: 1450, stock: 25, categoryId: "cat-1",
    image: prodSaffron, images: [prodSaffron],
    status: "active", description: "Premium quality saffron threads", createdAt: "2025-02-01", rating: 5,
    variants: [
      { id: "v1-1", label: "1g", price: 1450, stock: 25 },
      { id: "v1-2", label: "2g", price: 2800, stock: 15 },
      { id: "v1-3", label: "5g", price: 6500, compareAtPrice: 7250, stock: 8 },
    ],
  },
  {
    id: "prod-2", name: "Pomegranate Seeds | Annar Dana | اناردانہ", price: 120, compareAtPrice: 220, stock: 60, categoryId: "cat-3",
    image: prodAnardana, images: [prodAnardana],
    status: "active", description: "Dried pomegranate seeds", createdAt: "2025-02-03", rating: 4, priceRange: "₨ 120–₨ 220",
    variants: [
      { id: "v2-1", label: "100g", price: 120, stock: 60 },
      { id: "v2-2", label: "250g", price: 220, compareAtPrice: 280, stock: 30 },
    ],
  },
  {
    id: "prod-3", name: "Kali Mirch Powder (Black Pepper Powder)", price: 550, compareAtPrice: 700, stock: 40, categoryId: "cat-2",
    image: prodKaliMirch, images: [prodKaliMirch],
    status: "active", description: "Premium ground black pepper", createdAt: "2025-02-05", rating: 5,
    variants: [
      { id: "v3-1", label: "100g", price: 550, compareAtPrice: 700, stock: 40 },
      { id: "v3-2", label: "250g", price: 1200, compareAtPrice: 1500, stock: 20 },
    ],
  },
  {
    id: "prod-4", name: "Kali Mirch Sabat (Black Pepper Whole)", price: 180, stock: 45, categoryId: "cat-2",
    image: prodBlackPepper, images: [prodBlackPepper],
    status: "active", description: "Whole black peppercorns", createdAt: "2025-02-08", rating: 4, priceRange: "₨ 180–₨ 550",
    variants: [
      { id: "v4-1", label: "50g", price: 180, stock: 45 },
      { id: "v4-2", label: "100g", price: 320, stock: 30 },
      { id: "v4-3", label: "250g", price: 550, stock: 15 },
    ],
  },
  {
    id: "prod-5", name: "Ginger | Sund | سنڈھ", price: 210, stock: 35, categoryId: "cat-1",
    image: prodGinger, images: [prodGinger],
    status: "active", description: "Dried ginger powder", createdAt: "2025-02-10", rating: 5,
    variants: [
      { id: "v5-1", label: "100g", price: 210, stock: 35 },
      { id: "v5-2", label: "250g", price: 480, stock: 20 },
    ],
  },
  {
    id: "prod-6", name: "Neem | نیم", price: 60, stock: 80, categoryId: "cat-1",
    image: prodNeem, images: [prodNeem],
    status: "active", description: "Pure neem leaves powder", createdAt: "2025-02-12", rating: 4,
  },
  {
    id: "prod-7", name: "Lal Mirch Darla - Red Chilli Powder", price: 120, stock: 55, categoryId: "cat-2",
    image: prodRedChilli, images: [prodRedChilli],
    status: "active", description: "Premium red chilli powder", createdAt: "2025-02-15", rating: 5, priceRange: "₨ 120–₨ 450",
    variants: [
      { id: "v7-1", label: "100g", price: 120, stock: 55 },
      { id: "v7-2", label: "250g", price: 280, stock: 30 },
      { id: "v7-3", label: "500g", price: 450, stock: 15 },
    ],
  },
  {
    id: "prod-8", name: "Sabz Elaichi (Green Cardamom)", price: 180, stock: 3, categoryId: "cat-2",
    image: prodCardamom, images: [prodCardamom],
    status: "active", description: "Fragrant green cardamom pods", createdAt: "2025-02-18", rating: 5, priceRange: "₨ 180–₨ 800",
    variants: [
      { id: "v8-1", label: "25g", price: 180, stock: 3 },
      { id: "v8-2", label: "50g", price: 350, stock: 5 },
      { id: "v8-3", label: "100g", price: 650, stock: 2 },
      { id: "v8-4", label: "250g", price: 800, stock: 1 },
    ],
  },
  {
    id: "prod-9", name: "Ashwagandha | Asgand Nagori", price: 150, stock: 2, categoryId: "cat-1",
    image: prodAshwagandha, images: [prodAshwagandha],
    status: "active", description: "Withania Somnifera root", createdAt: "2025-03-01", rating: 5, priceRange: "₨ 150–₨ 1,500",
    variants: [
      { id: "v9-1", label: "50g", price: 150, stock: 2 },
      { id: "v9-2", label: "100g", price: 280, stock: 5 },
      { id: "v9-3", label: "500g", price: 1500, stock: 1 },
    ],
  },
  {
    id: "prod-10", name: "Shikakai | Soap Pod | سکاکائی", price: 60, stock: 70, categoryId: "cat-1",
    image: prodShikakai, images: [prodShikakai],
    status: "active", description: "Natural hair care herb", createdAt: "2025-03-05", rating: 4, priceRange: "₨ 60–₨ 650",
    variants: [
      { id: "v10-1", label: "100g", price: 60, stock: 70 },
      { id: "v10-2", label: "500g", price: 250, stock: 30 },
      { id: "v10-3", label: "1kg", price: 650, stock: 10 },
    ],
  },
  {
    id: "prod-11", name: "White Pepper Whole | Safeed Mirch", price: 320, stock: 30, categoryId: "cat-2",
    image: prodWhitePepper, images: [prodWhitePepper],
    status: "active", description: "Premium whole white pepper", createdAt: "2025-03-08", rating: 4, priceRange: "₨ 320–₨ 620",
    variants: [
      { id: "v11-1", label: "50g", price: 320, stock: 30 },
      { id: "v11-2", label: "100g", price: 620, stock: 15 },
    ],
  },
  {
    id: "prod-12", name: "Zeera Sabat Safeed (White Cumin)", price: 150, stock: 50, categoryId: "cat-2",
    image: prodCumin, images: [prodCumin],
    status: "active", description: "Whole white cumin seeds", createdAt: "2025-03-10", rating: 4, priceRange: "₨ 150–₨ 450",
    variants: [
      { id: "v12-1", label: "100g", price: 150, stock: 50 },
      { id: "v12-2", label: "250g", price: 350, stock: 25 },
      { id: "v12-3", label: "500g", price: 450, stock: 10 },
    ],
  },
];

const defaultOrders: AdminOrder[] = [
  { id: "ORD-1001", customer: "Ahmed Khan", email: "ahmed@email.com", phone: "+92 300 1234567", address: "123 Main St, Lahore", total: 2850, status: "delivered", items: 3, productNames: ["Saffron", "Black Pepper"], createdAt: "2025-03-20", notes: "" },
  { id: "ORD-1002", customer: "Sara Ali", email: "sara@email.com", phone: "+92 321 7654321", address: "45 Garden Town, Karachi", total: 550, status: "shipped", items: 1, productNames: ["Kali Mirch Powder"], createdAt: "2025-03-22", notes: "" },
  { id: "ORD-1003", customer: "Usman Raza", email: "usman@email.com", phone: "+92 333 9876543", address: "78 Blue Area, Islamabad", total: 1670, status: "processing", items: 4, productNames: ["Ginger", "Neem", "Red Chilli"], createdAt: "2025-03-25", notes: "Urgent delivery" },
  { id: "ORD-1004", customer: "Fatima Noor", email: "fatima@email.com", phone: "+92 312 5551234", address: "10 Model Town, Lahore", total: 390, status: "pending", items: 2, productNames: ["Pomegranate Seeds"], createdAt: "2025-03-28", notes: "" },
  { id: "ORD-1005", customer: "Bilal Shah", email: "bilal@email.com", phone: "+92 345 1112233", address: "22 Saddar, Peshawar", total: 1450, status: "cancelled", items: 1, productNames: ["Saffron"], createdAt: "2025-03-30", notes: "Customer requested cancellation" },
];

const defaultReviews: Review[] = [
  { id: "rev-1", productId: "prod-1", author: "Ali Hassan", email: "ali@email.com", rating: 5, text: "Excellent quality saffron! The aroma and color are amazing. Best I've ever purchased.", status: "visible", createdAt: "2025-03-15" },
  { id: "rev-2", productId: "prod-1", author: "Ayesha Khan", rating: 4, text: "Very good saffron. Packaging was great and delivery was fast.", status: "visible", createdAt: "2025-03-18" },
  { id: "rev-3", productId: "prod-3", author: "Zainab Ali", rating: 5, text: "The black pepper powder is so fresh and aromatic. Will definitely buy again!", status: "visible", createdAt: "2025-03-20" },
  { id: "rev-4", productId: "prod-5", author: "Omar Farooq", rating: 5, text: "Pure ginger powder with no additives. Great for tea and cooking.", status: "visible", createdAt: "2025-03-22" },
  { id: "rev-5", productId: "prod-7", author: "Hina Malik", rating: 4, text: "Good quality red chilli powder. Not too spicy, perfect balance.", status: "visible", createdAt: "2025-03-25" },
  { id: "rev-6", productId: "prod-8", author: "Kamran Sheikh", rating: 5, text: "Best cardamom I've found online. Very fragrant and fresh.", status: "visible", createdAt: "2025-03-28" },
];

const DATA_VERSION = "v2-webp";
const VERSION_KEY = "admin_data_version";

// Force refresh when data structure changes (e.g. new images)
if (typeof window !== "undefined" && localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
  localStorage.removeItem("admin_products");
  localStorage.removeItem("admin_categories");
  localStorage.setItem(VERSION_KEY, DATA_VERSION);
}

function getStore<T>(key: string, defaults: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Products CRUD
export const getProducts = (): AdminProduct[] => getStore("admin_products", defaultProducts);
export const saveProducts = (p: AdminProduct[]) => setStore("admin_products", p);
export const addProduct = (p: AdminProduct) => { const all = getProducts(); all.push(p); saveProducts(all); };
export const updateProduct = (p: AdminProduct) => { const all = getProducts().map(x => x.id === p.id ? p : x); saveProducts(all); };
export const deleteProduct = (id: string) => { saveProducts(getProducts().filter(x => x.id !== id)); };

// Categories CRUD
export const getCategories = (): AdminCategory[] => getStore("admin_categories", defaultCategories);
export const saveCategories = (c: AdminCategory[]) => setStore("admin_categories", c);
export const addCategory = (c: AdminCategory) => { const all = getCategories(); all.push(c); saveCategories(all); };
export const updateCategory = (c: AdminCategory) => { const all = getCategories().map(x => x.id === c.id ? c : x); saveCategories(all); };
export const deleteCategory = (id: string) => { saveCategories(getCategories().filter(x => x.id !== id)); };

// Orders CRUD
export const getOrders = (): AdminOrder[] => getStore("admin_orders", defaultOrders);
export const saveOrders = (o: AdminOrder[]) => setStore("admin_orders", o);
export const addOrder = (o: AdminOrder) => { const all = getOrders(); all.push(o); saveOrders(all); };
export const updateOrder = (o: AdminOrder) => { const all = getOrders().map(x => x.id === o.id ? o : x); saveOrders(all); };
export const deleteOrder = (id: string) => { saveOrders(getOrders().filter(x => x.id !== id)); };

// Reviews CRUD
export const getReviews = (): Review[] => getStore("admin_reviews", defaultReviews);
export const saveReviews = (r: Review[]) => setStore("admin_reviews", r);
export const addReview = (r: Review) => { const all = getReviews(); all.push(r); saveReviews(all); };
export const updateReview = (r: Review) => { const all = getReviews().map(x => x.id === r.id ? r : x); saveReviews(all); };
export const deleteReview = (id: string) => { saveReviews(getReviews().filter(x => x.id !== id)); };

// Reset to defaults
export const resetProducts = () => { localStorage.removeItem("admin_products"); };
export const resetCategories = () => { localStorage.removeItem("admin_categories"); };
export const resetReviews = () => { localStorage.removeItem("admin_reviews"); };
