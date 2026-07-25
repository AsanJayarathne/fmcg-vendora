import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../context/CartContextObject";
import { OrderContext } from "../../context/OrderContextObject";
import { useAuth } from "../../context/AuthContext";
import {
  FiMessageSquare,
  FiShoppingCart,
  FiGlobe,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function Topbar() {
  const { cartCount } = useContext(CartContext);
  const { messages, unreadMessageCount, markMessageRead } = useContext(OrderContext);
  const { auth, logout } = useAuth();

  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeMsgId, setActiveMsgId]   = useState(null);

  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profilePopupRef = useRef(null);

  const latestMessages = messages.slice(0, 3);
  const activeMessage = messages.find((m) => m.id === activeMsgId);

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
        setActiveMsgId(null);
      }
      if (
        showProfileMenu &&
        profilePopupRef.current &&
        !profilePopupRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMessages, showProfileMenu]);

  return (
    <div className="h-16 w-full bg-white flex items-center justify-end px-6 gap-3.5 border-b border-slate-100 relative">
      
      {/* Language Selector */}
      <button className="flex items-center gap-1.5 border border-blue-100 hover:border-blue-500 rounded-full px-3.5 py-1.5 text-[10px] font-black text-blue-600 hover:bg-blue-50/50 transition cursor-pointer">
        <FiGlobe size={13} />
        ENG
      </button>

      {/* Messages Toggle */}
      <div className="relative" ref={buttonRef}>
        <button
          type="button"
          className="bg-blue-50/40 border border-blue-100/50 hover:bg-blue-50 text-blue-650 px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition cursor-pointer relative"
          onClick={() => {
            setShowMessages((prev) => !prev);
            setActiveMsgId(null);
          }}
        >
          <FiMessageSquare size={13} />
          <span>Messages</span>
          {unreadMessageCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-black border border-white">
              {unreadMessageCount}
            </span>
          )}
        </button>

        {showMessages && (
          <div
            ref={popupRef}
            className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-100 rounded-[28px] shadow-lg z-50 overflow-hidden animate-fadeInUp"
          >
            {activeMessage ? (
              /* Expanded Message Details View Inside Dropdown */
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50/20">
                  <button
                    onClick={() => setActiveMsgId(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <FiArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    onClick={() => {
                      setShowMessages(false);
                      setActiveMsgId(null);
                    }}
                  >
                    <FiX size={15} />
                  </button>
                </div>
                
                {/* Body */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-wider flex items-center gap-1">
                      <FiClock size={10} /> {formatDate(activeMessage.createdAt)}
                    </p>
                    <h4 className="text-xs font-black text-slate-805 leading-tight mt-1">
                      {activeMessage.title}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed max-h-40 overflow-y-auto no-scrollbar bg-slate-50 border border-slate-100 rounded-2xl p-3.5 whitespace-pre-line">
                    {activeMessage.body}
                  </p>
                  <button
                    onClick={() => setActiveMsgId(null)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-[11px] cursor-pointer transition shadow-2xs"
                  >
                    Close Message
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Messages List View inside Dropdown */
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50/20">
                  <div>
                    <p className="text-[9px] text-blue-500 uppercase tracking-wider font-black">
                      Latest Messages
                    </p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
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
                <div className="max-h-64 overflow-y-auto no-scrollbar p-3.5 space-y-2.5">
                  {latestMessages.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400 text-center py-6">
                      No messages available.
                    </p>
                  ) : (
                    latestMessages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => {
                          setActiveMsgId(message.id);
                          markMessageRead(message.orderId);
                        }}
                        className="w-full text-left rounded-2xl border border-slate-100 p-3.5 bg-white transition hover:bg-blue-50/10 hover:border-blue-200/50 cursor-pointer relative"
                      >
                        <p className="text-xs font-extrabold text-slate-800 mb-0.5 truncate pr-4">
                          {message.title}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-455 line-clamp-2 leading-relaxed">
                          {message.body}
                        </p>
                        {!message.read && (
                          <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                      </button>
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
                      className="w-full rounded-full bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
                    >
                      See All
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Icon */}
      <Link to="/cart" className="relative">
        <button className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition flex items-center justify-center cursor-pointer shadow-xs">
          <FiShoppingCart size={15} />
        </button>

        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-black border border-white">
            {cartCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <div className="relative" ref={profileButtonRef}>
        <button
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-full"
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="Profile"
            className="w-9 h-9 rounded-full border border-blue-100 hover:border-blue-500 object-cover transition"
          />
        </button>

        {showProfileMenu && (
          <div
            ref={profilePopupRef}
            className="absolute right-0 top-full mt-2 w-[220px] bg-white border border-slate-100 rounded-[24px] shadow-lg z-50 overflow-hidden animate-fadeInUp"
          >
            {/* Header info */}
            <div className="px-5 py-4 border-b border-slate-100 bg-blue-50/20">
              <p className="text-xs font-black text-slate-800 truncate">
                {auth?.fullName ?? "Retailer"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate flex items-center gap-1">
                <FiUser size={10} /> Retailer Account
              </p>
            </div>

            {/* Menu options */}
            <div className="p-2 space-y-0.5">
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-slate-650 hover:bg-blue-50/50 hover:text-blue-600 transition"
              >
                <FiSettings size={13} />
                <span>Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <FiLogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
