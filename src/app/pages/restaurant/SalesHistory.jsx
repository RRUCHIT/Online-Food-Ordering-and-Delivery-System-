import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { DollarSign, TrendingUp, ShoppingBag, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { format } from "date-fns";

export function SalesHistory() {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const ownerId = user?._id || user?.id;

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    let isActive = true;

    API
      .get(`/api/restaurants/owner/${ownerId}`)
      .then(async (res) => {
        if (!isActive || !res.data) {
          return;
        }

        setRestaurant(res.data);

        const ordersRes = await API.get(
          `/api/orders/restaurant/${res.data._id}`
        );

        if (isActive) {
          setOrders(ordersRes.data);
        }
      })
      .catch(() => {
        if (isActive) {
          setOrders([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [ownerId]);

  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders]
  );
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalOrders = deliveredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const itemFrequency = {};

  deliveredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemFrequency[item.name]) {
        itemFrequency[item.name] = { count: 0, revenue: 0 };
      }
      itemFrequency[item.name].count += item.quantity;
      itemFrequency[item.name].revenue += item.price * item.quantity;
    });
  });

  const popularItems = Object.entries(itemFrequency)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average Order Value",
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Items Sold",
      value: deliveredOrders.reduce(
        (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
        0
      ),
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sales History</h1>
        <p className="text-gray-600">
          Track {restaurant?.name || "your restaurant"} performance
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="orders" className="mb-8">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="popular">Popular Items</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveredOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No completed orders yet
                  </div>
                ) : (
                  deliveredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">Order #{order._id}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(order.orderDate), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500 text-lg">
                          ${Number(order.total).toFixed(2)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 mt-1">
                          Delivered
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No data available yet
                  </div>
                ) : (
                  popularItems.map(([name, data], index) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-500">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{name}</p>
                          <p className="text-sm text-gray-600">
                            {data.count} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">
                          ${data.revenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">Total revenue</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
