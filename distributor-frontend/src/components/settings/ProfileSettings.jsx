import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { updateProfile } from "../../services/profileApi";

export default function ProfileSettings({ profile, onChangePassword, onSaved }) {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  const [form, setForm] = useState({
    full_name:       profile?.full_name       ?? "",
    phone:           profile?.phone           ?? "",
    company_name:    profile?.company_name    ?? "",
    company_address: profile?.company_address ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null); // { type: 'success'|'error', msg }

  useEffect(() => {
    if (profile) {
      setForm({
        full_name:       profile.full_name       ?? "",
        phone:           profile.phone           ?? "",
        company_name:    profile.company_name    ?? "",
        company_address: profile.company_address ?? "",
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!form.full_name.trim()) {
      setToast({ type: "error", msg: "Full name is required." });
      return;
    }
    setSaving(true);
    setToast(null);
    try {
      await updateProfile(auth.token, form);
      setToast({ type: "success", msg: "Account and enterprise profile updated successfully!" });
      onSaved?.();
      setTimeout(() => setToast(null), 5000);
    } catch (err) {
      setToast({ type: "error", msg: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.full_name || profile?.company_name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const code = `DST-${String(profile?.distributor_id || 1).padStart(3, "0")}`;

  const tabs = [
    { id: "general", label: "Representative Profile", icon: User },
    { id: "business", label: "Enterprise & Territory", icon: Building2 },
    { id: "security", label: "Security & Access", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-2xl text-xs font-bold border shadow-xs animate-slide-down ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200/80 text-emerald-800"
              : "bg-rose-50 border-rose-200/80 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{toast.msg}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs font-black text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Profile Header Hero Card */}
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-xs relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20 border-4 border-white">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Online & Active" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {form.company_name || form.full_name || "Distributor Partner"}
                </h2>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                  {code}
                </span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                  <Sparkles size={11} />
                  {profile?.status || "Approved"}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-semibold mt-1 flex flex-wrap items-center gap-2">
                <span>Representative: <strong className="text-slate-700">{form.full_name || "—"}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin size={12} className="text-blue-500" />
                  {profile?.region_name || "National Territory"}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-xs shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <RotateCcw size={14} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isCurrent
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                }`}
              >
                <Icon size={14} className={isCurrent ? "text-blue-400" : "text-slate-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave}>
        {/* TAB 1: General Profile */}
        {activeTab === "general" && (
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-50 pb-4">
              <h3 className="text-base font-bold text-slate-800">Representative Details</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Primary contact and account representative credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Representative Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="Enter full legal name"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-800 outline-none transition shadow-2xs focus:ring-4 focus:ring-blue-500/10"
                  />
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="07X XXX XXXX"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-800 outline-none transition shadow-2xs focus:ring-4 focus:ring-blue-500/10"
                  />
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Login Email (System Bound)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email ?? ""}
                    readOnly
                    className="w-full bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                  Locked for platform security. Contact system administrator for email migrations.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Assigned Regional Territory
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile?.region_name ? `${profile.region_name} District (Region #${profile?.region_id || 1})` : "National FMCG Territory"}
                    readOnly
                    className="w-full bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                  Territory is assigned and verified by Vendora FMCG network operations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Enterprise & Business Details */}
        {activeTab === "business" && (
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-50 pb-4">
              <h3 className="text-base font-bold text-slate-800">Enterprise Entity & Warehouse Hub</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Commercial registration, trade licenses, and supply warehouse location</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Distribution Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    placeholder="e.g. Golden Distribution Ltd"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-800 outline-none transition shadow-2xs focus:ring-4 focus:ring-blue-500/10"
                  />
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Business Registration (BR No.)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile?.reg_number || "REG-001"}
                    readOnly
                    className="w-full bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-600 outline-none cursor-not-allowed"
                  />
                  <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  FMCG Operating License (Lic No.)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile?.lic_number || "LIC-001"}
                    readOnly
                    className="w-full bg-slate-100/70 border border-slate-200/80 rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-600 outline-none cursor-not-allowed"
                  />
                  <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Distribution Hub / Physical Warehouse Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.company_address}
                    onChange={(e) => handleChange("company_address", e.target.value)}
                    placeholder="Enter complete physical address of distribution center"
                    className="w-full bg-slate-50/60 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3 pl-10 text-xs font-bold text-slate-800 outline-none transition shadow-2xs focus:ring-4 focus:ring-blue-500/10"
                  />
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security & Access */}
        {activeTab === "security" && (
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-50 pb-4">
              <h3 className="text-base font-bold text-slate-800">Security & Authentication</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Manage your credentials, active JWT session, and platform verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Setting Card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                    <Lock size={16} className="text-blue-600" />
                    <h4>Account Password</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Ensure your account is protected with a strong, multi-character password.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={onChangePassword}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition cursor-pointer shadow-2xs flex items-center gap-2"
                  >
                    <Lock size={13} />
                    Change Password
                  </button>
                </div>
              </div>

              {/* Session / Verification Status Card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <h4>Authentication Token</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Signed JWT bearer authentication active with role: <strong className="text-slate-800">DISTRIBUTOR</strong>.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                    Token Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}