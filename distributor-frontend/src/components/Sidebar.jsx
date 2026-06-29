import { useState } from "react";
import { Link } from "react-router-dom";
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
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [shopsDriversOpen, setShopsDriversOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const otherMenu = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Sign Out", path: "/login", icon: LogOut },
  ];

  return (
    <aside className="h-full p-3 overflow-y-auto bg-white border-r border-gray-200 w-60 no-scrollbar">
      <h2 className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Main Menu
      </h2>

      <nav className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/product" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
          <Package size={18} />
          Products
        </Link>

        {/* Orders Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setOrdersOpen(!ordersOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={18} />
              Orders
            </span>
            <ChevronDown size={16} className={`transition ${ordersOpen ? "rotate-180" : ""}`} />
          </button>

          {ordersOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/orders" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                Orders
              </Link>
              <Link to="/order-history" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                Order History
              </Link>
            </div>
          )}
        </div>

        <Link to="/delivery" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
          <Truck size={18} />
          Delivery
        </Link>

        {/* Shops & Drivers Dropdown */}
        <div>
          <button
            type="button"
            onClick={() => setShopsDriversOpen(!shopsDriversOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <span className="flex items-center gap-3">
              <Store size={18} />
              Shops & Drivers
            </span>
            <ChevronDown size={16} className={`transition ${shopsDriversOpen ? "rotate-180" : ""}`} />
          </button>

          {shopsDriversOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/shops" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                Shops
              </Link>
              <Link to="/drivers" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
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
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <span className="flex items-center gap-3">
              <Warehouse size={18} />
              Inventory
            </span>
            <ChevronDown size={16} className={`transition ${inventoryOpen ? "rotate-180" : ""}`} />
          </button>

          {inventoryOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link to="/my-inventory" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                My Inventory
              </Link>
              <Link to="/request-stock" className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                Request Stock
              </Link>
            </div>
          )}
        </div>

        <Link to="/payments" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
          <CreditCard size={18} />
          Payments
        </Link>

        <Link to="/analytics" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
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
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-gray-100 transition"
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