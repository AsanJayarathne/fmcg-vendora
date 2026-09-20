import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 sm:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 pb-10 sm:pb-16 border-b border-slate-800">

          {/* Company */}
          <div className="sm:col-span-2">
            <img
              src={logo}
              alt="Vendora FMCG"
              className="h-10 w-auto bg-white rounded-xl p-1.5"
            />

            <p className="mt-4 sm:mt-6 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Vendora is Sri Lanka's modern FMCG B2B marketplace,
              connecting retailers and distributors through smart
              inventory management, flexible credit solutions,
              seamless ordering, and powerful business analytics.
            </p>

            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="Facebook"
              >
                <FiFacebook size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-500 flex items-center justify-center text-slate-300 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="space-y-2.5 sm:space-y-3.5 text-slate-400 text-xs sm:text-sm">
              <li>
                <Link to="/landing" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <a href="/landing#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/landing#analytics" className="hover:text-white transition">
                  Analytics
                </a>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="mailto:support@vendora.lk" className="hover:text-white transition">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">
              Platform
            </h3>

            <ul className="space-y-2.5 sm:space-y-3.5 text-slate-400 text-xs sm:text-sm">
              <li>Inventory Management</li>
              <li>Distributor Marketplace</li>
              <li>Credit Account</li>
              <li>Order Tracking</li>
              <li>Business Analytics</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">
              Contact
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <FiMail className="text-blue-400 shrink-0" />
                <span className="text-slate-400">support@vendora.lk</span>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="text-green-400 shrink-0" />
                <span className="text-slate-400">+94 77 123 4567</span>
              </div>

              <div className="flex items-center gap-3">
                <FiMapPin className="text-red-400 shrink-0" />
                <span className="text-slate-400">Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 text-slate-500 text-xs text-center sm:text-left">
          <p>© 2026 Vendora FMCG. All Rights Reserved.</p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;