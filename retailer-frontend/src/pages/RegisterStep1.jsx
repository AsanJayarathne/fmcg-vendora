import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { FiGlobe } from "react-icons/fi";

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
  const { language, toggleLanguage, t } = useLanguage();
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
      setError(t("auth.fillAllFields", "Please fill in all personal information fields."));
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError(t("auth.invalidEmail", "Please enter a valid email address."));
      return;
    }

    if (!SRI_LANKAN_PHONE_REGEX.test(cleanPhone)) {
      setError(t("auth.invalidPhone", "Please enter a valid Sri Lankan mobile number (e.g., 0712345678 or +94712345678)."));
      return;
    }

    if (!SRI_LANKAN_NIC_REGEX.test(cleanNic)) {
      setError(t("auth.invalidNic", "Please enter a valid Sri Lankan NIC number (9 digits with V/X or 12 digits)."));
      return;
    }

    if (!passCriteria.minLength) {
      setError(t("auth.passwordTooShort", "Password must be at least 8 characters long."));
      return;
    }

    if (!passCriteria.hasUpper || !passCriteria.hasLower || !passCriteria.hasNumber) {
      setError(t("auth.passwordComplexity", "Password must contain at least one uppercase letter, one lowercase letter, and one number."));
      return;
    }

    if (!passCriteria.hasSpecial) {
      setError(t("auth.passwordSpecial", "Password must contain at least one special character (!@#$%^&* etc.)."));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch", "Passwords do not match."));
      return;
    }

    setError("");
    navigate("/register-step2");
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 relative">
      {/* Floating Language Switcher */}
      <button
        type="button"
        onClick={toggleLanguage}
        title={language === "si" ? "Switch to English" : "සිංහල භාෂාවට මාරුවන්න"}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition shadow-xs border border-blue-200 cursor-pointer active:scale-95"
      >
        <FiGlobe size={14} />
        <span>{language === "si" ? "සිංහල" : "English"}</span>
      </button>

      <div className="flex gap-12 min-h-[90vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col justify-between">
          <img src={logo} alt="Vendora" className="w-56 h-auto mx-auto" />

          <p className="text-center text-base text-gray-400 mt-2">1 / 2</p>

          <h1 className="text-center text-3xl font-bold mt-2 text-slate-800">
            {t("auth.registerStep1Title", "Personal Information")}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-xl text-center font-semibold mt-2 text-base">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <FormInput
              label={t("auth.firstName", "First Name")}
              placeholder="First Name"
              value={regForm.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />

            <FormInput
              label={t("auth.lastName", "Last Name")}
              placeholder="Last Name"
              value={regForm.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />

            <FormInput
              label={t("auth.shopName", "Shop Name")}
              placeholder="Shop Name"
              value={regForm.shopName}
              onChange={(e) => handleChange("shopName", e.target.value)}
            />

            <FormInput
              label={t("auth.nicNumber", "NIC Number")}
              placeholder="92*******V"
              value={regForm.nic}
              onChange={(e) => handleChange("nic", e.target.value)}
            />

            <FormInput
              label={t("auth.email", "Email Address")}
              placeholder="jayarathne@gmail.com"
              type="email"
              value={regForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <FormInput
              label={t("auth.phone", "Phone Number")}
              placeholder="076****** "
              value={regForm.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <div className="flex flex-col">
              <FormInput
                label={t("auth.password", "Password")}
                placeholder="********"
                type="password"
                value={regForm.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {regForm.password && (
                <div className="mt-2 text-xs space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${passScore <= 2
                          ? "w-1/3 bg-red-500"
                          : passScore <= 4
                            ? "w-2/3 bg-amber-500"
                            : "w-full bg-emerald-500"
                        }`}
                    />
                  </div>
                  <p className={`flex items-center gap-1.5 ${passCriteria.minLength ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.minLength ? "✓" : "○"} {t("auth.reqMinChars", "At least 8 characters")}
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasUpper && passCriteria.hasLower ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasUpper && passCriteria.hasLower ? "✓" : "○"} {t("auth.reqUpperLower", "Uppercase & lowercase letters")}
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasNumber ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasNumber ? "✓" : "○"} {t("auth.reqNumber", "At least one number")}
                  </p>
                  <p className={`flex items-center gap-1.5 ${passCriteria.hasSpecial ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                    {passCriteria.hasSpecial ? "✓" : "○"} {t("auth.reqSymbol", "At least one symbol (!@#$%^&*)")}
                  </p>
                </div>
              )}
            </div>

            <FormInput
              label={t("auth.confirmPassword", "Confirm Password")}
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
                cursor-pointer
              "
            >
              {t("common.next", "Continue")}
            </button>

            <p className="text-sm text-slate-500">
              {t("auth.alreadyHaveAccount", "Already have an account?")}{" "}
              <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                {t("auth.loginHere", "Login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}