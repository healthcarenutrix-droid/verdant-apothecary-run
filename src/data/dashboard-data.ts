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

import blogTurmeric from "@/assets/blog-turmeric.jpg";
import blogHerbalTea from "@/assets/blog-herbal-tea.jpg";
import blogAyurvedic from "@/assets/blog-ayurvedic.jpg";
import blogHoneyGinger from "@/assets/blog-honey-ginger.jpg";
import blogDryfruits from "@/assets/blog-dryfruits.jpg";
import blogTraditional from "@/assets/blog-traditional.jpg";
import blogSkincare from "@/assets/blog-skincare.jpg";
import blogSpiceMarket from "@/assets/blog-spice-market.jpg";
import blogBlackPepper from "@/assets/blog-black-pepper.webp";

export interface ProductOption {
  id: string;
  name: string; // e.g. "Size", "Color", "Weight"
  values: string[]; // e.g. ["Small", "Medium", "Large"]
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. "Small / Blue" or "100g"
  optionValues: Record<string, string>; // e.g. { Size: "Small", Color: "Blue" }
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
}

export interface SeoFields {
  handle?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface AdminProduct extends SeoFields {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  categoryId: string;
  image: string;
  imageAlt?: string;
  images?: string[];
  status: "active" | "draft";
  createdAt: string;
  priceRange?: string;
  rating?: number;
  options?: ProductOption[];
  variants?: ProductVariant[];
}

export interface AdminCategory extends SeoFields {
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
    options: [{ id: "opt-1-1", name: "Weight", values: ["1g", "2g", "5g"] }],
    variants: [
      { id: "v1-1", label: "1g", optionValues: { Weight: "1g" }, price: 1450, stock: 25 },
      { id: "v1-2", label: "2g", optionValues: { Weight: "2g" }, price: 2800, stock: 15 },
      { id: "v1-3", label: "5g", optionValues: { Weight: "5g" }, price: 6500, compareAtPrice: 7250, stock: 8 },
    ],
  },
  {
    id: "prod-2", name: "Pomegranate Seeds | Annar Dana | اناردانہ", price: 120, compareAtPrice: 220, stock: 60, categoryId: "cat-3",
    image: prodAnardana, images: [prodAnardana],
    status: "active", description: "Dried pomegranate seeds", createdAt: "2025-02-03", rating: 4, priceRange: "₨ 120–₨ 220",
    options: [{ id: "opt-2-1", name: "Weight", values: ["100g", "250g"] }],
    variants: [
      { id: "v2-1", label: "100g", optionValues: { Weight: "100g" }, price: 120, stock: 60 },
      { id: "v2-2", label: "250g", optionValues: { Weight: "250g" }, price: 220, compareAtPrice: 280, stock: 30 },
    ],
  },
  {
    id: "prod-3", name: "Kali Mirch Powder (Black Pepper Powder)", price: 550, compareAtPrice: 700, stock: 40, categoryId: "cat-2",
    image: prodKaliMirch, images: [prodKaliMirch],
    status: "active", description: "Premium ground black pepper", createdAt: "2025-02-05", rating: 5,
    options: [{ id: "opt-3-1", name: "Weight", values: ["100g", "250g"] }],
    variants: [
      { id: "v3-1", label: "100g", optionValues: { Weight: "100g" }, price: 550, compareAtPrice: 700, stock: 40 },
      { id: "v3-2", label: "250g", optionValues: { Weight: "250g" }, price: 1200, compareAtPrice: 1500, stock: 20 },
    ],
  },
  {
    id: "prod-4", name: "Kali Mirch Sabat (Black Pepper Whole)", price: 180, stock: 45, categoryId: "cat-2",
    image: prodBlackPepper, images: [prodBlackPepper],
    status: "active", description: "Whole black peppercorns", createdAt: "2025-02-08", rating: 4, priceRange: "₨ 180–₨ 550",
    options: [{ id: "opt-4-1", name: "Weight", values: ["50g", "100g", "250g"] }],
    variants: [
      { id: "v4-1", label: "50g", optionValues: { Weight: "50g" }, price: 180, stock: 45 },
      { id: "v4-2", label: "100g", optionValues: { Weight: "100g" }, price: 320, stock: 30 },
      { id: "v4-3", label: "250g", optionValues: { Weight: "250g" }, price: 550, stock: 15 },
    ],
  },
  {
    id: "prod-5", name: "Ginger | Sund | سنڈھ", price: 210, stock: 35, categoryId: "cat-1",
    image: prodGinger, images: [prodGinger],
    status: "active", description: "Dried ginger powder", createdAt: "2025-02-10", rating: 5,
    options: [{ id: "opt-5-1", name: "Weight", values: ["100g", "250g"] }],
    variants: [
      { id: "v5-1", label: "100g", optionValues: { Weight: "100g" }, price: 210, stock: 35 },
      { id: "v5-2", label: "250g", optionValues: { Weight: "250g" }, price: 480, stock: 20 },
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
    options: [{ id: "opt-7-1", name: "Weight", values: ["100g", "250g", "500g"] }],
    variants: [
      { id: "v7-1", label: "100g", optionValues: { Weight: "100g" }, price: 120, stock: 55 },
      { id: "v7-2", label: "250g", optionValues: { Weight: "250g" }, price: 280, stock: 30 },
      { id: "v7-3", label: "500g", optionValues: { Weight: "500g" }, price: 450, stock: 15 },
    ],
  },
  {
    id: "prod-8", name: "Sabz Elaichi (Green Cardamom)", price: 180, stock: 3, categoryId: "cat-2",
    image: prodCardamom, images: [prodCardamom],
    status: "active", description: "Fragrant green cardamom pods", createdAt: "2025-02-18", rating: 5, priceRange: "₨ 180–₨ 800",
    options: [{ id: "opt-8-1", name: "Weight", values: ["25g", "50g", "100g", "250g"] }],
    variants: [
      { id: "v8-1", label: "25g", optionValues: { Weight: "25g" }, price: 180, stock: 3 },
      { id: "v8-2", label: "50g", optionValues: { Weight: "50g" }, price: 350, stock: 5 },
      { id: "v8-3", label: "100g", optionValues: { Weight: "100g" }, price: 650, stock: 2 },
      { id: "v8-4", label: "250g", optionValues: { Weight: "250g" }, price: 800, stock: 1 },
    ],
  },
  {
    id: "prod-9", name: "Ashwagandha | Asgand Nagori", price: 150, stock: 2, categoryId: "cat-1",
    image: prodAshwagandha, images: [prodAshwagandha],
    status: "active", description: "Withania Somnifera root", createdAt: "2025-03-01", rating: 5, priceRange: "₨ 150–₨ 1,500",
    options: [{ id: "opt-9-1", name: "Weight", values: ["50g", "100g", "500g"] }],
    variants: [
      { id: "v9-1", label: "50g", optionValues: { Weight: "50g" }, price: 150, stock: 2 },
      { id: "v9-2", label: "100g", optionValues: { Weight: "100g" }, price: 280, stock: 5 },
      { id: "v9-3", label: "500g", optionValues: { Weight: "500g" }, price: 1500, stock: 1 },
    ],
  },
  {
    id: "prod-10", name: "Shikakai | Soap Pod | سکاکائی", price: 60, stock: 70, categoryId: "cat-1",
    image: prodShikakai, images: [prodShikakai],
    status: "active", description: "Natural hair care herb", createdAt: "2025-03-05", rating: 4, priceRange: "₨ 60–₨ 650",
    options: [{ id: "opt-10-1", name: "Weight", values: ["100g", "500g", "1kg"] }],
    variants: [
      { id: "v10-1", label: "100g", optionValues: { Weight: "100g" }, price: 60, stock: 70 },
      { id: "v10-2", label: "500g", optionValues: { Weight: "500g" }, price: 250, stock: 30 },
      { id: "v10-3", label: "1kg", optionValues: { Weight: "1kg" }, price: 650, stock: 10 },
    ],
  },
  {
    id: "prod-11", name: "White Pepper Whole | Safeed Mirch", price: 320, stock: 30, categoryId: "cat-2",
    image: prodWhitePepper, images: [prodWhitePepper],
    status: "active", description: "Premium whole white pepper", createdAt: "2025-03-08", rating: 4, priceRange: "₨ 320–₨ 620",
    options: [{ id: "opt-11-1", name: "Weight", values: ["50g", "100g"] }],
    variants: [
      { id: "v11-1", label: "50g", optionValues: { Weight: "50g" }, price: 320, stock: 30 },
      { id: "v11-2", label: "100g", optionValues: { Weight: "100g" }, price: 620, stock: 15 },
    ],
  },
  {
    id: "prod-12", name: "Zeera Sabat Safeed (White Cumin)", price: 150, stock: 50, categoryId: "cat-2",
    image: prodCumin, images: [prodCumin],
    status: "active", description: "Whole white cumin seeds", createdAt: "2025-03-10", rating: 4, priceRange: "₨ 150–₨ 450",
    options: [{ id: "opt-12-1", name: "Weight", values: ["100g", "250g", "500g"] }],
    variants: [
      { id: "v12-1", label: "100g", optionValues: { Weight: "100g" }, price: 150, stock: 50 },
      { id: "v12-2", label: "250g", optionValues: { Weight: "250g" }, price: 350, stock: 25 },
      { id: "v12-3", label: "500g", optionValues: { Weight: "500g" }, price: 450, stock: 10 },
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

const DATA_VERSION = "v3-multi-variant";
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

// Contact Messages
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "unread" | "read" | "replied" | "archived";
  reply?: string;
  repliedAt?: string;
}

const defaultMessages: ContactMessage[] = [
  { id: "msg-1", name: "Ali Hassan", email: "ali@example.com", subject: "Product Inquiry", message: "I want to know about the availability of Kashmiri Saffron in bulk. Do you offer wholesale pricing?", date: "2024-03-10T10:30:00", status: "read" },
  { id: "msg-2", name: "Fatima Khan", email: "fatima@example.com", subject: "Order Issue", message: "My order #ORD-003 has not arrived yet. It's been 10 days since I placed it. Please help.", date: "2024-03-12T14:20:00", status: "replied", reply: "We're sorry for the delay. Your order has been reshipped and you should receive it within 3 days.", repliedAt: "2024-03-12T16:00:00" },
  { id: "msg-3", name: "Ahmed Raza", email: "ahmed.raza@example.com", subject: "Return Request", message: "I received the wrong product. I ordered Black Pepper but received Red Chilli Powder. Please arrange a return.", date: "2024-03-14T09:15:00", status: "unread" },
  { id: "msg-4", name: "Sara Malik", email: "sara@example.com", subject: "Partnership Opportunity", message: "We run a chain of organic stores and would love to partner with MSUR Herbs. Can we schedule a call?", date: "2024-03-15T11:45:00", status: "unread" },
  { id: "msg-5", name: "Usman Tariq", email: "usman@example.com", subject: "Feedback", message: "I've been using your Ashwagandha powder for 2 months now and the quality is amazing. Keep up the great work!", date: "2024-03-16T08:00:00", status: "read" },
];

export const getMessages = (): ContactMessage[] => getStore("admin_messages", defaultMessages);
export const saveMessages = (m: ContactMessage[]) => setStore("admin_messages", m);
export const addMessage = (m: ContactMessage) => { const all = getMessages(); all.unshift(m); saveMessages(all); };
export const updateMessage = (m: ContactMessage) => { const all = getMessages().map(x => x.id === m.id ? m : x); saveMessages(all); };
export const deleteMessage = (id: string) => { saveMessages(getMessages().filter(x => x.id !== id)); };

// Blog Posts
export interface AdminBlogPost extends SeoFields {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
  content: string;
  status: "published" | "draft";
  createdAt: string;
}

const defaultBlogPosts: AdminBlogPost[] = [
  {
    id: "blog-1", slug: "turmeric-golden-spice-health-benefits",
    title: "Turmeric: The Golden Spice and Its Amazing Health Benefits",
    category: "Wellness", date: "March 15, 2026", readTime: "5 Min Read", author: "MSUR Herbs",
    excerpt: "Discover why turmeric has been a cornerstone of traditional medicine for thousands of years and how it can boost your daily wellness routine.",
    image: blogTurmeric, featured: true, status: "published", createdAt: "2026-03-15",
    content: `Turmeric, often called the "Golden Spice," has been used in South Asian traditional medicine for over 4,000 years. Its active compound, curcumin, is responsible for both its vibrant yellow color and its powerful health benefits.\n\nResearch has shown that curcumin possesses strong anti-inflammatory and antioxidant properties. It can help manage oxidative and inflammatory conditions, metabolic syndrome, arthritis, and even anxiety. Adding turmeric to your daily diet is simpler than you might think.\n\nOne of the most popular ways to consume turmeric is through "golden milk" — a warm beverage made with milk, turmeric, black pepper (which enhances curcumin absorption by up to 2000%), and a touch of honey. This soothing drink has become a global wellness staple.\n\nYou can also add turmeric to your curries, rice dishes, smoothies, and even scrambled eggs. At MSUR Herbs, we source our turmeric directly from farmers who use traditional cultivation methods, ensuring the highest curcumin content in every batch.\n\nFor maximum benefits, always pair turmeric with a pinch of black pepper and a healthy fat like coconut oil or ghee. This combination significantly improves your body's ability to absorb curcumin.`,
  },
  {
    id: "blog-2", slug: "herbal-teas-for-better-sleep",
    title: "5 Herbal Teas That Will Transform Your Sleep Quality",
    category: "Wellness", date: "March 08, 2026", readTime: "4 Min Read", author: "MSUR Herbs",
    excerpt: "Struggling with sleep? These five natural herbal teas can help you relax, unwind, and enjoy deeper, more restful nights.",
    image: blogHerbalTea, status: "published", createdAt: "2026-03-08",
    content: `Quality sleep is the foundation of good health, yet millions struggle with it every night. Before reaching for sleep medications, consider the gentle power of herbal teas — nature's own sleep remedy.\n\nChamomile tea is perhaps the most well-known sleep aid. It contains apigenin, an antioxidant that binds to certain receptors in the brain to promote sleepiness and reduce insomnia.\n\nValerian root tea has been used since ancient Greek and Roman times. Studies suggest it can help you fall asleep faster and improve overall sleep quality.\n\nLavender tea offers more than just a pleasant aroma. Research indicates that inhaling lavender while drinking the tea creates a dual calming effect.\n\nPassionflower tea increases gamma-aminobutyric acid (GABA) levels in the brain, which helps lower brain activity and promotes calm.\n\nAshwagandha tea, a staple in Ayurvedic medicine, helps the body manage stress — one of the biggest barriers to quality sleep.`,
  },
  {
    id: "blog-3", slug: "ayurvedic-herbs-modern-wellness",
    title: "Ancient Ayurvedic Herbs for Modern Wellness",
    category: "Herbs", date: "February 28, 2026", readTime: "6 Min Read", author: "MSUR Herbs",
    excerpt: "Bridge the gap between ancient wisdom and modern science with these powerful Ayurvedic herbs that are backed by research.",
    image: blogAyurvedic, featured: true, status: "published", createdAt: "2026-02-28",
    content: `Ayurveda, the 5,000-year-old system of natural healing from India, has experienced a remarkable resurgence in modern wellness circles.\n\nAshwagandha (Withania somnifera) is perhaps the most studied Ayurvedic herb. Known as an adaptogen, it helps the body resist physical and mental stress.\n\nNeem, often called the "village pharmacy" in South Asia, has powerful antibacterial, antifungal, and anti-inflammatory properties.\n\nBrahmi (Bacopa monnieri) has been used for centuries to enhance cognitive function.\n\nTriphala, a combination of three fruits, is a gentle yet effective digestive tonic.`,
  },
  {
    id: "blog-4", slug: "honey-ginger-winter-remedies",
    title: "Honey & Ginger: Your Ultimate Winter Wellness Duo",
    category: "Remedies", date: "February 20, 2026", readTime: "3 Min Read", author: "MSUR Herbs",
    excerpt: "When winter arrives, this powerful combination of honey and ginger becomes your best defense against seasonal ailments.",
    image: blogHoneyGinger, status: "published", createdAt: "2026-02-20",
    content: `As temperatures drop, our bodies become more susceptible to colds, flu, and general winter malaise. Two of nature's most potent ingredients — honey and ginger — have been trusted remedies for centuries.\n\nGinger contains gingerol, a bioactive compound with powerful anti-inflammatory and antioxidant effects.\n\nRaw honey is a natural antibacterial and antiviral agent. It soothes sore throats, suppresses coughs, and provides quick energy.\n\nTogether, they create a synergistic effect that is greater than either ingredient alone.`,
  },
  {
    id: "blog-5", slug: "health-benefits-dry-fruits-nuts",
    title: "Top 8 Health Benefits of Dry Fruits & Nuts You Should Know",
    category: "Nutrition", date: "February 12, 2026", readTime: "5 Min Read", author: "MSUR Herbs",
    excerpt: "From heart health to brain function, discover the science-backed benefits of including dry fruits and nuts in your daily diet.",
    image: blogDryfruits, status: "published", createdAt: "2026-02-12",
    content: `Dry fruits and nuts are nutritional powerhouses packed into small, delicious packages.\n\nHeart health is perhaps the most well-documented benefit. Almonds, walnuts, and pistachios are rich in unsaturated fats.\n\nBrain function benefits significantly from regular nut consumption.\n\nWeight management may seem counterintuitive given their calorie density, but research consistently shows that nut consumers tend to have lower body weights.`,
  },
  {
    id: "blog-6", slug: "traditional-herbal-remedies-guide",
    title: "A Complete Guide to Traditional Herbal Remedies",
    category: "Guides", date: "January 30, 2026", readTime: "7 Min Read", author: "MSUR Herbs",
    excerpt: "From kitchen spices to powerful medicinal herbs, learn how our ancestors used plants for healing — and how you can too.",
    image: blogTraditional, status: "published", createdAt: "2026-01-30",
    content: `Traditional herbal remedies represent thousands of years of accumulated wisdom about the healing power of plants.\n\nCumin and coriander, common kitchen spices, are powerful digestive aids.\n\nBlack seed (Nigella sativa) has been called "the remedy for everything except death."\n\nSaffron offers benefits that justify its premium status.`,
  },
  {
    id: "blog-7", slug: "natural-skincare-herbs-oils",
    title: "Natural Skincare: Best Herbs & Oils for Glowing Skin",
    category: "Beauty", date: "January 22, 2026", readTime: "4 Min Read", author: "MSUR Herbs",
    excerpt: "Ditch the chemicals and embrace nature's own skincare ingredients.",
    image: blogSkincare, status: "published", createdAt: "2026-01-22",
    content: `The beauty industry has come full circle. After decades of synthetic formulations, there's a growing movement back to natural, plant-based skincare.\n\nNeem oil is one of the most powerful natural skincare ingredients available.\n\nTurmeric face masks have been a bridal beauty ritual in South Asia for centuries.\n\nRose water is a natural toner that balances skin pH.`,
  },
  {
    id: "blog-8", slug: "spice-market-buying-guide",
    title: "How to Buy Authentic Spices: A Complete Buyer's Guide",
    category: "Guides", date: "January 10, 2026", readTime: "5 Min Read", author: "MSUR Herbs",
    excerpt: "Learn how to identify high-quality spices, avoid adulteration, and store your spice collection for maximum flavor and potency.",
    image: blogSpiceMarket, status: "published", createdAt: "2026-01-10",
    content: `The difference between a good dish and a great dish often comes down to the quality of spices used.\n\nColor is your first clue, but it can be misleading.\n\nAroma tells a powerful story. Fresh, high-quality spices have a strong, distinct fragrance.\n\nBuy whole spices whenever possible and grind them yourself.`,
  },
  {
    id: "blog-9", slug: "black-pepper-king-of-spices",
    title: "Black Pepper: Why It's Called the King of Spices",
    category: "Spices", date: "December 28, 2025", readTime: "4 Min Read", author: "MSUR Herbs",
    excerpt: "From ancient trade routes to modern kitchens, black pepper has held its crown as the world's most important spice for millennia.",
    image: blogBlackPepper, status: "published", createdAt: "2025-12-28",
    content: `Black pepper (Piper nigrum) has been the world's most traded spice for over 4,000 years.\n\nThe compound responsible for pepper's signature heat is piperine. Beyond flavor, piperine has remarkable health properties.\n\nThere's a significant difference between pre-ground pepper and freshly cracked peppercorns.\n\nDifferent varieties offer different flavor profiles.`,
  },
];

export const getBlogPosts = (): AdminBlogPost[] => getStore("admin_blog_posts", defaultBlogPosts);
export const saveBlogPosts = (b: AdminBlogPost[]) => setStore("admin_blog_posts", b);
export const addBlogPost = (b: AdminBlogPost) => { const all = getBlogPosts(); all.push(b); saveBlogPosts(all); };
export const updateBlogPost = (b: AdminBlogPost) => { const all = getBlogPosts().map(x => x.id === b.id ? b : x); saveBlogPosts(all); };
export const deleteBlogPost = (id: string) => { saveBlogPosts(getBlogPosts().filter(x => x.id !== id)); };

// Reset to defaults
export const resetProducts = () => { localStorage.removeItem("admin_products"); };
export const resetCategories = () => { localStorage.removeItem("admin_categories"); };
export const resetReviews = () => { localStorage.removeItem("admin_reviews"); };
export const resetBlogPosts = () => { localStorage.removeItem("admin_blog_posts"); };
