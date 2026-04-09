import { useState, useMemo } from "react";
import { Star, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getReviews, addReview, Review } from "@/data/dashboard-data";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { toast } = useToast();
  const allReviews = useMemo(() => getReviews().filter(r => r.productId === productId && r.status === "visible"), [productId]);
  const [reviews, setReviews] = useState<Review[]>(allReviews);
  const [showForm, setShowForm] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Form state
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) setImage(e.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      toast({ title: "Please fill in your name and review", variant: "destructive" });
      return;
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: author.trim(),
      email: email.trim(),
      rating,
      text: text.trim(),
      image: image || undefined,
      status: "visible",
      createdAt: new Date().toISOString().split("T")[0],
    };
    addReview(newReview);
    setReviews(prev => [newReview, ...prev]);
    setAuthor(""); setEmail(""); setRating(5); setText(""); setImage("");
    setShowForm(false);
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
  };

  // Carousel logic: show 3 at a time on desktop
  const perSlide = 3;
  const maxSlide = Math.max(0, Math.ceil(reviews.length / perSlide) - 1);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-border"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 md:p-6 space-y-4 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email (optional)</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Rating *</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                >
                  <Star className={`h-6 w-6 cursor-pointer transition-colors ${
                    n <= (hoverRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-border"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Review *</label>
            <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience..." rows={4} className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Photo (optional)</label>
            {image ? (
              <div className="relative inline-block mt-2">
                <img src={image} alt="Review" className="w-20 h-20 object-cover rounded-lg" />
                <button type="button" onClick={() => setImage("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="mt-1 flex items-center gap-2 border border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload a photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
              </label>
            )}
          </div>

          <Button type="submit" className="w-full sm:w-auto">Submit Review</Button>
        </form>
      )}

      {/* Review carousel */}
      {reviews.length > 0 ? (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(carouselIdx * perSlide, carouselIdx * perSlide + perSlide).map(r => (
              <div key={r.id} className="border border-border rounded-lg p-4 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{r.author}</p>
                    <p className="text-xs text-muted-foreground">{r.createdAt}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-border"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                {r.image && (
                  <img src={r.image} alt="Review" className="w-full h-32 object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>
          {maxSlide > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={carouselIdx === 0} onClick={() => setCarouselIdx(c => c - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">{carouselIdx + 1} / {maxSlide + 1}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={carouselIdx >= maxSlide} onClick={() => setCarouselIdx(c => c + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : !showForm && (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          <Button variant="outline" className="mt-3" onClick={() => setShowForm(true)}>Write a Review</Button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
