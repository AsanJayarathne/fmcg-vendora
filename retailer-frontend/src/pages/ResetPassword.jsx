import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import logo from "../assets/images/logo.png";
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

  // Validate token on mount
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
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to reset password. Please try again.");
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

  // Password strength checklist
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return (
    <div className="min-h-screen bg-[#2446D8] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-8 sm:p-12 shadow-2xl relative border border-blue-100">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md shadow-blue-200">
              V
            </div>
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
              Vendora
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose a secure password for <span className="font-semibold text-slate-700">{email || "your account"}</span>
          </p>
        </div>

        {/* Verifying Token State */}
        {verifying && (
          <div className="py-14 text-center">
            <Loader2 size={36} className="animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Verifying secure reset link...</p>
          </div>
        )}

        {/* Invalid Token State */}
        {!verifying && !isTokenValid && (
          <div className="mt-8 text-center py-4">
            <div className="w-14 h-14 bg-red-50 text-red-500 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={30} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Reset Link Expired or Invalid</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              {error || "For your security, reset links expire after 15 minutes or can only be used once."}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
              >
                Request New Link
              </button>
              <Link
                to="/login"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition text-sm flex items-center justify-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Success State */}
        {!verifying && isTokenValid && success && (
          <div className="mt-8 text-center py-6">
            <div className="w-16 h-16 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Password Updated Successfully!</h3>
            <p className="text-sm text-slate-500 mt-2">
              Your password has been changed and all old sessions were securely signed out.
            </p>
            <p className="text-xs text-blue-600 font-semibold mt-3 animate-pulse">
              Redirecting you to Login in a moment...
            </p>
          </div>
        )}

        {/* Password Form */}
        {!verifying && isTokenValid && !success && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative flex items-center bg-slate-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white border border-transparent transition">
                <Lock size={18} className="text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition ml-2 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative flex items-center bg-slate-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white border border-transparent transition">
                <Lock size={18} className="text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Repeat new password"
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 transition ml-2 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength Checklist */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${hasMinLength ? "bg-green-500" : "bg-slate-300"}`}>
                  ✓
                </div>
                <span className={hasMinLength ? "text-green-700 font-medium" : "text-slate-500"}>At least 6 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${hasNumber ? "bg-green-500" : "bg-slate-300"}`}>
                  ✓
                </div>
                <span className={hasNumber ? "text-green-700 font-medium" : "text-slate-500"}>Contains a number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] ${hasLetter ? "bg-green-500" : "bg-slate-300"}`}>
                  ✓
                </div>
                <span className={hasLetter ? "text-green-700 font-medium" : "text-slate-500"}>Contains letters</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !hasMinLength}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-full transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
                Return to Login
              </Link>
            </div>
          </form>
        )}

        {/* Forgot Password Modal (for requesting new link if expired) */}
        <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
        />

      </div>
    </div>
  );
}
