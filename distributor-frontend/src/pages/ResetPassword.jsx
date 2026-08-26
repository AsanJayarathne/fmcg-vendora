import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import logo from "../assets/vendora logo.png";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [verifying, setVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setVerifying(false);
      setIsTokenValid(false);
      setError("Missing reset token or email address in the link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/verify-reset-token.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });
        const data = await res.json();
        if (data.success && data.data?.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setError(data.message || "This password reset link is invalid or has expired.");
        }
      } catch (err) {
        setIsTokenValid(false);
        setError("Network error — unable to verify reset token.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/reset-password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError("Network error — unable to connect to the authentication server.");
      setLoading(false);
    }
  };

  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 relative overflow-hidden font-sans">
      <div className="relative w-full max-w-lg z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 text-white">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner mb-4">
              <img src={logo} alt="Vendora Logo" className="h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Reset Distributor Password</h1>
            <p className="text-xs text-blue-200/70 mt-1">
              Account: <span className="font-semibold text-white">{email || "your account"}</span>
            </p>
          </div>

          {verifying && (
            <div className="py-12 text-center">
              <Loader2 size={36} className="animate-spin text-blue-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Verifying secure token...</p>
            </div>
          )}

          {!verifying && !isTokenValid && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={30} />
              </div>
              <h3 className="text-lg font-bold text-white">Link Expired or Invalid</h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                {error || "For security reasons, reset links expire after 15 minutes."}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm cursor-pointer"
                >
                  Request New Link
                </button>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm flex items-center justify-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {!verifying && isTokenValid && success && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-white">Password Updated!</h3>
              <p className="text-sm text-slate-300 mt-2">
                Your password has been changed. Old sessions have been invalidated.
              </p>
              <p className="text-xs text-blue-400 font-semibold mt-3 animate-pulse">
                Redirecting to login...
              </p>
            </div>
          )}

          {!verifying && isTokenValid && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-blue-200/80 mb-1 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3.5 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-white/30 hover:text-white/60 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold text-blue-200/80 mb-1 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3.5 text-white/30" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-white/30 hover:text-white/60 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Strength Indicators */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className={hasMinLength ? "text-green-400 font-bold" : "text-slate-500"}>✓</span>
                  <span>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={hasNumber ? "text-green-400 font-bold" : "text-slate-500"}>✓</span>
                  <span>Contains a number</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !hasMinLength}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-blue-300 hover:text-white transition">
                  Return to Login
                </Link>
              </div>
            </form>
          )}

          <ForgotPasswordModal
            isOpen={showForgotModal}
            onClose={() => setShowForgotModal(false)}
          />

        </div>
      </div>
    </div>
  );
}
