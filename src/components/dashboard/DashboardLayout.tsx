import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/products": "Products",
  "/dashboard/categories": "Categories",
  "/dashboard/orders": "Orders",
  "/dashboard/reviews": "Reviews",
};

const DashboardLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const showAdd = ["/dashboard/products", "/dashboard/categories", "/dashboard/orders"].includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>
            {showAdd && (
              <Button size="sm" id="dashboard-add-btn">
                <Plus className="h-4 w-4 mr-1" /> Add New
              </Button>
            )}
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
