import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPostsData, BlogPost } from "@/pages/BlogPost";

const CATEGORIES = ["All", ...Array.from(new Set(blogPostsData.map(p => p.category)))];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);

  const featured = blogPostsData.filter(p => p.featured);
  const currentFeatured = featured[heroIndex] || featured[0];

  const filteredPosts = activeCategory === "All"
    ? blogPostsData.filter(p => !p.featured)
    : blogPostsData.filter(p => p.category === activeCategory && !p.featured);

  const nextHero = () => setHeroIndex((heroIndex + 1) % featured.length);
  const prevHero = () => setHeroIndex((heroIndex - 1 + featured.length) % featured.length);

  return (
    <div>
      {/* Hero Featured Slider */}
      {currentFeatured && (
        <section className="relative bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Text Side */}
              <div className="space-y-5 order-2 md:order-1">
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentFeatured.category}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                  {currentFeatured.title}
                </h1>
                <div className="w-16 h-1 bg-primary rounded-full" />
                <p className="text-muted-foreground leading-relaxed text-base">
                  {currentFeatured.excerpt}
                </p>
                <Button asChild className="group">
                  <Link to={`/blog/${currentFeatured.slug}`}>
                    Read This Article <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                {/* Slider controls */}
                {featured.length > 1 && (
                  <div className="flex items-center gap-3 pt-4">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={prevHero}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setHeroIndex(i)}
                          className={`transition-all duration-300 rounded-full ${
                            i === heroIndex ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                        />
                      ))}
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextHero}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Side */}
              <div className="order-1 md:order-2">
                <Link to={`/blog/${currentFeatured.slug}`} className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={currentFeatured.image}
                    alt={currentFeatured.title}
                    className="w-full h-64 md:h-[380px] object-cover hover:scale-105 transition-transform duration-700"
                    width={800}
                    height={512}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Section Header + Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Featured Articles, Picked Just For You
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid — first post large, rest in 2-column */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large first card */}
            <div className="md:row-span-2">
              <BlogCard post={filteredPosts[0]} large />
            </div>

            {/* Remaining cards */}
            {filteredPosts.slice(1).map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>No articles found in this category.</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-primary/5 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">Stay Updated with Natural Wellness Tips</h3>
          <p className="text-muted-foreground text-sm">Subscribe to our blog for the latest articles on herbs, spices, and natural remedies.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const BlogCard = ({ post, large }: { post: BlogPost; large?: boolean }) => (
  <Link
    to={`/blog/${post.slug}`}
    className={`group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col ${
      large ? "h-full" : ""
    }`}
  >
    <div className={`overflow-hidden ${large ? "h-64 md:h-72" : "h-48"}`}>
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        width={800}
        height={512}
      />
    </div>
    <div className={`p-5 flex flex-col flex-1 ${large ? "space-y-3" : "space-y-2"}`}>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
      </div>
      <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
        large ? "text-lg md:text-xl" : "text-sm line-clamp-2"
      }`}>
        {post.title}
      </h3>
      {large && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      )}
      <div className="mt-auto pt-2">
        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
          {post.category}
        </span>
      </div>
    </div>
  </Link>
);

export default Blog;
