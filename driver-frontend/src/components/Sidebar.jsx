import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, Wallet, User, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobpool', label: 'Open Job Pool', icon: Briefcase },
  { path: '/myroute', label: 'My Route', icon: Map },
  { path: '/cashaudit', label: 'Cash Audit', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: User },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = auth?.fullName ? auth.fullName.split(' ')[0] : 'Driver';

  return (
    <div className="w-60 bg-orange-50 flex flex-col p-4 border-r border-orange-100">
      <div className="flex items-center gap-3 mb-8 px-2 pt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
          {displayName[0]?.toUpperCase()}
        </div>
        <div>
          <div className="text-xs text-gray-400">Hello, {displayName}!</div>
          <div className="text-sm font-medium text-orange-600">Active Driver</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-orange-100'
            }`}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-gray-500 border border-gray-200 hover:bg-orange-100 w-full bg-white cursor-pointer transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;