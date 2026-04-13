import { useParams, Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import blogTurmeric from "@/assets/blog-turmeric.jpg";
import blogHerbalTea from "@/assets/blog-herbal-tea.jpg";
import blogAyurvedic from "@/assets/blog-ayurvedic.jpg";
import blogHoneyGinger from "@/assets/blog-honey-ginger.jpg";
import blogDryfruits from "@/assets/blog-dryfruits.jpg";
import blogTraditional from "@/assets/blog-traditional.jpg";
import blogSkincare from "@/assets/blog-skincare.jpg";
import blogSpiceMarket from "@/assets/blog-spice-market.jpg";
import blogBlackPepper from "@/assets/blog-black-pepper.webp";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  image: string;
  featured?: boolean;
  content: string;
}

const blogPostsData: BlogPost[] = [
  {
    slug: "turmeric-golden-spice-health-benefits",
    title: "Turmeric: The Golden Spice and Its Amazing Health Benefits",
    category: "Wellness",
    date: "March 15, 2026",
    readTime: "5 Min Read",
    author: "MSUR Herbs",
    excerpt: "Discover why turmeric has been a cornerstone of traditional medicine for thousands of years and how it can boost your daily wellness routine.",
    image: blogTurmeric,
    featured: true,
    content: `Turmeric, often called the "Golden Spice," has been used in South Asian traditional medicine for over 4,000 years. Its active compound, curcumin, is responsible for both its vibrant yellow color and its powerful health benefits.

Research has shown that curcumin possesses strong anti-inflammatory and antioxidant properties. It can help manage oxidative and inflammatory conditions, metabolic syndrome, arthritis, and even anxiety. Adding turmeric to your daily diet is simpler than you might think.

One of the most popular ways to consume turmeric is through "golden milk" — a warm beverage made with milk, turmeric, black pepper (which enhances curcumin absorption by up to 2000%), and a touch of honey. This soothing drink has become a global wellness staple.

You can also add turmeric to your curries, rice dishes, smoothies, and even scrambled eggs. At MSUR Herbs, we source our turmeric directly from farmers who use traditional cultivation methods, ensuring the highest curcumin content in every batch.

For maximum benefits, always pair turmeric with a pinch of black pepper and a healthy fat like coconut oil or ghee. This combination significantly improves your body's ability to absorb curcumin.`,
  },
  {
    slug: "herbal-teas-for-better-sleep",
    title: "5 Herbal Teas That Will Transform Your Sleep Quality",
    category: "Wellness",
    date: "March 08, 2026",
    readTime: "4 Min Read",
    author: "MSUR Herbs",
    excerpt: "Struggling with sleep? These five natural herbal teas can help you relax, unwind, and enjoy deeper, more restful nights.",
    image: blogHerbalTea,
    content: `Quality sleep is the foundation of good health, yet millions struggle with it every night. Before reaching for sleep medications, consider the gentle power of herbal teas — nature's own sleep remedy.

Chamomile tea is perhaps the most well-known sleep aid. It contains apigenin, an antioxidant that binds to certain receptors in the brain to promote sleepiness and reduce insomnia. Drinking a cup 30 minutes before bed creates a calming bedtime ritual.

Valerian root tea has been used since ancient Greek and Roman times. Studies suggest it can help you fall asleep faster and improve overall sleep quality. Its earthy flavor pairs well with a touch of honey.

Lavender tea offers more than just a pleasant aroma. Research indicates that inhaling lavender while drinking the tea creates a dual calming effect that reduces anxiety and promotes relaxation.

Passionflower tea increases gamma-aminobutyric acid (GABA) levels in the brain, which helps lower brain activity and promotes calm. It's particularly helpful for those with racing thoughts at bedtime.

Ashwagandha tea, a staple in Ayurvedic medicine, helps the body manage stress — one of the biggest barriers to quality sleep. Regular consumption can help regulate your body's stress response and improve sleep patterns over time.`,
  },
  {
    slug: "ayurvedic-herbs-modern-wellness",
    title: "Ancient Ayurvedic Herbs for Modern Wellness",
    category: "Herbs",
    date: "February 28, 2026",
    readTime: "6 Min Read",
    author: "MSUR Herbs",
    excerpt: "Bridge the gap between ancient wisdom and modern science with these powerful Ayurvedic herbs that are backed by research.",
    image: blogAyurvedic,
    featured: true,
    content: `Ayurveda, the 5,000-year-old system of natural healing from India, has experienced a remarkable resurgence in modern wellness circles. What makes this ancient system so relevant today is that modern science is increasingly validating what practitioners have known for millennia.

Ashwagandha (Withania somnifera) is perhaps the most studied Ayurvedic herb. Known as an adaptogen, it helps the body resist physical and mental stress. Clinical studies have shown it can reduce cortisol levels by up to 30%, improve memory, and enhance muscle strength.

Neem, often called the "village pharmacy" in South Asia, has powerful antibacterial, antifungal, and anti-inflammatory properties. Its leaves, bark, and oil are used in everything from skincare to dental care. Modern research confirms its effectiveness against various skin conditions.

Brahmi (Bacopa monnieri) has been used for centuries to enhance cognitive function. Recent studies show it can improve memory formation, reduce anxiety, and even help with attention disorders. It works by increasing blood flow to the brain and protecting neural pathways.

Triphala, a combination of three fruits (Amalaki, Bibhitaki, and Haritaki), is a gentle yet effective digestive tonic. It supports gut health, promotes regular elimination, and is rich in antioxidants. Many practitioners recommend it as the single most important Ayurvedic formulation.

At MSUR Herbs, we honor these traditions by sourcing authentic, high-quality herbs processed using methods that preserve their natural potency. Each product is carefully tested to ensure it meets both traditional standards and modern quality expectations.`,
  },
  {
    slug: "honey-ginger-winter-remedies",
    title: "Honey & Ginger: Your Ultimate Winter Wellness Duo",
    category: "Remedies",
    date: "February 20, 2026",
    readTime: "3 Min Read",
    author: "MSUR Herbs",
    excerpt: "When winter arrives, this powerful combination of honey and ginger becomes your best defense against seasonal ailments.",
    image: blogHoneyGinger,
    content: `As temperatures drop, our bodies become more susceptible to colds, flu, and general winter malaise. Two of nature's most potent ingredients — honey and ginger — have been trusted remedies for centuries, and for good reason.

Ginger contains gingerol, a bioactive compound with powerful anti-inflammatory and antioxidant effects. It can help relieve nausea, reduce muscle pain, and support the immune system. Fresh ginger is particularly effective when steeped in hot water to make a warming tea.

Raw honey is a natural antibacterial and antiviral agent. It soothes sore throats, suppresses coughs, and provides quick energy. Unlike processed honey, raw honey retains all its beneficial enzymes, antioxidants, and minerals.

Together, they create a synergistic effect that is greater than either ingredient alone. A simple honey-ginger preparation can be made by grating fresh ginger into warm water, letting it steep for 10 minutes, then stirring in a tablespoon of raw honey.

For a more potent preparation, create a honey-ginger preserve: layer thin slices of fresh ginger in a jar with raw honey and let it infuse for at least a week. Take a spoonful daily during winter months for ongoing immune support.

Add a squeeze of lemon for extra vitamin C, or a pinch of turmeric and black pepper for additional anti-inflammatory benefits. This simple combination is one of the most effective natural wellness tools available.`,
  },
  {
    slug: "health-benefits-dry-fruits-nuts",
    title: "Top 8 Health Benefits of Dry Fruits & Nuts You Should Know",
    category: "Nutrition",
    date: "February 12, 2026",
    readTime: "5 Min Read",
    author: "MSUR Herbs",
    excerpt: "From heart health to brain function, discover the science-backed benefits of including dry fruits and nuts in your daily diet.",
    image: blogDryfruits,
    content: `Dry fruits and nuts are nutritional powerhouses packed into small, delicious packages. They've been valued as energy-dense foods for centuries, and modern nutrition science confirms their remarkable health benefits.

Heart health is perhaps the most well-documented benefit. Almonds, walnuts, and pistachios are rich in unsaturated fats, fiber, and plant sterols that help lower LDL cholesterol. Studies show that consuming a handful of nuts daily can reduce heart disease risk by up to 30%.

Brain function benefits significantly from regular nut consumption. Walnuts, shaped remarkably like a brain, contain omega-3 fatty acids, polyphenols, and vitamin E — all crucial for cognitive health and neuroprotection against age-related decline.

Weight management may seem counterintuitive given their calorie density, but research consistently shows that nut consumers tend to have lower body weights. The combination of protein, fiber, and healthy fats promotes satiety and reduces overall calorie intake.

Bone health is supported by the calcium, magnesium, and phosphorus found abundantly in almonds, figs, and dates. These minerals are essential for maintaining bone density, especially important as we age.

Blood sugar regulation is enhanced by the low glycemic index of most nuts and the fiber content of dried fruits like figs and apricots. They provide sustained energy without the blood sugar spikes of refined snacks.

Skin and hair health benefit from the vitamin E, zinc, and biotin found in almonds, cashews, and walnuts. These nutrients support collagen production and protect against oxidative damage.

Digestive health is promoted by the fiber in dates, figs, and prunes, which supports regular bowel movements and feeds beneficial gut bacteria. Soaked almonds are particularly gentle on the digestive system.

At MSUR Herbs, we offer premium quality dry fruits sourced directly from trusted growers, ensuring freshness and maximum nutritional value in every bite.`,
  },
  {
    slug: "traditional-herbal-remedies-guide",
    title: "A Complete Guide to Traditional Herbal Remedies",
    category: "Guides",
    date: "January 30, 2026",
    readTime: "7 Min Read",
    author: "MSUR Herbs",
    excerpt: "From kitchen spices to powerful medicinal herbs, learn how our ancestors used plants for healing — and how you can too.",
    image: blogTraditional,
    content: `Traditional herbal remedies represent thousands of years of accumulated wisdom about the healing power of plants. While modern medicine has brought remarkable advances, many people are rediscovering these time-tested approaches as complementary wellness tools.

The foundation of herbal medicine lies in understanding that plants produce complex chemical compounds as part of their own defense and survival mechanisms. When we consume these plants, we benefit from those same protective compounds.

Cumin and coriander, common kitchen spices, are powerful digestive aids. Cumin stimulates enzyme secretion and can relieve bloating, while coriander helps detoxify the body and supports healthy liver function. A simple cumin-coriander tea after meals can transform your digestion.

Black seed (Nigella sativa), known as "Kalonji" in South Asian traditions, has been called "the remedy for everything except death." Modern research validates its impressive range of benefits, from immune support to blood sugar regulation and respiratory health.

Saffron, the world's most expensive spice by weight, offers benefits that justify its premium status. Studies show it can improve mood, support eye health, and even help with PMS symptoms. Just a few strands steeped in warm milk create a powerful wellness tonic.

Fennel seeds are nature's antacid. Chewing a teaspoon after meals reduces acid reflux, freshens breath, and supports digestive comfort. They also have mild diuretic properties that can help reduce water retention.

Preparing herbal remedies at home is straightforward. The most common methods include decoctions (boiling herbs), infusions (steeping in hot water), and pastes (grinding with water or oil). Each method extracts different beneficial compounds.

Start slowly when introducing any new herb into your routine. Begin with small amounts and observe how your body responds. While generally safe, herbs can interact with medications, so consult with a healthcare provider if you're on any prescription drugs.`,
  },
  {
    slug: "natural-skincare-herbs-oils",
    title: "Natural Skincare: Best Herbs & Oils for Glowing Skin",
    category: "Beauty",
    date: "January 22, 2026",
    readTime: "4 Min Read",
    author: "MSUR Herbs",
    excerpt: "Ditch the chemicals and embrace nature's own skincare ingredients — herbs and oils that have been beautifying skin for centuries.",
    image: blogSkincare,
    content: `The beauty industry has come full circle. After decades of synthetic formulations, there's a growing movement back to natural, plant-based skincare — the same ingredients that kept our grandmothers' skin radiant and healthy.

Neem oil is one of the most powerful natural skincare ingredients available. Its antibacterial and antifungal properties make it excellent for acne-prone skin. It also contains fatty acids and vitamin E that moisturize and protect the skin barrier.

Turmeric face masks have been a bridal beauty ritual in South Asia for centuries. Turmeric's anti-inflammatory properties reduce redness and calm irritated skin, while its antioxidants combat free radical damage that causes premature aging.

Rose water, distilled from fresh rose petals, is a natural toner that balances skin pH, reduces pore size, and provides gentle hydration. It's suitable for all skin types and can be used multiple times daily without irritation.

Almond oil is rich in vitamin E and lightweight enough for daily use. It helps reduce dark circles, softens fine lines, and provides deep moisturization without clogging pores. Warm a few drops between your palms and press into damp skin for best absorption.

Shikakai, traditionally used as a hair cleanser, also works wonders for the scalp. It maintains the scalp's natural oils while gently cleansing, reducing dandruff and promoting healthy hair growth.

Multani mitti (Fuller's Earth) combined with rose water creates a classic face pack that draws out impurities, tightens pores, and leaves skin feeling refreshed. Add a pinch of turmeric and a teaspoon of honey for enhanced benefits.

Building a natural skincare routine doesn't require expensive products. Start with quality raw ingredients from trusted sources and experiment with simple combinations. Your skin will thank you for going back to nature.`,
  },
  {
    slug: "spice-market-buying-guide",
    title: "How to Buy Authentic Spices: A Complete Buyer's Guide",
    category: "Guides",
    date: "January 10, 2026",
    readTime: "5 Min Read",
    author: "MSUR Herbs",
    excerpt: "Learn how to identify high-quality spices, avoid adulteration, and store your spice collection for maximum flavor and potency.",
    image: blogSpiceMarket,
    content: `The difference between a good dish and a great dish often comes down to the quality of spices used. Unfortunately, spice adulteration is a widespread problem, with inferior products being passed off as premium. Here's how to be a smart spice buyer.

Color is your first clue, but it can be misleading. Artificially colored spices appear unnaturally vibrant. True saffron has a deep red-orange hue with slightly lighter tips. Authentic turmeric has a warm, earthy yellow — not a fluorescent shade.

Aroma tells a powerful story. Fresh, high-quality spices have a strong, distinct fragrance. If you can't smell much when you open a container, the spice has likely lost its potency. Whole spices retain their aroma much longer than ground versions.

Buy whole spices whenever possible and grind them yourself. Whole cumin seeds, peppercorns, cardamom pods, and cinnamon sticks stay fresh for years when stored properly. Pre-ground spices begin losing flavor within months.

Source matters enormously. Spices sourced directly from growing regions — like Kashmiri saffron, Kerala cardamom, or Thar desert cumin — offer superior flavor profiles compared to generic bulk imports. At MSUR Herbs, we maintain direct relationships with farmers to ensure authenticity.

Storage is crucial for maintaining quality. Keep spices in airtight glass or tin containers away from heat, moisture, and direct sunlight. A cool, dark pantry or drawer is ideal. Never store spices above your stove — the heat and steam degrade them quickly.

Test for adulteration at home. Pure turmeric dissolved in water settles naturally; adulterated turmeric leaves visible artificial color streaks. Pure saffron releases color slowly in warm water; fake saffron releases color immediately.

Invest in quality over quantity. A small amount of premium spice delivers more flavor than a large quantity of low-grade product. Your food will taste better, and you'll actually use less.`,
  },
  {
    slug: "black-pepper-king-of-spices",
    title: "Black Pepper: Why It's Called the King of Spices",
    category: "Spices",
    date: "December 28, 2025",
    readTime: "4 Min Read",
    author: "MSUR Herbs",
    excerpt: "From ancient trade routes to modern kitchens, black pepper has held its crown as the world's most important spice for millennia.",
    image: blogBlackPepper,
    content: `Black pepper (Piper nigrum) has been the world's most traded spice for over 4,000 years. Once so valuable it was used as currency, this humble berry continues to reign supreme in kitchens worldwide.

The compound responsible for pepper's signature heat is piperine. Beyond flavor, piperine has remarkable health properties: it enhances the absorption of nutrients (most notably curcumin from turmeric by up to 2000%), supports digestive health, and has potent antioxidant effects.

There's a significant difference between pre-ground pepper and freshly cracked peppercorns. Whole peppercorns retain their essential oils — the source of both flavor and health benefits — almost indefinitely. Once ground, pepper begins losing its potency within hours. Investing in a good pepper mill is one of the simplest upgrades you can make in your kitchen.

Different varieties offer different flavor profiles. Tellicherry peppercorns (from India's Malabar coast) are larger, fully ripened berries with complex, nuanced heat. Lampong pepper from Indonesia delivers sharper, more direct spiciness. Vietnamese pepper tends to be bold and pungent.

In cooking, timing matters. Adding pepper early in the cooking process builds deep, subtle warmth throughout the dish. Adding it at the end provides bright, immediate heat on the palate. Many professional chefs use both techniques for layered flavor.

Beyond savory dishes, black pepper has a surprising affinity for sweet preparations. A pinch in chocolate desserts, strawberry compotes, or even vanilla ice cream adds intriguing complexity. Try it in your next fruit salad — the contrast is remarkable.

At MSUR Herbs, our black pepper is sourced from premium growing regions and carefully processed to preserve maximum piperine content. Whether whole, cracked, or freshly ground, quality pepper transforms everyday cooking into something extraordinary.`,
  },
];

const BlogPostPage = () => {
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

  const recentPosts = blogPostsData.filter(p => p.slug !== slug).slice(0, 4);

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-muted/50 border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Main Layout: Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            {/* Separator */}
            <hr className="border-border mb-6" />

            {/* Intro paragraph (first paragraph) */}
            {(() => {
              const paragraphs = post.content.split("\n\n");
              const firstPara = paragraphs[0];
              const restParas = paragraphs.slice(1);
              return (
                <>
                  <p className="mb-8 text-muted-foreground leading-relaxed text-base text-justify">
                    {firstPara}
                  </p>

                  {/* Centered Featured Image */}
                  <div className="flex justify-center mb-8">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="rounded-lg max-w-full h-auto max-h-[500px] object-cover"
                    />
                  </div>

                  {/* Rest of content */}
                  <div className="prose prose-sm max-w-none">
                    {restParas.map((para, i) => (
                      <p key={i} className="mb-5 text-muted-foreground leading-relaxed text-base text-justify">
                        {para}
                      </p>
                    ))}
                  </div>
                </>
              );
            })()}

            {/* Meta info */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
            </div>

            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog</Link>
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Recent Blogs
            </h2>
            <div className="space-y-6">
              {recentPosts.map(rp => (
                <Link
                  to={`/blog/${rp.slug}`}
                  key={rp.slug}
                  className="group block"
                >
                  <div className="rounded-lg overflow-hidden mb-2">
                    <img
                      src={rp.image}
                      alt={rp.title}
                      loading="lazy"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{rp.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rp.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export { blogPostsData };
export default BlogPostPage;
