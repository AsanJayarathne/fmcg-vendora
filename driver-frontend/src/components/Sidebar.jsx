import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/logo.png';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobpool', label: 'Open Job Pool', icon: Briefcase },
  { path: '/myroute', label: 'My Orders', icon: Package },
  { path: '/cashaudit', label: 'My Route', icon: Map },
  { path: '/profile', label: 'Profile', icon: User },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white flex flex-col p-4 border-r border-slate-100 flex-shrink-0 z-20">
      {/* Brand Logo Header */}
      <div className="px-1 mb-6 pt-1 flex items-center">
        <img
          src={logo}
          alt="Vendora Logo"
          className="w-full max-w-[190px] h-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;