import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContextObject";
import { OrderContext } from "../../context/OrderContextObject";
import {
  FiBell,
  FiMessageSquare,
  FiShoppingCart,
  FiSettings,
  FiGlobe,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const { cartCount } = useContext(CartContext);
  const { unreadMessageCount } = useContext(OrderContext);
  const navigate = useNavigate();

  return (
    <div className="h-20 bg-white flex justify-end items-center px-8 gap-4 shadow-sm">
      <button className="flex items-center gap-2 border border-blue-600 rounded-full px-5 py-2 text-blue-600">
        <FiGlobe />
        ENG
      </button>

      <button
        onClick={() => navigate("/settings")}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <FiSettings size={22} />
      </button>


      <button
        onClick={() => navigate("/messages")}
        className="relative bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-2"
      >
        <FiMessageSquare />
        Messages
        {unreadMessageCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
            {unreadMessageCount}
          </span>
        )}
      </button>

      <button className="relative bg-blue-600 text-white p-3 rounded-full">
        <FiBell size={20} />
      </button>

     <Link
  to="/cart"
  className="relative inline-block"
>
  <button className="bg-blue-600 text-white p-3 rounded-full">
    <FiShoppingCart size={20} />
  </button>

  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
      {cartCount}
    </span>
  )}
</Link> 
    </div>
  );
}

export default Topbar;
