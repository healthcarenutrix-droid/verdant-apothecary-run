import { useParams, Link } from "react-router-dom";
import { ChevronRight, Calendar, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import blogBlackPepper from "@/assets/blog-black-pepper.webp";
import blogGarlic from "@/assets/blog-garlic.webp";
import blogSpicesGuide from "@/assets/blog-spices-guide.webp";

const blogImages: Record<string, string> = {
  "black-pepper-spice-beef-recipe": blogBlackPepper,
  "garlicky-punch-and-finishes": blogGarlic,
  "spices-subscription-guide": blogSpicesGuide,
};

const blogPostsData = [
  {
    slug: "black-pepper-spice-beef-recipe",
    title: "Black Pepper Spice Beef Recipe",
    category: "Recipes",
    date: "13 Feb 2023",
    views: 228,
    content: `Black pepper is one of the most versatile spices in the world. Its bold, pungent flavor makes it a perfect companion for beef dishes. In this recipe, we'll explore how to create a mouthwatering black pepper beef that captures the essence of traditional cooking with a modern twist.

Start by selecting high-quality black peppercorns — whole, freshly ground pepper delivers significantly more flavor than pre-ground varieties. Toast the peppercorns lightly in a dry pan to release their aromatic oils before crushing them.

For the marinade, combine crushed black pepper with garlic, soy sauce, a touch of honey, and sesame oil. Let the beef strips marinate for at least 30 minutes. The longer you marinate, the more flavorful the result.

Cook on high heat in a wok or heavy skillet, searing the beef quickly to lock in the juices. Add vegetables of your choice — bell peppers, onions, and spring onions work beautifully. Finish with a splash of oyster sauce and serve over steamed rice.`,
  },
  {
    slug: "garlicky-punch-and-finishes",
    title: "Garlicky Punch and Finishes",
    category: "Tips",
    date: "21 Feb 2023",
    views: 177,
    content: `Garlic is the backbone of countless cuisines around the world. Its ability to transform a simple dish into something extraordinary is unmatched. In this article, we explore different techniques for using garlic to add depth and complexity to your cooking.

Raw garlic delivers a sharp, pungent bite — perfect for dressings, marinades, and dips. Roasted garlic becomes sweet and nutty, ideal for spreading on bread or stirring into mashed potatoes. Sautéed garlic adds a mellow warmth to any dish.

The key is timing: add garlic too early and it burns, becoming bitter. Add it too late and it remains raw. For most sautéed dishes, add minced garlic about 30 seconds before adding your liquid or other ingredients.

Try finishing your dishes with a garlic-infused oil drizzle for an extra punch that elevates even the simplest preparations.`,
  },
  {
    slug: "spices-subscription-guide",
    title: "Spices Subscription Guide",
    category: "Guides",
    date: "17 Mar 2023",
    views: 166,
    content: `Building a well-stocked spice collection can be overwhelming. A spice subscription service takes the guesswork out of the equation, delivering curated selections right to your door.

When choosing a subscription, consider what cuisines you enjoy most. If you love South Asian cooking, look for services that focus on cumin, coriander, turmeric, and specialty blends. For Mediterranean cooking, prioritize oregano, thyme, and sumac.

Quality matters more than quantity. Look for subscriptions that source directly from farmers and grind in small batches. Whole spices retain their potency much longer than pre-ground varieties — up to 3-4 years compared to 6 months.

Store your spices in airtight containers away from heat and light. A cool, dark drawer or cabinet is ideal. Label everything with the purchase date so you know when it's time to refresh your collection.`,
  },
];

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
        <Button asChild><Link to="/blog">Back to Blog</Link></Button>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1 text-sm opacity-80 mb-4">
            <Link to="/" className="hover:opacity-100">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:opacity-100">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1">{post.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-lg overflow-hidden mb-8">
          <img src={blogImages[post.slug] || blogBlackPepper} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded">{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} views</span>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{para}</p>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Button asChild variant="outline">
            <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog</Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export { blogPostsData };
export default BlogPost;
