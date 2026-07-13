import analyticsImage from "../../assets/images/analytics.png";

import {
  FiBarChart2,
  FiCheckCircle,
  FiTrendingUp,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

export default function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-32 bg-slate-50">

      <div className="max-w-7xl mx-auto px-8">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}

          <div>

            <span className="inline-flex items-center bg-blue-100 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold">
              <FiBarChart2 className="mr-2" />
              Retail Analytics
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-900 leading-tight">
              Make Better Business Decisions
              <span className="text-blue-600"> with Live Analytics.</span>
            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-8">
              Understand inventory movement, monitor spending,
              identify fast-moving products, and optimize purchasing
              with real-time reports built specifically for FMCG retailers.
            </p>

            {/* Checklist */}

            <div className="space-y-5 mt-10">

              {[
                "Inventory turnover reports",
                "Credit utilization insights",
                "Monthly purchasing trends",
                "Best-selling products",
                "Retail performance dashboard",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="text-emerald-600" />
                  </div>

                  <span className="text-slate-700 font-medium">
                    {item}
                  </span>

                </div>

              ))}

            </div>

            <button
              className="
              mt-12
              px-8
              py-4
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition"
            >
              Explore Analytics
            </button>

          </div>

          {/* RIGHT SIDE */}

          {/* RIGHT SIDE */}
            <div className="relative">

              {/* Main Dashboard */}
              <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 p-5">
                <img
                  src={analyticsImage}
                  alt="Analytics Dashboard"
                  className="w-full h-auto rounded-3xl"
                />
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -top-8 -right-8 bg-white rounded-3xl shadow-xl p-6 w-60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FiTrendingUp className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">Revenue</p>
                    <h3 className="text-2xl font-bold">Rs.245K</h3>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute bottom-16 -left-8 bg-white rounded-3xl shadow-xl p-6 w-56">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <FiShoppingCart className="text-orange-500" />
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">Orders</p>
                    <h3 className="text-2xl font-bold">128</h3>
                  </div>
                </div>
              </div>


            </div>

        </div>

      </div>

    </section>
  );
}