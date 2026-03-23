import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { UtensilsCrossed, ArrowRight, Store } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    restaurantName: "",
    restaurantDescription: "",
    cuisine: "",
    deliveryTime: "",
    image: "",
    address: "",
    phone: ""
  });

  const isRestaurant = formData.userType === "restaurant";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      isRestaurant &&
      (!formData.restaurantName || !formData.cuisine || !formData.address || !formData.phone)
    ) {
      toast.error("Fill all required restaurant profile fields");
      return;
    }

    try {
      const response = await API.post(
        "/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.userType,
          restaurantName: formData.restaurantName,
          restaurantDescription: formData.restaurantDescription,
          cuisine: formData.cuisine,
          deliveryTime: formData.deliveryTime,
          image: formData.image,
          address: formData.address,
          phone: formData.phone
        }
      );

      toast.success(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[0.92fr_1.08fr] gap-6 items-stretch animate-fade-in">
        <div className="hidden lg:flex rounded-[2.5rem] bg-[linear-gradient(180deg,#fff7ed_0%,#fff5f5_100%)] border border-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900">FoodHub</span>
                <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Create account</span>
              </div>
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-orange-400 mb-4">Get Started</p>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 leading-[1.02] mb-5">
              Join the food ordering experience with cleaner flow and better control.
            </h1>
            <p className="text-slate-600 text-lg leading-8 max-w-lg">
              Customers get a smoother checkout. Restaurants can build profiles, wait for approval, and manage operations cleanly.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Restaurant signup</p>
                <p className="text-sm text-slate-500">Approval-based onboarding for trusted listings.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-7">
              Add restaurant details during signup, then let admin approve before restaurant access is activated.
            </p>
          </div>
        </div>

        <Card className="w-full border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-4 text-center px-8 pt-10">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">FoodHub</span>
            </div>

            <CardTitle className="text-4xl font-black tracking-tight text-slate-950">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Sign up and start browsing, ordering, or onboarding your restaurant.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userType: value })
                  }
                >
                  <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-100">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value
                      })
                    }
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                    required
                  />
                </div>
              </div>

              {isRestaurant && (
                <div className="rounded-[1.75rem] border border-orange-100 bg-[#fff9f4] p-5 space-y-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Restaurant Profile</h3>
                    <p className="text-sm text-slate-500">
                      Admin approval is required before this restaurant can log in.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Restaurant Name</Label>
                      <Input
                        placeholder="Spice Garden"
                        value={formData.restaurantName}
                        onChange={(e) =>
                          setFormData({ ...formData, restaurantName: e.target.value })
                        }
                        className="rounded-2xl h-12 bg-white border-orange-100"
                        required={isRestaurant}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cuisine</Label>
                      <Input
                        placeholder="Indian"
                        value={formData.cuisine}
                        onChange={(e) =>
                          setFormData({ ...formData, cuisine: e.target.value })
                        }
                        className="rounded-2xl h-12 bg-white border-orange-100"
                        required={isRestaurant}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Tell customers about your restaurant"
                      value={formData.restaurantDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restaurantDescription: e.target.value
                        })
                      }
                      className="rounded-2xl bg-white border-orange-100"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-2xl h-12 bg-white border-orange-100"
                        required={isRestaurant}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Time</Label>
                      <Input
                        placeholder="30-40 min"
                        value={formData.deliveryTime}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryTime: e.target.value })
                        }
                        className="rounded-2xl h-12 bg-white border-orange-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="Restaurant address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="rounded-2xl h-12 bg-white border-orange-100"
                      required={isRestaurant}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://example.com/restaurant.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="rounded-2xl h-12 bg-white border-orange-100"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
              >
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="text-center text-sm text-slate-500">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="text-rose-500 hover:underline font-semibold ml-1"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-slate-500 hover:text-slate-900"
                >
                  Back to home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
