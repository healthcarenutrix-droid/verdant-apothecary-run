import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X, Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SideCart from "@/components/SideCart";
import SearchOverlay from "@/components/SearchOverlay";

const links = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Left: Nav Links (desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`nav-link text-sm ${location.pathname === l.path ? "nav-link-active" : ""}`}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Center: Logo */}
          <Link to="/" className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-foreground">
                <span className="text-primary italic">M</span>SUR
              </span>
            </div>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-foreground hover:text-primary transition-colors" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden sm:block text-foreground hover:text-primary transition-colors">
              <User className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="relative text-foreground hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              {totalWishlist > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalWishlist}
                </span>
              )}
            </Link>
            <button
              className="relative text-foreground hover:text-primary transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in">
            <div className="flex flex-col p-4 gap-1">
              {links.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-4 text-sm font-medium rounded transition-colors ${
                    location.pathname === l.path
                      ? "text-primary font-semibold bg-secondary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <SideCart open={cartOpen} onOpenChange={setCartOpen} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
