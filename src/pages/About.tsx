import { Leaf, CheckCircle2, Truck, ShieldCheck, Heart, Sprout, Globe } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import aboutStore from "@/assets/about-store.jpg";
import aboutMission from "@/assets/about-mission.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "13+", label: "Authentic Herbal Products" },
  { value: "6+", label: "Trusted Farms & Suppliers" },
  { value: "100%", label: "Natural & Pure Ingredients" },
  { value: "98%", label: "Customer Satisfaction Rate" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    desc: "Every product is selected for its purity, potency, and authenticity. We partner with reliable sources to ensure the highest standards of natural quality.",
  },
  {
    icon: Heart,
    title: "Tradition Meets Convenience",
    desc: "We bring the benefits of traditional Pansar wisdom into the modern world, making it easier for you to access natural health solutions from home.",
  },
  {
    icon: Truck,
    title: "Customer-Focused Service",
    desc: "Your satisfaction is our top priority. Whether you're new to herbal products or a long-time believer, we're here to support your wellness journey.",
  },
];

const About = () => (
  <div>
    {/* Hero Banner */}
    <section className="relative h-[340px] md:h-[420px] overflow-hidden">
      <img
        src={aboutHero}
        alt="Spices and herbs spread on a dark surface"
        className="w-full h-full object-cover"
        width={1920}
        height={600}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/70 text-sm mb-2 tracking-widest uppercase">
          Home &rsaquo; About Us
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">ABOUT US</h1>
      </div>
    </section>

    {/* Intro Section */}
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Where Herbal Wisdom Meets Healthy Living
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Welcome to <strong className="text-foreground">Msur Trader Pansar Store</strong> — your trusted
            destination for natural wellness and traditional health products.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We are passionate about preserving the rich heritage of herbal remedies and organic living.
            Our store offers a carefully curated range of <strong className="text-foreground">Arqiyat</strong>,{" "}
            <strong className="text-foreground">Dry Fruits</strong>,{" "}
            <strong className="text-foreground">Fruit Preserves</strong>,{" "}
            <strong className="text-foreground">Herbal Oils</strong>,{" "}
            <strong className="text-foreground">Pure Herbs</strong>, and{" "}
            <strong className="text-foreground">Spices</strong> — all sourced with integrity and care.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe in the power of nature and time-tested remedies to promote a healthier lifestyle.
          </p>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={aboutStore}
              alt="Traditional herbal store with shelves of natural products"
              className="w-full h-[400px] object-cover"
              loading="lazy"
              width={800}
              height={800}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-5 rounded-xl shadow-lg hidden md:block">
            <Leaf className="h-8 w-8" />
          </div>
        </div>
      </div>
    </section>

    {/* Stats Bar */}
    <section className="bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="order-2 lg:order-1">
          <div className="space-y-6">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-primary/10 h-fit">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            At MSUR Herbs, every product represents our commitment to purity, tradition, and your well-being.
          </p>
        </div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Vision & Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For natural wellness that bridges tradition with modern convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={aboutMission}
              alt="Carefully selecting quality herbs and spices"
              className="w-full h-[380px] object-cover"
              loading="lazy"
              width={800}
              height={800}
            />
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become a leading and trusted online destination for herbal and natural wellness products.
                We aim to empower individuals and families to embrace a healthier, more balanced lifestyle
                through easy access to pure Arqiyat, herbs, oils, and natural foods — reviving the legacy
                of herbal healing with the convenience of the modern world.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sprout className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To deliver pure, natural, and effective wellness products rooted in centuries-old traditional knowledge.
                We are committed to preserving the integrity of herbal healing through ethically sourced,
                environmentally conscious products. Through transparency, premium quality, and customer satisfaction,
                we strive to educate, inspire, and empower individuals to embrace natural alternatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center">
      <Leaf className="h-10 w-10 text-primary mx-auto mb-4" />
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        Start Your Natural Wellness Journey
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-8">
        Explore our range of authentic herbs, spices, and natural products — all handpicked for quality and purity.
      </p>
      <Button size="lg" asChild>
        <Link to="/products">Shop Now</Link>
      </Button>
    </section>
  </div>
);

export default About;
