import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import deliveryImg from "../assets/delivery.png";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (json.data.role !== 'DRIVER') {
        setError("Access denied. This portal is for Drivers only.");
        setLoading(false);
        return;
      }

      login(json.data);
      navigate("/");
    } catch (err) {
      setError("Network error - make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-3.5 sm:p-6 font-sans">
      <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[480px]">

        {/* ── LEFT SIDE – Form ── */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Welcome Back</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold mb-5">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <input
                id="login-email"
                type="email"
                placeholder="driver@vendora.lk"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-600 hover:text-orange-600 font-medium transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              id="login-submit"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-sm sm:text-base shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-center text-xs sm:text-sm text-slate-500">
              Don't Have an Account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                Register
              </button>
            </p>
          </div>
        </div>

        {/* ── RIGHT SIDE – Image ── */}
        <div className="hidden lg:flex w-[45%] bg-orange-500 m-4 rounded-2xl overflow-hidden items-center justify-center shrink-0">
          <img src={deliveryImg} alt="Delivery person" className="w-full h-full object-cover" />
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
}
