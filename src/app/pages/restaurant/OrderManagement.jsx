import { useEffect, useMemo, useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";

export function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const ownerId = user?._id || user?.id;

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    axios
      .get(`http://localhost:5000/api/restaurants/owner/${ownerId}`)
      .then((res) => {
        setRestaurant(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ownerId]);

  useEffect(() => {
    if (!restaurant?._id) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/restaurant/${restaurant._id}`
        );

        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);

    return () => clearInterval(interval);
  }, [restaurant]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status }
      );

      setOrders((prev) =>
        prev.map((order) => order._id === orderId ? res.data : order)
      );

      toast.success(`Order marked as ${status.replaceAll("_", " ")}`);
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending"),
    [orders]
  );
  const activeOrders = useMemo(
    () => orders.filter((order) => ["preparing", "out_for_delivery"].includes(order.status)),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((order) => ["delivered", "rejected"].includes(order.status)),
    [orders]
  );

  const OrderCard = ({ order }) => {
    const isPending = order.status === "pending";
    const isCompleted = ["delivered", "rejected"].includes(order.status);

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Order #{order._id}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(order.orderDate), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge
              className={
                order.status === "pending"
                  ? "bg-yellow-500"
                  : order.status === "preparing"
                  ? "bg-blue-500"
                  : order.status === "out_for_delivery"
                  ? "bg-orange-500"
                  : order.status === "delivered"
                  ? "bg-green-500"
                  : "bg-red-500"
              }
            >
              {order.status.replaceAll("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex justify-between text-sm"
                >
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-orange-500">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="grid gap-1 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Phone:</span> {order.phone}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Delivery:</span>{" "}
              {order.deliveryType === "live_location"
                ? order.liveLocation
                : order.deliveryAddress}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Payment:</span>{" "}
              {order.paymentMethod.replaceAll("_", " ")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {isPending && (
              <>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={() => handleUpdateStatus(order._id, "preparing")}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-500 hover:text-red-600"
                  onClick={() => handleUpdateStatus(order._id, "rejected")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}

            {!isPending && !isCompleted && (
              <Select
                value={order.status}
                onValueChange={(value) => handleUpdateStatus(order._id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">
          Manage incoming orders and update their status
        </p>
      </div>

      <Tabs defaultValue="pending" className="mb-6">
        <TabsList className="w-full md:w-fit overflow-x-auto">
          <TabsTrigger value="pending">
            Pending
            {pendingOrders.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{pendingOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            {activeOrders.length > 0 && (
              <Badge className="ml-2 bg-blue-500">{activeOrders.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No pending orders</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {activeOrders.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No active orders</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedOrders.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No completed orders</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
