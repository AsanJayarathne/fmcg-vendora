import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

export default function RegisterStep1() {
  const navigate = useNavigate();
  const { regForm, setRegForm } = useAuth();
  const [error, setError] = useState("");

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

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !shopName.trim() ||
      !nic.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all personal information fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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
          <img src={logo} alt="Vendora" className="w-44 h-auto mx-auto" />

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
              placeholder="2002 76 23 555 555"
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
              placeholder="+94 76 1234567"
              value={regForm.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <FormInput
              label="Password"
              placeholder="********"
              type="password"
              value={regForm.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <FormInput
              label="Confirm Password"
              placeholder="********"
              type="password"
              value={regForm.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-6 mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}