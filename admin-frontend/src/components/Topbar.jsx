import React, { useState } from "react";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Topbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const fullName = auth?.fullName || "Company Admin";
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-end h-16 px-8 bg-white border-b border-slate-100 shadow-2xs font-sans">
      {/* Right Section: Messages + User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications / Messages */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 h-9 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition cursor-pointer shadow-2xs"
        >
          <span className="hidden sm:inline">Messages</span>
          <Bell size={15} className="text-white" />
        </button>

        {/* User Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer border border-slate-100 shadow-2xs"
          >
            <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-600 rounded-full shadow-2xs">
              {initials}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden md:inline">{fullName}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              {/* Dropdown Panel */}
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-800 truncate">{fullName}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Admin Account</p>
                </div>
                {/* Menu Items */}
                <div className="p-1 text-xs font-bold">
                  <Link
                    to="/products"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Settings size={14} className="text-slate-400" />
                    Catalog Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition w-full text-left cursor-pointer"
                  >
                    <LogOut size={14} className="text-rose-400" />
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
