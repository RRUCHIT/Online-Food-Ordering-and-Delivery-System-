import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Mail, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-4 text-center px-8 pt-10">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">FoodHub</span>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-slate-950">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Enter your registered email address to receive an OTP.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(244,63,94,0.25)] hover:shadow-[0_12px_24px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : (
                <>
                  Send OTP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
