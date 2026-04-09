import { useState, useMemo } from "react";
import { Package, FolderTree, AlertTriangle, ShoppingBag, Star, Plus, TrendingUp, DollarSign, CalendarIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getProducts, getCategories, getOrders, getReviews } from "@/data/dashboard-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

type DateRange = { from: Date; to: Date };

const presets = [
  { label: "Today", days: 0 },
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "All Time", days: -1 },
];

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 220 70% 50%))",
  "hsl(var(--chart-3, 280 65% 60%))",
  "hsl(var(--chart-4, 40 80% 55%))",
  "hsl(var(--chart-5, 160 60% 45%))",
  "hsl(var(--chart-1, 12 76% 61%))",
];

const DashboardOverview = () => {
  const [activePreset, setActivePreset] = useState("All Time");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 365),
    to: new Date(),
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const products = getProducts();
  const categories = getCategories();
  const orders = getOrders();
  const reviews = getReviews();

  const handlePreset = (label: string, days: number) => {
    setActivePreset(label);
    if (days === -1) {
      setDateRange({ from: subDays(new Date(), 365 * 5), to: new Date() });
    } else if (days === 0) {
      setDateRange({ from: startOfDay(new Date()), to: endOfDay(new Date()) });
    } else {
      setDateRange({ from: subDays(new Date(), days), to: new Date() });
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = parseISO(o.createdAt);
      return !isBefore(d, startOfDay(dateRange.from)) && !isAfter(d, endOfDay(dateRange.to));
    });
  }, [orders, dateRange]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const d = parseISO(r.createdAt);
      return !isBefore(d, startOfDay(dateRange.from)) && !isAfter(d, endOfDay(dateRange.to));
    });
  }, [reviews, dateRange]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const lowStock = products.filter((p) => p.stock <= 5);

  // Order status distribution
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [filteredOrders]);

  // Revenue by day (simple chart data)
  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const day = o.createdAt;
      map[day] = (map[day] || 0) + o.total;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date: format(parseISO(date), "MMM dd"), revenue }));
  }, [filteredOrders]);

  // Category distribution
  const categoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const name = cat?.name || "Other";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products, categories]);

  const stats = [
    { label: "Total Revenue", value: `₨ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bgColor: "bg-emerald-100", trend: "+12.5%", up: true },
    { label: "Orders", value: filteredOrders.length, icon: ShoppingBag, color: "text-primary", bgColor: "bg-primary/10", trend: "+8.2%", up: true },
    { label: "Avg. Order Value", value: `₨ ${Math.round(avgOrderValue).toLocaleString()}`, icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100", trend: "+3.1%", up: true },
    { label: "Products", value: products.length, icon: Package, color: "text-violet-600", bgColor: "bg-violet-100", trend: "0%", up: true },
    { label: "Low Stock", value: lowStock.length, icon: AlertTriangle, color: "text-amber-600", bgColor: "bg-amber-100", trend: lowStock.length > 0 ? "Needs attention" : "All good", up: lowStock.length === 0 },
    { label: "Reviews", value: filteredReviews.length, icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100", trend: "+5 new", up: true },
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
      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground">
            {format(dateRange.from, "MMM dd, yyyy")} – {format(dateRange.to, "MMM dd, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs value={activePreset} onValueChange={(val) => {
            const preset = presets.find(p => p.label === val);
            if (preset) handlePreset(preset.label, preset.days);
          }}>
            <TabsList className="h-9">
              {presets.map((p) => (
                <TabsTrigger key={p.label} value={p.label} className="text-xs px-3">
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Custom
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setActivePreset("");
                    setCalendarOpen(false);
                  } else if (range?.from) {
                    setDateRange({ from: range.from, to: range.from });
                  }
                }}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${s.bgColor}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <span className={cn("text-xs font-medium flex items-center gap-0.5", s.up ? "text-emerald-600" : "text-red-500")}>
                  {typeof s.trend === "string" && s.trend !== "All good" && s.trend !== "Needs attention" && (
                    s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />
                  )}
                  {s.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                    formatter={(value: number) => [`₨ ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                No data for selected period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Pie + Category Dist */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              {statusCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                      {statusCounts.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {statusCounts.map((s, i) => (
                  <span key={s.name} className="text-[10px] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {s.name} ({s.value})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryDist.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {categoryDist.map((c, i) => (
                  <span key={c.name} className="text-[10px] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {c.name} ({c.value})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions + Activity + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
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

        <Card>
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

        {lowStock.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader><CardTitle className="text-base text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Low Stock</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground truncate">{p.name}</span>
                    <Badge variant="destructive">{p.stock} left</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Products by Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Product</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Category</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Price</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Stock</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-2.5 font-medium text-foreground">{p.name.length > 30 ? p.name.slice(0, 30) + "…" : p.name}</td>
                      <td className="py-2.5 text-muted-foreground">{cat?.name || "—"}</td>
                      <td className="py-2.5 text-right text-foreground">₨ {p.price.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        <span className={cn("font-medium", p.stock <= 5 ? "text-red-600" : "text-foreground")}>{p.stock}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant={p.status === "active" ? "default" : "secondary"} className="text-[10px]">{p.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
