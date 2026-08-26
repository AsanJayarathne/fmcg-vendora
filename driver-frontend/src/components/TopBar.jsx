import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, User, LogOut, Package, Map, ChevronDown, Mail, CheckCircle2, X, CheckCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationApi';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function TopBar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileButtonRef = useRef(null);
  const profilePopupRef = useRef(null);
  const notifButtonRef = useRef(null);
  const notifPopupRef = useRef(null);

  const token = auth?.token;

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

  const driverInitials = auth?.fullName
    ? auth.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'KP';

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showProfileMenu &&
        profilePopupRef.current &&
        !profilePopupRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        showNotifications &&
        notifPopupRef.current &&
        !notifPopupRef.current.contains(event.target) &&
        notifButtonRef.current &&
        !notifButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu, showNotifications]);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">
      {/* Left side empty space */}
      <div></div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">

        {/* ── Notifications Button & Popover ── */}
        <div className="relative" ref={notifButtonRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-100 flex items-center justify-center transition-all cursor-pointer active:scale-[0.98]"
          >
            <Bell size={17} className="text-orange-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold text-white bg-rose-500 rounded-full border border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              ref={notifPopupRef}
              className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeInUp"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-orange-50/50">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-orange-600" />
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} />
                      <span>Read all</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-orange-100/50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-slate-400">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.notification_id}
                      onClick={() => handleMarkAsRead(notif)}
                      className={`p-3 transition-colors cursor-pointer hover:bg-slate-50 relative ${
                        !notif.is_read ? 'bg-orange-50/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs ${!notif.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      {!notif.is_read && (
                        <span className="absolute top-3.5 right-2.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* ── Driver Account Overview Popover Button ── */}
        <div className="relative" ref={profileButtonRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/70 transition-all cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
              {driverInitials}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{auth?.fullName || 'Kamal Perera'}</div>
              <div className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                <span>Driver Account</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {/* ── Account Overview Dropdown Popover ── */}
          {showProfileMenu && (
            <div
              ref={profilePopupRef}
              className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeInUp"
            >
              {/* Header Profile Summary */}
              <div className="p-4 bg-orange-50/60 border-b border-orange-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {driverInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{auth?.fullName || 'Kamal Perera'}</h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Mail size={11} className="text-slate-400" />
                      <span>{auth?.email || 'kamal@vendora.lk'}</span>
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-semibold text-orange-600">On Duty • Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="p-3 grid grid-cols-2 gap-2 bg-slate-50/50 border-b border-slate-100 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Driver ID</span>
                  <span className="font-bold text-slate-800">D001</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="p-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  <span>Account Details & Profile</span>
                </Link>

                <Link
                  to="/myroute"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Package size={15} className="text-slate-400" />
                  <span>My Route Deliveries</span>
                </Link>

                <Link
                  to="/cashaudit"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Map size={15} className="text-slate-400" />
                  <span>Interactive Route Map</span>
                </Link>
              </div>

              {/* Footer Logout */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default TopBar;