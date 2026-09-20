import { useContext } from "react";
import logo from "../../assets/images/logo.png";
import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiClipboard,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiX
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { OrderContext } from "../../context/OrderContextObject";
import { useLanguage } from "../../context/LanguageContext";

function Sidebar({ isOpen = false, onClose }) {
  const { logout } = useAuth();
  const { unreadMessageCount = 0 } = useContext(OrderContext) || {};
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login");
  };

  const handleNavClick = () => {
    onClose?.();
  };

  const menuItems = [
    {
      name: t("nav.dashboard", "Dashboard"),
      path: "/",
      icon: <FiHome size={20} />
    },
    {
      name: t("nav.products", "Products"),
      path: "/products",
      icon: <FiShoppingBag size={20} />
    },
    {
      name: t("nav.myOrders", "My Orders"),
      path: "/orders",
      icon: <FiClipboard size={20} />
    },
    {
      name: t("nav.messages", "Messages"),
      path: "/messages",
      icon: <FiMessageSquare size={20} />,
      badge: unreadMessageCount
    },
    {
      name: t("nav.analytics", "Analytics"),
      path: "/analytics",
      icon: <FiBarChart2 size={20} />
    },
    {
      name: t("nav.settings", "Settings"),
      path: "/profile",
      icon: <FiSettings size={20} />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-64 max-w-[85vw] h-screen bg-white flex flex-col p-4 border-r border-slate-100
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:w-60 md:z-auto shrink-0 md:shadow-none
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header: Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-2 mb-6">
          <img
            src={logo}
            alt="Vendora FMCG"
            className="h-10 sm:h-11 w-auto object-contain"
          />
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1">{item.name}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              py-2.5
              rounded-xl
              border
              border-slate-200
              text-sm
              font-medium
              text-red-600
              hover:bg-red-50
              hover:border-red-200
              transition-colors
              cursor-pointer
            "
          >
            <FiLogOut size={16} />
            <span>{t("nav.logout", "Logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
