import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export default function RegisterStep2() {
  const navigate = useNavigate();
  const { regForm, setRegForm, resetRegForm } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    apiFetch("/auth/regions.php")
      .then((json) => {
        setRegions(json.data || []);
      })
      .catch((err) => console.error("Failed to load regions:", err));
  }, []);

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

      const json = await apiFetch("/auth/register-retailer.php", null, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess("Registration submitted successfully! Awaiting distributor approval. Redirecting to login...");
      resetRegForm();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Network error — make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex gap-12 min-h-[90vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col">
          <img src={logo} alt="Vendora" className="w-56 mx-auto" />

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
                value={regForm.regionId}
                onChange={(e) => handleChange("regionId", e.target.value)}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.region_id} value={r.region_id}>
                    {r.region_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 mb-4 flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
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
