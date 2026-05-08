import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    title: "Orders & Payment",
    faqs: [
      { q: "How do I place an order?", a: "Browse our collections, add items to your cart, and proceed to checkout. You can pay securely via card, bank transfer, or cash on delivery." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, bank transfer, JazzCash, EasyPaisa, and cash on delivery (COD) within Pakistan." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Please contact our support team immediately at msurherbs@gmail.com." },
      { q: "Is my payment information secure?", a: "Yes. All transactions are encrypted with industry-standard SSL and processed through trusted payment gateways. We never store your card details." },
    ],
  },
  {
    title: "Shipping & Delivery",
    faqs: [
      { q: "How long does shipping take?", a: "Standard delivery takes 3–5 business days within Pakistan. Express delivery (1–2 days) is available in major cities." },
      { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International delivery typically takes 7–14 business days depending on your location." },
      { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email and SMS. Use it on our Order Tracking page or the courier's website." },
      { q: "Is there free shipping?", a: "Yes! Orders above PKR 3,000 within Pakistan qualify for free standard shipping." },
    ],
  },
  {
    title: "Products & Quality",
    faqs: [
      { q: "Are your products 100% natural?", a: "Absolutely. All MSUR Herbs products are sourced from trusted farms, cold-processed, and free from artificial additives or preservatives." },
      { q: "Do products have an expiry date?", a: "Yes, every product has a clearly printed manufacturing and expiry date. We recommend using within 12–24 months for best quality." },
      { q: "How should I store herbal products?", a: "Store in a cool, dry place away from direct sunlight. Some oils and preserves are best refrigerated after opening." },
      { q: "Are products tested or certified?", a: "Our products undergo quality checks and are certified halal. Lab certificates are available on request." },
    ],
  },
  {
    title: "Returns & Refunds",
    faqs: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unopened, undamaged products. See our Return Policy page for full details." },
      { q: "How do I request a refund?", a: "Email us at msurherbs@gmail.com with your order number and reason. Refunds are processed within 5–7 business days after approval." },
      { q: "Who pays for return shipping?", a: "If the return is due to our error (wrong/damaged item), we cover the shipping. Otherwise, the customer is responsible for return shipping costs." },
    ],
  },
  {
    title: "Account & Support",
    faqs: [
      { q: "Do I need an account to order?", a: "No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, and access exclusive offers." },
      { q: "How do I reset my password?", a: "Visit the My Account page and click 'Forgot Password'. We'll email you a reset link." },
      { q: "How can I contact customer support?", a: "Email msurherbs@gmail.com, call 03117956306, or use the Contact Us form. We respond within 24 hours on business days." },
    ],
  },
];

const FAQs = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "FAQs | MSUR Herbs";
  }, []);

  const filtered = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((c) => c.faqs.length > 0);

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg opacity-80">Find quick answers to common questions about our products, shipping, and policies.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <div className="relative mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No FAQs match your search.</p>
        ) : (
          filtered.map((cat) => (
            <div key={cat.title} className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-foreground">{cat.title}</h2>
              <Accordion type="single" collapsible className="bg-card border border-border rounded-xl px-4">
                {cat.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`${cat.title}-${idx}`}>
                    <AccordionTrigger className="text-left hover:no-underline">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}

        <div className="mt-12 bg-muted/30 border border-border rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">Our team is here to help you 7 days a week.</p>
          <a href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
