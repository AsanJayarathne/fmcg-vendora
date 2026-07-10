import logo from "../../assets/images/logo.png";
import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiClipboard,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiHome size={20} />
    },
    {
      name: "Products",
      path: "/products",
      icon: <FiShoppingBag size={20} />
    },
    
    {
      name: "My Orders",
      path: "/orders",
      icon: <FiClipboard size={20} />
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FiBarChart2 size={20} />
    },
    {
      name: "Settings",
      path: "/profile",
      icon: <FiSettings size={20} />
    }
  ];

  return (
     <div className="w-60 h-screen bg-white flex flex-col p-4 border-r border-slate-100">

      <div className="px-2 mb-6">
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto object-contain"
        />    
      </div>

      <div className="flex flex-col gap-1.5">

        {menuItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >

            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </div>

      
      <div className="mt-auto">

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
            transition-colors
          "
        >
          <FiLogOut size={16} />

          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;
