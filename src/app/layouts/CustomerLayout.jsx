import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  History,
  User,
  LogOut,
  UtensilsCrossed
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, currentUser } = useApp();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isLoggedIn = Boolean(currentUser?._id || currentUser?.id);

  const navItems = [
    { path: "/customer", label: "Browse", icon: UtensilsCrossed },
    { path: "/customer/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
    { path: "/customer/orders", label: "Orders", icon: Package },
    { path: "/customer/history", label: "History", icon: History },
    { path: "/customer/profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("foodhub-auth-changed"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/88 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xl font-black tracking-tight text-slate-900">FoodHub</span>
                <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">Order Better</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition relative ${
                      isActive
                        ? "text-rose-600 bg-rose-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="bg-rose-500 text-white">{item.badge}</Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full bg-rose-500 hover:bg-rose-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/96 backdrop-blur-xl border-t z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 relative ${
                  isActive ? "text-rose-500" : "text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1 min-w-[20px] h-5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="pb-28 md:pb-24">
        <Outlet />
      </main>

      {itemCount > 0 && location.pathname !== "/customer/cart" && isLoggedIn && (
        <Link
          to="/customer/cart"
          className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-50 animate-float-up"
        >
          <div className="rounded-full bg-[linear-gradient(135deg,#e11d48_0%,#f97316_100%)] text-white shadow-[0_22px_55px_rgba(15,23,42,0.25)] px-5 py-3 min-w-[280px] flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{itemCount} item(s) in cart</p>
              <p className="text-xs opacity-90">View cart and checkout</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
