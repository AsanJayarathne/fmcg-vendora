import { useState, useEffect, useRef } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Loader2, X } from "lucide-react";

export default function OtpVerificationModal({
  isOpen,
  email,
  onSuccess,
  onClose,
  portalName = "Driver Portal",
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess(false);
      setResendMessage("");
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
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
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
    } catch {
      setError("Network error - unable to reach verification server.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/resend-verification-otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to resend code.");
        setResending(false);
        return;
      }

      setResendMessage("A new verification code has been sent to your email.");
      setResendCooldown(60);
      setResending(false);
    } catch {
      setError("Network error - failed to resend verification code.");
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-slate-100 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && !loading && !success && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            success 
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
              : "bg-orange-50 text-orange-500 border border-orange-200"
          }`}>
            {success ? (
              <CheckCircle2 size={32} />
            ) : (
              <ShieldCheck size={32} />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {success ? "Email Verified!" : "Verify Your Email"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            {success ? (
              "Your driver account has been created and is awaiting distributor approval."
            ) : (
              <>
                We sent a 6-digit verification code to:
                <br />
                <span className="font-semibold text-slate-800">{email}</span>
              </>
            )}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resendMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{resendMessage}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6-Box OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all outline-none ${
                    digit
                      ? "border-orange-500 bg-orange-50/50 text-slate-900 shadow-xs"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-orange-500 focus:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* Verify CTA */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Submit Registration</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-400 mb-1.5">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resending}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                {resendCooldown > 0
                  ? `Resend Code in ${resendCooldown}s`
                  : "Resend Verification Code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
