import analyticsImage from "../../assets/images/analytics.png";
import {
  FiBarChart2,
  FiCheckCircle,
  FiTrendingUp,
  FiShoppingCart,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-12 sm:py-20 lg:py-28 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              <FiBarChart2 className="mr-2" />
              Retail Analytics
            </span>

            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Make Better Business Decisions
              <span className="text-blue-600"> with Live Analytics.</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 leading-relaxed">
              Understand inventory movement, monitor spending,
              identify fast-moving products, and optimize purchasing
              with real-time reports built specifically for FMCG retailers.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 sm:space-y-4 mt-6 sm:mt-8">
              {[
                "Inventory turnover reports",
                "Credit utilization insights",
                "Monthly purchasing trends",
                "Best-selling products",
                "Retail performance dashboard",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-emerald-600 text-sm sm:text-base" />
                  </div>

                  <span className="text-slate-700 font-medium text-xs sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-10">
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-500/20 transition"
              >
                Explore Analytics
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative mt-4 lg:mt-0">
            {/* Main Dashboard Preview */}
            <div className="bg-white rounded-2xl sm:rounded-[36px] shadow-xl border border-slate-200 p-2.5 sm:p-5">
              <img
                src={analyticsImage}
                alt="Analytics Dashboard Preview"
                className="w-full h-auto rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* Floating Card 1 (Hidden on small mobile) */}
            <div className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white rounded-2xl shadow-xl p-4 w-52 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <FiTrendingUp className="text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Revenue</p>
                  <h3 className="text-lg font-bold text-slate-800">Rs.245K</h3>
                </div>
              </div>
            </div>

            {/* Floating Card 2 (Hidden on small mobile) */}
            <div className="hidden sm:block absolute bottom-4 -left-4 lg:bottom-6 lg:-left-6 bg-white rounded-2xl shadow-xl p-4 w-48 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <FiShoppingCart className="text-orange-500" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium">Orders</p>
                  <h3 className="text-lg font-bold text-slate-800">128</h3>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}