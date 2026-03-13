import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DollarSign, ShoppingBag, TrendingUp, Star } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export function RestaurantDashboard() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const ownerId = user?._id || user?.id;

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    let isActive = true;

    axios
      .get(`http://localhost:5000/api/restaurants/owner/${ownerId}`)
      .then(async (res) => {
        if (!isActive || !res.data) {
          return;
        }

        setRestaurant(res.data);

        const ordersRes = await axios.get(
          `http://localhost:5000/api/orders/restaurant/${res.data._id}`
        );

        if (isActive) {
          setOrders(ordersRes.data);
        }
      })
      .catch(() => {
        if (isActive) {
          setRestaurant(null);
          setOrders([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [ownerId]);

  const todayOrders = orders.length;
  const todayRevenue = useMemo(
    () => orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );
  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );
  const averageRating = restaurant?.rating || 4.5;

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Back
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {restaurant?.name || "Dashboard"}
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your restaurant overview
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

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 border rounded-lg mb-3"
              >
                <div>
                  <p className="font-semibold">Order #{order._id}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-orange-500">
                    ${Number(order.total).toFixed(2)}
                  </p>

                  <span className="text-sm text-gray-600">
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
