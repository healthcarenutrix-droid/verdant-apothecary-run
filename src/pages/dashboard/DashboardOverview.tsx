import { useState, useMemo } from "react";
import {
  Package, FolderTree, AlertTriangle, ShoppingBag, Star, Plus,
  TrendingUp, DollarSign, CalendarIcon, ArrowUpRight, ArrowDownRight,
  Users, Eye, CheckCircle2, Clock, XCircle, Truck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getProducts, getCategories, getOrders, getReviews } from "@/data/dashboard-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

type DateRange = { from: Date; to: Date };

const presets = [
  { label: "Today", days: 0 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "All", days: -1 },
];

const CHART_COLORS = [
  "hsl(142, 71%, 45%)",
  "hsl(217, 91%, 60%)",
  "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(160, 60%, 45%)",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(38, 92%, 50%)",
  processing: "hsl(217, 91%, 60%)",
  shipped: "hsl(280, 65%, 60%)",
  delivered: "hsl(142, 71%, 45%)",
  cancelled: "hsl(0, 84%, 60%)",
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  pending: Clock,
  processing: Eye,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

const DashboardOverview = () => {
  const [activePreset, setActivePreset] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 365 * 5),
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
  const deliveredRevenue = filteredOrders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = filteredOrders.filter(o => o.status === "pending" || o.status === "processing").reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const lowStock = products.filter((p) => p.stock <= 5);
  const totalItems = filteredOrders.reduce((sum, o) => sum + o.items, 0);

  // Order status distribution
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: STATUS_COLORS[name] || CHART_COLORS[0],
    }));
  }, [filteredOrders]);

  // Revenue by day
  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      map[o.createdAt] = (map[o.createdAt] || 0) + o.total;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date: format(parseISO(date), "MMM dd"), revenue }));
  }, [filteredOrders]);

  // Category product count
  const categoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const name = cat?.name || "Other";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products, categories]);

  // Orders by day for chart
  const ordersByDay = useMemo(() => {
    const map: Record<string, { orders: number; items: number }> = {};
    filteredOrders.forEach((o) => {
      if (!map[o.createdAt]) map[o.createdAt] = { orders: 0, items: 0 };
      map[o.createdAt].orders += 1;
      map[o.createdAt].items += o.items;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date: format(parseISO(date), "MMM dd"), ...data }));
  }, [filteredOrders]);

  // Recent orders for table
  const recentOrders = [...filteredOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const stats = [
    {
      label: "Total Revenue",
      value: `₨ ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      trend: "+12.5%",
      up: true,
      sub: `₨ ${deliveredRevenue.toLocaleString()} delivered`,
    },
    {
      label: "Total Orders",
      value: filteredOrders.length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      trend: "+8.2%",
      up: true,
      sub: `${totalItems} items sold`,
    },
    {
      label: "Avg. Order Value",
      value: `₨ ${Math.round(avgOrderValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      trend: "+3.1%",
      up: true,
      sub: `₨ ${pendingRevenue.toLocaleString()} pending`,
    },
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      trend: `${categories.length} categories`,
      up: true,
      sub: `${lowStock.length} low stock`,
    },
    {
      label: "Reviews",
      value: filteredReviews.length,
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      trend: `${(filteredReviews.reduce((s, r) => s + r.rating, 0) / (filteredReviews.length || 1)).toFixed(1)} avg`,
      up: true,
      sub: "average rating",
    },
    {
      label: "Low Stock",
      value: lowStock.length,
      icon: AlertTriangle,
      color: lowStock.length > 0 ? "text-red-500" : "text-emerald-600",
      bgColor: lowStock.length > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      borderColor: lowStock.length > 0 ? "border-red-500/20" : "border-emerald-500/20",
      trend: lowStock.length > 0 ? "Needs attention" : "All good",
      up: lowStock.length === 0,
      sub: "items below threshold",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(dateRange.from, "MMM dd, yyyy")} — {format(dateRange.to, "MMM dd, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-muted rounded-lg p-0.5">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p.label, p.days)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  activePreset === p.label
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Custom Range</span>
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
          <Card key={s.label} className={cn("border transition-all hover:shadow-lg hover:-translate-y-0.5", s.borderColor)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", s.bgColor)}>
                  <s.icon className={cn("h-4 w-4", s.color)} />
                </div>
                <span className={cn(
                  "text-[11px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                  s.up ? "text-emerald-700 bg-emerald-500/10" : "text-red-600 bg-red-500/10"
                )}>
                  {typeof s.trend === "string" && !["All good", "Needs attention"].includes(s.trend) && s.trend.startsWith("+") && (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {s.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                <CardDescription className="text-xs">Daily revenue trend for selected period</CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                ₨ {totalRevenue.toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {revenueByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueByDay}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`₨ ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingBag className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No revenue data for selected period</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Order Status</CardTitle>
            <CardDescription className="text-xs">{filteredOrders.length} total orders</CardDescription>
          </CardHeader>
          <CardContent>
            {statusCounts.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {statusCounts.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {statusCounts.map((s) => {
                    const Icon = STATUS_ICONS[s.name.toLowerCase()] || Clock;
                    return (
                      <div key={s.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-foreground text-xs">{s.name}</span>
                        </div>
                        <span className="font-semibold text-xs text-foreground">{s.value}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No orders</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Orders & Items</CardTitle>
            <CardDescription className="text-xs">Orders count and items per day</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="orders" name="Orders" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="items" name="Items" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Products by Category</CardTitle>
            <CardDescription className="text-xs">{products.length} products across {categories.length} categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" name="Products" radius={[0, 4, 4, 0]}>
                  {categoryDist.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <CardDescription className="text-xs">Latest orders in selected period</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link to="/dashboard/orders">View All →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 text-xs text-muted-foreground font-medium">Order ID</th>
                      <th className="text-left py-2.5 text-xs text-muted-foreground font-medium">Customer</th>
                      <th className="text-left py-2.5 text-xs text-muted-foreground font-medium hidden sm:table-cell">Products</th>
                      <th className="text-right py-2.5 text-xs text-muted-foreground font-medium">Amount</th>
                      <th className="text-right py-2.5 text-xs text-muted-foreground font-medium">Status</th>
                      <th className="text-right py-2.5 text-xs text-muted-foreground font-medium hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 font-mono text-xs font-medium text-foreground">{order.id}</td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{order.customer}</p>
                            <p className="text-[11px] text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {order.productNames?.join(", ") || `${order.items} items`}
                          </p>
                        </td>
                        <td className="py-3 text-right font-semibold text-foreground">₨ {order.total.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] font-medium",
                              order.status === "delivered" && "bg-emerald-500/10 text-emerald-700",
                              order.status === "shipped" && "bg-violet-500/10 text-violet-700",
                              order.status === "processing" && "bg-blue-500/10 text-blue-700",
                              order.status === "pending" && "bg-amber-500/10 text-amber-700",
                              order.status === "cancelled" && "bg-red-500/10 text-red-600",
                            )}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right text-xs text-muted-foreground hidden md:table-cell">
                          {format(parseISO(order.createdAt), "MMM dd")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No orders in selected period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start h-9 text-sm" asChild>
                <Link to="/dashboard/products"><Plus className="h-4 w-4 mr-2" /> Add Product</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-sm" asChild>
                <Link to="/dashboard/categories"><FolderTree className="h-4 w-4 mr-2" /> Add Category</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-sm" asChild>
                <Link to="/dashboard/orders"><ShoppingBag className="h-4 w-4 mr-2" /> Manage Orders</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-9 text-sm" asChild>
                <Link to="/dashboard/reviews"><Star className="h-4 w-4 mr-2" /> View Reviews</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {lowStock.length > 0 && (
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {lowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-xs text-foreground truncate flex-1 mr-2">
                        {p.name.length > 25 ? p.name.slice(0, 25) + "…" : p.name}
                      </span>
                      <Badge variant="destructive" className="text-[10px] shrink-0">
                        {p.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Reviews */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Latest Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredReviews.slice(0, 3).map((r) => {
                  const product = products.find(p => p.id === r.productId);
                  return (
                    <div key={r.id} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{r.author}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{r.text}</p>
                      {product && (
                        <p className="text-[10px] text-muted-foreground/60 mt-1">on {product.name.slice(0, 20)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
