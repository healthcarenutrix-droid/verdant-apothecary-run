import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery = ({ images, name }: ProductImageGalleryProps) => {
  const [selected, setSelected] = useState(0);
  const allImages = images.length > 0 ? images : [""];

  const goNext = () => setSelected((s) => (s + 1) % allImages.length);
  const goPrev = () => setSelected((s) => (s - 1 + allImages.length) % allImages.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative bg-secondary rounded-lg overflow-hidden group">
        <img
          src={allImages[selected]}
          alt={`${name} - Image ${selected + 1}`}
          className="w-full aspect-square object-cover"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
    </div>
  );
};

export default ProductImageGallery;
