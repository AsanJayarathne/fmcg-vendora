import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/landing" className="flex items-center">
          <img
            src={logo}
            alt="Vendora FMCG"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          <a
            href="#features"
            className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition"
          >
            How It Works
          </a>
          <a
            href="#analytics"
            className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition"
          >
            Analytics
          </a>
          <a
            href="#testimonials"
            className="text-slate-700 hover:text-blue-600 text-sm font-semibold transition"
          >
            Reviews
          </a>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition"
          >
            Register Shop
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50"
          >
            Log In
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            <a
              href="#features"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#analytics"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Analytics
            </a>
            <a
              href="#testimonials"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Reviews
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/register"
              onClick={closeMenu}
              className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm"
            >
              Register Shop
            </Link>
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
