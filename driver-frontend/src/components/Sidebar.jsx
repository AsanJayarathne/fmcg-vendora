import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, User, LogOut, Package, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/logo.png';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobpool', label: 'Open Job Pool', icon: Briefcase },
  { path: '/myroute', label: 'My Orders', icon: Package },
  { path: '/cashaudit', label: 'My Route', icon: Map },
  { path: '/profile', label: 'Profile', icon: User },
];

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 print:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-64 max-w-[85vw] h-screen bg-white flex flex-col p-4 border-r border-slate-100
          transition-transform duration-300 ease-in-out print:hidden
          md:static md:translate-x-0 md:w-64 md:z-auto shrink-0 md:shadow-none
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Logo & Mobile Close Button */}
        <div className="px-1 mb-6 pt-1 flex items-center justify-between">
          <img
            src={logo}
            alt="Vendora Logo"
            className="h-10 sm:h-11 w-auto object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
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
    </>
  );
}

export default Sidebar;