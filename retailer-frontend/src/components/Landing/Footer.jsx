// src/components/landing/Footer.jsx

import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

import logo from "../../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8">

      <div className="max-w-7xl mx-auto px-8">

        {/* Top Section */}
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-12 pb-16 border-b border-slate-700">

          {/* Company */}
          <div className="lg:col-span-2">

            <img
              src={logo}
              alt="Vendora"
              className="w-44 bg-white rounded-xl p-2"
            />

            <p className="mt-6 text-slate-400 leading-8 max-w-md">
              Vendora is Sri Lanka's modern FMCG B2B marketplace,
              connecting retailers and distributors through smart
              inventory management, flexible credit solutions,
              seamless ordering, and powerful business analytics.
            </p>

            <div className="flex gap-4 mt-8">

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
              >
                <FiFacebook size={20} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition"
              >
                <FiInstagram size={20} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-blue-500 flex items-center justify-center transition"
              >
                <FiLinkedin size={20} />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4 text-slate-400">

              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Analytics
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>

            </ul>

          </div>

          {/* Platform */}
          <div>

            <h3 className="text-xl font-semibold mb-6">
              Platform
            </h3>

            <ul className="space-y-4 text-slate-400">

              <li>Inventory Management</li>

              <li>Distributor Marketplace</li>

              <li>Credit Account</li>

              <li>Order Tracking</li>

              <li>Business Analytics</li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-6">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <FiMail className="text-blue-400 mt-1" />

                <span className="text-slate-400">
                  support@vendora.lk
                </span>

              </div>

              <div className="flex gap-3">

                <FiPhone className="text-green-400 mt-1" />

                <span className="text-slate-400">
                  +94 77 123 4567
                </span>

              </div>

              <div className="flex gap-3">

                <FiMapPin className="text-red-400 mt-1" />

                <span className="text-slate-400">
                  Colombo, Sri Lanka
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-slate-500 text-sm">

          <p>
            © 2026 Vendora. All Rights Reserved.
          </p>

          <div className="flex gap-8 mt-4 md:mt-0">

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