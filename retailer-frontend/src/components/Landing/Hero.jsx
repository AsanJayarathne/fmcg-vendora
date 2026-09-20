import {
  FiArrowRight,
  FiPlayCircle,
  FiCheckCircle,
  FiPackage,
  FiCreditCard,
  FiRefreshCw
} from "react-icons/fi";
import { Link } from "react-router-dom";
import dashboardImage from "../../assets/images/dashboard.png";

function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT SIDE */}
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              <FiCheckCircle className="shrink-0" />
              <span>The Smartest Way To Run Your Store</span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 sm:mt-8 text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 tracking-tight">
              Empower Your Retail Business with{" "}
              <span className="text-blue-600">Smart Inventory</span>{" "}
              <span className="text-emerald-500">& Live Credit.</span>
            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl text-slate-600 leading-relaxed sm:leading-8 max-w-xl">
              Manage your stock, track orders, and access flexible
              credit—all in one powerful platform built specifically
              for modern retailers.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/20 transition"
              >
                <span>Register Your Shop</span>
                <FiArrowRight />
              </Link>

              <a
                href="https://youtu.be/x8wQ65XQ_1Y?si=U2cE8V9Z5XQ_1Y"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base transition"
              >
                <FiPlayCircle />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <FiPackage className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                    Real-time
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Stock Updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <FiCreditCard className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                    Flexible
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Credit Solutions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <FiRefreshCw className="text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                    Fast & Easy
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Returns
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="relative mt-4 lg:mt-0">

            {/* Main Dashboard Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-xl border border-slate-200 p-2.5 sm:p-4 md:p-6">
                <img
                  src={dashboardImage}
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>

            {/* Floating Credit Card (Hidden on small mobile to prevent clutter and overflow) */}
            <div className="hidden sm:block absolute -bottom-6 -left-4 lg:-bottom-8 lg:-left-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-52">
              <p className="text-xs text-slate-500 font-medium">
                Available Credit
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Rs. 18,500
              </h3>
              <div className="mt-2.5 h-1.5 rounded-full bg-slate-100">
                <div className="w-2/3 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            {/* Floating Orders Card (Hidden on small mobile) */}
            <div className="hidden sm:block absolute top-4 -right-4 lg:top-8 lg:-right-6 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-44">
              <p className="text-xs text-slate-500 font-medium">
                Active Orders
              </p>
              <h3 className="text-2xl font-bold text-orange-500 mt-1">
                12
              </h3>
              <p className="text-[11px] font-semibold text-blue-600 mt-1">
                View Orders →
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;