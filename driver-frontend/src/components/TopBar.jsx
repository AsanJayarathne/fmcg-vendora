import { MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

function TopBar() {
  const { auth } = useAuth();
  const driverInitials = auth?.fullName
    ? auth.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'KP';

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      {/* Left side empty placeholder */}
      <div></div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm">
          <MessageCircle size={15} />
          <span className="hidden sm:inline">Messages</span>
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-100 flex items-center justify-center transition-all cursor-pointer">
          <Bell size={17} className="text-orange-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
            {driverInitials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">{auth?.fullName || 'Kamal Perera'}</div>
            <div className="text-[11px] text-slate-400 font-medium">Driver Account</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;