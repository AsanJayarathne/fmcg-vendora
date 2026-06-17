import { Link, Outlet, useLocation } from 'react-router-dom';

function DriverLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/jobpool', label: 'Open Job Pool', icon: '💼' },
    { path: '/myroute', label: 'My Route', icon: '🗺️' },
    { path: '/cashaudit', label: 'Cash Audit', icon: '💵' },
    { path: '/profile', label: 'Profile', icon: '👤' },
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
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800 w-full">
            🚪 Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default DriverLayout;