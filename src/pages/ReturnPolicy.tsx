import { useEffect } from "react";
import { RotateCcw, CheckCircle2, XCircle, Clock, CreditCard, Mail } from "lucide-react";

const ReturnPolicy = () => {
  useEffect(() => {
    document.title = "Return Policy | MSUR Herbs";
  }, []);

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Return Policy</h1>
          <p className="text-lg opacity-80">Your satisfaction is our priority. Here's how returns work.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: "7-Day Window", desc: "Request returns within 7 days of delivery" },
            { icon: CreditCard, title: "Easy Refunds", desc: "Refund processed in 5–7 business days" },
            { icon: CheckCircle2, title: "Quality Promise", desc: "Damaged or wrong items? Free replacement" },
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
            <h2 className="text-2xl font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              At MSUR Herbs, we stand behind the quality of every product. If you're not completely satisfied with your purchase, we offer a hassle-free return process within 7 days of delivery, subject to the conditions below.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" /> Eligible for Return
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-6">
              <li>Items received damaged, defective, or expired</li>
              <li>Wrong product delivered (not matching your order)</li>
              <li>Unopened, sealed products in original packaging</li>
              <li>Returns initiated within 7 days of delivery</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" /> Not Eligible for Return
            </h2>
            <ul className="space-y-2 text-muted-foreground list-disc pl-6">
              <li>Opened or partially used herbal products, oils, or food items (for hygiene and safety)</li>
              <li>Items returned after 7 days of delivery</li>
              <li>Products damaged due to misuse or improper storage</li>
              <li>Items without original packaging or proof of purchase</li>
              <li>Sale or clearance items (unless defective)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">How to Request a Return</h2>
            <ol className="space-y-3 text-muted-foreground list-decimal pl-6">
              <li><strong className="text-foreground">Contact us</strong> within 7 days at msurherbs@gmail.com or 03117956306 with your order number and reason.</li>
              <li><strong className="text-foreground">Wait for approval.</strong> Our team will review and respond within 24 hours with return instructions.</li>
              <li><strong className="text-foreground">Ship the item</strong> in its original packaging to the address we provide. Use a trackable courier.</li>
              <li><strong className="text-foreground">Receive your refund</strong> within 5–7 business days after we inspect the returned item.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" /> Refunds
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Approved refunds are issued to your original payment method. Bank transfers and card refunds may take an additional 3–5 business days to reflect depending on your bank. Cash on delivery refunds are issued via bank transfer or store credit.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Shipping costs are non-refundable</strong> unless the return is due to our error.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Exchanges</h2>
            <p className="text-muted-foreground leading-relaxed">
              We replace items only if they are defective, damaged, or incorrect. If you need to exchange a defective product for the same item, email us at msurherbs@gmail.com.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Need help with a return?</p>
              <p className="text-sm text-muted-foreground">Email msurherbs@gmail.com or call 03117956306</p>
            </div>
          </div>
          <a href="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicy;
