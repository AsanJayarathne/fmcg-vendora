import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered admin email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/forgot-password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          portal_url: window.location.origin,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to send reset link.");
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || "A password reset link has been dispatched to your email.");
      setLoading(false);
    } catch (err) {
      setError("Network error — unable to connect to authentication server.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm">
            <Mail size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">Forgot Password?</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Enter your admin email to receive a password recovery link.
          </p>
        </div>

        {error && (
          <div className="mt-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="mt-6 text-center py-4">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={26} />
            </div>
            <h4 className="text-base font-semibold text-white">Reset Email Dispatched</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {successMessage}
            </p>
            <p className="text-xs text-amber-400 font-medium mt-2">
              ⏱ Link expires in 15 minutes.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@vendora.lk"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white placeholder-slate-500 outline-none transition"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white transition py-1 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
