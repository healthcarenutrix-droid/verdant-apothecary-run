import { useEffect } from "react";
import { Truck, Globe, Package, Clock, MapPin, ShieldCheck } from "lucide-react";

const ShippingPolicy = () => {
  useEffect(() => {
    document.title = "Shipping Policy | MSUR Herbs";
  }, []);

  const zones = [
    { region: "Major Cities (Karachi, Lahore, Islamabad, Rawalpindi)", time: "1–3 business days", cost: "PKR 200" },
    { region: "Other Cities in Pakistan", time: "3–5 business days", cost: "PKR 300" },
    { region: "Remote Areas", time: "5–7 business days", cost: "PKR 400" },
    { region: "International (Worldwide)", time: "7–14 business days", cost: "Calculated at checkout" },
  ];

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Truck className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-lg opacity-80">Fast, reliable delivery for every order — locally and worldwide.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Package, title: "Free Shipping", desc: "On orders over PKR 3,000" },
            { icon: Clock, title: "Fast Dispatch", desc: "Orders shipped within 24 hours" },
            { icon: Globe, title: "Worldwide Delivery", desc: "We ship to 50+ countries" },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-xl p-6 text-center">
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-3">Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              All orders are processed and dispatched within <strong className="text-foreground">24 hours</strong> on business days (Monday–Saturday). Orders placed on Sundays or public holidays are processed the next business day.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" /> Shipping Rates & Delivery Times
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left p-3 font-semibold">Region</th>
                    <th className="text-left p-3 font-semibold">Delivery Time</th>
                    <th className="text-left p-3 font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.region} className="border-t border-border">
                      <td className="p-3 text-foreground">{z.region}</td>
                      <td className="p-3 text-muted-foreground">{z.time}</td>
                      <td className="p-3 text-muted-foreground">{z.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Free standard shipping on Pakistan orders over PKR 3,000.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Order Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once your order ships, you'll receive a confirmation email and SMS with your tracking number. You can track your shipment anytime via the courier's website or by contacting our support team.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" /> International Shipping
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We ship MSUR Herbs products worldwide. International shipping rates are calculated at checkout based on weight and destination.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Customs & duties:</strong> Customers are responsible for any customs fees, import taxes, or duties imposed by the destination country.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" /> Damaged or Lost Packages
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every package is carefully inspected before dispatch. If your order arrives damaged or goes missing, contact us within 48 hours of delivery (or expected delivery date) at msurherbs@gmail.com with photos and your order number. We'll arrange a replacement or refund promptly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Address Accuracy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Please ensure your shipping address is complete and correct. We're not responsible for orders shipped to incorrect addresses provided by the customer. Address changes can only be made before the order is dispatched.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Questions about shipping?</h3>
          <p className="text-muted-foreground mb-4">Our team is happy to help with any shipping concerns.</p>
          <a href="/contact" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
