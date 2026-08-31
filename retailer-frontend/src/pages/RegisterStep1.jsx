import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const SRI_LANKAN_PHONE_REGEX = /^(?:\+94|0)?7[0-9]{8}$/;
const SRI_LANKAN_NIC_REGEX = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordCriteria(password = "") {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()\-_=+\[\]{};:\'",.<>\/?\\|`~]/.test(password),
  };
}

export default function RegisterStep1() {
  const navigate = useNavigate();
  const { regForm, setRegForm } = useAuth();
  const [error, setError] = useState("");

  const passCriteria = getPasswordCriteria(regForm.password || "");
  const passScore = Object.values(passCriteria).filter(Boolean).length;

  const handleChange = (field, val) => {
    setRegForm((prev) => ({ ...prev, [field]: val }));
    setError("");
  };

  const handleContinue = () => {
    const {
      firstName,
      lastName,
      shopName,
      nic,
      email,
      phone,
      password,
      confirmPassword,
    } = regForm;

    const cleanPhone = (phone || "").replace(/[\s\-]/g, "");
    const cleanNic = (nic || "").replace(/[\s\-]/g, "");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !shopName.trim() ||
      !cleanNic ||
      !email.trim() ||
      !cleanPhone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all personal information fields.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!SRI_LANKAN_PHONE_REGEX.test(cleanPhone)) {
      setError("Please enter a valid Sri Lankan mobile number (e.g., 0712345678 or +94712345678).");
      return;
    }

    if (!SRI_LANKAN_NIC_REGEX.test(cleanNic)) {
      setError("Please enter a valid Sri Lankan NIC number (9 digits with V/X or 12 digits).");
      return;
    }

    if (!passCriteria.minLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!passCriteria.hasUpper || !passCriteria.hasLower || !passCriteria.hasNumber) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (!passCriteria.hasSpecial) {
      setError("Password must contain at least one special character (!@#$%^&* etc.).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    navigate("/register-step2");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex gap-12 min-h-[90vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col justify-between">
          <img src={logo} alt="Vendora" className="w-56 h-auto mx-auto" />

          <p className="text-center text-base text-gray-400 mt-2">1 / 2</p>

          <h1 className="text-center text-3xl font-bold mt-2">
            Personal Information
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-xl text-center font-semibold mt-2 text-base">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <FormInput
              label="First Name"
              placeholder="John"
              value={regForm.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />

            <FormInput
              label="Last Name"
              placeholder="Carter"
              value={regForm.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />

            <FormInput
              label="Shop Name"
              placeholder="Jayarathna Stores"
              value={regForm.shopName}
              onChange={(e) => handleChange("shopName", e.target.value)}
            />

            <FormInput
              label="NIC Number"
              placeholder="921234567V or 200212345678"
              value={regForm.nic}
              onChange={(e) => handleChange("nic", e.target.value)}
            />

            <FormInput
              label="Email Address"
              placeholder="john@gmail.com"
              type="email"
              value={regForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <FormInput
              label="Phone Number"
              placeholder="076 1234567 or +94 76 1234567"
              value={regForm.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <div className="flex flex-col">
              <FormInput
                label="Password"
                placeholder="********"
                type="password"
                value={regForm.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {regForm.password && (
                <div className="mt-2 text-xs space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passScore <= 2
                          ? "w-1/3 bg-red-500"
                          : passScore <= 4
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <p className={`flex items-center gap-1.5 ${passCriteria.minLength ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.minLength ? "✓" : "○"} At least 8 characters
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasUpper && passCriteria.hasLower ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasUpper && passCriteria.hasLower ? "✓" : "○"} Uppercase & lowercase letters
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasNumber ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasNumber ? "✓" : "○"} At least one number
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasSpecial ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasSpecial ? "✓" : "○"} At least one symbol (!@#$%^&*)
                  </p>
                </div>
              )}
            </div>

            <FormInput
              label="Confirm Password"
              placeholder="********"
              type="password"
              value={regForm.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center mt-6 mb-4 gap-3">
            <button
              type="button"
              onClick={handleContinue}
              className="
                w-72
                h-12
                rounded-full
                bg-blue-700
                text-white
                text-lg
                font-semibold
                hover:bg-blue-800
                transition
              "
            >
              Continue
            </button>

            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}