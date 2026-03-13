import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Store, ShoppingBag, MessageSquare, DollarSign, LogOut, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/restaurants", label: "Restaurants", icon: Store },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { path: "/admin/complaints", label: "Complaints", icon: MessageSquare },
    { path: "/admin/reports", label: "Reports", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden md:block">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </header>

          {/* Mobile Navigation */}
          <nav className="md:hidden bg-white border-b px-4 py-2 flex overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                    isActive
                      ? "bg-blue-50 text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
