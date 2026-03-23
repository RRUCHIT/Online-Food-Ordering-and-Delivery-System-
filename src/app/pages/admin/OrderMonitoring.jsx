import { useEffect, useMemo, useState } from "react";
import { Search, Eye, ShoppingBag } from "lucide-react";
import API from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { format } from "date-fns";

export function OrderMonitoring() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    API
      .get("/api/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const orderId = order._id?.toLowerCase?.() || "";
    const customerName = order.customerName?.toLowerCase?.() || "";
    const restaurantName = order.restaurantName?.toLowerCase?.() || "";
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      orderId.includes(query) ||
      customerName.includes(query) ||
      restaurantName.includes(query);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }), [orders, searchQuery, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
      case "preparing":
        return "bg-blue-500";
      case "out_for_delivery":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const OrderDetailsDialog = ({ order }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-white/70 bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                {order.status.replaceAll("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Restaurant</p>
              <p className="font-semibold">{order.restaurantName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
                {format(new Date(order.orderDate), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-green-500">
<<<<<<< HEAD
                ₹{Number(order.total).toFixed(2)}
=======
                ${Number(order.total).toFixed(2)}
>>>>>>> 4cf86f5ca086441cb68307469e1c28b498815031
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-semibold mb-3">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://placehold.co/120x120?text=Food"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
<<<<<<< HEAD
                    ₹{(item.price * item.quantity).toFixed(2)}
=======
                    ${(item.price * item.quantity).toFixed(2)}
>>>>>>> 4cf86f5ca086441cb68307469e1c28b498815031
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Delivery</p>
              <p className="text-gray-600">
                {order.deliveryType === "live_location"
                  ? order.liveLocation
                  : order.deliveryAddress}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2">Payment</p>
              <p className="text-gray-600">{order.paymentMethod.replaceAll("_", " ")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#14532d_48%,#f97316_100%)] p-6 md:p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="flex items-center gap-3 mb-3">
          <ShoppingBag className="w-6 h-6" />
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Admin Orders</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">Order Monitoring</h1>
        <p className="text-white/80">Track every active and completed order across the platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer, or restaurant..."
            className="pl-10 rounded-full bg-white/90 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-52 rounded-full bg-white/90 shadow-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-white/70 bg-white/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 p-5 rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Restaurant</p>
                      <p className="font-semibold">{order.restaurantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600">
<<<<<<< HEAD
                        ₹{Number(order.total).toFixed(2)}
=======
                        ${Number(order.total).toFixed(2)}
>>>>>>> 4cf86f5ca086441cb68307469e1c28b498815031
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.replaceAll("_", " ")}
                    </Badge>
                    <OrderDetailsDialog order={order} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
