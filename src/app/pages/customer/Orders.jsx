import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
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
import { toast } from "sonner";

const steps = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered"
];

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
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

export function Orders() {
  const { currentUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [complaintMessage, setComplaintMessage] = useState("");

  const customerId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (!customerId) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get(
          `/api/orders/customer/${customerId}`
        );

        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);

    return () => clearInterval(interval);
  }, [customerId]);

  const activeOrders = useMemo(
    () => orders.filter((order) => !["delivered", "rejected"].includes(order.status)),
    [orders]
  );

  const handleSubmitComplaint = async (order) => {
    if (!complaintMessage.trim()) {
      toast.error("Please write your complaint first");
      return;
    }

    try {
      await API.post("/api/complaints", {
        orderId: order._id,
        customerId,
        customerName: currentUser?.name || "Customer",
        restaurantName: order.restaurantName,
        message: complaintMessage
      });

      setComplaintMessage("");
      toast.success("Complaint submitted");
    } catch (error) {
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Track Your Orders</h1>

      {activeOrders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => {
            const stepIndex = steps.indexOf(order.status);
            const progressValue = stepIndex >= 0
              ? ((stepIndex + 1) / steps.length) * 100
              : 0;

            return (
              <Card key={order._id}>
                <CardContent className="p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg">Order #{order._id}</h2>
                      <p className="text-sm text-gray-600">
                        Restaurant: {order.restaurantName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Payment: {order.paymentMethod.replaceAll("_", " ")}
                      </p>
                    </div>

                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Progress value={progressValue} className="h-3" />
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                      {steps.map((step) => (
                        <p key={step} className="text-center">
                          {step.replaceAll("_", " ")}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">Delivery</p>
                      <p className="text-gray-600">
                        {order.deliveryType === "live_location"
                          ? order.liveLocation
                          : order.deliveryAddress}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Contact</p>
                      <p className="text-gray-600">{order.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item._id || item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>{item.quantity} x {item.name}</span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-orange-500">${Number(order.total).toFixed(2)}</span>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Report Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Complaint</DialogTitle>
                        <DialogDescription>
                          Tell us what went wrong with this order.
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
