import { useState, useRef, MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  onSale?: boolean;
}

const ProductImageGallery = ({ images, name, onSale }: ProductImageGalleryProps) => {
  const [selected, setSelected] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number; show: boolean }>({ x: 50, y: 50, show: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const allImages = images.length > 0 ? images : [""];

  const goNext = () => setSelected((s) => (s + 1) % allImages.length);
  const goPrev = () => setSelected((s) => (s - 1 + allImages.length) % allImages.length);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLens({ x, y, show: true });
  };

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        ref={containerRef}
        className="relative bg-secondary rounded-lg overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => setLens((l) => ({ ...l, show: true }))}
        onMouseLeave={() => setLens((l) => ({ ...l, show: false }))}
        onMouseMove={handleMouseMove}
        onClick={() => setZoomOpen(true)}
      >
        {onSale && (
          <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
            Sale!
          </span>
        )}
        <img
          src={allImages[selected]}
          alt={`${name} - Image ${selected + 1}`}
          className="w-full aspect-square object-cover transition-transform duration-200"
          style={lens.show ? { transform: "scale(2.5)", transformOrigin: `${lens.x}% ${lens.y}%` } : undefined}
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selected === idx ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen zoom dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl p-0 bg-background border-0">
          <div className="relative">
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-3 right-3 z-10 bg-card/90 hover:bg-card rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-auto max-h-[85vh]">
              <img
                src={allImages[selected]}
                alt={`${name} - zoom`}
                className="w-full h-auto object-contain"
              />
            </div>
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
