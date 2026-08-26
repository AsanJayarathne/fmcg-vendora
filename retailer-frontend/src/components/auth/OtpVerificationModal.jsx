import { useState, useEffect, useRef } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Loader2, X } from "lucide-react";

export default function OtpVerificationModal({
  isOpen,
  email,
  onSuccess,
  onClose,
  portalName = "Retailer Portal",
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess(false);
      setResendCooldown(60);
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, resendCooldown]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Digits only

    const newOtp = [...otp];
    // Handle single character or paste
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setError("");
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
    const newOtp = ["", "", "", "", "", ""];
    pasteData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/verify-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: code,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Verification failed. Please check the code.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError("Network error — unable to reach verification server.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/resend-verification-otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to resend code.");
      } else {
        setResendCooldown(60);
      }
      setResending(false);
    } catch (err) {
      setError("Network error — unable to resend verification code.");
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Verify Your Email</h3>
          <p className="text-sm text-slate-500 mt-1">
            We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mt-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="mt-6 text-center py-6">
            <div className="w-14 h-14 bg-green-50 text-green-600 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Email Verified!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your account has been verified successfully. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="mt-6">
            {/* 6 Digits Boxes */}
            <div className="flex justify-between gap-2.5 my-6" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold rounded-2xl border outline-none transition-all ${
                    digit
                      ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-100"
                      : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white"
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-xs text-amber-600 font-medium mb-5">
              ⏱ Code expires in 15 minutes
            </p>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="mt-5 text-center text-xs text-slate-500">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="font-semibold text-slate-700">
                  Resend in <span className="text-blue-600">{resendCooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                  <span>{resending ? "Resending..." : "Resend Code"}</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
