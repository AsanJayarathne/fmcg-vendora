import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import loginImage from "../assets/images/shop.png"; 
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

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
        setError(json.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (json.data.role !== 'RETAILER') {
        setError("Access denied. This portal is for Retailers only.");
        setLoading(false);
        return;
      }

      login(json.data);
      navigate("/");
    } catch (err) {
      setError("Network error — make sure the backend is running.");
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#2446D8] flex items-center justify-center p-6">

      <div className="bg-white rounded-[32px] w-full max-w-5xl overflow-hidden flex shadow-2xl">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 py-12">

          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-7">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md shadow-blue-200">
              V
            </div>

            <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
              Vendora
            </h1>

          </div>

          <h2 className="text-3xl font-bold mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-semibold mb-6 text-base">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div className="bg-slate-100 rounded-xl px-4 py-2.5">

              <label className="text-gray-500 text-xs">
                E-mail Address
              </label>

              <div className="flex items-center gap-2 mt-1.5">

                <FiMail className="text-gray-500" />

                <input
                  type="email"
                  placeholder="johncarter@business.com"
                  className="bg-transparent outline-none w-full font-semibold text-sm"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="bg-slate-100 rounded-xl px-4 py-2.5">

              <label className="text-gray-500 text-xs">
                Password
              </label>

              <div className="flex items-center gap-2 mt-1.5">

                <FiLock className="text-gray-500" />

                <input
                  type="password"
                  placeholder="********"
                  className="bg-transparent outline-none w-full font-semibold text-sm"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                />

              </div>

            </div>

            {/* Remember */}

            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />

                Remember Me

              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-gray-500 hover:text-blue-600 cursor-pointer"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-700 hover:bg-blue-800 transition text-white py-3 rounded-full text-base font-semibold cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>

          </form>

          {/* Register */}

          <p className="text-center mt-6 text-gray-600 text-sm">

            Don't Have an Account?

            <button
              onClick={handleRegister}
              className="ml-1.5 text-blue-700 font-semibold cursor-pointer"
            >
              Register
            </button>

          </p>

        </div>

        {/* RIGHT */}

        <div className="hidden lg:flex w-1/2 bg-[#2446D8] items-center justify-center p-8">

          <div className="w-full h-full rounded-[24px] flex items-center justify-center">

            <img
              src={loginImage}
              alt="Login Illustration"
              className="max-h-[420px] object-contain"
            />

          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        portalName="Retailer Portal"
      />

    </div>
  );
}
export default Login;