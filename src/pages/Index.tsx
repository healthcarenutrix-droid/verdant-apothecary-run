import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import { products, categoryObjects } from "@/data/products";

import heroBg from "@/assets/hero-bg.jpg";
import catSpices from "@/assets/cat-spices.webp";
import blogBlackPepper from "@/assets/blog-black-pepper.webp";
import blogGarlic from "@/assets/blog-garlic.webp";
import blogSpicesGuide from "@/assets/blog-spices-guide.webp";

const blogImageMap: Record<string, string> = {
  "black-pepper-spice-beef-recipe": blogBlackPepper,
  "garlicky-punch-and-finishes": blogGarlic,
  "spices-subscription-guide": blogSpicesGuide,
};

/* ─── Hero Slider ─── */
const heroSlides = [
  {
    heading: "Herbs & Spices the",
    bigText: "WAY NATURE",
    bigText2: "INTENDED",
  },
  {
    heading: "Pure & Natural",
    bigText: "HERBAL",
    bigText2: "REMEDIES",
  },
  {
    heading: "Premium Quality",
    bigText: "SPICES &",
    bigText2: "HERBS",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 flex items-center min-h-[420px]">
        <div className="text-primary-foreground animate-fade-in" key={current}>
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-2">{slide.heading}</p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-none tracking-tight">
            {slide.bigText}
          </h1>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-none tracking-tight text-primary-foreground/90">
            {slide.bigText2}
          </h1>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-primary-foreground" : "bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

/* ─── Shipping Banner ─── */
const ShippingBanner = () => (
  <div className="text-center py-5 px-4 border-b border-border">
    <p className="text-sm md:text-base font-medium text-foreground capitalize">
      Most Products Can Be Shipped In 5 Business Days Or Less!
    </p>
  </div>
);

/* ─── Categories ─── */
const Categories = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
      {categoryObjects.map((cat) => (
        <Link to={`/collections/${cat.slug}`} key={cat.name} className="flex flex-col items-center gap-3 group">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                width={112}
                height={112}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                {cat.name}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-foreground text-center">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

/* ─── Featured Products ─── */
const FeaturedProducts = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <h2 className="section-title text-center mb-10">
      Discover Our <span className="inline-block ml-2">Featured Products</span>
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, 4).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
);

/* ─── Deals of the Month ─── */
const DealsCountdown = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);

    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[hsl(0,0%,20%)] text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Deals of the month</h2>
          <p className="text-sm opacity-70">
            Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping.
          </p>
        </div>
        <div className="flex gap-6">
          {[
            { val: time.days, label: "Days" },
            { val: time.hours, label: "Hours" },
            { val: time.mins, label: "Minutes" },
            { val: time.secs, label: "Seconds" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold">{t.val}</div>
              <div className="text-xs opacity-60 mt-1">{t.label}</div>
            </div>
          ))}
        </div>
        <Button asChild className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 text-sm font-medium px-6">
          <Link to="/products">View All Deals</Link>
        </Button>
      </div>
    </section>
  );
};

/* ─── New Herbs ─── */
const NewHerbs = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <h2 className="section-title text-center mb-10">
      Discover Our <span className="inline-block ml-2">New Herbs</span>
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.slice(4, 8).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
);

/* ─── Bundle Banner ─── */
const BundleBanner = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <div className="bg-secondary rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h2 className="section-title mb-4">Shop in Bundle & Save More</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Discover the ultimate bundle of spice sets. Whether you're looking for BBQ or baking spice gift set, vegetarian meals, or international flavors.
        </p>
        <ul className="space-y-2 text-sm text-foreground mb-6">
          <li>3 spices, save Rs199</li>
          <li>6 spices, save Rs299 (free shipping!)</li>
          <li>9 spices, save Rs499 (free shipping!)</li>
        </ul>
        <Button asChild className="rounded-md">
          <Link to="/products">Build your own set</Link>
        </Button>
      </div>
      <div className="w-full md:w-80 h-48 md:h-64 flex items-center justify-center">
        <img src={catSpices} alt="Spice bundle" className="max-w-full max-h-full object-contain" loading="lazy" />
      </div>
    </div>
  </section>
);

/* ─── New Spices ─── */
const NewSpices = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <h2 className="section-title text-center mb-10">
      Discover Our <span className="inline-block ml-2">New Species</span>
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.slice(7, 12).map((p) => (
        <ProductCard key={`spice-${p.id}`} product={p} />
      ))}
    </div>
  </section>
);

/* ─── Blog Preview ─── */
const blogPosts = [
  {
    slug: "black-pepper-spice-beef-recipe",
    title: "Black Pepper Spice Beef Recipe",
    category: "GardenFrost Puree",
    date: "13 Feb",
    excerpt: "Mole sauce are a magnificent mixture fragrant layered flavors, and we're honing...",
    views: 228,
  },
  {
    slug: "garlicky-punch-and-finishes",
    title: "Garlicky Punch and Finishes",
    category: "Backpepper",
    date: "21 Feb",
    excerpt: "We combine famous carnitas flavor with herbaceous Indian spices...",
    views: 177,
  },
  {
    slug: "spices-subscription-guide",
    title: "Spices Subscription Guide",
    category: "Backpepper",
    date: "17 Mar",
    excerpt: "With blend we sought to capture the essence and introduce a new dimension...",
    views: 166,
  },
];

const BlogSection = () => (
  <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
    <h2 className="section-title text-center mb-10">
      From <span className="inline-block ml-2">The Articles</span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogPosts.map((post) => (
        <Link to={`/blog/${post.slug}`} key={post.title} className="group">
          <div className="h-48 rounded-lg overflow-hidden mb-4 bg-secondary relative">
            <img src={blogImageMap[post.slug] || blogBlackPepper} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded uppercase">
              {post.category}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>👁 {post.views}</span>
            <span>💬 0</span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

/* ─── Subscription Banner ─── */
const SubscriptionBanner = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    toast({ title: "Subscribed!", description: "Thank you for subscribing." });
    setEmail("");
  };

  return (
    <section className="bg-[hsl(0,62%,22%)] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">Our Subscription</h2>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button type="submit" className="shrink-0">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

/* ─── Index Page ─── */
const Index = () => (
  <div>
    <Hero />
    <ShippingBanner />
    <Categories />
    <FeaturedProducts />
    <DealsCountdown />
    <NewHerbs />
    <BundleBanner />
    <NewSpices />
    <BlogSection />
    <SubscriptionBanner />
  </div>
);

export default Index;
