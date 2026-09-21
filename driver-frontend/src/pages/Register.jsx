import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import deliveryImg from "../assets/delivery.png";
import OtpVerificationModal from "../components/auth/OtpVerificationModal";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    distributorId: "",
    licenseNumber: "",
    vehicleNumber: "",
  });

  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost/fmcg-vendora/backend/api/auth/distributors.php")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDistributors(json.data || []);
        }
      })
      .catch((err) => console.error("Failed to load distributors:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    const { fullName, email, phone, password, distributorId, licenseNumber, vehicleNumber } = form;

    const cleanPhone = (phone || "").replace(/[\s\-]/g, "");

    if (!fullName.trim() || !email.trim() || !cleanPhone || !password || !distributorId || !licenseNumber.trim() || !vehicleNumber.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^(?:\+94|0)?7[0-9]{8}$/.test(cleanPhone)) {
      setError("Please enter a valid Sri Lankan mobile number (e.g., 0712345678 or +94712345678).");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (!/[!@#$%^&*()\-_=+\[\]{};:\'",.<>\/?\\|`~]/.test(password)) {
      setError("Password must contain at least one special character (!@#$%^&* etc.).");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        distributor_id: parseInt(distributorId, 10),
        license_number: licenseNumber.trim(),
        vehicle_number: vehicleNumber.trim(),
      };

      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/register-driver.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      if (json.data?.requires_verification) {
        setShowOtpModal(true);
      } else {
        setSuccess("Registration submitted successfully! Awaiting distributor approval.");
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (err) {
      setError("Network error - make sure the backend is running.");
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    setSuccess("Email verified successfully! Your driver account has been submitted for distributor approval.");
    setTimeout(() => {
      navigate("/login");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-3.5 sm:p-6 font-sans">
      <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl my-4 sm:my-8">

        {/* ── LEFT SIDE – Image (Desktop only) ── */}
        <div className="hidden lg:flex w-[40%] bg-orange-500 m-3 rounded-2xl overflow-hidden items-center justify-center shrink-0">
          <img src={deliveryImg} alt="Delivery person" className="w-full h-full object-cover" />
        </div>

        {/* ── RIGHT SIDE – Form ── */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-4">Driver Registration</h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">Create your driver account to join delivery routes</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                id="register-fullname"
                type="text"
                name="fullName"
                placeholder="John Silva"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="driver@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                placeholder="07XXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">License Number</label>
              <input
                id="register-license"
                type="text"
                name="licenseNumber"
                placeholder="B1234567"
                value={form.licenseNumber}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Vehicle No.</label>
              <input
                id="register-vehicle"
                type="text"
                name="vehicleNumber"
                placeholder="WP CAB-1234"
                value={form.vehicleNumber}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-1.5 sm:py-2 text-sm text-slate-900 bg-transparent transition-colors placeholder:text-slate-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Assigned Distributor</label>
              <select
                id="register-distributor"
                name="distributorId"
                value={form.distributorId}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 focus:border-orange-500 outline-none py-2 text-sm text-slate-900 bg-transparent transition-colors cursor-pointer"
              >
                <option value="">Select Distributor</option>
                {distributors.map((d) => (
                  <option key={d.distributor_id} value={d.distributor_id}>
                    {d.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            id="register-submit"
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-sm sm:text-base shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer mt-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-xs sm:text-sm text-slate-500 mt-4">
            Already Have an Account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-orange-600 font-bold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>

      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        email={form.email.trim()}
        onSuccess={handleOtpSuccess}
        onClose={() => setShowOtpModal(false)}
        portalName="Driver Portal"
      />
    </div>
  );
}
