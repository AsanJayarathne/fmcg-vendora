import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-2xl sm:rounded-[40px] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 shadow-2xl">

          {/* Decorative Circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center p-6 sm:p-10 lg:p-16">

            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                <FiCheckCircle className="shrink-0" />
                <span>Join 18,500+ Retailers</span>
              </span>

              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Ready to Transform Your Retail Business?
              </h2>

              <p className="mt-3 sm:mt-6 text-blue-100 text-xs sm:text-base lg:text-lg leading-relaxed max-w-xl">
                Start ordering directly from trusted distributors,
                manage inventory efficiently, monitor your credit
                account, and grow your business using powerful
                analytics-all from one platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10">
                <Link
                  to="/register"
                  className="bg-white text-blue-700 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-base flex items-center justify-center gap-2 shadow-lg hover:bg-blue-50 transition"
                >
                  <span>Register Your Shop</span>
                  <FiArrowRight />
                </Link>

                <Link
                  to="/login"
                  className="border border-white/30 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-base flex items-center justify-center hover:bg-white/10 transition"
                >
                  Existing User Login
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
                Why Choose Vendora?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {[
                  "Real-time inventory tracking",
                  "Flexible distributor credit",
                  "Smart procurement analytics",
                  "Fast order placement",
                  "Live delivery tracking",
                  "Secure payment management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="text-emerald-600 text-sm" />
                    </div>

                    <span className="text-slate-700 font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}