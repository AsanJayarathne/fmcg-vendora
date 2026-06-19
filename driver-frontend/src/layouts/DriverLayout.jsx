import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, Wallet, User, LogOut } from 'lucide-react';

function DriverLayout() {
  const location = useLocation();

 const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobpool', label: 'Open Job Pool', icon: Briefcase },
    { path: '/myroute', label: 'My Route', icon: Map },
    { path: '/cashaudit', label: 'Cash Audit', icon: Wallet },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-52 bg-gray-900 flex flex-col p-4">
        <div className="text-purple-400 text-lg font-semibold mb-8 px-2">
          VENDORA
        </div>

      <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                location.pathname === item.path
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 w-full">
            <LogOut size={17} />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <div className="text-sm font-medium text-gray-800">Hello, Kamal</div>
            <div className="text-xs text-gray-400">Delivery Driver · D001</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
              On Duty
            </span>
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-medium">
              KP
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DriverLayout;