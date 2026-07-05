import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../context/CartContextObject";
import { OrderContext } from "../../context/OrderContextObject";
import {
  
  FiMessageSquare,
  FiShoppingCart,
  FiSettings,
  FiGlobe,
  FiX,
} from "react-icons/fi";

function Topbar() {
  const { cartCount } = useContext(CartContext);
  const { messages } = useContext(OrderContext);
  const [showMessages, setShowMessages] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const latestMessages = messages.slice(0, 3);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showMessages &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMessages(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMessages]);

return (
  <div className="h-20 w-full bg-white flex items-center justify-end px-8 gap-4 shadow-sm relative">
    
    <button className="flex items-center gap-2 border border-blue-600 rounded-full px-5 py-2 text-blue-600 hover:bg-blue-50 transition">
      <FiGlobe />
      ENG
    </button>

    
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        className="bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-slate-800 transition"
        onClick={() => setShowMessages((prev) => !prev)}
      >
        <FiMessageSquare />
        Messages
      </button>

      {showMessages && (
        <div
          ref={popupRef}
          className="absolute right-0 top-full mt-3 w-[360px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 overflow-hidden"
        >
          
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                Latest Messages
              </p>
              <p className="font-semibold text-slate-900">
                Recent Updates
              </p>
            </div>

            <button
              type="button"
              className="text-slate-500 hover:text-slate-900"
              onClick={() => setShowMessages(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          
          <div className="max-h-80 overflow-y-auto p-4 space-y-3">
            {latestMessages.length === 0 ? (
              <p className="text-sm text-gray-500">
                No messages available.
              </p>
            ) : (
              latestMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                >
                  <p className="font-semibold text-slate-900 mb-1">
                    {message.title}
                  </p>

                  <p className="text-sm text-slate-600 line-clamp-2">
                    {message.body}
                  </p>
                </div>
              ))
            )}
          </div>

          
          <div className="border-t border-slate-200 p-4">
            <Link
              to="/messages"
              onClick={() => setShowMessages(false)}
            >
              <button
                type="button"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-800 transition"
              >
                See More
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>

    <Link to="/cart" className="relative">
      <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
        <FiShoppingCart size={20} />
      </button>

      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
          {cartCount}
        </span>
      )}
    </Link>

    
    <img
      src="https://i.pravatar.cc/100"
      alt="Profile"
      className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover cursor-pointer"
    />
  </div>
);
}

export default Topbar;
