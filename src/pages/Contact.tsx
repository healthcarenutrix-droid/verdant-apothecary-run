import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!form.email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-80">We'd love to hear from you</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <h2 className="section-title mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            {[
              { icon: Phone, label: "Phone", value: "03117956306" },
              { icon: Mail, label: "Email", value: "msurherbs@gmail.com" },
              { icon: MapPin, label: "Address", value: "Pakistan" },
            ].map((i) => (
              <div key={i.label} className="flex gap-4 items-start">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <i.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{i.label}</h3>
                  <p className="text-sm text-muted-foreground">{i.value}</p>
                </div>
              </div>
            ))}
            <div className="h-64 rounded-xl bg-secondary flex items-center justify-center border border-border">
              <p className="text-muted-foreground text-sm">Map — Integrate Google Maps</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
