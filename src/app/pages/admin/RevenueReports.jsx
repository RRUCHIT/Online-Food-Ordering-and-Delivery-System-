import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  PiggyBank,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import API from "../../api/axios";
import { useEffect, useState } from "react";

export function RevenueReports() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    platformFee: 0,
    platformProfit: 0,
    restaurantRevenue: 0,
    completionRate: 0
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    API
      .get("/api/admin/revenue", {
        headers: {
          authorization: token
        }
      })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const statsCards = [
    {
      title: "Delivered Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      change: "Delivered orders only",
      isPositive: true,
      icon: IndianRupee,
    },
    {
      title: "Admin Profit (15%)",
      value: `₹${(stats.platformProfit || stats.platformFee).toFixed(2)}`,
      change: "Taken after delivery",
      isPositive: true,
      icon: PiggyBank,
    },
    {
      title: "Restaurant Share",
      value: `₹${stats.restaurantRevenue.toFixed(2)}`,
      change: "Net after platform cut",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Order Completion",
      value: `${stats.completionRate.toFixed(1)}%`,
      change: "Delivered vs total orders",
      isPositive: stats.completionRate >= 50,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#14532d_42%,#f97316_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">
            Revenue Intelligence
          </p>
          <h1 className="text-4xl font-black mb-2">Revenue Reports</h1>
          <p className="text-white/80">Admin profit is calculated only when an order is delivered.</p>
        </div>

        <Select defaultValue="this_month">
          <SelectTrigger className="w-52 rounded-full bg-white/12 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index} className="glass-panel rounded-[1.5rem]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-emerald-600" />
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader>
            <CardTitle>Profit Formula</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Delivered Orders</span>
              <span className="font-semibold">{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivered Revenue</span>
              <span className="font-semibold">₹{stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admin Profit</span>
              <span className="font-semibold text-emerald-600">
                ₹{(stats.platformProfit || stats.platformFee).toFixed(2)}
              </span>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-900">
              Admin profit = 15% of the order total, counted only after the order status becomes `delivered`.
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader>
            <CardTitle>Platform Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">{stats.completionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Restaurant Share</span>
              <span className="font-semibold">₹{stats.restaurantRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admin Profit</span>
              <span className="font-semibold">₹{(stats.platformProfit || stats.platformFee).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
