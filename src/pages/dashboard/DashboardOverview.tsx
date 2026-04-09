import { Package, FolderTree, AlertTriangle, ShoppingBag, Star, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getProducts, getCategories, getOrders, getReviews } from "@/data/dashboard-data";

const DashboardOverview = () => {
  const products = getProducts();
  const categories = getCategories();
  const orders = getOrders();
  const reviews = getReviews();
  const lowStock = products.filter(p => p.stock <= 5);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Categories", value: categories.length, icon: FolderTree, color: "text-blue-600" },
    { label: "Low Stock", value: lowStock.length, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-purple-600" },
    { label: "Reviews", value: reviews.length, icon: Star, color: "text-yellow-600" },
  ];

  const recentActivity = [
    { text: "New order #ORD-1004 received", time: "2 hours ago", type: "order" },
    { text: "Product 'Ashwagandha' stock is low (2 left)", time: "5 hours ago", type: "alert" },
    { text: "Category 'Fruit Preserves' was deactivated", time: "1 day ago", type: "category" },
    { text: "Order #ORD-1005 was cancelled", time: "2 days ago", type: "order" },
    { text: "New product 'Red Chilli Powder' added", time: "3 days ago", type: "product" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/dashboard/products"><Plus className="h-4 w-4 mr-2" /> Add Product</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard/categories"><Plus className="h-4 w-4 mr-2" /> Add Category</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard/orders"><ShoppingBag className="h-4 w-4 mr-2" /> View Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{a.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader><CardTitle className="text-base text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Low Stock Alert</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <Badge variant="destructive">{p.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOverview;
