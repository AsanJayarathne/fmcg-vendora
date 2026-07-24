import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../context/CartContextObject";
import { OrderContext } from "../../context/OrderContextObject";
import {
  FiMessageSquare,
  FiShoppingCart,
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
      
      {/* Language Selector */}
      <button className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-800 rounded-full px-3.5 py-1.5 text-[10px] font-black text-slate-700 hover:bg-slate-50 transition cursor-pointer">
        <FiGlobe size={13} />
        ENG
      </button>

      {/* Messages Toggle */}
      <div className="relative" ref={buttonRef}>
        <button
          type="button"
          className="bg-slate-50 border border-slate-100 hover:bg-slate-100/70 text-slate-800 px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition cursor-pointer"
          onClick={() => setShowMessages((prev) => !prev)}
        >
          <FiMessageSquare size={13} />
          Messages
        </button>

        {showMessages && (
          <div
            ref={popupRef}
            className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-100 rounded-[28px] shadow-lg z-50 overflow-hidden animate-fadeInUp"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-black">
                  Latest Messages
                </p>
                <p className="text-xs font-black text-slate-805 mt-0.5">
                  Recent Updates
                </p>
              </div>

              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 transition"
                onClick={() => setShowMessages(false)}
              >
                <FiX size={15} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto p-3.5 space-y-2.5">
              {latestMessages.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 text-center py-6">
                  No messages available.
                </p>
              ) : (
                latestMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-slate-100 p-3.5 bg-white transition hover:bg-slate-50/30"
                  >
                    <p className="text-xs font-extrabold text-slate-800 mb-0.5 truncate">
                      {message.title}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-450 line-clamp-2 leading-relaxed">
                      {message.body}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-3.5 bg-slate-50/50">
              <Link
                to="/messages"
                onClick={() => setShowMessages(false)}
              >
                <button
                  type="button"
                  className="w-full rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Cart Icon */}
      <Link to="/cart" className="relative">
        <button className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-800 transition flex items-center justify-center cursor-pointer shadow-xs">
          <FiShoppingCart size={15} />
        </button>

        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-black border border-white">
            {cartCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <img
        src="https://i.pravatar.cc/100"
        alt="Profile"
        className="w-9 h-9 rounded-full border border-slate-200 object-cover cursor-pointer hover:opacity-90 transition"
      />
    </div>
  );
}

export default Topbar;
