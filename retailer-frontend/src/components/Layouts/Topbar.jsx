import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../context/CartContextObject";
import { OrderContext } from "../../context/OrderContextObject";
import { useAuth } from "../../context/AuthContext";
import {
  FiMenu,
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

const AVATAR_BASE = "http://localhost/fmcg-vendora/backend/uploads/avatars/";

function Topbar({ onToggleSidebar }) {
  const { cartCount } = useContext(CartContext);
  const { messages, unreadMessageCount, markMessageRead, markAllMessagesRead } = useContext(OrderContext);
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
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMessages, showProfileMenu]);

  return (
    <div className="h-16 w-full bg-white flex items-center justify-between px-3.5 sm:px-6 gap-2 sm:gap-3.5 border-b border-slate-100 relative shrink-0 z-30">
      
      {/* Mobile Menu Hamburger Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Toggle navigation menu"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5 ml-auto">
        {/* Language Selector */}
        <button className="flex items-center gap-1 border border-blue-100 hover:border-blue-500 rounded-full px-2.5 sm:px-3.5 py-1.5 text-[10px] font-black text-blue-600 hover:bg-blue-50/50 transition cursor-pointer">
          <FiGlobe size={13} />
          <span>ENG</span>
        </button>

        {/* Messages Toggle */}
        <div className="relative" ref={buttonRef}>
          <button
            type="button"
            className={`
              border px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs font-bold transition cursor-pointer relative
              ${showMessages ? "bg-blue-600 border-blue-600 text-white shadow-xs" : "bg-blue-50/50 border-blue-100 hover:bg-blue-50 text-blue-600"}
            `}
            onClick={() => {
              setShowMessages((prev) => !prev);
              setActiveMsgId(null);
            }}
            aria-label="Messages"
          >
            <FiMessageSquare size={14} />
            <span className="hidden sm:inline">Messages</span>
            {unreadMessageCount > 0 && (
              <span className={`text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-black border ${showMessages ? "bg-white text-blue-600 border-blue-600" : "bg-red-500 text-white border-white"}`}>
                {unreadMessageCount}
              </span>
            )}
          </button>

          {showMessages && (
            <div
              ref={popupRef}
              className="
                fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2
                sm:w-[340px] max-w-[360px] bg-white border border-slate-200 sm:border-slate-100 rounded-3xl shadow-2xl sm:shadow-xl z-50 overflow-hidden animate-fadeInUp
              "
            >
              {activeMessage ? (
                /* Expanded Message Details View Inside Dropdown */
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50/30">
                    <button
                      onClick={() => setActiveMsgId(null)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <FiArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
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
                      <h4 className="text-xs font-black text-slate-800 leading-tight mt-1">
                        {activeMessage.title}
                      </h4>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed max-h-48 overflow-y-auto no-scrollbar bg-slate-50 border border-slate-100 rounded-2xl p-3.5 whitespace-pre-line">
                      {activeMessage.body}
                    </p>
                    <button
                      onClick={() => setActiveMsgId(null)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-[11px] cursor-pointer transition shadow-2xs"
                    >
                      Close Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Messages List View inside Dropdown */
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-blue-50/30">
                    <div>
                      <p className="text-[9px] text-blue-500 uppercase tracking-wider font-black">
                        Latest Messages
                      </p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">
                        Recent Updates
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadMessageCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllMessagesRead}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Read all
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition"
                        onClick={() => setShowMessages(false)}
                      >
                        <FiX size={15} />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-64 overflow-y-auto no-scrollbar p-3.5 space-y-2.5">
                    {latestMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <FiMessageSquare className="mx-auto text-slate-300 mb-2" size={24} />
                        <p className="text-xs font-bold text-slate-400">
                          No messages available.
                        </p>
                      </div>
                    ) : (
                      latestMessages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => {
                            setActiveMsgId(message.id);
                            markMessageRead(message.id ?? message.orderId);
                          }}
                          className="w-full text-left rounded-2xl border border-slate-100 p-3.5 bg-white transition hover:bg-blue-50/20 hover:border-blue-200/50 cursor-pointer relative"
                        >
                          <p className="text-xs font-extrabold text-slate-800 mb-0.5 truncate pr-4">
                            {message.title}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 line-clamp-2 leading-relaxed">
                            {message.body}
                          </p>
                          {!message.read && (
                            <span className="absolute top-4 right-3.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
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
                        See All Messages
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
          <button className="bg-blue-600 text-white p-2 sm:p-2.5 rounded-full hover:bg-blue-700 transition flex items-center justify-center cursor-pointer shadow-xs">
            <FiShoppingCart size={15} />
          </button>

          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-xs"></span>
          )}
        </Link>

        {/* Profile */}
        <div className="relative" ref={profileButtonRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-1.5 focus:outline-none cursor-pointer rounded-full"
            aria-label="User menu"
          >
            {auth?.avatarUrl ? (
              <img
                src={`${AVATAR_BASE}${auth.avatarUrl}`}
                alt="Profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-blue-100 hover:border-blue-500 object-cover transition"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(auth?.fullName || "Retailer") + "&background=2563EB&color=fff";
                }}
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center border border-blue-100 hover:border-blue-500 transition">
                {auth?.fullName ? auth.fullName.charAt(0).toUpperCase() : <FiUser size={14} />}
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div
              ref={profilePopupRef}
              className="absolute right-0 top-full mt-2 w-48 sm:w-[220px] bg-white border border-slate-100 rounded-3xl shadow-xl z-50 overflow-hidden animate-fadeInUp"
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
                  className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50/50 hover:text-blue-600 transition"
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
    </div>
  );
}

export default Topbar;
