import { FiChevronDown } from "react-icons/fi";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Vendora"
            className="w-44 object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-10">

          <a
            href="#features"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            How It Works
          </a>

          <a
            href="#pricing"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Pricing
          </a>

          <button className="flex items-center gap-1 text-slate-700 hover:text-blue-600 font-medium transition">
            Resources
            <FiChevronDown />
          </button>

          <a
            href="#about"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            About Us
          </a>

        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium transition"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 transition"
          >
            Register Shop
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
