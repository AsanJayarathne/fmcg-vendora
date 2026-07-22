import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Store,
  Warehouse,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [ordersOpen, setOrdersOpen] = useState(false);
  const [shopsDriversOpen, setShopsDriversOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // Auto-open dropdowns if sub-routes are active
  useEffect(() => {
    if (currentPath.startsWith("/orders") || currentPath.startsWith("/order-history")) {
      setOrdersOpen(true);
    }
    if (currentPath.startsWith("/shops") || currentPath.startsWith("/drivers")) {
      setShopsDriversOpen(true);
    }
    if (currentPath.startsWith("/my-inventory") || currentPath.startsWith("/request-stock")) {
      setInventoryOpen(true);
    }
  }, [currentPath]);

  const getLinkClass = (path, isSubLink = false) => {
    const isActive = path === "/" ? currentPath === "/" : currentPath.startsWith(path);
    
    if (isSubLink) {
      return `px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-50 text-blue-600 font-semibold" 
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }`;
    }
    
    return `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl border ${
      isActive
        ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm"
        : "text-gray-700 border-transparent hover:bg-blue-50 hover:text-blue-600"
    }`;
  };

  const getParentClass = (paths) => {
    const isActive = paths.some(p => currentPath.startsWith(p));
    return `flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium transition-all rounded-xl border ${
      isActive
        ? "bg-blue-50/50 text-blue-600 border-blue-50"
        : "text-gray-700 border-transparent hover:bg-blue-50 hover:text-blue-600"
    }`;
  };

  const otherMenu = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Sign Out", path: "/login", icon: LogOut },
  ];

  return (
    <aside className="h-full p-3 overflow-y-auto bg-white border-r border-gray-200 w-60 no-scrollbar">
      <h2 className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Main Menu
      </h2>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={getLinkClass("/")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/product" className={getLinkClass("/product")}>
          <Package size={18} />
          Products
        </Link>

        {/* Orders Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setOrdersOpen(!ordersOpen)}
            className={getParentClass(["/orders", "/order-history"])}
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={18} />
              Orders
            </span>
            <ChevronDown size={16} className={`transition ${ordersOpen ? "rotate-180" : ""}`} />
          </button>

          {ordersOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/orders" className={getLinkClass("/orders", true)}>
                Orders
              </Link>
              <Link to="/order-history" className={getLinkClass("/order-history", true)}>
                Order History
              </Link>
            </div>
          )}
        </div>

        <Link to="/delivery" className={getLinkClass("/delivery")}>
          <Truck size={18} />
          Delivery
        </Link>

        {/* Shops & Drivers Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setShopsDriversOpen(!shopsDriversOpen)}
            className={getParentClass(["/shops", "/drivers"])}
          >
            <span className="flex items-center gap-3">
              <Store size={18} />
              Shops & Drivers
            </span>
            <ChevronDown size={16} className={`transition ${shopsDriversOpen ? "rotate-180" : ""}`} />
          </button>

          {shopsDriversOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/shops" className={getLinkClass("/shops", true)}>
                Shops
              </Link>
              <Link to="/drivers" className={getLinkClass("/drivers", true)}>
                Drivers
              </Link>
            </div>
          )}
        </div>

        {/* Inventory Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className={getParentClass(["/my-inventory", "/request-stock"])}
          >
            <span className="flex items-center gap-3">
              <Warehouse size={18} />
              Inventory
            </span>
            <ChevronDown size={16} className={`transition ${inventoryOpen ? "rotate-180" : ""}`} />
          </button>

          {inventoryOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/my-inventory" className={getLinkClass("/my-inventory", true)}>
                My Inventory
              </Link>
              <Link to="/request-stock" className={getLinkClass("/request-stock", true)}>
                Request Stock
              </Link>
            </div>
          )}
        </div>

        <Link to="/payments" className={getLinkClass("/payments")}>
          <CreditCard size={18} />
          Payments
        </Link>

        <Link to="/analytics" className={getLinkClass("/analytics")}>
          <BarChart3 size={18} />
          Analytics
        </Link>
      </nav>

      <h2 className="mt-6 mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Others
      </h2>

      <nav className="flex flex-col gap-2 pb-4">
        {otherMenu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={getLinkClass(item.path)}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}