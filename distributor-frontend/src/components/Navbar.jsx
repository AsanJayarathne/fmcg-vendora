import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, ChevronDown, Settings, LogOut, CheckCheck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/vendora logo.png";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile } from "../services/profileApi";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationApi";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const menuRef = useRef(null);
  const token = auth?.token;

  useEffect(() => {
    if (!token) return;
    const cached = localStorage.getItem("vendora_full_name");
    if (cached) setProfile({ full_name: cached });

    fetchProfile(token)
      .then((data) => {
        setProfile(data);
        localStorage.setItem("vendora_full_name", data.full_name || "");
        window.dispatchEvent(new Event("storage"));
      })
      .catch(() => {});
  }, [token]);

  const loadNotifs = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchNotifications(token);
      setNotifications(data.notifications || []);
      setUnreadCount(Number(data.unread_count || 0));
    } catch {
      // silent background error
    }
  }, [token]);

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, [loadNotifs]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notif) => {
    if (!notif.is_read) {
      try {
        await markNotificationRead(token, notif.notification_id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notif.notification_id
              ? { ...n, is_read: 1 }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("vendora_full_name");
    navigate("/login");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "D";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm relative z-30">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Vendora Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 h-9 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-xs"
          >
            <span className="hidden sm:inline">Messages</span>
            <Bell size={16} className="text-white" />
            {unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeInUp">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-gray-700" />
                  <span className="text-xs font-bold text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-600 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} />
                      <span>Read all</span>
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded-full hover:bg-gray-200/60"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-gray-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.notification_id}
                      onClick={() => handleMarkAsRead(notif)}
                      className={`p-3.5 transition cursor-pointer hover:bg-gray-50 relative ${
                        !notif.is_read ? "bg-blue-50/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${!notif.is_read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      {!notif.is_read && (
                        <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-blue-600 rounded-full shadow-xs">
              {initials}
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || "Distributor"}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.email || ""}</p>
              </div>
              {/* Links */}
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Settings size={15} className="text-gray-400" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left cursor-pointer"
                >
                  <LogOut size={15} className="text-red-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}