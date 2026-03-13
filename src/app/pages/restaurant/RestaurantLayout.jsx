import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Menu,
  BarChart3,
  Store
} from "lucide-react";

const navItems = [
  { path: "/restaurant", label: "Dashboard", icon: LayoutDashboard },
  { path: "/restaurant/orders", label: "Orders", icon: ClipboardList },
  { path: "/restaurant/menu", label: "Menu", icon: Menu },
  { path: "/restaurant/sales", label: "Sales", icon: BarChart3 },
];

export function RestaurantLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen animate-fade-in">
      <div className="hidden md:block w-64 bg-[linear-gradient(180deg,#08111f_0%,#0f172a_100%)] text-white p-6 shadow-[18px_0_60px_rgba(15,23,42,0.15)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Restaurant Panel</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Operations</p>
          </div>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                  isActive
                    ? "bg-white/10 text-orange-300"
                    : "text-slate-200 hover:bg-white/8 hover:text-orange-300"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-40 border-b border-white/60 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Restaurant</p>
              <h2 className="text-xl font-black text-slate-900">Operations Panel</h2>
            </div>
            <button
              onClick={() => navigate("/")}
              className="rounded-full px-4 py-2 text-sm bg-slate-100 text-slate-700"
            >
              Home
            </button>
          </div>

          <div className="px-3 pb-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
