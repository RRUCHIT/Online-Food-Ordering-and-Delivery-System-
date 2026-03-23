import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, MapPin, Smartphone, Wallet } from "lucide-react";

import API from "../../api/axios";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

const deliveryOptions = [
  { value: "address", label: "Address", icon: MapPin },
  { value: "live_location", label: "Live Location", icon: Smartphone }
];

const paymentOptions = [
  { value: "cash_on_delivery", label: "Cash on Delivery" },
  { value: "upi", label: "UPI / Online" },
  { value: "card", label: "Card" }
];

export function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    currentUser
  } = useApp();

  const [deliveryType, setDeliveryType] = useState("address");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [selectedSavedPayment, setSelectedSavedPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentStorageKey = useMemo(
    () => `foodhub_payment_methods_${currentUser?._id || currentUser?.id || "guest"}`,
    [currentUser]
  );

  const savedPaymentMethods = useMemo(() => {
    try {
      const stored = localStorage.getItem(paymentStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [paymentStorageKey]);

  useEffect(() => {
    const defaultMethod = savedPaymentMethods.find((method) => method.isDefault);

    if (!defaultMethod) {
      setSelectedSavedPayment("");
      return;
    }

    if (defaultMethod.label.toLowerCase().includes("upi")) {
      setPaymentMethod("upi");
      setSelectedSavedPayment(defaultMethod.id);
    } else if (defaultMethod.label.toLowerCase().includes("card")) {
      setPaymentMethod("card");
      setSelectedSavedPayment(defaultMethod.id);
    }
  }, [savedPaymentMethods]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!currentUser?.id && !currentUser?._id) {
      toast.error("Please log in again");
      navigate("/login");
      return;
    }

    if (!phone) {
      toast.error("Enter phone number");
      return;
    }

    if (deliveryType === "address" && !deliveryAddress) {
      toast.error("Enter delivery address");
      return;
    }

    if (paymentMethod !== "cash_on_delivery" && !selectedSavedPayment) {
      toast.error("Select a saved payment method first", {
        description: "Add one in your profile if you have not saved UPI or card details yet."
      });
      return;
    }

    const firstRestaurantId = cart[0]?.restaurantId;
    const mixedRestaurant = cart.some((item) => item.restaurantId !== firstRestaurantId);

    if (mixedRestaurant) {
      toast.error("Place order from one restaurant at a time");
      return;
    }

    setIsSubmitting(true);

    try {
      const savedMethod = savedPaymentMethods.find((method) => method.id === selectedSavedPayment);

      await API.post("/api/orders", {
        customerId: currentUser._id || currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        phone,
        restaurantId: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
        items: cart,
        total,
        deliveryType,
        deliveryAddress: deliveryType === "address" ? deliveryAddress : "Live Location Order",
        paymentMethod,
        paymentDetails: savedMethod?.value || "",
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
        notes,
        status: "pending"
      });

      clearCart();
      toast.success("Order placed successfully!", {
        description: "You can now track it live from your orders page."
      });
      navigate("/customer/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto text-center py-16">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious food items</p>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/customer")}
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#f97316_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">Checkout</p>
        <h1 className="text-4xl font-black mb-2">Shopping Cart</h1>
        <p className="text-white/80">
          Review items, choose delivery, and confirm payment in one place.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemId = item._id || item.id;

            return (
              <Card key={itemId} className="border-white/60 bg-white/90 backdrop-blur-sm shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "https://placehold.co/300x300?text=Food"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.restaurantName}</p>
                      <p className="text-orange-500 font-semibold mt-1">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(itemId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(itemId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(itemId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="sticky top-20 border-white/60 bg-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery Option</Label>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDeliveryType(option.value)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          deliveryType === option.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-2" />
                        <p className="font-medium text-sm">{option.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {deliveryType === "address" ? (
                <div>
                  <Label>Delivery Address</Label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows={3}
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100">
                  <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Live location will be tracked automatically
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="space-y-2">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentMethod(option.value)}
                      className={`w-full rounded-2xl border p-3 text-left flex items-center gap-3 transition ${
                        paymentMethod === option.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== "cash_on_delivery" && (
                <div className="space-y-2">
                  <Label>Saved Payment Details</Label>
                  {savedPaymentMethods.filter((method) => {
                    const label = method.label.toLowerCase();
                    return paymentMethod === "upi"
                      ? label.includes("upi")
                      : label.includes("card");
                  }).length > 0 ? (
                    <div className="space-y-2">
                      {savedPaymentMethods
                        .filter((method) => {
                          const label = method.label.toLowerCase();
                          return paymentMethod === "upi"
                            ? label.includes("upi")
                            : label.includes("card");
                        })
                        .map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedSavedPayment(method.id)}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              selectedSavedPayment === method.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                            }`}
                          >
                            <p className="font-semibold text-sm">{method.label}</p>
                            <p className="text-sm text-gray-600">{method.value}</p>
                            {method.expiry && (
                              <p className="text-xs text-gray-500 mt-1">{method.expiry}</p>
                            )}
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50/70 p-4 text-sm text-gray-700">
                      No saved {paymentMethod === "upi" ? "UPI" : "card"} method found.
                      Add one from your profile first.
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label>Order Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions"
                  rows={2}
                />
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
