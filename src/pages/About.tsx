import { Leaf } from "lucide-react";
import catHerbs from "@/assets/cat-herbs.webp";
import catSpices from "@/assets/cat-spices.webp";

const About = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <Leaf className="h-12 w-12 mx-auto mb-4 opacity-60" />
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About MSUR Herbs</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Bridging ancient herbal wisdom with modern wellness needs
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="section-title mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            MSUR Herbs was founded with a deep reverence for nature's healing power. We are dedicated to bringing authentic,
            pure, and effective herbal products and spices to modern households. We believe that wellness should be natural,
            accessible, and free from harmful chemicals.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our team sources the finest herbs, spices, dry fruits, and natural products directly from trusted farmers
            and suppliers, ensuring every product meets our high standards of quality and purity.
          </p>
        </div>
        <div className="h-72 lg:h-96 rounded-xl overflow-hidden">
          <img src={catHerbs} alt="Our herbs" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>

    {/* Mission */}
    <section className="bg-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-72 rounded-xl overflow-hidden">
            <img src={catSpices} alt="Our spices" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="section-title mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To provide 100% natural, pure, and authentic herbal products that promote wellness and health. We are committed to
              sustainable sourcing, fair trade practices, and delivering exceptional quality to our customers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every product in our collection is carefully selected, tested, and packaged to preserve its natural potency
              and freshness, ensuring you receive the best nature has to offer.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
      <h2 className="section-title mb-12">Why Choose MSUR?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "100% Natural", desc: "All products are sourced directly from nature with zero additives or preservatives." },
          { title: "Quality Assured", desc: "Every product goes through rigorous quality checks before reaching you." },
          { title: "Fast Delivery", desc: "Most products shipped within 5 business days with secure packaging." },
        ].map((v) => (
          <div key={v.title} className="p-6 bg-secondary rounded-xl">
            <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
