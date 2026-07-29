import { useState } from "react";
import { User, Lock, Save, Building2, MapPin, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { updateProfile } from "../../services/profileApi";

export default function ProfileSettings({ profile, onChangePassword, onSaved }) {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    full_name:       profile?.full_name       ?? "",
    phone:           profile?.phone           ?? "",
    company_name:    profile?.company_name    ?? "",
    company_address: profile?.company_address ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null); // { type: 'success'|'error', msg }

  // Sync when profile prop changes
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setToast({ type: "error", msg: "Full name is required." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      await updateProfile(auth.token, form);
      setToast({ type: "success", msg: "Profile updated successfully!" });
      onSaved?.();
    } catch (err) {
      setToast({ type: "error", msg: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  // Get initials from full name
  const initials = (form.full_name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-blue-600 bg-white rounded-full shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{form.full_name || "Distributor"}</h2>
            <p className="text-blue-100 text-sm mt-0.5">
              {profile?.region_name ? `Region: ${profile.region_name}` : "Distributor Account"}
            </p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
              profile?.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {profile?.status || "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 space-y-6">

        {/* Toast */}
        {toast && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {toast.type === "success"
              ? <CheckCircle size={16} />
              : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* Section: Personal Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><Phone size={13} /> Phone Number</span>
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="07X XXX XXXX"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><Mail size={13} /> Email Address</span>
              </label>
              <input
                value={profile?.email ?? ""}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-gray-100 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact admin for email updates.</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Section: Company Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Company Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name</label>
              <input
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="Company name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><MapPin size={13} /> Region</span>
              </label>
              <input
                value={profile?.region_name ?? ""}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-gray-100 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Address</label>
              <input
                value={form.company_address}
                onChange={(e) => handleChange("company_address", e.target.value)}
                placeholder="Full company address"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onChangePassword}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition"
          >
            <Lock size={15} />
            Change Password
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}