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

  const mainMenu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/product", icon: Package },
    { name: "Delivery", path: "/delivery", icon: Truck },
    { name: "Shops & Drivers", path: "/shops-drivers", icon: Store },
    { name: "Inventory", path: "/inventory", icon: Warehouse },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const otherMenu = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Sign Out", path: "/login", icon: LogOut },
  ];

  return (
    <aside className="h-full p-3 bg-white border-r border-gray-200 w-60">
      <h2 className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Main Menu
      </h2>

      <nav className="flex flex-col gap-2">
        {mainMenu.slice(0, 2).map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

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

            <ChevronDown
              size={16}
              className={`transition ${ordersOpen ? "rotate-180" : ""}`}
            />
          </button>

          {ordersOpen && (
            <div className="flex flex-col gap-1 mt-2 ml-8">
              <Link
                to="/orders"
                className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600"
              >
                Orders
              </Link>

              <Link
                to="/order-history"
                className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600"
              >
                Order History
              </Link>
            </div>
          )}
        </div>

        {mainMenu.slice(2).map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
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