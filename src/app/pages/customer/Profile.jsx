import { useMemo, useState } from "react";
import { User, MapPin, CreditCard, Bell, Save, Plus, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const emptyPaymentForm = {
  label: "",
  value: "",
  expiry: ""
};

export function Profile() {
  const { currentUser } = useApp();
  const storageKey = useMemo(
    () => `foodhub_profile_${currentUser?._id || currentUser?.id || "guest"}`,
    [currentUser]
  );
  const paymentStorageKey = useMemo(
    () => `foodhub_payment_methods_${currentUser?._id || currentUser?.id || "guest"}`,
    [currentUser]
  );

  const [profile, setProfile] = useState(() =>
    readStorage(storageKey, {
      name: currentUser?.name || "Customer",
      email: currentUser?.email || "",
      phone: "",
      address: "",
    })
  );

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });

  const [paymentMethods, setPaymentMethods] = useState(() =>
    readStorage(paymentStorageKey, [
      {
        id: "cod",
        label: "Cash on Delivery",
        value: "Pay when food arrives",
        expiry: "",
        isDefault: true
      }
    ])
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);

  const persistProfile = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem(storageKey, JSON.stringify(nextProfile));
  };

  const persistPaymentMethods = (nextMethods) => {
    setPaymentMethods(nextMethods);
    localStorage.setItem(paymentStorageKey, JSON.stringify(nextMethods));
  };

  const handleSaveProfile = () => {
    persistProfile(profile);
    toast.success("Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated!");
  };

  const openAddPayment = () => {
    setEditingPaymentId(null);
    setPaymentForm(emptyPaymentForm);
    setIsPaymentDialogOpen(true);
  };

  const openEditPayment = (method) => {
    setEditingPaymentId(method.id);
    setPaymentForm({
      label: method.label,
      value: method.value,
      expiry: method.expiry
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSavePaymentMethod = () => {
    if (!paymentForm.label || !paymentForm.value) {
      toast.error("Enter payment method details");
      return;
    }

    let nextMethods;

    if (editingPaymentId) {
      nextMethods = paymentMethods.map((method) =>
        method.id === editingPaymentId
          ? { ...method, ...paymentForm }
          : method
      );
    } else {
      nextMethods = [
        ...paymentMethods,
        {
          id: `pm_${Date.now()}`,
          ...paymentForm,
          isDefault: paymentMethods.length === 0
        }
      ];
    }

    persistPaymentMethods(nextMethods);
    setIsPaymentDialogOpen(false);
    setEditingPaymentId(null);
    setPaymentForm(emptyPaymentForm);
    toast.success("Payment method saved");
  };

  const handleSetDefaultPayment = (paymentId) => {
    const nextMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === paymentId
    }));

    persistPaymentMethods(nextMethods);
    toast.success("Default payment method updated");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#14532d_0%,#16a34a_42%,#f97316_100%)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">Customer Profile</p>
        <h1 className="text-4xl font-black mb-2">My Profile</h1>
        <p className="text-white/80">
          Manage delivery details, saved payments, and notification preferences.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Delivery Address</CardTitle>
            </div>
            <CardDescription>Manage your default delivery address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Enter your delivery address"
              />
            </div>

            <Button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              Save Address
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle>Payment Methods</CardTitle>
              </div>
              <CardDescription>Manage your payment options</CardDescription>
            </div>
            <Button variant="outline" onClick={openAddPayment}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-semibold">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.value}</p>
                      {method.expiry && (
                        <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                      )}
                      {method.isDefault && (
                        <p className="text-xs text-orange-500 font-medium mt-1">Default</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPayment(method)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[1.75rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Choose what updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-gray-600">
                  Get notified about your order status
                </p>
              </div>
              <Switch
                checked={notifications.orderUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, orderUpdates: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions & Offers</p>
                <p className="text-sm text-gray-600">
                  Receive special deals and discounts
                </p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, promotions: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-600">
                  Weekly food trends and restaurant news
                </p>
              </div>
              <Switch
                checked={notifications.newsletter}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newsletter: checked })
                }
              />
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPaymentId ? "Edit Payment Method" : "Add Payment Method"}
            </DialogTitle>
            <DialogDescription>
              Save the payment options you want to reuse during checkout
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Method Name</Label>
              <Input
                value={paymentForm.label}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, label: e.target.value })
                }
                placeholder="UPI, Visa, Cash on Delivery"
              />
            </div>

            <div>
              <Label>Details</Label>
              <Input
                value={paymentForm.value}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, value: e.target.value })
                }
                placeholder="upi@bank or card ending 4242"
              />
            </div>

            <div>
              <Label>Expiry / Note</Label>
              <Input
                value={paymentForm.expiry}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, expiry: e.target.value })
                }
                placeholder="12/26"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSavePaymentMethod}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
