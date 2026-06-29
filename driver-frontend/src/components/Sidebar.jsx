import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, Wallet, User, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobpool', label: 'Open Job Pool', icon: Briefcase },
  { path: '/myroute', label: 'My Route', icon: Map },
  { path: '/cashaudit', label: 'Cash Audit', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: User },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-60 bg-orange-50 flex flex-col p-4 border-r border-orange-100">
      <div className="flex items-center gap-3 mb-8 px-2 pt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-red-400" />
        <div>
          <div className="text-xs text-gray-400">Hello Again!</div>
          <div className="text-sm font-medium text-orange-600">Jayarathne Stores</div>
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
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-gray-500 border border-gray-200 hover:bg-orange-100 w-full">
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;