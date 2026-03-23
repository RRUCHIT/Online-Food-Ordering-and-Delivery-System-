import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { KeyRound, ArrowRight, UtensilsCrossed, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

export function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/verify-otp", { email, otp });
      toast.success(res.data.message);
      navigate("/reset-password", { state: { email, otp } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const res = await API.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
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
            Verify OTP
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Enter the 6-digit OTP sent to your email: <span className="font-bold text-slate-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-semibold text-slate-700 ml-1">
                OTP
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                  <KeyRound className="w-5 h-5" />
                </div>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all text-lg tracking-[0.5em] text-center"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-[0_8px_20px_rgba(244,63,94,0.25)] hover:shadow-[0_12px_24px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? "Verifying..." : (
                <>
                  Verify OTP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center pt-2 space-y-4">
              <div className="text-sm text-slate-500">
                Didn't receive OTP? {" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`font-bold transition-colors ${timer > 0 ? "text-slate-300 cursor-not-allowed" : "text-rose-600 hover:text-rose-700"}`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
                </button>
              </div>
              <div>
                <Link to="/forgot-password" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Change Number
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
