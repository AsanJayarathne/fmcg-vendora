import { Mail, Phone, MapPin, IdCard, Award, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

function Profile() {
  const { auth } = useAuth();

  const driverName = auth?.fullName || 'Kamal Perera';
  const driverEmail = auth?.email || 'kamal@vendora.lk';
  const driverInitials = driverName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Driver Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage personal profile details and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md shadow-orange-500/20 select-none shrink-0">
              {driverInitials}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{driverName}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Verified Delivery Driver • D001</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-100 px-3 py-0.5 rounded-full">
                  <UserCheck size={12} /> On Duty
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> Active
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { icon: Mail, label: 'Email Address', value: driverEmail },
              { icon: Phone, label: 'Mobile Number', value: '071 234 5678' },
              { icon: MapPin, label: 'Assigned District', value: 'Colombo Central' },
              { icon: IdCard, label: 'Driver Code', value: 'D001' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <item.icon size={14} className="text-orange-500 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[180px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Performance Summary</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">All-time delivery metrics & reliability score</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Total Deliveries Claimed', value: '248', color: 'text-slate-900 font-bold' },
              { label: 'Successful Deliveries', value: '241', color: 'text-emerald-600 font-extrabold' },
              { label: 'Returned Orders', value: '7', color: 'text-rose-600 font-bold' },
              { label: 'Completion Success Rate', value: '97.2%', color: 'text-orange-600 font-extrabold' },
              { label: 'Driver Rating', value: '4.9 ★', color: 'text-amber-500 font-bold' },
              { label: 'Member Since', value: 'Jan 2025', color: 'text-slate-600' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
              >
                <span className="text-slate-500 font-medium">{item.label}</span>
                <span className={`text-xs sm:text-sm ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;