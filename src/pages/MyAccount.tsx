import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, MapPin, Heart, LogOut, Mail, Phone, Edit2, ShoppingBag, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
};

type Address = {
  label: string;
  line: string;
  city: string;
  postal: string;
  country: string;
};

type StoredOrder = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; qty: number; price: number }[];
};

const PROFILE_KEY = "msur_profile";
const ADDRESS_KEY = "msur_address";

const MyAccount = () => {
  const { toast } = useToast();
  const { items: wishlist } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  const [profile, setProfile] = useState<Profile>({ fullName: "", email: "", phone: "" });
  const [address, setAddress] = useState<Address>({ label: "Home", line: "", city: "", postal: "", country: "Pakistan" });
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    document.title = "My Account | MSUR Herbs";
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      const p = JSON.parse(stored) as Profile;
      setProfile(p);
      setIsLoggedIn(true);
    }
    const addr = localStorage.getItem(ADDRESS_KEY);
    if (addr) setAddress(JSON.parse(addr));
    try {
      const ords = JSON.parse(localStorage.getItem("msur_orders") || "[]");
      setOrders(ords);
    } catch {}
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (authMode === "signup" && !authForm.name) {
      toast({ title: "Missing name", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    const p: Profile = {
      fullName: authForm.name || authForm.email.split("@")[0],
      email: authForm.email,
      phone: "",
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
    setIsLoggedIn(true);
    toast({ title: authMode === "signup" ? "Account created!" : "Welcome back!", description: `Signed in as ${p.email}` });
  };

  const handleLogout = () => {
    localStorage.removeItem(PROFILE_KEY);
    setIsLoggedIn(false);
    setAuthForm({ name: "", email: "", password: "" });
    toast({ title: "Signed out", description: "You have been logged out." });
  };

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const saveAddress = () => {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
    toast({ title: "Address saved", description: "Your shipping address has been updated." });
  };

  if (!isLoggedIn) {
    return (
      <div>
        <section className="bg-primary text-primary-foreground py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <User className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">My Account</h1>
            <p className="text-lg opacity-80">Sign in to manage your orders, addresses, and wishlist.</p>
          </div>
        </section>

        <section className="max-w-md mx-auto px-4 py-12">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="flex bg-muted/40 rounded-lg p-1 mb-6">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="John Doe" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">
                {authMode === "signup" ? "Create Account" : "Sign In"}
              </Button>
              {authMode === "login" && (
                <p className="text-xs text-center text-muted-foreground">
                  Forgot password? <a href="/contact" className="text-primary hover:underline">Contact support</a>
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {profile.fullName}</h1>
              <p className="text-sm opacity-80">{profile.email}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 mb-6 flex-nowrap">
            <TabsTrigger value="overview" className="gap-2"><User className="h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="address" className="gap-2"><MapPin className="h-4 w-4" /> Address</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><Edit2 className="h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2"><Heart className="h-4 w-4" /> Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <Package className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Heart className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{wishlist.length}</p>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">PKR {orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /> {profile.email}</div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /> {profile.phone || "Not added"}</div>
                <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /> {address.line ? `${address.line}, ${address.city}` : "No address saved"}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here.</p>
                <Button asChild><Link to="/products">Shop Now</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold">Order #{o.id}</p>
                        <Badge variant="secondary">{o.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(o.date).toLocaleDateString()} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">PKR {o.total.toLocaleString()}</p>
                      <Button variant="outline" size="sm" className="gap-2"><Eye className="h-4 w-4" /> View</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="address">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4 max-w-2xl">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })} placeholder="Home / Office" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Textarea value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} placeholder="House #, street, area" rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input value={address.postal} onChange={(e) => setAddress({ ...address, postal: e.target.value })} />
                </div>
              </div>
              <Button onClick={saveAddress}>Save Address</Button>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4 max-w-2xl">
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="03xx-xxxxxxx" />
              </div>
              <Button onClick={saveProfile}>Save Changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlist.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-sm text-muted-foreground mb-4">Save your favorite products for later.</p>
                <Button asChild><Link to="/products">Browse Products</Link></Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">You have {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in your wishlist.</p>
                <Button asChild><Link to="/wishlist">View Wishlist</Link></Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default MyAccount;
