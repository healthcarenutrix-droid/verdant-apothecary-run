import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="bg-[hsl(0,0%,7%)] text-white">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Logo */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-1 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl italic text-white">MSUR</span>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Shop</Link></li>
            <li><Link to="/about" className="text-white/70 hover:text-destructive transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-destructive transition-colors">Contact Us</Link></li>
            <li><Link to="/blog" className="text-white/70 hover:text-destructive transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Arqiyat</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Dry Fruits</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Fruit Preserves</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Herbal Oils</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Herbs</Link></li>
            <li><Link to="/products" className="text-white/70 hover:text-destructive transition-colors">Spices</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="text-white/70 hover:text-destructive transition-colors">My Account</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-destructive transition-colors">Order Tracking</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-destructive transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-destructive transition-colors">Return Policy</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white">Contact Us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>03117956306</li>
            <li>msurherbs@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
        © {new Date().getFullYear()} MSUR Herbs. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
