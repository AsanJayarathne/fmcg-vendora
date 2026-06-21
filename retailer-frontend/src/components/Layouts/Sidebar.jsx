import {
  FiHome,
  FiShoppingBag,
  FiTruck,
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
      name: "Distributors",
      path: "/distributors",
      icon: <FiTruck size={20} />
    },
    {
      name: "My Orders",
      path: "/orders",
      icon: <FiClipboard size={20} />
    },
    {
      name: "Settings",
      path: "/profile",
      icon: <FiSettings size={20} />
    }
  ];

  return (
     <div className="w-72 h-screen bg-white border-r flex flex-col p-5">

      
      <div className="flex items-center gap-3 mb-10">

        <img
          src="https://i.pravatar.cc/100"
          alt=""
          className="w-14 h-14 rounded-full"
        />

        <div>
          <p className="text-xs text-gray-500">
            Hello Again!
          </p>

          <h3 className="font-semibold text-slate-800">
            Jayarathne Stores
          </h3>
        </div>

      </div>

      {/* Menu */}
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

      {/* Logout */}
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
