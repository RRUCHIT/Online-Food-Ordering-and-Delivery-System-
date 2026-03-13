import { Store, ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export function AdminDashboard() {

  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/restaurants")
      .then((res) => {
        setRestaurants(res.data);
      })
      .catch((err) => console.log(err));


    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log(err));


    axios
      .get("http://localhost:5000/api/admin/revenue", {
        headers: {
          authorization: token
        }
      })
      .then((res) => {
        setRevenue(res.data.platformProfit || res.data.platformFee || 0);
        setActiveUsers(res.data.activeCustomers || 0);
      })
      .catch((err) => console.log(err));

  }, [token]);


  const totalRestaurants = restaurants.length;
  const totalOrders = orders.length;

  const stats = [

    {
      title: "Total Restaurants",
      value: totalRestaurants,
      icon: Store,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      change: "Platform restaurants",
    },

    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-green-500",
      bgColor: "bg-green-100",
      change: "All orders",
    },

    {
      title: "Platform Revenue",
      value: `$${revenue}`,
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      change: "15% platform fee",
    },

    {
      title: "Active Users",
      value: activeUsers,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      change: "Active customers",
    },

  ];


  return (

    <div className="animate-fade-in">

      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_42%,#f97316_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">

        <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">
          Platform Pulse
        </p>

        <h1 className="text-4xl font-black mb-2">
          Admin Dashboard
        </h1>

        <p className="text-white/80">
          Platform overview and key metrics
        </p>

      </div>


      {/* Stats */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          return (

            <Card key={index} className="glass-panel rounded-[1.5rem]">

              <CardContent className="p-6">

                <div className="flex items-center justify-between mb-4">

                  <div
                    className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                  >

                    <Icon className={`w-6 h-6 ${stat.color}`} />

                  </div>

                  <TrendingUp className="w-4 h-4 text-green-500" />

                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {stat.title}
                </p>

                <p className="text-3xl font-bold mb-1">
                  {stat.value}
                </p>

                <p className="text-xs text-gray-500">
                  {stat.change}
                </p>

              </CardContent>

            </Card>

          );

        })}

      </div>


      {/* Top Restaurants */}

      <Card className="glass-panel rounded-[1.75rem]">

        <CardHeader>

          <CardTitle>
            Top Restaurants
          </CardTitle>

        </CardHeader>


        <CardContent>

          <div className="space-y-4">

            {restaurants.slice(0,5).map((restaurant, index) => (

              <div
                key={restaurant._id}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-500">

                    #{index + 1}

                  </div>

                  <div>

                    <p className="font-semibold">
                      {restaurant.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {restaurant.cuisine}
                    </p>

                  </div>

                </div>


                <div className="text-right">

                  <div className="flex items-center gap-1">

                    <span className="text-yellow-500">★</span>

                    <span className="font-semibold">
                      {restaurant.rating}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </CardContent>

      </Card>

    </div>

  );

}
