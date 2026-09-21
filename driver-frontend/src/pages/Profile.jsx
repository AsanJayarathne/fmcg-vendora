import { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  IdCard, 
  Award, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  Building2, 
  Calendar, 
  RefreshCw, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  DollarSign, 
  Clock, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

function Profile() {
  const { auth, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    license_number: '',
    vehicle_number: ''
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/driver/profile.php", {
        headers: {
          "Authorization": `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load driver profile details");
      }
      setProfile(json.data);
      setFormData({
        full_name: json.data.full_name || '',
        phone: json.data.phone || '',
        license_number: json.data.license_number || '',
        vehicle_number: json.data.vehicle_number || ''
      });
    } catch (err) {
      console.error("Error fetching driver profile:", err);
      setError(err.message || "Could not connect to driver profile service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [auth]);

  const handleOpenEditModal = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        license_number: profile.license_number || '',
        vehicle_number: profile.vehicle_number || ''
      });
    }
    setModalError('');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');
    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/driver/profile.php", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth?.token}`
        },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile");
      }
      
      setProfile(json.data);
      updateUser?.({ full_name: json.data.full_name });
      setIsEditModalOpen(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setModalError(err.message || "Failed to update profile details");
    } finally {
      setSaving(false);
    }
  };

  const driverName = profile?.full_name || auth?.fullName || 'Driver';
  const driverEmail = profile?.email || auth?.email || 'N/A';
  const driverPhone = profile?.phone || 'N/A';
  const licenseNumber = profile?.license_number || 'N/A';
  const vehicleNumber = profile?.vehicle_number || 'N/A';
  const distributorName = profile?.distributor_name || 'Assigned FMCG Hub';
  const distributorAddress = profile?.distributor_address || 'Regional Distribution Hub';
  const regionName = profile?.region_name || 'Standard Operational Zone';
  const driverCode = profile?.driver_id ? `DRV-${String(profile.driver_id).padStart(3, '0')}` : 'DRV-001';
  const userCode = profile?.user_id ? `USR-${String(profile.user_id).padStart(3, '0')}` : 'USR-001';
  
  const driverInitials = driverName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DR';

  // Stats calculations
  const totalDeliveries = parseInt(profile?.total_deliveries) || 0;
  const successfulDeliveries = parseInt(profile?.successful_deliveries) || 0;
  const returnedDeliveries = parseInt(profile?.returned_deliveries) || 0;
  const pendingDeliveries = parseInt(profile?.pending_deliveries) || 0;
  const totalCashCollected = parseFloat(profile?.total_cash_collected) || 0;
  const successRate = totalDeliveries > 0 ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 100;

  const memberSince = profile?.user_created_at || profile?.created_at
    ? new Date(profile.user_created_at || profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Active Shift';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Driver Profile & Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Verified driver credentials, vehicle allocation & performance stats</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : 'text-slate-500'} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition cursor-pointer shadow-xs shadow-orange-500/20"
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchProfile} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* ── Hero Identity Card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex items-center justify-center text-white text-xl sm:text-2xl font-extrabold shadow-md shadow-orange-500/25 select-none shrink-0 ring-4 ring-orange-50">
            {driverInitials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{driverName}</h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                #{driverCode}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Commercial FMCG Dispatch Driver • Assigned to <span className="text-slate-800 font-semibold">{distributorName}</span>
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-3 py-1 rounded-full">
                <ShieldCheck size={13} className="text-emerald-600" /> Account Active
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-200/70 px-3 py-1 rounded-full">
                <UserCheck size={13} className="text-orange-500" /> On Duty
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                <Calendar size={12} className="text-slate-400" /> Since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stat Pill */}
        <div className="w-full md:w-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 flex md:flex-col items-center justify-between md:justify-center gap-2 min-w-[160px] text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reliability Score</span>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">{successRate}%</div>
          <span className="text-[10px] text-slate-400 font-medium">Based on {totalDeliveries} total jobs</span>
        </div>
      </div>

      {/* ── 4-Card Account Details Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        {/* Card 1: Personal & Contact Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Personal & Contact Details</h3>
              <p className="text-[11px] text-slate-400">Driver account identification and contact channels</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <UserCheck size={14} className="text-slate-400" /> Full Name
              </span>
              <span className="font-bold text-slate-800">{driverName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Mail size={14} className="text-slate-400" /> Email Address
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{driverEmail}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Phone size={14} className="text-slate-400" /> Mobile Number
              </span>
              <span className="font-bold text-slate-800 font-mono">{driverPhone}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <IdCard size={14} className="text-slate-400" /> Account User Ref
              </span>
              <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                #{userCode}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Clock size={14} className="text-slate-400" /> System Role
              </span>
              <span className="font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                Commercial Driver
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Vehicle & Driver Licensing */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Vehicle & Licensing</h3>
              <p className="text-[11px] text-slate-400">Assigned dispatch vehicle and commercial driving permit</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <IdCard size={14} className="text-slate-400" /> Driving License No
              </span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                {licenseNumber}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Truck size={14} className="text-slate-400" /> Vehicle Number Plate
              </span>
              <span className="font-mono font-extrabold text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-md">
                {vehicleNumber}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <ShieldCheck size={14} className="text-slate-400" /> License Verification
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Check size={13} className="text-emerald-500" /> Verified Valid
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Truck size={14} className="text-slate-400" /> Vehicle Category
              </span>
              <span className="font-semibold text-slate-800">Commercial FMCG Van / Truck</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <CheckCircle2 size={14} className="text-slate-400" /> Approval Status
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                {profile?.status || 'Approved'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Assigned Distribution Agency */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Distribution Agency & Zone</h3>
              <p className="text-[11px] text-slate-400">Regional warehouse and operating jurisdiction</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Building2 size={14} className="text-slate-400" /> Distributor Agency
              </span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">
                {distributorName}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" /> Operating Zone / Region
              </span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                {regionName}
              </span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <MapPin size={14} className="text-slate-400" /> Hub Address
              </span>
              <span className="font-semibold text-slate-700 text-right line-clamp-2 max-w-[220px]">
                {distributorAddress}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <IdCard size={14} className="text-slate-400" /> Distributor ID
              </span>
              <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                #DIST-{profile?.distributor_id || '01'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Live Dispatch Performance Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Dispatch Performance Summary</h3>
              <p className="text-[11px] text-slate-400">Real-time delivery fulfillment and cash collections</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Total Orders Assigned:</span>
              <span className="font-bold text-slate-800 font-mono text-sm">{totalDeliveries}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Successfully Delivered:</span>
              <span className="font-bold text-emerald-600 font-mono text-sm">{successfulDeliveries}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Returned Deliveries:</span>
              <span className="font-bold text-rose-600 font-mono text-sm">{returnedDeliveries}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Active In-Transit:</span>
              <span className="font-bold text-amber-600 font-mono text-sm">{pendingDeliveries}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <DollarSign size={14} className="text-emerald-500" /> Total Cash Remitted:
              </span>
              <span className="font-extrabold text-emerald-700 text-sm">
                Rs. {totalCashCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Driver Profile</h3>
                  <p className="text-[11px] text-slate-400">Update your driver contact & vehicle details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Kamal Perera"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 077 123 4567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Driving License Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  placeholder="e.g. B1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Registration Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                  placeholder="e.g. WP CAA-1234"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;