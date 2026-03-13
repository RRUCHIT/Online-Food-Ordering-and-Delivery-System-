import { useEffect, useState } from "react";
import { Package, CheckCircle, XCircle } from "lucide-react";
import API from "../../api/axios";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";
import { useApp } from "../../context/AppContext";
import { format } from "date-fns";
import { toast } from "sonner";

export function OrderHistory() {
  const { currentUser, addToCart } = useApp();
  const [orders, setOrders] = useState([]);
  const [complaintMessage, setComplaintMessage] = useState("");

  const customerId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (!customerId) {
      return;
    }

    API
      .get(`/api/orders/customer/${customerId}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [customerId]);

  const completedOrders = orders.filter((order) =>
    ["delivered", "rejected"].includes(order.status)
  );

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item);
    });

    toast.success("Items added to cart!");
  };

  const token = localStorage.getItem("token");

  const handleSubmitComplaint = async (order) => {
    if (!complaintMessage.trim()) {
      toast.error("Please write your complaint first");
      return;
    }

    try {
      await API.post(
        "/api/complaints",
        {
          orderId: order._id,
          customerId,
          customerName: currentUser?.name || "Customer",
          restaurantName: order.restaurantName,
          message: complaintMessage
        },
        {
          headers: {
            authorization: token
          }
        }
      );

      setComplaintMessage("");
      toast.success("Complaint submitted");
    } catch (error) {
      toast.error("Failed to submit complaint");
    }
  };

  if (completedOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No order history</h2>
          <p className="text-gray-600">Your past orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      <div className="space-y-4 max-w-4xl">
        {completedOrders.map((order) => {
          const isDelivered = order.status === "delivered";
          const StatusIcon = isDelivered ? CheckCircle : XCircle;

          return (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Order #{order._id}</h3>
                    <p className="text-sm text-gray-600">{order.restaurantName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(order.orderDate), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge className={isDelivered ? "bg-green-500" : "bg-red-500"}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {isDelivered ? "Delivered" : "Rejected"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <img
                          src={item.image || "https://placehold.co/120x120?text=Food"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReorder(order)}
                  >
                    Reorder
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        Report Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Complaint</DialogTitle>
                        <DialogDescription>
                          Share what went wrong with this order.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        value={complaintMessage}
                        onChange={(e) => setComplaintMessage(e.target.value)}
                        placeholder="Describe the issue"
                        rows={4}
                      />
                      <DialogFooter>
                        <Button onClick={() => handleSubmitComplaint(order)}>
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
