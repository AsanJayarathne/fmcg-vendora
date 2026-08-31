import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FiLoader, FiCheckCircle, FiAlertCircle, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, updateProfileData, uploadAvatar } from "../services/orderService";

const AVATAR_BASE = "http://localhost/fmcg-vendora/backend/uploads/avatars/";

export default function ProfileTab() {
  const { auth, login, updateAvatarUrl } = useAuth();
  const token = auth?.token ?? null;

  const fileInputRef = useRef(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    shop_name: "",
    owner_name: "",
    shop_address: "",
    city: "",
    nic_number: "",
    retailer_phone: "",
  });

  const [avatarUrl, setAvatarUrl] = useState(auth?.avatarUrl || "");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError]     = useState(null);

  // Load profile values on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetchProfile(token)
      .then((data) => {
        setFormData({
          full_name: data.full_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          shop_name: data.shop_name ?? "",
          owner_name: data.owner_name ?? "",
          shop_address: data.shop_address ?? "",
          city: data.city ?? "",
          nic_number: data.nic_number ?? "",
          retailer_phone: data.phone ?? "",
        });
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
          updateAvatarUrl(data.avatar_url);
        }
      })
      .catch((err) => {
        console.error("Load profile error:", err);
        setError("Failed to load profile details.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!token) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Avatar image must be under 2 MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    setUploadingAvatar(true);
    setError(null);
    setMessage(null);

    try {
      const res = await uploadAvatar(token, file);
      const newAvatarUrl = res.avatar_url;
      setAvatarUrl(newAvatarUrl);
      updateAvatarUrl(newAvatarUrl);
      setMessage("Profile avatar updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Upload avatar error:", err);
      setError(err.message || "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
      // Reset input value so same file can be re-selected if desired
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await updateProfileData(token, formData);
      setFormData({
        full_name: updated.full_name ?? "",
        email: updated.email ?? "",
        phone: updated.phone ?? "",
        shop_name: updated.shop_name ?? "",
        owner_name: updated.owner_name ?? "",
        shop_address: updated.shop_address ?? "",
        city: updated.city ?? "",
        nic_number: updated.nic_number ?? "",
        retailer_phone: updated.phone ?? "",
      });

      // Update AuthContext locally
      login({
        token,
        role: auth.role,
        full_name: updated.full_name,
        profile_id: auth.profileId,
        avatar_url: avatarUrl,
      });

      setMessage("Account profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <FiLoader size={32} className="animate-spin text-blue-600" />
        <p className="text-slate-400 font-bold text-xs">Loading profile credentials...</p>
      </div>
    );
  }

  const avatarSrc = avatarUrl ? `${AVATAR_BASE}${avatarUrl}` : null;

  return (
    <form onSubmit={handleSave} className="p-7 flex flex-col lg:flex-row gap-8">
      
      {/* Avatar column */}
      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="relative w-32 h-32">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="profile"
              className="w-full h-full rounded-full object-cover border border-slate-200 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.full_name || "Retailer") + "&background=2563EB&color=fff";
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 text-3xl font-black shadow-sm">
              {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <FiUser />}
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploadingAvatar}
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-0 bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
            title="Change Avatar"
          >
            {uploadingAvatar ? <FiLoader size={13} className="animate-spin" /> : <FaPen size={11} />}
          </button>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          {uploadingAvatar ? "Uploading..." : "Change Avatar"}
        </p>
      </div>

      {/* Form column */}
      <div className="flex-1 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100/50 text-red-750 px-4.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-100/50 text-green-750 px-4.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
            <FiCheckCircle /> {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
          <InputField
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Your full name"
            required
          />
          <InputField
            label="Owner Name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleInputChange}
            placeholder="Owner's full name"
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@email.com"
            required
          />
          <InputField
            label="User Contact"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+94 7X XXX XXXX"
          />
          <InputField
            label="Shop Name"
            name="shop_name"
            value={formData.shop_name}
            onChange={handleInputChange}
            placeholder="Enter shop name"
          />
          <InputField
            label="NIC Number"
            name="nic_number"
            value={formData.nic_number}
            onChange={handleInputChange}
            placeholder="NIC number"
          />
          <InputField
            label="Shop Address"
            name="shop_address"
            value={formData.shop_address}
            onChange={handleInputChange}
            placeholder="Street, area"
          />
          <InputField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Nearest city"
          />
        </div>

        <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-755 text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs transition disabled:bg-slate-205 flex items-center gap-2"
          >
            {saving && <FiLoader className="animate-spin" />}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function InputField({ label, name, value, type = "text", placeholder, onChange, required = false }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 border border-slate-200 rounded-2xl px-4 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
      />
    </div>
  );
}