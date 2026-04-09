import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import DashboardCategories from "./pages/dashboard/DashboardCategories";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardReviews from "./pages/dashboard/DashboardReviews";

const queryClient = new QueryClient();

const StorefrontLayout = () => (
  <>
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-complete" element={<OrderComplete />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Routes>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="products" element={<DashboardProducts />} />
                  <Route path="categories" element={<DashboardCategories />} />
                  <Route path="orders" element={<DashboardOrders />} />
                  <Route path="reviews" element={<DashboardReviews />} />
                </Route>
                <Route path="/*" element={<StorefrontLayout />} />
              </Routes>
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
