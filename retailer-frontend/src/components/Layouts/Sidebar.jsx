import logo from "../../assets/images/logo.png";
import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiClipboard,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

function Sidebar() {

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
     <div className="w-72 h-screen bg-white flex flex-col p-5">

      <img
        src={logo}
        alt="Logo"
        className="w-auto h-auto mb-7"
      />    

      <div className="flex flex-col gap-2">

        {menuItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>

          </NavLink>

        ))}

      </div>

      
      <div className="mt-auto">

        <button
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            py-4
            rounded-2xl
            border
            text-red-500
            hover:bg-red-50
          "
        >
          <FiLogOut />

          Logout
        </button>

      </div>

    </div>
  );
}

export default Sidebar;
