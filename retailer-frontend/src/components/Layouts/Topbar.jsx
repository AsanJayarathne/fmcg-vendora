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
  <div className="h-16 w-full bg-white flex items-center justify-end px-6 gap-3.5 border-b border-slate-100 relative">
    
    <button className="flex items-center gap-1.5 border border-blue-600 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
      <FiGlobe size={14} />
      ENG
    </button>

    
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold hover:bg-slate-800 transition"
        onClick={() => setShowMessages((prev) => !prev)}
      >
        <FiMessageSquare size={14} />
        Messages
      </button>

      {showMessages && (
        <div
          ref={popupRef}
          className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
        >
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-150 bg-slate-50">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                Latest Messages
              </p>
              <p className="text-xs font-bold text-slate-800">
                Recent Updates
              </p>
            </div>

            <button
              type="button"
              className="text-slate-400 hover:text-slate-700"
              onClick={() => setShowMessages(false)}
            >
              <FiX size={16} />
            </button>
          </div>

          
          <div className="max-h-64 overflow-y-auto p-3 space-y-2">
            {latestMessages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No messages available.
              </p>
            ) : (
              latestMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-slate-100 p-3 bg-slate-50"
                >
                  <p className="text-xs font-bold text-slate-800 mb-0.5">
                    {message.title}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {message.body}
                  </p>
                </div>
              ))
            )}
          </div>

          
          <div className="border-t border-slate-150 p-3 bg-slate-50">
            <Link
              to="/messages"
              onClick={() => setShowMessages(false)}
            >
              <button
                type="button"
                className="w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                See All
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>

    <Link to="/cart" className="relative">
      <button className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
        <FiShoppingCart size={16} />
      </button>

      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-bold">
          {cartCount}
        </span>
      )}
    </Link>

    
    <img
      src="https://i.pravatar.cc/100"
      alt="Profile"
      className="w-9 h-9 rounded-full border border-gray-250 object-cover cursor-pointer hover:opacity-90 transition-opacity"
    />
  </div>
);
}

export default Topbar;
