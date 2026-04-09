import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import blogBlackPepper from "@/assets/blog-black-pepper.webp";
import blogGarlic from "@/assets/blog-garlic.webp";
import blogSpicesGuide from "@/assets/blog-spices-guide.webp";
import { blogPostsData } from "@/pages/BlogPost";

const blogImages: Record<string, string> = {
  "black-pepper-spice-beef-recipe": blogBlackPepper,
  "garlicky-punch-and-finishes": blogGarlic,
  "spices-subscription-guide": blogSpicesGuide,
};

const Blog = () => (
  <div>
    <section className="bg-primary text-primary-foreground py-16 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg opacity-80">Latest articles, recipes, and tips</p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPostsData.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.slug} className="product-card group">
            <div className="h-48 overflow-hidden">
              <img src={blogImages[post.slug] || blogBlackPepper} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 space-y-3">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded uppercase">
                {post.category}
              </span>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default Blog;
