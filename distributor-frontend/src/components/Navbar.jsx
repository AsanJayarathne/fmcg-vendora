import { useState, useEffect } from "react";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/vendora logo.png";
import Lang from "./Lang";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile } from "../services/profileApi";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;
    // Load from localStorage cache first (instant display)
    const cached = localStorage.getItem("vendora_full_name");
    if (cached) setProfile({ full_name: cached });

    // Fetch fresh data
    fetchProfile(auth.token)
      .then((data) => {
        setProfile(data);
        // Cache for Sidebar usage
        localStorage.setItem("vendora_full_name", data.full_name || "");
        // Dispatch storage event so Sidebar picks it up
        window.dispatchEvent(new Event("storage"));
      })
      .catch(() => {}); // silent — navbar won't block if profile fails
  }, [auth?.token]);

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("vendora_full_name");
    navigate("/login");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "D";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">

      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Vendora Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Lang />

        {/* Notifications */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 h-9 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition"
        >
          <span className="hidden sm:inline">Messages</span>
          <Bell size={16} className="text-white" />
        </button>

        {/* User Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center w-9 h-9 text-xs font-bold text-white bg-blue-600 rounded-full">
              {initials}
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100">
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
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                  >
                    <LogOut size={15} className="text-red-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}