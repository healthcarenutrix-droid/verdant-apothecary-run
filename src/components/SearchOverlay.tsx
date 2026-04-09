import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const results = query.trim().length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full max-w-2xl mx-auto mt-20 rounded-lg shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.trim().length > 1 && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No products found for "{query}"</p>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-3 hover:bg-secondary transition-colors"
            >
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} — ₨ {p.price}</p>
              </div>
            </Link>
          ))}
          {query.trim().length <= 1 && (
            <p className="text-center text-muted-foreground py-8 text-sm">Type to search products...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
