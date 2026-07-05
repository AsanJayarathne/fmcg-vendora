import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

export default function RegisterStep2() {
  const navigate = useNavigate();
  const { regForm, setRegForm, resetRegForm } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => {
    setRegForm((prev) => ({ ...prev, [field]: val }));
    setError("");
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      shopName,
      nic,
      email,
      phone,
      password,
      shopAddress,
      city,
      shopPhone,
      regionId,
    } = regForm;

    // Check step 1 fields just in case they cleared or bypassed
    if (!firstName || !lastName || !nic || !email || !phone || !password) {
      setError("Please go back and fill in all personal information fields first.");
      return;
    }

    // Validate step 2 fields
    if (!shopName.trim() || !shopAddress.trim() || !city.trim() || !regionId) {
      setError("Please fill in all business information fields (Shop Name, Address, City, Region).");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        region_id: parseInt(regionId, 10),
        shop_name: shopName.trim(),
        owner_name: `${firstName.trim()} ${lastName.trim()}`,
        shop_address: regForm.addressLine2.trim()
          ? `${shopAddress.trim()}, ${regForm.addressLine2.trim()}`
          : shopAddress.trim(),
        city: city.trim(),
        nic_number: nic.trim(),
      };

      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/register-retailer.php", {
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

      setSuccess("Registration submitted successfully! Awaiting distributor approval. Redirecting to login...");
      resetRegForm();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Network error — make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex gap-12 min-h-[90vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col">
          <img src={logo} alt="Vendora" className="w-44 mx-auto" />

          <p className="text-center text-base text-gray-400 mt-2">2 / 2</p>

          <h1 className="text-center text-3xl font-bold mt-2">
            Business Information
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2.5 rounded-xl text-center font-semibold mt-2 text-base">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2.5 rounded-xl text-center font-semibold mt-2 text-base">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            <FormInput
              label="Shop Name"
              placeholder="Jayarathna Stores Pvt Ltd"
              value={regForm.shopName}
              onChange={(e) => handleChange("shopName", e.target.value)}
            />

            <FormInput
              label="Shop Address"
              placeholder="Address Line 1"
              value={regForm.shopAddress}
              onChange={(e) => handleChange("shopAddress", e.target.value)}
            />

            <FormInput
              label="Business Registration Number"
              placeholder="Jayarathna Stores Pvt Ltd"
              value={regForm.businessReg}
              onChange={(e) => handleChange("businessReg", e.target.value)}
            />

            <FormInput
              label="Address Line 2"
              placeholder="Address Line 2"
              value={regForm.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
            />

            <FormInput
              label="Location"
              placeholder="Pick Up your Shop Location"
              disabled
            />

            <FormInput
              label="City"
              placeholder="Colombo"
              value={regForm.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />

            <FormInput
              label="Shop Phone"
              placeholder="+94 11 32 45 789"
              value={regForm.shopPhone}
              onChange={(e) => handleChange("shopPhone", e.target.value)}
            />

            <div className="flex flex-col">
              <label className="text-gray-500 text-base mb-1.5 font-medium">Region</label>
              <select
                className="bg-[#EEF2F6] rounded-2xl px-5 py-3.5 text-base font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                value={
                  regForm.regionId === 4 ? "Western" :
                  regForm.regionId === 2 ? "Southern" :
                  regForm.regionId === 3 ? "Central" : ""
                }
                onChange={(e) => {
                  const regionMap = {
                    "Western": 4,
                    "Southern": 2,
                    "Central": 3
                  };
                  handleChange("regionId", regionMap[e.target.value] || "");
                }}
              >
                <option value="">Select Region</option>
                <option value="Western">Western</option>
                <option value="Southern">Southern</option>
                <option value="Central">Central</option>
              </select>
            </div>
          </div>

          <div className="mt-10 mb-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              className="w-44 h-12 rounded-full border border-blue-700 text-blue-700 text-lg font-semibold hover:bg-blue-50 disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-44 h-12 rounded-full bg-blue-700 text-white text-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
