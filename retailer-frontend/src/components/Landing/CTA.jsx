// src/components/landing/CTA.jsx

import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">

          {/* Decorative Circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center p-14 lg:p-20">

            {/* LEFT */}

            <div>

              <span className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold">

                <FiCheckCircle />

                Join 18,500+ Retailers

              </span>

              <h2 className="mt-8 text-5xl font-bold text-white leading-tight">

                Ready to Transform

                <br />

                Your Retail Business?

              </h2>

              <p className="mt-8 text-blue-100 text-lg leading-8 max-w-xl">

                Start ordering directly from trusted distributors,
                manage inventory efficiently, monitor your credit
                account, and grow your business using powerful
                analytics—all from one platform.

              </p>

              <div className="flex flex-wrap gap-4 mt-10">

                <button
                  className="
                  bg-white
                  text-blue-700
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  flex
                  items-center
                  gap-2
                  hover:scale-105
                  transition"
                >
                  Register Your Shop

                  <FiArrowRight />

                </button>

                <button
                  className="
                  border
                  border-white/30
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  hover:bg-white/10
                  transition"
                >
                  Contact Sales
                </button>

              </div>

            </div>

            {/* RIGHT */}

            <div className="bg-white rounded-3xl shadow-2xl p-8">

              <h3 className="text-2xl font-bold text-slate-900">

                Why Choose Vendora?

              </h3>

              <div className="space-y-6 mt-8">

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
                    className="flex items-center gap-4"
                  >

                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">

                      <FiCheckCircle className="text-emerald-600" />

                    </div>

                    <span className="text-slate-700 font-medium">

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