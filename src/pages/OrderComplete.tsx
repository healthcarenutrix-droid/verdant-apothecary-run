import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderComplete = () => {
  const orderNumber = `MSUR-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="h-14 w-14 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Thank You!</h1>
      <p className="text-lg text-foreground mb-2">Your order has been placed successfully.</p>
      <p className="text-sm text-muted-foreground mb-8">
        Order Number: <span className="font-semibold text-foreground">{orderNumber}</span>
      </p>

      <div className="bg-secondary rounded-lg p-6 text-left space-y-3 mb-8">
        <h3 className="font-semibold text-foreground text-sm">What's next?</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• You will receive an order confirmation email shortly.</li>
          <li>• Our team will process your order within 24 hours.</li>
          <li>• You'll receive tracking details once your order is shipped.</li>
          <li>• Most orders are delivered within 3-5 business days.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderComplete;
