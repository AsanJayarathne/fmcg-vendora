import {
  FiArrowRight,
  FiPlayCircle,
  FiCheckCircle,
  FiPackage,
  FiCreditCard,
  FiRefreshCw
} from "react-icons/fi";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold">
              <FiCheckCircle />
              The Smartest Way To Run Your Store
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-6xl font-bold leading-tight text-slate-900">
              Empower Your Retail
              <br />
              Business with
              <br />
              <span className="text-blue-600">
                Smart Inventory
              </span>
              <br />
              <span className="text-emerald-500">
                & Live Credit.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-xl text-slate-600 leading-9 max-w-xl">
              Manage your stock, track orders, and access flexible
              credit—all in one powerful platform built specifically
              for modern retailers.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">

              <Link to="/register" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg transition">
                Register Your Shop
                <FiArrowRight />
              </Link>

              <a
                href="https://youtu.be/x8wQ65XQ_1Y?si=U2cE8V9Z5XQ_1Y"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-medium transition"
              >
                <FiPlayCircle />
                Watch Demo
              </a>

            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 gap-6 mt-12">

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FiPackage className="text-emerald-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800">
                    Real-time
                  </h4>

                  <p className="text-sm text-slate-500">
                    Stock Updates
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FiCreditCard className="text-purple-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800">
                    Flexible
                  </h4>

                  <p className="text-sm text-slate-500">
                    Credit Solutions
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FiRefreshCw className="text-orange-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800">
                    Fast & Easy
                  </h4>

                  <p className="text-sm text-slate-500">
                    Returns
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="relative">

            {/* Main Dashboard Card */}
            <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6">

              <div className="h-[550px] rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-7xl">
                    🖥️
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-slate-700">
                    Dashboard Preview Image
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Replace with hero-dashboard.png
                  </p>

                </div>

              </div>

            </div>

            {/* Floating Credit Card */}
            <div className="absolute -bottom-8 -left-10 bg-white rounded-3xl shadow-xl border border-slate-200 p-5 w-60">

              <p className="text-sm text-slate-500">
                Available Credit
              </p>

              <h3 className="text-3xl font-bold mt-2">
                Rs. 18,500
              </h3>

              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div className="w-2/3 h-2 rounded-full bg-emerald-500"></div>
              </div>

            </div>

            {/* Floating Orders Card */}
            <div className="absolute top-10 -right-10 bg-white rounded-3xl shadow-xl border border-slate-200 p-5 w-52">

              <p className="text-sm text-slate-500">
                Active Orders
              </p>

              <h3 className="text-3xl font-bold text-orange-500 mt-2">
                12
              </h3>

              <p className="text-sm text-blue-600 mt-2">
                View Orders
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
export default Hero;