import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { UtensilsCrossed, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/api/auth/login",
        {
          email,
          password
        }
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("foodhub-auth-changed"));

      toast.success("Login successful!");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "restaurant") {
        navigate("/restaurant");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch animate-fade-in">
        <div className="hidden lg:flex rounded-[2.5rem] bg-[linear-gradient(180deg,#fff5f5_0%,#fff1e6_100%)] border border-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900">FoodHub</span>
                <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Welcome back</span>
              </div>
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-4">Sign In</p>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 leading-[1.02] mb-5">
              Pick up where your cravings left off.
            </h1>
            <p className="text-slate-600 text-lg leading-8 max-w-lg">
              Track orders, manage payments, and jump back into a smoother food ordering experience.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Faster reorder flow",
              "Live order tracking",
              "Clean customer and restaurant dashboards"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
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
              Welcome Back
            </CardTitle>

            <CardDescription className="text-base text-slate-500">
              Sign in to continue ordering, tracking, and managing everything in one place.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl h-12 bg-slate-50 border-slate-100"
                  required
                />
                <div className="flex justify-end pt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
              >
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <div className="text-center text-sm text-slate-500">
                <span>Don&apos;t have an account?</span>
                <Link
                  to="/register"
                  className="text-rose-500 hover:underline font-semibold ml-1"
                >
                  Sign up
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
